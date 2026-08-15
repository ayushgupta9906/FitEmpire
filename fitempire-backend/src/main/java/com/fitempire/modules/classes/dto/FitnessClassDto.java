package com.fitempire.modules.classes.dto;

import com.fitempire.modules.classes.entity.ClassDifficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FitnessClassDto {
    private UUID id;
    private UUID gymId;
    private String gymName;
    private UUID branchId;
    private String branchName;
    private UUID trainerId;
    private String trainerName;
    private String name;
    private String description;
    private String thumbnailUrl;
    private int durationMins;
    private int maxCapacity;
    private ClassDifficulty difficulty;
    private String category;
    private String[] tags;
    private boolean active;
}
