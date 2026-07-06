package com.fitempire.modules.classes.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class ClassScheduleDto {
    private UUID id;
    private UUID fitnessClassId;
    private String className;
    private UUID branchId;
    private String branchName;
    private UUID trainerId;
    private String trainerName;
    private LocalDate scheduledDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private int maxCapacity;
    private int bookedCount;
    private int waitlistCount;
    private boolean cancelled;
    private String cancellationReason;
}
