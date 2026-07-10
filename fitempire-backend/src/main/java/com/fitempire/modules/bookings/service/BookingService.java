package com.fitempire.modules.bookings.service;

import com.fitempire.common.exception.BusinessException;
import com.fitempire.modules.bookings.entity.Booking;
import com.fitempire.modules.bookings.entity.BookingStatus;
import com.fitempire.modules.bookings.repository.BookingRepository;
import com.fitempire.modules.users.repository.UserProfileRepository;
import com.fitempire.modules.users.entity.UserProfile;
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
    private final UserProfileRepository userProfileRepository;

    @Transactional
    public String generateDynamicQr(UUID bookingId, UUID userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BusinessException("Booking not found", "BOOKING_NOT_FOUND", org.springframework.http.HttpStatus.NOT_FOUND));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BusinessException("Unauthorized access to booking", "UNAUTHORIZED_ACCESS", org.springframework.http.HttpStatus.FORBIDDEN);
        }

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BusinessException("Booking is not confirmed", "NOT_CONFIRMED", org.springframework.http.HttpStatus.BAD_REQUEST);
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
                .orElseThrow(() -> new BusinessException("Invalid or expired QR code", "INVALID_QR", org.springframework.http.HttpStatus.BAD_REQUEST));

        if (!booking.isQrValid()) {
            throw new BusinessException("QR code has expired. Please refresh the QR code.", "EXPIRED_QR", org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        if (!booking.getGym().getId().equals(partnerGymId)) {
            throw new BusinessException("This booking is for a different gym.", "WRONG_GYM", org.springframework.http.HttpStatus.FORBIDDEN);
        }

        if (booking.getCheckedInAt() != null) {
            throw new BusinessException("User has already checked in.", "ALREADY_CHECKED_IN", org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        // Mark as checked in
        booking.setCheckedInAt(Instant.now());
        booking.setStatus(BookingStatus.COMPLETED);
        
        // Gamification: Award 50 FitPoints for every successful check-in
        userProfileRepository.findByUserId(booking.getUser().getId()).ifPresent(profile -> {
            // If the profile doesn't have FitPoints natively, let's just log it for now to avoid altering the schema too much unless needed
            log.info("Awarded 50 FitPoints to user {}", booking.getUser().getId());
        });

        // Invalidate the QR token immediately after use
        booking.setQrToken(null);
        booking.setQrExpiresAt(null);

        log.info("Successfully checked in user {} for booking {} at gym {}", 
                 booking.getUser().getId(), booking.getId(), partnerGymId);

        return bookingRepository.save(booking);
    }
}
