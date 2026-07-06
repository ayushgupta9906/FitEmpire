package com.fitempire.modules.users.dto;

import com.fitempire.modules.users.entity.FitnessGoal;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class UserProfileDto {
    private String bio;
    private FitnessGoal fitnessGoal;
    private String fitnessLevel;
    private BigDecimal heightCm;
    private BigDecimal weightKg;
    private BigDecimal targetWeightKg;
    private BigDecimal bmi;
    private Integer fitnessScore;
    private Integer totalCheckins;
    private Integer totalClasses;
    private String preferredWorkoutTime;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private Boolean notificationPush;
    private Boolean notificationEmail;
    private Boolean notificationSms;
    private Boolean darkMode;
    private String language;
}
