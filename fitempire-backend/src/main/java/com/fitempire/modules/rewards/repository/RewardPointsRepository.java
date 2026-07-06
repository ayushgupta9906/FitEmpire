package com.fitempire.modules.rewards.repository;

import com.fitempire.modules.rewards.entity.RewardPoints;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RewardPointsRepository extends JpaRepository<RewardPoints, UUID> {
    Optional<RewardPoints> findByUserId(UUID userId);
}
