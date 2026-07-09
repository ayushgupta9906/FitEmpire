package com.fitempire.modules.finance.dto;

import com.fitempire.modules.finance.entity.SettlementStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
public class SettlementDto {
    private UUID id;
    private UUID gymId;
    private BigDecimal totalAmount;
    private BigDecimal commissionDeducted;
    private BigDecimal taxAmount;
    private BigDecimal netPayable;
    private SettlementStatus status;
    private Instant settlementDate;
    private String bankRefNumber;
}