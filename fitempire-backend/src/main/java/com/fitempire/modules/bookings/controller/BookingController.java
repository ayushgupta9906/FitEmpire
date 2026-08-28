package com.fitempire.modules.bookings.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.bookings.dto.BookingDto;
import com.fitempire.modules.bookings.dto.CreateBookingRequest;
import com.fitempire.modules.bookings.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/v1/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Gym/class booking, QR check-in, and attendance management")
public class BookingController {

    private final BookingService bookingService;
    private final com.fitempire.modules.users.repository.UserRepository userRepository;

    private UUID getUserIdFromPrincipal(UserDetails userDetails) {
        return userRepository.findByEmailAndDeletedFalse(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Logged in user not found"))
                .getId();
    }

    // ── Create Booking ───────────────────────────────────────────────────────

    @PostMapping
    @Operation(summary = "Create a new gym or class booking")
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateBookingRequest request) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        BookingDto booking = bookingService.createBooking(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Booking confirmed successfully", booking));
    }

    // ── My Bookings ──────────────────────────────────────────────────────────

    @GetMapping("/my")
    @Operation(summary = "Get current user's bookings")
    public ResponseEntity<ApiResponse<PagedResponse<BookingDto>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(ApiResponse.success(bookingService.getMyBookings(userId, PageRequest.of(page, size))));
    }

    // ── Cancel Booking ───────────────────────────────────────────────────────

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<ApiResponse<BookingDto>> cancelBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id,
            @RequestParam(required = false) String reason) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        BookingDto booking = bookingService.cancelBooking(id, userId, reason);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", booking));
    }

    // ── Generate QR Token ────────────────────────────────────────────────────

    @GetMapping("/{id}/qr")
    @Operation(summary = "Generate dynamic QR token for booking")
    public ResponseEntity<ApiResponse<String>> generateQr(
            @PathVariable UUID id,
            @RequestParam UUID userId) {
        String qrToken = bookingService.generateDynamicQr(id, userId);
        return ResponseEntity.ok(ApiResponse.success("QR Token generated", qrToken));
    }

    // ── Partner: Verify QR & Check-In ────────────────────────────────────────

    @PostMapping("/verify-qr")
    @Operation(summary = "Verify QR code and check in member (Partner Scanner)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyQr(@RequestBody Map<String, Object> payload) {
        String tokenOrCode = "";
        if (payload.containsKey("code") && payload.get("code") != null) {
            tokenOrCode = payload.get("code").toString();
        } else if (payload.containsKey("qrToken") && payload.get("qrToken") != null) {
            tokenOrCode = payload.get("qrToken").toString();
        }

        UUID gymId = null;
        if (payload.containsKey("gymId") && payload.get("gymId") != null) {
            try {
                gymId = UUID.fromString(payload.get("gymId").toString());
            } catch (Exception ignored) {}
        }

        Map<String, Object> checkInDetails = bookingService.verifyAndCheckIn(tokenOrCode, gymId);
        return ResponseEntity.ok(ApiResponse.success("Check-in verified & recorded successfully", checkInDetails));
    }

    // ── Partner: Live Attendance Log ─────────────────────────────────────────

    @GetMapping("/attendances")
    @Operation(summary = "Get live attendance records")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAttendances(
            @RequestParam(required = false) UUID gymId) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getLiveAttendances(gymId)));
    }
}
