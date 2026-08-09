package com.fitempire.modules.payments.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.modules.payments.service.RazorpayService;
import com.fitempire.modules.coupons.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayService razorpayService;
    private final CouponService couponService;

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<String>> createOrder(@RequestBody Map<String, Object> payload) {
        UUID paymentId = UUID.fromString((String) payload.get("paymentId"));
        BigDecimal amount = new BigDecimal(payload.get("amount").toString());
        String couponCode = (String) payload.get("couponCode");
        UUID userId = UUID.fromString((String) payload.get("userId"));

        BigDecimal discount = BigDecimal.ZERO;
        if (couponCode != null && !couponCode.trim().isEmpty()) {
            discount = couponService.validateAndCalculateDiscount(userId, couponCode, amount);
        }
        
        BigDecimal finalAmount = amount.subtract(discount);
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) finalAmount = BigDecimal.ZERO;
        
        String orderId = razorpayService.createOrder(paymentId, finalAmount);
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
