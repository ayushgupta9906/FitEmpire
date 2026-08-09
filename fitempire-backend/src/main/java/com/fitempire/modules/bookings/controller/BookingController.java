package com.fitempire.modules.bookings.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.modules.bookings.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // Called by the User Mobile App
    @GetMapping("/{id}/qr")
    public ResponseEntity<ApiResponse<String>> generateQr(
            @PathVariable UUID id,
            @RequestParam UUID userId) {
        
        String qrToken = bookingService.generateDynamicQr(id, userId);
        return ResponseEntity.ok(ApiResponse.success("QR Token generated", qrToken));
    }

    // Called by the Partner Mobile App Scanner
    @PostMapping("/verify-qr")
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

    // Called by Partner App Attendance Log & Admin Checkins
    @GetMapping("/attendances")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAttendances(
            @RequestParam(required = false) UUID gymId) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getLiveAttendances(gymId)));
    }
}
