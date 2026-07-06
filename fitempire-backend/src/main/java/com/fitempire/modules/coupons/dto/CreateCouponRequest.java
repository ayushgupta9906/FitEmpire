package com.fitempire.modules.coupons.dto;

import com.fitempire.modules.coupons.entity.CouponType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateCouponRequest {

    @NotBlank(message = "Coupon code is required")
    @Size(max = 50, message = "Coupon code cannot exceed 50 characters")
    @Pattern(regexp = "^[A-Z0-9_-]+$", message = "Coupon code must contain only uppercase alphanumeric characters, hyphens or underscores")
    private String code;

    @NotNull(message = "Coupon type is required")
    private CouponType type;

    @NotNull(message = "Coupon discount value is required")
    @DecimalMin(value = "0.01", message = "Coupon discount value must be positive")
    private BigDecimal value;

    @DecimalMin(value = "0.00", message = "Minimum purchase cannot be negative")
    private BigDecimal minPurchase = BigDecimal.ZERO;

    private BigDecimal maxDiscount;

    @FutureOrPresent(message = "Start date must be in the present or future")
    private LocalDate startDate;

    @Future(message = "End date must be in the future")
    private LocalDate endDate;

    @Min(value = 1, message = "Usage limit must be at least 1")
    private Integer usageLimit;
}
