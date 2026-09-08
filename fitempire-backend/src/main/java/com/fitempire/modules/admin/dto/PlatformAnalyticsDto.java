package com.fitempire.modules.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PlatformAnalyticsDto {
    private long totalActiveMembers;
    private long totalPartnerGyms;
    private long checkinsToday;
    private BigDecimal monthlyGrossRevenue;
    private BigDecimal partnerPayoutsPending;
    private double turnstileSuccessRate;
}
