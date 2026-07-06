package com.fitempire.modules.trainers.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalTime;
import java.util.UUID;

@Data
public class CreateTrainerScheduleRequest {

    @NotNull(message = "Branch ID is required")
    private UUID branchId;

    @Min(value = 0, message = "Day of week must be between 0 (Sunday) and 6 (Saturday)")
    @Max(value = 6, message = "Day of week must be between 0 (Sunday) and 6 (Saturday)")
    private short dayOfWeek;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;
}
