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
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/v1/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Gym and class booking management")
public class BookingController {

    private final BookingService bookingService;
    private final com.fitempire.modules.users.repository.UserRepository userRepository;

    private UUID getUserIdFromPrincipal(UserDetails userDetails) {
        return userRepository.findByEmailAndDeletedFalse(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Logged in user not found"))
                .getId();
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Book a slot for a gym or class")
    public ResponseEntity<ApiResponse<BookingDto>> bookSlot(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateBookingRequest request) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        BookingDto booking = bookingService.createBooking(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking confirmed successfully.", booking));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user's booking history")
    public ResponseEntity<ApiResponse<PagedResponse<BookingDto>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(bookingService.getMyBookings(userId, pageable)));
    }

    @PostMapping("/{bookingId}/cancel")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Cancel an active booking")
    public ResponseEntity<ApiResponse<BookingDto>> cancelBooking(
            @PathVariable UUID bookingId,
            @RequestParam(required = false, defaultValue = "User requested cancellation") String reason,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully.", bookingService.cancelBooking(bookingId, reason, userId)));
    }

    @GetMapping("/{bookingId}/qr")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get QR check-in token for booking")
    public ResponseEntity<ApiResponse<BookingDto>> getQrCode(
            @PathVariable UUID bookingId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(ApiResponse.success(bookingService.getQrCode(bookingId, userId)));
    }

    @PostMapping("/check-in")
    @PreAuthorize("hasAnyRole('GYM_PARTNER', 'ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Check in a user at a gym branch using QR token")
    public ResponseEntity<ApiResponse<BookingDto>> checkIn(
            @RequestParam String qrToken,
            @RequestParam UUID branchId) {
        return ResponseEntity.ok(ApiResponse.success("Check-in successful.", bookingService.checkIn(qrToken, branchId)));
    }
}
