const fs = require('fs');
const path = require('path');

// --- 1. Coupons Backend ---
const repoDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'coupons', 'repository');
fs.mkdirSync(repoDir, { recursive: true });

const repoContent = `package com.fitempire.modules.coupons.repository;

import com.fitempire.modules.coupons.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, UUID> {
    Optional<Coupon> findByCodeIgnoreCaseAndDeletedFalseAndActiveTrue(String code);
}
`;
fs.writeFileSync(path.join(repoDir, 'CouponRepository.java'), repoContent);

const serviceDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'coupons', 'service');
fs.mkdirSync(serviceDir, { recursive: true });

const serviceContent = `package com.fitempire.modules.coupons.service;

import com.fitempire.common.exception.BusinessException;
import com.fitempire.modules.coupons.entity.Coupon;
import com.fitempire.modules.coupons.entity.CouponType;
import com.fitempire.modules.coupons.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    public BigDecimal calculateDiscountedAmount(String couponCode, BigDecimal originalAmount) {
        if (couponCode == null || couponCode.trim().isEmpty()) {
            return originalAmount;
        }

        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndDeletedFalseAndActiveTrue(couponCode)
                .orElseThrow(() -> new BusinessException("Invalid or expired coupon code"));

        if (coupon.getValidFrom() != null && Instant.now().isBefore(coupon.getValidFrom())) {
            throw new BusinessException("Coupon is not active yet");
        }
        if (coupon.getValidUntil() != null && Instant.now().isAfter(coupon.getValidUntil())) {
            throw new BusinessException("Coupon has expired");
        }
        if (coupon.getMinOrderValue() != null && originalAmount.compareTo(coupon.getMinOrderValue()) < 0) {
            throw new BusinessException("Minimum order value for this coupon is ₹" + coupon.getMinOrderValue());
        }
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new BusinessException("Coupon usage limit reached");
        }

        BigDecimal discount = BigDecimal.ZERO;

        if (coupon.getType() == CouponType.FLAT) {
            discount = coupon.getDiscountValue();
        } else if (coupon.getType() == CouponType.PERCENTAGE) {
            discount = originalAmount.multiply(coupon.getDiscountValue()).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
                discount = coupon.getMaxDiscount();
            }
        }

        BigDecimal finalAmount = originalAmount.subtract(discount);
        return finalAmount.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : finalAmount;
    }
}
`;
fs.writeFileSync(path.join(serviceDir, 'CouponService.java'), serviceContent);

// --- 2. Update PaymentController ---
const paymentControllerPath = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'payments', 'controller', 'PaymentController.java');
let paymentControllerContent = fs.readFileSync(paymentControllerPath, 'utf8');

if (!paymentControllerContent.includes('CouponService')) {
    paymentControllerContent = paymentControllerContent.replace(
        'import com.fitempire.modules.payments.service.RazorpayService;',
        'import com.fitempire.modules.payments.service.RazorpayService;\nimport com.fitempire.modules.coupons.service.CouponService;'
    );
    paymentControllerContent = paymentControllerContent.replace(
        'private final RazorpayService razorpayService;',
        'private final RazorpayService razorpayService;\n    private final CouponService couponService;'
    );
    
    // Update createOrder method to handle coupon
    const newCreateOrder = `
    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<String>> createOrder(@RequestBody Map<String, Object> payload) {
        UUID paymentId = UUID.fromString((String) payload.get("paymentId"));
        BigDecimal originalAmount = new BigDecimal(payload.get("amount").toString());
        String couponCode = (String) payload.get("couponCode");
        
        BigDecimal finalAmount = couponService.calculateDiscountedAmount(couponCode, originalAmount);
        
        String orderId = razorpayService.createOrder(paymentId, finalAmount);
        return ResponseEntity.ok(ApiResponse.success("Order created", orderId));
    }
    `;
    
    paymentControllerContent = paymentControllerContent.replace(
        /@PostMapping\("\/create-order"\)[\s\S]*?return ResponseEntity\.ok\(ApiResponse\.success\("Order created", orderId\)\);\n    \}/,
        newCreateOrder
    );
    
    fs.writeFileSync(paymentControllerPath, paymentControllerContent);
}

// --- 3. FitPoints Gamification (BookingService) ---
const bookingServicePath = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'bookings', 'service', 'BookingService.java');
let bookingServiceContent = fs.readFileSync(bookingServicePath, 'utf8');

if (!bookingServiceContent.includes('userProfileRepository.save')) {
    bookingServiceContent = bookingServiceContent.replace(
        'import com.fitempire.modules.bookings.repository.BookingRepository;',
        'import com.fitempire.modules.bookings.repository.BookingRepository;\nimport com.fitempire.modules.users.repository.UserProfileRepository;\nimport com.fitempire.modules.users.entity.UserProfile;'
    );
    
    bookingServiceContent = bookingServiceContent.replace(
        'private final BookingRepository bookingRepository;',
        'private final BookingRepository bookingRepository;\n    private final UserProfileRepository userProfileRepository;'
    );
    
    const gamificationLogic = `
        booking.setCheckedInAt(Instant.now());
        booking.setStatus(BookingStatus.COMPLETED);
        
        // Gamification: Award 50 FitPoints for every successful check-in
        userProfileRepository.findByUserIdAndDeletedFalse(booking.getUser().getId()).ifPresent(profile -> {
            profile.setFitPoints(profile.getFitPoints() + 50);
            userProfileRepository.save(profile);
            log.info("Awarded 50 FitPoints to user {}", booking.getUser().getId());
        });

        // Invalidate the QR token immediately after use
        booking.setQrToken(null);
`;
    
    bookingServiceContent = bookingServiceContent.replace(
        /booking\.setCheckedInAt\(Instant\.now\(\)\);\n        booking\.setStatus\(BookingStatus\.COMPLETED\);\n        \n        \/\/ Invalidate the QR token immediately after use\n        booking\.setQrToken\(null\);/,
        gamificationLogic
    );
    
    fs.writeFileSync(bookingServicePath, bookingServiceContent);
}

console.log("Scaffolded Phase 3 Backend Logic");
