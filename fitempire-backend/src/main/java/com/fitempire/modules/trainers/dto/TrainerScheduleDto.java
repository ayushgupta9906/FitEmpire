package com.fitempire.modules.trainers.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class TrainerScheduleDto {
    private UUID id;
    private UUID trainerId;
    private UUID branchId;
    private String branchName;
    private short dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean available;
}
