package com.fitempire.modules.users.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.users.dto.WalletDto;
import com.fitempire.modules.users.dto.WalletTopUpRequest;
import com.fitempire.modules.users.dto.WalletTransactionDto;
import com.fitempire.modules.users.entity.WalletTxnType;
import com.fitempire.modules.users.service.WalletService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/v1/wallets")
@RequiredArgsConstructor
@Tag(name = "Wallet", description = "User digital wallet and transaction management")
public class WalletController {

    private final WalletService walletService;
    private final com.fitempire.modules.users.repository.UserRepository userRepository;

    private UUID getUserIdFromPrincipal(UserDetails userDetails) {
        return userRepository.findByEmailAndDeletedFalse(userDetails.getUsername())
                .orElseThrow(() -> new com.fitempire.common.exception.ResourceNotFoundException("User not found"))
                .getId();
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user's wallet info")
    public ResponseEntity<ApiResponse<WalletDto>> getMyWallet(@AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(ApiResponse.success(walletService.getWalletByUserId(userId)));
    }

    @PostMapping("/me/top-up")
    @Operation(summary = "Admin manual top up wallet balance (User top-ups require verified gateway payment)")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<WalletTransactionDto>> topUpWallet(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody WalletTopUpRequest request) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        WalletTransactionDto txn = walletService.creditWallet(
                userId,
                request.getAmount(),
                WalletTxnType.TOPUP,
                "Admin Approved Wallet Adjustment: " + (request.getPaymentMethod() != null ? request.getPaymentMethod() : "MANUAL"),
                null,
                "ADMIN_ADJUSTMENT"
        );
        return ResponseEntity.ok(ApiResponse.success("Wallet recharged successfully by admin", txn));
    }

    @GetMapping("/me/transactions")
    @Operation(summary = "Get current user's wallet transaction history")
    public ResponseEntity<ApiResponse<PagedResponse<WalletTransactionDto>>> getMyTransactions(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(walletService.getTransactionHistory(userId, pageable)));
    }
}
