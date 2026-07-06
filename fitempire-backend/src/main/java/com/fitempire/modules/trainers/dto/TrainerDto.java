package com.fitempire.modules.trainers.dto;

import com.fitempire.modules.trainers.entity.TrainerSpecialization;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class TrainerDto {
    private UUID id;
    private UUID userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private UUID gymId;
    private String gymName;
    private String bio;
    private Integer experienceYears;
    private String[] certifications;
    private TrainerSpecialization[] specializations;
    private String profilePictureUrl;
    private String coverImageUrl;
    private BigDecimal hourlyRate;
    private boolean available;
    private BigDecimal avgRating;
    private int totalReviews;
    private int totalSessions;
    private boolean featured;
}
