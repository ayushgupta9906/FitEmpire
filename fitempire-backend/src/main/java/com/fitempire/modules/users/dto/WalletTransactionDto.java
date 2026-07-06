package com.fitempire.modules.users.dto;

import com.fitempire.modules.users.entity.TransactionType;
import com.fitempire.modules.users.entity.WalletTxnType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class WalletTransactionDto {
    private UUID id;
    private UUID walletId;
    private UUID userId;
    private TransactionType type;
    private WalletTxnType txnType;
    private BigDecimal amount;
    private BigDecimal balanceBefore;
    private BigDecimal balanceAfter;
    private String description;
    private UUID referenceId;
    private String referenceType;
    private Instant createdAt;
}
