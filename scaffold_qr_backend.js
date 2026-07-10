const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 1. Update BookingService
const serviceDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'bookings', 'service');
fs.mkdirSync(serviceDir, { recursive: true });

const serviceContent = `package com.fitempire.modules.bookings.service;

import com.fitempire.common.exception.BusinessException;
import com.fitempire.modules.bookings.entity.Booking;
import com.fitempire.modules.bookings.entity.BookingStatus;
import com.fitempire.modules.bookings.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    @Transactional
    public String generateDynamicQr(UUID bookingId, UUID userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BusinessException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BusinessException("Unauthorized access to booking");
        }

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BusinessException("Booking is not confirmed");
        }

        // Generate a new dynamic token valid for 60 seconds
        String newToken = UUID.randomUUID().toString() + "-" + Instant.now().toEpochMilli();
        booking.setQrToken(newToken);
        booking.setQrExpiresAt(Instant.now().plus(60, ChronoUnit.SECONDS));
        
        bookingRepository.save(booking);
        return newToken;
    }

    @Transactional
    public Booking verifyQr(String qrToken, UUID partnerGymId) {
        Booking booking = bookingRepository.findByQrToken(qrToken)
                .orElseThrow(() -> new BusinessException("Invalid or expired QR code"));

        if (!booking.isQrValid()) {
            throw new BusinessException("QR code has expired. Please refresh the QR code.");
        }

        if (!booking.getGym().getId().equals(partnerGymId)) {
            throw new BusinessException("This booking is for a different gym.");
        }

        if (booking.getCheckedInAt() != null) {
            throw new BusinessException("User has already checked in.");
        }

        // Mark as checked in
        booking.setCheckedInAt(Instant.now());
        booking.setStatus(BookingStatus.COMPLETED);
        
        // Invalidate the QR token immediately after use
        booking.setQrToken(null);
        booking.setQrExpiresAt(null);

        log.info("Successfully checked in user {} for booking {} at gym {}", 
                 booking.getUser().getId(), booking.getId(), partnerGymId);

        return bookingRepository.save(booking);
    }
}
`;
fs.writeFileSync(path.join(serviceDir, 'BookingService.java'), serviceContent);
console.log("Created BookingService.java");

// 2. Create BookingRepository methods if they don't exist
const repoDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'bookings', 'repository');
const repoContent = `package com.fitempire.modules.bookings.repository;

import com.fitempire.modules.bookings.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    Optional<Booking> findByQrToken(String qrToken);
}
`;
fs.writeFileSync(path.join(repoDir, 'BookingRepository.java'), repoContent);
console.log("Updated BookingRepository.java");


// 3. Create BookingController
const controllerDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'bookings', 'controller');
fs.mkdirSync(controllerDir, { recursive: true });

const controllerContent = `package com.fitempire.modules.bookings.controller;

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
`;
fs.writeFileSync(path.join(controllerDir, 'BookingController.java'), controllerContent);
console.log("Created BookingController.java");

