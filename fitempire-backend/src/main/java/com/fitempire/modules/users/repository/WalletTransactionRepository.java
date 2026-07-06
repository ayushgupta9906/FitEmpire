package com.fitempire.modules.users.repository;

import com.fitempire.modules.users.entity.WalletTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, UUID> {
    Page<WalletTransaction> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    Page<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(UUID walletId, Pageable pageable);
}
