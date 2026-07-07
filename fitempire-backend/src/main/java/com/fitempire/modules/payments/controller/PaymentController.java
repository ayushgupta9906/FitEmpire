package com.fitempire.modules.payments.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.payments.dto.*;
import com.fitempire.modules.payments.entity.Payment;
import com.fitempire.modules.payments.repository.PaymentRepository;
import com.fitempire.modules.payments.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Payment creation, verification, and history")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final com.fitempire.modules.users.repository.UserRepository userRepository;

    private UUID getUserIdFromPrincipal(UserDetails userDetails) {
        return userRepository.findByEmailAndDeletedFalse(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Logged in user not found"))
                .getId();
    }

    @PostMapping("/order")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create a Razorpay payment order for a membership plan")
    public ResponseEntity<ApiResponse<PaymentOrderResponse>> createPaymentOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreatePaymentRequest request) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Order created successfully.", paymentService.createRazorpayOrder(request, userId)));
    }

    @PostMapping("/verify")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Verify Razorpay signature and complete payment")
    public ResponseEntity<ApiResponse<PaymentVerifyResponse>> verifyPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody VerifyPaymentRequest request) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully.", paymentService.verifyRazorpayPayment(request, userId)));
    }

    @PostMapping("/webhook/razorpay")
    @Operation(summary = "Razorpay payment failure/success callback webhook")
    public ResponseEntity<Void> razorpayWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {
        paymentService.handleRazorpayWebhook(payload, signature);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user's payment history")
    public ResponseEntity<ApiResponse<PagedResponse<Payment>>> getMyPayments(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Payment> payments = paymentRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(PagedResponse.of(payments)));
    }
}
