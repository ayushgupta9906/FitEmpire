package com.fitempire.modules.rewards.repository;

import com.fitempire.modules.rewards.entity.RewardTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RewardTransactionRepository extends JpaRepository<RewardTransaction, UUID> {
    Page<RewardTransaction> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
}
