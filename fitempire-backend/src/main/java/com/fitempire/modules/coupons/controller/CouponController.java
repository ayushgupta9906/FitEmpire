package com.fitempire.modules.coupons.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.coupons.dto.CouponDto;
import com.fitempire.modules.coupons.dto.CreateCouponRequest;
import com.fitempire.modules.coupons.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/v1/coupons")
@RequiredArgsConstructor
@Tag(name = "Coupons", description = "Coupon / promo code definitions and validations")
public class CouponController {

    private final CouponService couponService;
    private final com.fitempire.modules.users.repository.UserRepository userRepository;

    private UUID getUserIdFromPrincipal(UserDetails userDetails) {
        return userRepository.findByEmailAndDeletedFalse(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Logged in user not found"))
                .getId();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Create a new coupon definition (Admin only)")
    public ResponseEntity<ApiResponse<CouponDto>> createCoupon(
            @Valid @RequestBody CreateCouponRequest request) {
        CouponDto coupon = couponService.createCoupon(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Coupon created successfully.", coupon));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Get list of all coupons (Admin only)")
    public ResponseEntity<ApiResponse<PagedResponse<CouponDto>>> getCoupons(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PagedResponse<CouponDto> result = couponService.getCoupons(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Get coupon by ID")
    public ResponseEntity<ApiResponse<CouponDto>> getCouponById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(couponService.getCouponById(id)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Delete coupon by ID")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable UUID id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon deleted successfully."));
    }

    @GetMapping("/validate")
    @Operation(summary = "Validate a coupon code and calculate discount amount")
    public ResponseEntity<ApiResponse<BigDecimal>> validateCoupon(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String code,
            @RequestParam BigDecimal orderAmount) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        BigDecimal discount = couponService.validateAndCalculateDiscount(userId, code, orderAmount);
        return ResponseEntity.ok(ApiResponse.success("Coupon code is valid.", discount));
    }
}
