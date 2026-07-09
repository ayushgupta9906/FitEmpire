package com.fitempire.modules.finance.service;

import com.fitempire.common.exception.ResourceNotFoundException;
import com.fitempire.modules.bookings.entity.Booking;
import com.fitempire.modules.bookings.repository.BookingRepository;
import com.fitempire.modules.finance.entity.RefundDestination;
import com.fitempire.modules.finance.entity.RefundRequest;
import com.fitempire.modules.finance.entity.RefundStatus;
import com.fitempire.modules.finance.repository.RefundRequestRepository;
import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefundService {

    private final RefundRequestRepository refundRequestRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Transactional
    public RefundRequest initiateRefund(UUID userId, UUID bookingId, String reason) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
            
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> ResourceNotFoundException.of("Booking", bookingId));

        RefundRequest request = new RefundRequest();
        request.setUser(user);
        request.setBooking(booking);
        // Simplified: refunding a fixed amount or fetch from transaction
        request.setAmount(new BigDecimal("500.00")); 
        request.setStatus(RefundStatus.REQUESTED);
        request.setRefundDestination(RefundDestination.WALLET);
        request.setRefundReason(reason);

        RefundRequest saved = refundRequestRepository.save(request);
        log.info("Refund initiated for booking {} by user {}", bookingId, userId);
        return saved;
    }
}