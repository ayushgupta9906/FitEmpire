package com.fitempire.modules.payments.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreatePaymentRequest {

    @NotNull(message = "Plan ID is required")
    private UUID planId;

    private BigDecimal discount;
    private BigDecimal walletAmount;
    private UUID couponId;
    private String couponCode;
}
