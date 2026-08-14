package com.fitempire.modules.payments.service;

import com.fitempire.common.exception.PaymentException;
import com.fitempire.common.exception.ResourceNotFoundException;
import com.fitempire.modules.payments.dto.CreatePaymentRequest;
import com.fitempire.modules.payments.dto.PaymentOrderResponse;
import com.fitempire.modules.payments.dto.VerifyPaymentRequest;
import com.fitempire.modules.payments.dto.PaymentVerifyResponse;
import com.fitempire.modules.payments.entity.*;
import com.fitempire.modules.payments.repository.PaymentRepository;
import com.fitempire.modules.memberships.entity.MembershipPlan;
import com.fitempire.modules.memberships.entity.UserMembership;
import com.fitempire.modules.memberships.entity.MembershipStatus;
import com.fitempire.modules.memberships.repository.MembershipPlanRepository;
import com.fitempire.modules.memberships.repository.UserMembershipRepository;
import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.repository.UserRepository;
import com.fitempire.service.NotificationService;
import com.razorpay.RazorpayClient;
import com.razorpay.Order;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.HexFormat;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final MembershipPlanRepository membershipPlanRepository;
    private final UserMembershipRepository userMembershipRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final InvoiceService invoiceService;

    @Value("${app.razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${app.razorpay.key-secret}")
    private String razorpayKeySecret;

    @Value("${app.razorpay.webhook-secret}")
    private String razorpayWebhookSecret;

    @Value("${app.stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${app.gst.rate:18.0}")
    private double gstRate;

    // ── Create Payment Order (Razorpay) ───────────────────────────────────────

    @Transactional
    public PaymentOrderResponse createRazorpayOrder(CreatePaymentRequest request, UUID userId) {
        User user = findUserOrThrow(userId);
        MembershipPlan plan = membershipPlanRepository.findById(request.getPlanId())
                .orElseThrow(() -> ResourceNotFoundException.of("MembershipPlan", request.getPlanId()));

        BigDecimal baseAmount = plan.getPrice();
        BigDecimal gst = baseAmount.multiply(BigDecimal.valueOf(gstRate / 100));
        BigDecimal discount = request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO;
        BigDecimal walletUsed = request.getWalletAmount() != null ? request.getWalletAmount() : BigDecimal.ZERO;
        BigDecimal netAmount = baseAmount.add(gst).subtract(discount).subtract(walletUsed);

        if (netAmount.compareTo(BigDecimal.ZERO) < 0) {
            netAmount = BigDecimal.ZERO;
        }

        // Create Payment record
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setMembershipId(request.getPlanId());
        payment.setAmount(baseAmount);
        payment.setGstAmount(gst);
        payment.setDiscountAmount(discount);
        payment.setWalletAmount(walletUsed);
        payment.setNetAmount(netAmount);
        payment.setCurrency("INR");
        payment.setStatus(PaymentStatus.PENDING);
        payment.setPaymentGateway(PaymentGateway.RAZORPAY);
        payment.setDescription("Membership: " + plan.getName());

        Payment savedPayment = paymentRepository.save(payment);

        // Create Razorpay Order (if amount > 0)
        String orderId = null;
        if (netAmount.compareTo(BigDecimal.ZERO) > 0) {
            try {
                RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", netAmount.multiply(BigDecimal.valueOf(100)).intValue()); // paise
                orderRequest.put("currency", "INR");
                orderRequest.put("receipt", savedPayment.getId().toString());
                orderRequest.put("notes", new JSONObject()
                        .put("payment_id", savedPayment.getId().toString())
                        .put("user_id", userId.toString())
                        .put("plan_id", plan.getId().toString())
                );

                Order order = razorpayClient.orders.create(orderRequest);
                orderId = order.get("id");

                payment.setGatewayOrderId(orderId);
                paymentRepository.save(payment);

                log.info("Razorpay order created: {} for payment: {}", orderId, savedPayment.getId());
            } catch (Exception e) {
                log.error("Failed to create Razorpay order: {}", e.getMessage(), e);
                throw new PaymentException("Failed to initiate payment. Please try again.", "GATEWAY_ERROR");
            }
        }

        return PaymentOrderResponse.builder()
                .paymentId(savedPayment.getId())
                .razorpayOrderId(orderId)
                .amount(netAmount)
                .currency("INR")
                .keyId(razorpayKeyId)
                .description(payment.getDescription())
                .userEmail(user.getEmail())
                .userPhone(user.getPhone())
                .userName(user.getFullName())
                .build();
    }

    // ── Verify Razorpay Payment ───────────────────────────────────────────────

    @Transactional
    public PaymentVerifyResponse verifyRazorpayPayment(VerifyPaymentRequest request, UUID userId) {
        Payment payment = paymentRepository.findById(request.getPaymentId())
                .orElseThrow(() -> ResourceNotFoundException.of("Payment", request.getPaymentId()));

        if (!payment.getUser().getId().equals(userId)) {
            throw new PaymentException("Payment does not belong to this user.", "PAYMENT_ACCESS_DENIED");
        }

        // Verify Razorpay signature
        String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
        if (!verifyRazorpaySignature(payload, request.getRazorpaySignature(), razorpayKeySecret)) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Signature verification failed");
            paymentRepository.save(payment);
            throw new PaymentException("Payment verification failed. Invalid signature.", "SIGNATURE_INVALID");
        }

        // Mark payment complete
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setGatewayPaymentId(request.getRazorpayPaymentId());
        payment.setGatewaySignature(request.getRazorpaySignature());
        payment.setPaymentMethod(PaymentMethod.RAZORPAY);
        paymentRepository.save(payment);

        // Activate membership
        MembershipPlan plan = membershipPlanRepository.findById(payment.getMembershipId())
                .orElseThrow();
        UserMembership membership = activateMembership(payment.getUser(), plan, payment.getId());

        // Generate invoice
        invoiceService.generateInvoice(payment);

        // Send confirmation notification
        notificationService.sendPaymentConfirmation(payment.getUser().getEmail(), payment);

        log.info("Payment verified and membership activated: payment={}, membership={}", payment.getId(), membership.getId());

        return PaymentVerifyResponse.builder()
                .paymentId(payment.getId())
                .membershipId(membership.getId())
                .status(PaymentStatus.COMPLETED)
                .build();
    }

    // ── Razorpay Webhook ──────────────────────────────────────────────────────

    @Transactional
    public void handleRazorpayWebhook(String payload, String signature) {
        if (!verifyRazorpaySignature(payload, signature, razorpayWebhookSecret)) {
            log.warn("Invalid Razorpay webhook signature");
            throw new PaymentException("Invalid webhook signature.", "WEBHOOK_SIGNATURE_INVALID");
        }

        try {
            JSONObject event = new JSONObject(payload);
            String eventType = event.getString("event");
            log.info("Razorpay webhook: {}", eventType);

            if ("payment.failed".equals(eventType)) {
                JSONObject paymentData = event.getJSONObject("payload")
                        .getJSONObject("payment").getJSONObject("entity");
                String orderId = paymentData.getString("order_id");

                paymentRepository.findByGatewayOrderId(orderId).ifPresent(p -> {
                    p.setStatus(PaymentStatus.FAILED);
                    p.setFailureReason(paymentData.optString("error_description", "Payment failed"));
                    paymentRepository.save(p);
                    log.warn("Payment failed via webhook: {}", p.getId());
                });
            }
        } catch (Exception e) {
            log.error("Error processing Razorpay webhook: {}", e.getMessage(), e);
        }
    }

    // ── Refund ────────────────────────────────────────────────────────────────

    @Transactional
    public void processRefund(UUID paymentId, BigDecimal refundAmount, String reason, UUID adminId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> ResourceNotFoundException.of("Payment", paymentId));

        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new PaymentException("Only completed payments can be refunded.", "REFUND_NOT_ELIGIBLE");
        }

        BigDecimal remaining = payment.getNetAmount().subtract(payment.getRefundedAmount());
        if (refundAmount.compareTo(remaining) > 0) {
            throw new PaymentException("Refund amount exceeds remaining refundable amount.", "REFUND_EXCEEDS_AMOUNT");
        }

        // Process via Razorpay if applicable
        if (payment.getPaymentGateway() == PaymentGateway.RAZORPAY && payment.getGatewayPaymentId() != null) {
            try {
                RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
                JSONObject refundRequest = new JSONObject();
                refundRequest.put("amount", refundAmount.multiply(BigDecimal.valueOf(100)).intValue());
                refundRequest.put("notes", new JSONObject().put("reason", reason));
                client.payments.refund(payment.getGatewayPaymentId(), refundRequest);
            } catch (Exception e) {
                log.error("Razorpay refund failed: {}", e.getMessage(), e);
                throw new PaymentException("Refund processing failed. Please try again.", "REFUND_FAILED");
            }
        }

        payment.setRefundedAmount(payment.getRefundedAmount().add(refundAmount));
        payment.setStatus(payment.getRefundedAmount().compareTo(payment.getNetAmount()) >= 0
                ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED);
        paymentRepository.save(payment);

        notificationService.sendRefundConfirmation(payment.getUser().getEmail(), refundAmount, payment);
        log.info("Refund of {} processed for payment: {} by admin: {}", refundAmount, paymentId, adminId);
    }

    // ── Private Helpers ───────────────────────────────────────────────────────

    private UserMembership activateMembership(User user, MembershipPlan plan, UUID paymentId) {
        UserMembership membership = new UserMembership();
        membership.setUser(user);
        membership.setPlan(plan);
        membership.setGym(plan.getGym());
        membership.setBranch(plan.getBranch());
        membership.setStatus(MembershipStatus.ACTIVE);

        LocalDate today = LocalDate.now();
        membership.setStartDate(today);

        if (plan.getDurationDays() != null) {
            membership.setEndDate(today.plusDays(plan.getDurationDays()));
        }

        if (plan.getCreditCount() != null) {
            membership.setCreditsTotal(plan.getCreditCount());
            membership.setCreditsRemaining(plan.getCreditCount());
        }

        return userMembershipRepository.save(membership);
    }

    private boolean verifyRazorpaySignature(String payload, String signature, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(keySpec);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String computed = HexFormat.of().formatHex(hash);
            return computed.equals(signature);
        } catch (Exception e) {
            log.error("Signature verification error: {}", e.getMessage());
            return false;
        }
    }

    private User findUserOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
    }
}
