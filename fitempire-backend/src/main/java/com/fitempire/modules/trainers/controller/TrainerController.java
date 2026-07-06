package com.fitempire.modules.trainers.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.trainers.dto.*;
import com.fitempire.modules.trainers.service.TrainerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/trainers")
@RequiredArgsConstructor
@Tag(name = "Trainers", description = "Trainer discovery and schedule management")
public class TrainerController {

    private final TrainerService trainerService;

    @GetMapping
    @Operation(summary = "Search and list active trainers")
    public ResponseEntity<ApiResponse<PagedResponse<TrainerDto>>> getTrainers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String specialization) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("avgRating").descending());
        PagedResponse<TrainerDto> result = trainerService.searchTrainers(search, specialization, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured trainers")
    public ResponseEntity<ApiResponse<List<TrainerDto>>> getFeaturedTrainers() {
        return ResponseEntity.ok(ApiResponse.success(trainerService.getFeaturedTrainers()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get trainer details by ID")
    public ResponseEntity<ApiResponse<TrainerDto>> getTrainerById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(trainerService.getTrainerById(id)));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get trainer details associated with User ID")
    public ResponseEntity<ApiResponse<TrainerDto>> getTrainerByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(ApiResponse.success(trainerService.getTrainerByUserId(userId)));
    }

    @GetMapping("/gym/{gymId}")
    @Operation(summary = "Get trainers by Gym ID")
    public ResponseEntity<ApiResponse<List<TrainerDto>>> getTrainersByGym(@PathVariable UUID gymId) {
        return ResponseEntity.ok(ApiResponse.success(trainerService.getTrainersByGym(gymId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('GYM_PARTNER', 'ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Register a user as a trainer (Gym Partner / Admin only)")
    public ResponseEntity<ApiResponse<TrainerDto>> registerTrainer(
            @Valid @RequestBody CreateTrainerRequest request) {
        TrainerDto trainer = trainerService.registerTrainer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Trainer registered successfully.", trainer));
    }

    @PostMapping("/{trainerId}/availability")
    @PreAuthorize("hasAnyRole('TRAINER', 'GYM_PARTNER', 'ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Toggle trainer availability")
    public ResponseEntity<ApiResponse<Void>> toggleAvailability(
            @PathVariable UUID trainerId,
            @RequestParam boolean available) {
        trainerService.toggleTrainerAvailability(trainerId, available);
        return ResponseEntity.ok(ApiResponse.success("Availability updated."));
    }

    // ── Trainer Schedule Endpoints ───────────────────────────────────────────

    @GetMapping("/{trainerId}/schedules")
    @Operation(summary = "Get trainer's working schedules")
    public ResponseEntity<ApiResponse<List<TrainerScheduleDto>>> getSchedules(
            @PathVariable UUID trainerId) {
        return ResponseEntity.ok(ApiResponse.success(trainerService.getTrainerSchedules(trainerId)));
    }

    @PostMapping("/{trainerId}/schedules")
    @PreAuthorize("hasAnyRole('TRAINER', 'GYM_PARTNER', 'ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Add a new schedule slot for trainer")
    public ResponseEntity<ApiResponse<TrainerScheduleDto>> addSchedule(
            @PathVariable UUID trainerId,
            @Valid @RequestBody CreateTrainerScheduleRequest request) {
        TrainerScheduleDto schedule = trainerService.addSchedule(trainerId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Schedule slot added.", schedule));
    }

    @DeleteMapping("/{trainerId}/schedules/{scheduleId}")
    @PreAuthorize("hasAnyRole('TRAINER', 'GYM_PARTNER', 'ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Remove a schedule slot")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(
            @PathVariable UUID trainerId,
            @PathVariable UUID scheduleId) {
        trainerService.deleteSchedule(trainerId, scheduleId);
        return ResponseEntity.ok(ApiResponse.success("Schedule slot deleted."));
    }
}
