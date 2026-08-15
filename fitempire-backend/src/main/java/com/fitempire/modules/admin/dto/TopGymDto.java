package com.fitempire.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopGymDto {
    private UUID gymId;
    private String gymName;
    private long totalBookings;
    private BigDecimal revenue;
}
