const fs = require('fs');
const path = require('path');

const pomPath = path.join(__dirname, 'fitempire-backend', 'pom.xml');
let pomContent = fs.readFileSync(pomPath, 'utf8');

if (!pomContent.includes('<artifactId>razorpay-java</artifactId>')) {
    const depString = `
        <!-- Razorpay -->
        <dependency>
            <groupId>com.razorpay</groupId>
            <artifactId>razorpay-java</artifactId>
            <version>\${razorpay.version}</version>
        </dependency>
`;
    pomContent = pomContent.replace('<!-- ── Database ─────────────────────────────── -->', depString + '\n        <!-- ── Database ─────────────────────────────── -->');
    fs.writeFileSync(pomPath, pomContent);
    console.log("Added Razorpay dependency to pom.xml");
} else {
    console.log("Razorpay dependency already exists.");
}

// 2. Update Payment.java to add `isSettled`
const paymentPath = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'payments', 'entity', 'Payment.java');
let paymentContent = fs.readFileSync(paymentPath, 'utf8');

if (!paymentContent.includes('private boolean isSettled')) {
    paymentContent = paymentContent.replace(
        'private Instant updatedAt = Instant.now();',
        'private Instant updatedAt = Instant.now();\n\n    @Column(name = "is_settled", nullable = false)\n    private boolean isSettled = false;'
    );
    fs.writeFileSync(paymentPath, paymentContent);
    console.log("Added isSettled to Payment.java");
} else {
    console.log("isSettled already exists in Payment.java");
}

// 3. Create RazorpayService
const serviceDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'payments', 'service');
fs.mkdirSync(serviceDir, { recursive: true });

const razorpayService = `package com.fitempire.modules.payments.service;

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

    @Value("\${razorpay.key.id:dummy}")
    private String keyId;

    @Value("\${razorpay.key.secret:dummy}")
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
                payment.setStatus(PaymentStatus.SUCCESS);
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
                payment.setStatus(PaymentStatus.SUCCESS);
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
`;

fs.writeFileSync(path.join(serviceDir, 'RazorpayService.java'), razorpayService);
console.log("Created RazorpayService.java");
