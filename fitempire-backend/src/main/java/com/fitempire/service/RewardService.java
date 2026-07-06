package com.fitempire.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RewardService {

    private final com.fitempire.modules.rewards.repository.RewardPointsRepository rewardPointsRepository;
    private final com.fitempire.modules.rewards.repository.RewardTransactionRepository rewardTransactionRepository;

    @Value("${app.rewards.points-per-checkin:50}")
    private int pointsPerCheckin;

    @Value("${app.rewards.points-per-review:25}")
    private int pointsPerReview;

    @Value("${app.rewards.referral-points-referrer:500}")
    private int referralPointsReferrer;

    @Value("${app.rewards.referral-points-referee:200}")
    private int referralPointsReferee;

    @Async
    @Transactional
    public void awardCheckInPoints(UUID userId) {
        awardPoints(userId, pointsPerCheckin, "Check-in reward", null, "CHECKIN");
    }

    @Async
    @Transactional
    public void awardBookingPoints(UUID userId) {
        awardPoints(userId, 10, "Booking reward", null, "BOOKING");
    }

    @Async
    @Transactional
    public void awardReviewPoints(UUID userId, UUID reviewId) {
        awardPoints(userId, pointsPerReview, "Review reward", reviewId, "REVIEW");
    }

    @Async
    @Transactional
    public void awardReferralPoints(UUID referrerId, UUID refereeId) {
        awardPoints(referrerId, referralPointsReferrer, "Referral bonus — friend joined!", refereeId, "REFERRAL");
        awardPoints(refereeId, referralPointsReferee, "Welcome bonus — joined via referral!", referrerId, "REFERRAL");
    }

    @Transactional
    public boolean redeemPoints(UUID userId, int points) {
        var rewardPoints = rewardPointsRepository.findByUserId(userId).orElse(null);
        if (rewardPoints == null || rewardPoints.getBalance() < points) {
            return false;
        }
        rewardPoints.setBalance(rewardPoints.getBalance() - points);
        rewardPoints.setTotalRedeemed(rewardPoints.getTotalRedeemed() + points);
        rewardPointsRepository.save(rewardPoints);

        // Record transaction
        var txn = new com.fitempire.modules.rewards.entity.RewardTransaction();
        txn.setUserId(userId);
        txn.setPoints(-points);
        txn.setType(com.fitempire.modules.users.entity.TransactionType.DEBIT);
        txn.setDescription("Points redeemed");
        rewardTransactionRepository.save(txn);

        log.info("Redeemed {} points for user: {}", points, userId);
        return true;
    }

    private void awardPoints(UUID userId, int points, String description, UUID refId, String refType) {
        try {
            var rewardPoints = rewardPointsRepository.findByUserId(userId)
                    .orElseGet(() -> {
                        var rp = new com.fitempire.modules.rewards.entity.RewardPoints();
                        rp.setUserId(userId);
                        return rewardPointsRepository.save(rp);
                    });

            rewardPoints.setBalance(rewardPoints.getBalance() + points);
            rewardPoints.setTotalEarned(rewardPoints.getTotalEarned() + points);
            updateTier(rewardPoints);
            rewardPointsRepository.save(rewardPoints);

            var txn = new com.fitempire.modules.rewards.entity.RewardTransaction();
            txn.setUserId(userId);
            txn.setPoints(points);
            txn.setType(com.fitempire.modules.users.entity.TransactionType.CREDIT);
            txn.setDescription(description);
            txn.setReferenceId(refId);
            txn.setReferenceType(refType);
            rewardTransactionRepository.save(txn);

            log.debug("Awarded {} points to user: {} ({})", points, userId, description);
        } catch (Exception e) {
            log.error("Failed to award points to user {}: {}", userId, e.getMessage());
        }
    }

    private void updateTier(com.fitempire.modules.rewards.entity.RewardPoints rp) {
        int total = rp.getTotalEarned();
        if (total >= 10000) rp.setTier("PLATINUM");
        else if (total >= 5000) rp.setTier("GOLD");
        else if (total >= 1000) rp.setTier("SILVER");
        else rp.setTier("BRONZE");
    }
}
