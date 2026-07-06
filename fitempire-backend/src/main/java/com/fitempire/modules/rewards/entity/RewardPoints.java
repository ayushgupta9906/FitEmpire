package com.fitempire.modules.rewards.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "reward_points")
@Getter
@Setter
@NoArgsConstructor
public class RewardPoints {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "total_earned")
    private int totalEarned = 0;

    @Column(name = "total_redeemed")
    private int totalRedeemed = 0;

    @Column(name = "balance")
    private int balance = 0;

    @Column(name = "tier", length = 50)
    private String tier = "BRONZE";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();
}
