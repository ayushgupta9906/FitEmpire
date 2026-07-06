package com.fitempire.modules.ai.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.modules.ai.dto.AiRecommendationDto;
import com.fitempire.modules.ai.service.AiRecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/ai")
@RequiredArgsConstructor
@Tag(name = "AI Recommendations", description = "AI workout plans and nutrition suggestions")
public class AiRecommendationController {

    private final AiRecommendationService aiRecommendationService;
    private final com.fitempire.modules.users.repository.UserRepository userRepository;

    private UUID getUserIdFromPrincipal(UserDetails userDetails) {
        return userRepository.findByEmailAndDeletedFalse(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Logged in user not found"))
                .getId();
    }

    @GetMapping("/recommendations")
    @Operation(summary = "Get active AI recommendations for the logged in user")
    public ResponseEntity<ApiResponse<List<AiRecommendationDto>>> getMyRecommendations(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(ApiResponse.success(aiRecommendationService.getActiveRecommendations(userId)));
    }

    @PostMapping("/recommendations/workout")
    @Operation(summary = "Generate a fresh workout recommendation")
    public ResponseEntity<ApiResponse<AiRecommendationDto>> generateWorkout(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(ApiResponse.success(aiRecommendationService.generateWorkoutRecommendation(userId)));
    }

    @PostMapping("/recommendations/nutrition")
    @Operation(summary = "Generate a fresh nutrition recommendation")
    public ResponseEntity<ApiResponse<AiRecommendationDto>> generateNutrition(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(ApiResponse.success(aiRecommendationService.generateNutritionRecommendation(userId)));
    }

    @PostMapping("/recommendations/{id}/feedback")
    @Operation(summary = "Submit feedback on an AI recommendation")
    public ResponseEntity<ApiResponse<Void>> submitFeedback(
            @PathVariable UUID id,
            @RequestParam String feedback) {
        aiRecommendationService.submitFeedback(id, feedback);
        return ResponseEntity.ok(ApiResponse.success("Feedback submitted successfully."));
    }

    @PostMapping("/recommendations/{id}/dismiss")
    @Operation(summary = "Dismiss an AI recommendation")
    public ResponseEntity<ApiResponse<Void>> dismiss(@PathVariable UUID id) {
        aiRecommendationService.dismissRecommendation(id);
        return ResponseEntity.ok(ApiResponse.success("Recommendation dismissed."));
    }
}
