package com.fitempire.modules.gyms.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.gyms.dto.*;
import com.fitempire.modules.gyms.service.GymService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/gyms")
@RequiredArgsConstructor
@Tag(name = "Gyms", description = "Gym discovery, management, and partner portal")
public class GymController {

    private final GymService gymService;
    private final com.fitempire.modules.users.repository.UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Browse active gyms with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<GymDto>>> getGyms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String city) {
        var pageable = PageRequest.of(page, size, Sort.by("featured").descending().and(Sort.by("avgRating").descending()));
        PagedResponse<GymDto> result = gymService.searchGyms(search, city, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured gyms")
    public ResponseEntity<ApiResponse<List<GymDto>>> getFeaturedGyms() {
        return ResponseEntity.ok(ApiResponse.success(gymService.getFeaturedGyms()));
    }

    @GetMapping("/nearby")
    @Operation(summary = "Find gyms near a location")
    public ResponseEntity<ApiResponse<List<GymDto>>> getNearbyGyms(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "10") double radiusKm,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(ApiResponse.success(
                gymService.getNearbyGyms(latitude, longitude, radiusKm, limit)));
    }

    @GetMapping("/{gymId}")
    @Operation(summary = "Get gym details by ID")
    public ResponseEntity<ApiResponse<GymDto>> getGym(@PathVariable UUID gymId) {
        return ResponseEntity.ok(ApiResponse.success(gymService.getGymById(gymId)));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get gym details by slug")
    public ResponseEntity<ApiResponse<GymDto>> getGymBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(gymService.getGymBySlug(slug)));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Register a new gym (becomes GYM_PARTNER)")
    public ResponseEntity<ApiResponse<GymDto>> createGym(
            @Valid @RequestBody CreateGymRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID ownerId = userRepository.findByEmailAndDeletedFalse(userDetails.getUsername())
                .orElseThrow().getId();
        GymDto gym = gymService.createGym(request, ownerId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Gym registration submitted for review.", gym));
    }

    @GetMapping("/my-gyms")
    @PreAuthorize("hasAnyRole('GYM_PARTNER', 'ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Get gyms owned by the authenticated partner")
    public ResponseEntity<ApiResponse<List<GymDto>>> getMyGyms(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID ownerId = userRepository.findByEmailAndDeletedFalse(userDetails.getUsername())
                .orElseThrow().getId();
        return ResponseEntity.ok(ApiResponse.success(gymService.getGymsByOwner(ownerId)));
    }

    // ── Admin Endpoints ───────────────────────────────────────────────────────

    @PostMapping("/{gymId}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Approve a gym registration (Admin only)")
    public ResponseEntity<ApiResponse<GymDto>> approveGym(
            @PathVariable UUID gymId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID adminId = userRepository.findByEmailAndDeletedFalse(userDetails.getUsername())
                .orElseThrow().getId();
        return ResponseEntity.ok(ApiResponse.success("Gym approved.", gymService.approveGym(gymId, adminId)));
    }

    @PostMapping("/{gymId}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Reject a gym registration (Admin only)")
    public ResponseEntity<ApiResponse<GymDto>> rejectGym(
            @PathVariable UUID gymId,
            @RequestParam String reason,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID adminId = userRepository.findByEmailAndDeletedFalse(userDetails.getUsername())
                .orElseThrow().getId();
        return ResponseEntity.ok(ApiResponse.success("Gym rejected.", gymService.rejectGym(gymId, reason, adminId)));
    }
}
