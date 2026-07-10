package com.fitempire.modules.bookings.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.modules.bookings.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookings")
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

    // Called by the Partner Mobile App
    @PostMapping("/verify-qr")
    public ResponseEntity<ApiResponse<Boolean>> verifyQr(@RequestBody Map<String, String> payload) {
        String qrToken = payload.get("qrToken");
        UUID gymId = UUID.fromString(payload.get("gymId"));
        
        bookingService.verifyQr(qrToken, gymId);
        return ResponseEntity.ok(ApiResponse.success("Successfully checked in", true));
    }
}
