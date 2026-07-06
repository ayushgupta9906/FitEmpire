package com.fitempire.modules.payments.dto;

import com.fitempire.modules.payments.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class PaymentVerifyResponse {
    private UUID paymentId;
    private UUID membershipId;
    private PaymentStatus status;
}
