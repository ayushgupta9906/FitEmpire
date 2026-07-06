package com.fitempire.modules.coupons.dto;

import com.fitempire.modules.coupons.entity.CouponType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class CouponDto {
    private UUID id;
    private String code;
    private CouponType type;
    private BigDecimal value;
    private BigDecimal minPurchase;
    private BigDecimal maxDiscount;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer usageLimit;
    private int usedCount;
    private boolean active;
}
