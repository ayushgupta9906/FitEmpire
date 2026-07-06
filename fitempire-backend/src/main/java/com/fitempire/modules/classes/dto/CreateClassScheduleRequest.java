package com.fitempire.modules.classes.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class CreateClassScheduleRequest {

    @NotNull(message = "Fitness class ID is required")
    private UUID fitnessClassId;

    @NotNull(message = "Branch ID is required")
    private UUID branchId;

    private UUID trainerId;

    @NotNull(message = "Scheduled date is required")
    @FutureOrPresent(message = "Schedule date cannot be in the past")
    private LocalDate scheduledDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    private int maxCapacity; // overrides default class capacity if set > 0
}
