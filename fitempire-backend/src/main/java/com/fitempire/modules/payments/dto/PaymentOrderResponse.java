package com.fitempire.modules.payments.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class PaymentOrderResponse {
    private UUID paymentId;
    private String razorpayOrderId;
    private BigDecimal amount;
    private String currency;
    private String keyId;
    private String description;
    private String userEmail;
    private String userPhone;
    private String userName;
}
