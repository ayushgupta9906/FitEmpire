package com.fitempire.modules.users.dto;

import com.fitempire.modules.users.entity.FitnessGoal;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateProfileRequest {

    @Size(max = 500, message = "Bio cannot exceed 500 characters")
    private String bio;

    private FitnessGoal fitnessGoal;

    @Size(max = 50, message = "Fitness level too long")
    private String fitnessLevel;

    @DecimalMin(value = "50", message = "Height must be at least 50 cm")
    @DecimalMax(value = "300", message = "Height cannot exceed 300 cm")
    private BigDecimal heightCm;

    @DecimalMin(value = "20", message = "Weight must be at least 20 kg")
    @DecimalMax(value = "500", message = "Weight cannot exceed 500 kg")
    private BigDecimal weightKg;

    @DecimalMin(value = "20", message = "Target weight must be at least 20 kg")
    @DecimalMax(value = "500", message = "Target weight cannot exceed 500 kg")
    private BigDecimal targetWeightKg;

    @Size(max = 50)
    private String preferredWorkoutTime;

    @Size(max = 100)
    private String city;

    @Size(max = 100)
    private String state;

    @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Invalid pincode")
    private String pincode;

    private String addressLine1;
    private String addressLine2;

    private Boolean notificationPush;
    private Boolean notificationEmail;
    private Boolean notificationSms;
    private Boolean darkMode;

    @Pattern(regexp = "^(en|hi|ta|te|kn|ml|mr|gu|bn)$", message = "Unsupported language")
    private String language;
}
