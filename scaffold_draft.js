const fs = require('fs');
const path = require('path');

const entityDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'gyms', 'entity');
const repoDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'gyms', 'repository');
const controllerDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'gyms', 'controller');

fs.mkdirSync(entityDir, { recursive: true });
fs.mkdirSync(repoDir, { recursive: true });
fs.mkdirSync(controllerDir, { recursive: true });

const entityCode = `package com.fitempire.modules.gyms.entity;

import com.fitempire.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.UUID;

@Entity
@Table(name = "gym_registration_drafts")
@Getter
@Setter
@NoArgsConstructor
public class GymRegistrationDraft extends BaseEntity {

    @Column(name = "owner_id", nullable = false)
    private UUID ownerId;

    @Column(name = "current_step", nullable = false)
    private int currentStep = 1;

    @Column(name = "is_submitted", nullable = false)
    private boolean submitted = false;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "draft_data", columnDefinition = "jsonb")
    private String draftData;
}`;

const repoCode = `package com.fitempire.modules.gyms.repository;

import com.fitempire.modules.gyms.entity.GymRegistrationDraft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GymRegistrationDraftRepository extends JpaRepository<GymRegistrationDraft, UUID> {
    Optional<GymRegistrationDraft> findByOwnerIdAndSubmittedFalse(UUID ownerId);
}`;

const controllerCode = `package com.fitempire.modules.gyms.controller;

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
        GymRegistrationDraft draft = draftRepository.findByOwnerIdAndSubmittedFalse(ownerId)
                .orElseThrow(() -> new RuntimeException("Draft not found"));
        
        draft.setSubmitted(true);
        draftRepository.save(draft);
        
        // Logic to convert draft JSON data into actual Gym, GymBranch, Membership plans, etc.
        // goes here, resulting in a PENDING_REVIEW Gym entity.
        
        return ResponseEntity.ok(ApiResponse.success("Registration submitted for review successfully", null));
    }
}`;

fs.writeFileSync(path.join(entityDir, 'GymRegistrationDraft.java'), entityCode);
fs.writeFileSync(path.join(repoDir, 'GymRegistrationDraftRepository.java'), repoCode);
fs.writeFileSync(path.join(controllerDir, 'GymOnboardingController.java'), controllerCode);

console.log("Draft APIs created successfully.");
