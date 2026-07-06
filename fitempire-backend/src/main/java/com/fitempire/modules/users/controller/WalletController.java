package com.fitempire.modules.users.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.users.dto.WalletDto;
import com.fitempire.modules.users.dto.WalletTransactionDto;
import com.fitempire.modules.users.service.WalletService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
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
                .orElseThrow(() -> new RuntimeException("Logged in user not found"))
                .getId();
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user's wallet info")
    public ResponseEntity<ApiResponse<WalletDto>> getMyWallet(@AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(ApiResponse.success(walletService.getWalletByUserId(userId)));
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
