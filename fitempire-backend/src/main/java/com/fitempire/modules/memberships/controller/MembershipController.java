package com.fitempire.modules.memberships.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.memberships.dto.MembershipPlanDto;
import com.fitempire.modules.memberships.dto.UserMembershipDto;
import com.fitempire.modules.memberships.service.MembershipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/memberships")
@RequiredArgsConstructor
@Tag(name = "Memberships", description = "Membership plans browsing and subscriptions history")
public class MembershipController {

    private final MembershipService membershipService;
    private final com.fitempire.modules.users.repository.UserRepository userRepository;

    private UUID getUserIdFromPrincipal(UserDetails userDetails) {
        return userRepository.findByEmailAndDeletedFalse(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Logged in user not found"))
                .getId();
    }

    @GetMapping("/plans")
    @Operation(summary = "Get list of all active membership plans")
    public ResponseEntity<ApiResponse<List<MembershipPlanDto>>> getPlans() {
        return ResponseEntity.ok(ApiResponse.success(membershipService.getActivePlans()));
    }

    @GetMapping("/plans/{planId}")
    @Operation(summary = "Get details of a specific membership plan")
    public ResponseEntity<ApiResponse<MembershipPlanDto>> getPlanById(@PathVariable UUID planId) {
        return ResponseEntity.ok(ApiResponse.success(membershipService.getPlanById(planId)));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user's membership history")
    public ResponseEntity<ApiResponse<PagedResponse<UserMembershipDto>>> getMyMemberships(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(membershipService.getMyMemberships(userId, pageable)));
    }

    @GetMapping("/my/active")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user's active memberships")
    public ResponseEntity<ApiResponse<List<UserMembershipDto>>> getMyActiveMemberships(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(ApiResponse.success(membershipService.getActiveMemberships(userId)));
    }
}
