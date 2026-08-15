package com.fitempire.modules.memberships.dto;

import com.fitempire.modules.memberships.entity.MembershipStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserMembershipDto {
    private UUID id;
    private UUID userId;
    private String userName;
    private UUID planId;
    private String planName;
    private UUID gymId;
    private String gymName;
    private UUID branchId;
    private String branchName;
    private MembershipStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer creditsRemaining;
    private Integer creditsTotal;
    private int sessionsUsedToday;
    private LocalDate lastSessionDate;
    private boolean active;
}
