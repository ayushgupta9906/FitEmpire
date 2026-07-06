package com.fitempire.modules.coupons.service;

import com.fitempire.common.exception.BusinessException;
import com.fitempire.common.exception.DuplicateResourceException;
import com.fitempire.common.exception.ResourceNotFoundException;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.coupons.dto.CouponDto;
import com.fitempire.modules.coupons.dto.CreateCouponRequest;
import com.fitempire.modules.coupons.entity.Coupon;
import com.fitempire.modules.coupons.entity.CouponType;
import com.fitempire.modules.coupons.entity.CouponUsage;
import com.fitempire.modules.coupons.mapper.CouponMapper;
import com.fitempire.modules.coupons.repository.CouponRepository;
import com.fitempire.modules.coupons.repository.CouponUsageRepository;
import com.fitempire.modules.payments.entity.Payment;
import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final UserRepository userRepository;
    private final CouponMapper couponMapper;

    @Transactional
    public CouponDto createCoupon(CreateCouponRequest request) {
        String normalizedCode = request.getCode().trim().toUpperCase();
        if (couponRepository.findByCodeAndDeletedFalse(normalizedCode).isPresent()) {
            throw new DuplicateResourceException("Coupon code already exists: " + normalizedCode);
        }

        Coupon coupon = new Coupon();
        coupon.setCode(normalizedCode);
        coupon.setType(request.getType());
        coupon.setValue(request.getValue());
        coupon.setMinPurchase(request.getMinPurchase());
        coupon.setMaxDiscount(request.getMaxDiscount());
        coupon.setStartDate(request.getStartDate() != null ? request.getStartDate() : LocalDate.now());
        coupon.setEndDate(request.getEndDate());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setUsedCount(0);
        coupon.setActive(true);

        Coupon saved = couponRepository.save(coupon);
        log.info("Coupon created: {} with code: {}", saved.getId(), saved.getCode());
        return couponMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public CouponDto getCouponById(UUID id) {
        Coupon coupon = couponRepository.findById(id)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> ResourceNotFoundException.of("Coupon", id));
        return couponMapper.toDto(coupon);
    }

    @Transactional(readOnly = true)
    public CouponDto getCouponByCode(String code) {
        Coupon coupon = couponRepository.findByCodeAndDeletedFalse(code.trim().toUpperCase())
                .orElseThrow(() -> ResourceNotFoundException.of("Coupon Code", "code", code));
        return couponMapper.toDto(coupon);
    }

    @Transactional(readOnly = true)
    public PagedResponse<CouponDto> getCoupons(String search, Pageable pageable) {
        Page<Coupon> page;
        if (search != null && !search.isBlank()) {
            page = couponRepository.searchCoupons(search.trim(), pageable);
        } else {
            page = couponRepository.findAllActive(pageable);
        }
        return PagedResponse.of(page.map(couponMapper::toDto));
    }

    @Transactional
    public void deleteCoupon(UUID id) {
        Coupon coupon = couponRepository.findById(id)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> ResourceNotFoundException.of("Coupon", id));
        coupon.softDelete();
        couponRepository.save(coupon);
        log.info("Coupon soft deleted: {}", id);
    }

    @Transactional(readOnly = true)
    public BigDecimal validateAndCalculateDiscount(UUID userId, String code, BigDecimal orderAmount) {
        Coupon coupon = couponRepository.findByCodeAndDeletedFalse(code.trim().toUpperCase())
                .orElseThrow(() -> ResourceNotFoundException.of("Coupon", "code", code));

        if (!coupon.isActive()) {
            throw new BusinessException("Coupon is inactive.", "COUPON_INACTIVE", HttpStatus.BAD_REQUEST);
        }

        LocalDate today = LocalDate.now();
        if (coupon.getStartDate() != null && today.isBefore(coupon.getStartDate())) {
            throw new BusinessException("Coupon offer has not started yet.", "COUPON_NOT_STARTED", HttpStatus.BAD_REQUEST);
        }
        if (coupon.getEndDate() != null && today.isAfter(coupon.getEndDate())) {
            throw new BusinessException("Coupon has expired.", "COUPON_EXPIRED", HttpStatus.BAD_REQUEST);
        }

        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new BusinessException("Coupon usage limit has been reached.", "COUPON_LIMIT_REACHED", HttpStatus.BAD_REQUEST);
        }

        if (orderAmount.compareTo(coupon.getMinPurchase()) < 0) {
            throw new BusinessException("Order amount is below the minimum required: ₹" + coupon.getMinPurchase(), "COUPON_MIN_PURCHASE", HttpStatus.BAD_REQUEST);
        }

        long userUsage = couponUsageRepository.countUsageByCouponAndUser(coupon.getId(), userId);
        if (userUsage > 0) {
            throw new BusinessException("You have already used this coupon code.", "COUPON_ALREADY_USED", HttpStatus.BAD_REQUEST);
        }

        // Calculate discount
        BigDecimal discount = BigDecimal.ZERO;
        if (coupon.getType() == CouponType.PERCENTAGE) {
            discount = orderAmount.multiply(coupon.getValue()).divide(BigDecimal.valueOf(100.0), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
                discount = coupon.getMaxDiscount();
            }
        } else if (coupon.getType() == CouponType.FIXED_AMOUNT) {
            discount = coupon.getValue();
            if (discount.compareTo(orderAmount) > 0) {
                discount = orderAmount; // cannot exceed purchase value
            }
        }

        return discount;
    }

    @Transactional
    public void recordCouponUsage(UUID couponId, UUID userId, Payment payment, BigDecimal discountAmount) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> ResourceNotFoundException.of("Coupon", couponId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));

        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);

        CouponUsage usage = new CouponUsage();
        usage.setCoupon(coupon);
        usage.setUser(user);
        usage.setPayment(payment);
        usage.setDiscountAmount(discountAmount);
        couponUsageRepository.save(usage);

        log.info("Recorded usage of Coupon {} by User: {}", couponId, userId);
    }
}
