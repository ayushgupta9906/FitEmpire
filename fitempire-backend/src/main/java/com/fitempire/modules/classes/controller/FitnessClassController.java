package com.fitempire.modules.classes.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.classes.dto.*;
import com.fitempire.modules.classes.service.FitnessClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/classes")
@RequiredArgsConstructor
@Tag(name = "Classes", description = "Fitness Class discovery and booking schedule management")
public class FitnessClassController {

    private final FitnessClassService fitnessClassService;

    @GetMapping
    @Operation(summary = "Get active classes with search query")
    public ResponseEntity<ApiResponse<PagedResponse<FitnessClassDto>>> getClasses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size);
        PagedResponse<FitnessClassDto> result = fitnessClassService.getClasses(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get class by ID")
    public ResponseEntity<ApiResponse<FitnessClassDto>> getClassById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(fitnessClassService.getClassById(id)));
    }

    @GetMapping("/gym/{gymId}")
    @Operation(summary = "Get classes by Gym ID")
    public ResponseEntity<ApiResponse<List<FitnessClassDto>>> getClassesByGym(@PathVariable UUID gymId) {
        return ResponseEntity.ok(ApiResponse.success(fitnessClassService.getClassesByGym(gymId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('GYM_PARTNER', 'ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Create a new class definition (Gym Partner / Admin only)")
    public ResponseEntity<ApiResponse<FitnessClassDto>> createClass(
            @Valid @RequestBody CreateClassRequest request) {
        FitnessClassDto response = fitnessClassService.createClass(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Fitness class created successfully.", response));
    }

    // ── Class Schedules ──────────────────────────────────────────────────────

    @PostMapping("/schedules")
    @PreAuthorize("hasAnyRole('GYM_PARTNER', 'ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Schedule a class slot")
    public ResponseEntity<ApiResponse<ClassScheduleDto>> createSchedule(
            @Valid @RequestBody CreateClassScheduleRequest request) {
        ClassScheduleDto schedule = fitnessClassService.createSchedule(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Class scheduled successfully.", schedule));
    }

    @GetMapping("/schedules/branch/{branchId}")
    @Operation(summary = "Get class schedules for a branch on a specific date")
    public ResponseEntity<ApiResponse<List<ClassScheduleDto>>> getSchedules(
            @PathVariable UUID branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ClassScheduleDto> schedules = fitnessClassService.getSchedulesByBranchAndDate(branchId, date);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }

    @GetMapping("/schedules/branch/{branchId}/range")
    @Operation(summary = "Get class schedules for a branch within a date range")
    public ResponseEntity<ApiResponse<List<ClassScheduleDto>>> getSchedulesRange(
            @PathVariable UUID branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<ClassScheduleDto> schedules = fitnessClassService.getSchedulesByBranchAndDateRange(branchId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }

    @PostMapping("/schedules/{scheduleId}/cancel")
    @PreAuthorize("hasAnyRole('GYM_PARTNER', 'ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Cancel a scheduled class session")
    public ResponseEntity<ApiResponse<Void>> cancelSchedule(
            @PathVariable UUID scheduleId,
            @RequestParam String reason) {
        fitnessClassService.cancelSchedule(scheduleId, reason);
        return ResponseEntity.ok(ApiResponse.success("Class schedule session cancelled."));
    }
}
