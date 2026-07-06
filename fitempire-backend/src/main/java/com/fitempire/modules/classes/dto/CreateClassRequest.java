package com.fitempire.modules.classes.dto;

import com.fitempire.modules.classes.entity.ClassDifficulty;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateClassRequest {

    @NotNull(message = "Gym ID is required")
    private UUID gymId;

    private UUID branchId;
    private UUID trainerId;

    @NotBlank(message = "Class name is required")
    @Size(max = 255, message = "Class name cannot exceed 255 characters")
    private String name;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    private String thumbnailUrl;

    @Min(value = 5, message = "Class duration must be at least 5 minutes")
    @Max(value = 480, message = "Class duration cannot exceed 8 hours")
    private int durationMins;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int maxCapacity = 20;

    @NotNull(message = "Difficulty level is required")
    private ClassDifficulty difficulty = ClassDifficulty.ALL_LEVELS;

    @Size(max = 100, message = "Category name cannot exceed 100 characters")
    private String category;

    private String[] tags;
}
