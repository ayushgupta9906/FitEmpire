package com.fitempire.modules.payments.service;

import com.fitempire.modules.payments.entity.Payment;
import com.fitempire.modules.payments.entity.PaymentStatus;
import com.fitempire.modules.payments.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RazorpayService {

    @Value("${razorpay.key.id:dummy}")
    private String keyId;

    @Value("${razorpay.key.secret:dummy}")
    private String keySecret;

    private RazorpayClient razorpayClient;
    private final PaymentRepository paymentRepository;

    @PostConstruct
    public void init() {
        try {
            if (!"dummy".equals(keyId)) {
                this.razorpayClient = new RazorpayClient(keyId, keySecret);
            }
        } catch (RazorpayException e) {
            log.error("Failed to initialize Razorpay Client: ", e);
        }
    }

    @Transactional
    public String createOrder(UUID paymentId, BigDecimal amount) {
        try {
            if (razorpayClient == null) {
                log.warn("Razorpay Client not initialized, returning mock order id");
                return "order_mock_" + UUID.randomUUID().toString().substring(0, 8);
            }

            JSONObject orderRequest = new JSONObject();
            // Razorpay expects amount in paise (multiply by 100)
            orderRequest.put("amount", amount.multiply(new BigDecimal("100")).intValue());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", paymentId.toString());

            Order order = razorpayClient.orders.create(orderRequest);
            return order.get("id");
            
        } catch (RazorpayException e) {
            log.error("Error creating Razorpay order", e);
            throw new RuntimeException("Failed to create payment order");
        }
    }

    @Transactional
    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature, UUID internalPaymentId) {
        try {
            if (razorpayClient == null) {
                log.warn("Razorpay Client not initialized, auto-verifying mock payment");
                Payment payment = paymentRepository.findById(internalPaymentId)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));
                payment.setStatus(PaymentStatus.COMPLETED);
                payment.setGatewayOrderId(orderId);
                payment.setGatewayPaymentId(paymentId);
                paymentRepository.save(payment);
                return true;
            }

            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);

            boolean isValid = Utils.verifyPaymentSignature(options, keySecret);
            
            if (isValid) {
                Payment payment = paymentRepository.findById(internalPaymentId)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));
                payment.setStatus(PaymentStatus.COMPLETED);
                payment.setGatewayOrderId(orderId);
                payment.setGatewayPaymentId(paymentId);
                payment.setGatewaySignature(signature);
                paymentRepository.save(payment);
            }
            return isValid;
            
        } catch (Exception e) {
            log.error("Error verifying payment signature", e);
            return false;
        }
    }
}
