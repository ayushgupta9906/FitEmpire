package com.fitempire.modules.gyms.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.modules.gyms.entity.GymRegistrationDraft;
import com.fitempire.modules.gyms.repository.GymRegistrationDraftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/gyms/onboarding")
@RequiredArgsConstructor
public class GymOnboardingController {

    private final GymRegistrationDraftRepository draftRepository;
    private final com.fitempire.modules.gyms.service.GymOnboardingService onboardingService;

    @GetMapping("/draft/{ownerId}")
    public ResponseEntity<ApiResponse<GymRegistrationDraft>> getDraft(@PathVariable UUID ownerId) {
        GymRegistrationDraft draft = draftRepository.findByOwnerIdAndSubmittedFalse(ownerId)
                .orElseGet(() -> {
                    GymRegistrationDraft newDraft = new GymRegistrationDraft();
                    newDraft.setOwnerId(ownerId);
                    newDraft.setDraftData("{}");
                    return draftRepository.save(newDraft);
                });
        return ResponseEntity.ok(ApiResponse.success("Draft fetched", draft));
    }

    @PostMapping("/draft/{ownerId}")
    public ResponseEntity<ApiResponse<GymRegistrationDraft>> saveDraft(
            @PathVariable UUID ownerId,
            @RequestBody GymRegistrationDraft payload) {
        
        GymRegistrationDraft draft = draftRepository.findByOwnerIdAndSubmittedFalse(ownerId)
                .orElse(new GymRegistrationDraft());
        
        draft.setOwnerId(ownerId);
        draft.setCurrentStep(payload.getCurrentStep());
        draft.setDraftData(payload.getDraftData());
        
        GymRegistrationDraft saved = draftRepository.save(draft);
        return ResponseEntity.ok(ApiResponse.success("Draft saved successfully", saved));
    }
    
    @PostMapping("/submit/{ownerId}")
    public ResponseEntity<ApiResponse<String>> submitRegistration(@PathVariable UUID ownerId) {
        onboardingService.submitRegistration(ownerId);
        return ResponseEntity.ok(ApiResponse.success("Registration submitted for review successfully", null));
    }
}