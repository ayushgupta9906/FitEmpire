package com.fitempire.modules.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AnalyticsOverviewDto {
    private BigDecimal totalRevenue;
    private long totalBookings;
    private double conversionRate;
    private BigDecimal avgOrderValue;
}
