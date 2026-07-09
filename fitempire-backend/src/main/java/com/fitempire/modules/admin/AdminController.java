package com.fitempire.modules.admin;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.admin.dto.*;
import com.fitempire.modules.gyms.dto.GymDto;
import com.fitempire.modules.gyms.entity.Gym;
import com.fitempire.modules.gyms.entity.GymStatus;
import com.fitempire.modules.gyms.mapper.GymMapper;
import com.fitempire.modules.gyms.repository.GymRepository;
import com.fitempire.modules.memberships.dto.UserMembershipDto;
import com.fitempire.modules.memberships.entity.UserMembership;
import com.fitempire.modules.memberships.mapper.MembershipMapper;
import com.fitempire.modules.memberships.repository.UserMembershipRepository;
import com.fitempire.modules.payments.entity.Payment;
import com.fitempire.modules.payments.repository.PaymentRepository;
import com.fitempire.modules.payments.service.PaymentService;
import com.fitempire.modules.users.dto.UserDto;
import com.fitempire.modules.users.repository.UserRepository;
import com.fitempire.modules.users.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@Tag(name = "Admin Operations", description = "Back-office management panel statistics, user deactivation, gym reviews")
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;
    private final GymRepository gymRepository;
    private final GymMapper gymMapper;
    private final UserRepository userRepository;
    private final UserMembershipRepository userMembershipRepository;
    private final MembershipMapper membershipMapper;
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;

    private UUID getUserIdFromPrincipal(UserDetails userDetails) {
        return userRepository.findByEmailAndDeletedFalse(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Admin user not found"))
                .getId();
    }

    // ── Dashboard stats ──────────────────────────────────────────────────────

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get aggregate statistics for the dashboard overview")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    @GetMapping("/dashboard/revenue")
    @Operation(summary = "Get historical revenue data for chart plotting")
    public ResponseEntity<ApiResponse<List<RevenueChartDto>>> getRevenueChart(
            @RequestParam(defaultValue = "week") String period) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getRevenueChart(period)));
    }

    @GetMapping("/dashboard/activity")
    @Operation(summary = "Get recent platform activities log")
    public ResponseEntity<ApiResponse<List<RecentActivityDto>>> getRecentActivity() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getRecentActivity()));
    }

    // ── Analytics ────────────────────────────────────────────────────────────

    @GetMapping("/analytics/overview")
    @Operation(summary = "Get detailed analytics performance overview")
    public ResponseEntity<ApiResponse<AnalyticsOverviewDto>> getAnalyticsOverview() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAnalyticsOverview()));
    }

    @GetMapping("/analytics/top-gyms")
    @Operation(summary = "Get list of top-performing gyms")
    public ResponseEntity<ApiResponse<List<TopGymDto>>> getTopGyms() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getTopGyms()));
    }

    @GetMapping("/analytics/cities")
    @Operation(summary = "Get customer distribution and partners metrics by city")
    public ResponseEntity<ApiResponse<List<CityDataDto>>> getTopCities() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getTopCities()));
    }

    // ── Users CRUD ───────────────────────────────────────────────────────────

    @GetMapping("/users")
    @Operation(summary = "Search/list all active platform users")
    public ResponseEntity<ApiResponse<PagedResponse<UserDto>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers(pageable, search)));
    }

    @GetMapping("/users/{userId}")
    @Operation(summary = "Get a platform user details")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable UUID userId) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(userId)));
    }

    @PostMapping("/users/{userId}/deactivate")
    @Operation(summary = "Deactivate platform user account")
    public ResponseEntity<ApiResponse<Void>> deactivateUser(
            @PathVariable UUID userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID adminId = getUserIdFromPrincipal(userDetails);
        userService.deactivateUser(userId, adminId);
        return ResponseEntity.ok(ApiResponse.success("User deactivated successfully."));
    }

    @PostMapping("/users/{userId}/reactivate")
    @Operation(summary = "Reactivate platform user account")
    public ResponseEntity<ApiResponse<Void>> reactivateUser(
            @PathVariable UUID userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID adminId = getUserIdFromPrincipal(userDetails);
        userService.reactivateUser(userId, adminId);
        return ResponseEntity.ok(ApiResponse.success("User reactivated successfully."));
    }

    // ── Gyms CRUD ────────────────────────────────────────────────────────────

    @GetMapping("/gyms")
    @Operation(summary = "List gyms by review/active status")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<PagedResponse<GymDto>>> getAllGyms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Gym> gymPage;
        if (status != null && !status.isBlank()) {
            GymStatus gymStatus = GymStatus.valueOf(status.toUpperCase());
            gymPage = gymRepository.findByStatusWithOwner(gymStatus, pageable);
        } else {
            gymPage = gymRepository.findAllWithOwner(pageable);
        }
        return ResponseEntity.ok(ApiResponse.success(PagedResponse.of(gymPage.map(gymMapper::toDto))));
    }

    // ── Memberships CRUD ──────────────────────────────────────────────────────

    @GetMapping("/memberships")
    @Operation(summary = "List all active subscriptions/memberships")
    public ResponseEntity<ApiResponse<PagedResponse<UserMembershipDto>>> getAllMemberships(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<UserMembership> membershipsPage = userMembershipRepository.findAll(pageable);
        return ResponseEntity.ok(ApiResponse.success(PagedResponse.of(membershipsPage.map(membershipMapper::toDto))));
    }

    // ── Payments CRUD ─────────────────────────────────────────────────────────

    @GetMapping("/payments")
    @Operation(summary = "List all payments history")
    public ResponseEntity<ApiResponse<PagedResponse<Payment>>> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Payment> paymentPage = paymentRepository.findAll(pageable);
        return ResponseEntity.ok(ApiResponse.success(PagedResponse.of(paymentPage)));
    }

    @PostMapping("/payments/{paymentId}/refund")
    @Operation(summary = "Refund a specific transaction")
    public ResponseEntity<ApiResponse<Void>> processRefund(
            @PathVariable UUID paymentId,
            @RequestBody RefundRequest refundRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID adminId = getUserIdFromPrincipal(userDetails);
        paymentService.processRefund(paymentId, refundRequest.getAmount(), refundRequest.getReason(), adminId);
        return ResponseEntity.ok(ApiResponse.success("Refund initiated successfully."));
    }

    // Static helper class for request mapping
    @lombok.Data
    public static class RefundRequest {
        private BigDecimal amount;
        private String reason;
    }
}
