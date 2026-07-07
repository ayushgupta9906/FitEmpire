package com.fitempire.modules.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class TopGymDto {
    private UUID gymId;
    private String gymName;
    private long totalBookings;
    private BigDecimal revenue;
}
