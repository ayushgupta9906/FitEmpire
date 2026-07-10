const fs = require('fs');
const path = require('path');

const controllerDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'payments', 'controller');
fs.mkdirSync(controllerDir, { recursive: true });

const controllerContent = `package com.fitempire.modules.payments.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.modules.payments.service.RazorpayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayService razorpayService;

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<String>> createOrder(@RequestBody Map<String, Object> payload) {
        UUID paymentId = UUID.fromString((String) payload.get("paymentId"));
        BigDecimal amount = new BigDecimal(payload.get("amount").toString());
        
        String orderId = razorpayService.createOrder(paymentId, amount);
        return ResponseEntity.ok(ApiResponse.success("Order created", orderId));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Boolean>> verifyPayment(@RequestBody Map<String, Object> payload) {
        String orderId = (String) payload.get("razorpay_order_id");
        String paymentId = (String) payload.get("razorpay_payment_id");
        String signature = (String) payload.get("razorpay_signature");
        UUID internalPaymentId = UUID.fromString((String) payload.get("internal_payment_id"));
        
        boolean isVerified = razorpayService.verifyPaymentSignature(orderId, paymentId, signature, internalPaymentId);
        
        if (isVerified) {
            return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", true));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid signature", "PAYMENT_FAILED"));
        }
    }
}
`;

fs.writeFileSync(path.join(controllerDir, 'PaymentController.java'), controllerContent);
console.log("Created PaymentController.java");
