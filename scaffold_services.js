const fs = require('fs');
const path = require('path');

const serviceDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'finance', 'service');
fs.mkdirSync(serviceDir, { recursive: true });

const services = {
    'CommissionService.java': `package com.fitempire.modules.finance.service;

import com.fitempire.common.exception.ResourceNotFoundException;
import com.fitempire.modules.finance.entity.CommissionRule;
import com.fitempire.modules.finance.repository.CommissionRuleRepository;
import com.fitempire.modules.gyms.entity.GymCategory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommissionService {

    private final CommissionRuleRepository commissionRuleRepository;

    @Transactional(readOnly = true)
    public BigDecimal calculateCommission(BigDecimal totalAmount, GymCategory category) {
        Optional<CommissionRule> ruleOpt = commissionRuleRepository.findByApplicableCategoryAndActiveTrue(category);
        
        BigDecimal percentage = BigDecimal.valueOf(15.0); // Default to 15% if no rule found
        if (ruleOpt.isPresent()) {
            percentage = ruleOpt.get().getPercentage();
        }

        BigDecimal commission = totalAmount.multiply(percentage).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        log.info("Calculated commission for category {} -> {}%", category, percentage);
        return commission;
    }
}`,
    'SettlementService.java': `package com.fitempire.modules.finance.service;

import com.fitempire.modules.finance.entity.Settlement;
import com.fitempire.modules.finance.entity.SettlementStatus;
import com.fitempire.modules.finance.repository.SettlementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SettlementService {

    private final SettlementRepository settlementRepository;

    @Transactional(readOnly = true)
    public List<Settlement> getSettlementsByGym(UUID gymId) {
        return settlementRepository.findByGymId(gymId);
    }
    
    // In a real scenario, this would have a @Scheduled cron job
    // to batch all weekly transactions for the gym and create a Settlement entity.
}`,
    'RefundService.java': `package com.fitempire.modules.finance.service;

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
}`
};

for (const [filename, content] of Object.entries(services)) {
    fs.writeFileSync(path.join(serviceDir, filename), content);
    console.log("Created service: " + filename);
}
