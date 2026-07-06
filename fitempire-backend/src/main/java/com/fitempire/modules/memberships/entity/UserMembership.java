package com.fitempire.modules.memberships.entity;

import com.fitempire.common.entity.BaseEntity;
import com.fitempire.modules.gyms.entity.Gym;
import com.fitempire.modules.gyms.entity.GymBranch;
import com.fitempire.modules.users.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "user_memberships")
@Getter
@Setter
@NoArgsConstructor
public class UserMembership extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private MembershipPlan plan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private GymBranch branch;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MembershipStatus status = MembershipStatus.PENDING;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "credits_remaining")
    private Integer creditsRemaining;

    @Column(name = "credits_total")
    private Integer creditsTotal;

    @Column(name = "sessions_used_today")
    private int sessionsUsedToday = 0;

    @Column(name = "last_session_date")
    private LocalDate lastSessionDate;

    @Column(name = "freeze_start_date")
    private LocalDate freezeStartDate;

    @Column(name = "freeze_end_date")
    private LocalDate freezeEndDate;

    @Column(name = "freeze_days_used")
    private int freezeDaysUsed = 0;

    @Column(name = "auto_renew")
    private boolean autoRenew = false;

    @Column(name = "corporate_code", length = 100)
    private String corporateCode;

    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    public boolean isActive() {
        return status == MembershipStatus.ACTIVE
                && (endDate == null || !LocalDate.now().isAfter(endDate));
    }

    public boolean isExpired() {
        return endDate != null && LocalDate.now().isAfter(endDate);
    }

    public boolean hasCreditsAvailable() {
        return creditsRemaining != null && creditsRemaining > 0;
    }

    public boolean canCheckIn() {
        if (!isActive()) return false;
        if (plan.getType() == MembershipType.CREDIT_PACK) {
            return hasCreditsAvailable();
        }
        if (lastSessionDate != null && lastSessionDate.equals(LocalDate.now())) {
            return sessionsUsedToday < plan.getMaxSessionsPerDay();
        }
        return true;
    }

    public void useCredit() {
        if (creditsRemaining != null && creditsRemaining > 0) {
            creditsRemaining--;
        }
    }

    public void recordSession() {
        LocalDate today = LocalDate.now();
        if (lastSessionDate == null || !lastSessionDate.equals(today)) {
            sessionsUsedToday = 1;
            lastSessionDate = today;
        } else {
            sessionsUsedToday++;
        }
    }
}
