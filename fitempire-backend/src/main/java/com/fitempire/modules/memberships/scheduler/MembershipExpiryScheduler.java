package com.fitempire.modules.memberships.scheduler;

import com.fitempire.modules.memberships.entity.UserMembership;
import com.fitempire.modules.memberships.repository.UserMembershipRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class MembershipExpiryScheduler {

    private final UserMembershipRepository userMembershipRepository;

    @Scheduled(cron = "0 0 8 * * *") // Daily at 8:00 AM IST
    public void checkExpiringMemberships() {
        LocalDate today = LocalDate.now();
        LocalDate targetDate = today.plusDays(7);

        log.info("Running membership expiry check for date range: {} to {}", today, targetDate);
        List<UserMembership> expiring = userMembershipRepository.findExpiringBetween(today, targetDate);

        for (UserMembership membership : expiring) {
            log.info("Membership {} for user {} expires on {}",
                    membership.getId(), membership.getUser().getId(), membership.getEndDate());
        }
    }
}
