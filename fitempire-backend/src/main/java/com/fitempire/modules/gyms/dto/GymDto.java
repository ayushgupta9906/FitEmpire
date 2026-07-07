package com.fitempire.modules.gyms.dto;

import com.fitempire.modules.gyms.entity.GymStatus;
import com.fitempire.modules.gyms.entity.GymCategory;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class GymDto {
    private UUID id;
    private String name;
    private String slug;
    private String description;
    private String logoUrl;
    private String coverImageUrl;
    private String websiteUrl;
    private String email;
    private String phone;
    private GymStatus status;
    private GymCategory category;
    private boolean featured;
    private BigDecimal avgRating;
    private int totalReviews;
    private int totalMembers;
    private Instant createdAt;
    private List<GymBranchDto> branches;
    private String ownerName;
    private UUID ownerId;
}
