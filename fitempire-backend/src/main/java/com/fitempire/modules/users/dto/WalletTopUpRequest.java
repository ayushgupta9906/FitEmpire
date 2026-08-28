package com.fitempire.modules.users.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class WalletTopUpRequest {

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "10.00", message = "Minimum top up amount is ₹10.00")
    private BigDecimal amount;

    private String razorpayPaymentId;

    private String razorpaySignature;

    private String paymentMethod; // UPI, CARD, NET_BANKING
}

