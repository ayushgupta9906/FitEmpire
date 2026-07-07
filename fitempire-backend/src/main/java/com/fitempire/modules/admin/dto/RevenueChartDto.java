package com.fitempire.modules.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class RevenueChartDto {
    private String date;
    private BigDecimal revenue;
    private long bookings;
}
