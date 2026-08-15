package com.fitempire.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsOverviewDto {
    private BigDecimal totalRevenue;
    private long totalBookings;
    private double conversionRate;
    private BigDecimal avgOrderValue;
}
