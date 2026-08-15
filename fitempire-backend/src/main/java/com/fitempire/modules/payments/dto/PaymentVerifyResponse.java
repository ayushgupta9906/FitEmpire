package com.fitempire.modules.payments.dto;

import com.fitempire.modules.payments.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVerifyResponse {
    private UUID paymentId;
    private UUID membershipId;
    private PaymentStatus status;
}
