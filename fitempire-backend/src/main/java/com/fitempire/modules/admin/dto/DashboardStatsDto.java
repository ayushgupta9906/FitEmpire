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
public class DashboardStatsDto {
    private long totalUsers;
    private long totalGyms;
    private long totalBookingsToday;
    private BigDecimal totalRevenueToday;
    private long activeMembers;
    private long pendingApprovals;
    private double growthRate;
}
