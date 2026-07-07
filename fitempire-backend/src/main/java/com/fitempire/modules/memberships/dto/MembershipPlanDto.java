package com.fitempire.modules.memberships.dto;

import com.fitempire.modules.memberships.entity.MembershipType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class MembershipPlanDto {
    private UUID id;
    private UUID gymId;
    private String gymName;
    private UUID branchId;
    private String branchName;
    private String name;
    private String description;
    private MembershipType type;
    private BigDecimal price;
    private BigDecimal gstAmount;
    private BigDecimal totalPrice;
    private Integer durationDays;
    private Integer creditCount;
    private Integer maxFreezeDays;
    private Integer maxSessionsPerDay;
    private boolean includesClasses;
    private boolean includesPersonalTraining;
    private String[] includesAmenities;
    private boolean active;
}
