package com.fitempire.modules.trainers.dto;

import com.fitempire.modules.trainers.entity.TrainerSpecialization;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreateTrainerRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotNull(message = "Gym ID is required")
    private UUID gymId;

    @Size(max = 2000, message = "Bio cannot exceed 2000 characters")
    private String bio;

    @Min(value = 0, message = "Experience years cannot be negative")
    private Integer experienceYears;

    private String[] certifications;

    private TrainerSpecialization[] specializations;

    @DecimalMin(value = "0.0", message = "Hourly rate cannot be negative")
    private BigDecimal hourlyRate;

    private String profilePictureUrl;
    private String coverImageUrl;
}
