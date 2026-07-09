package com.fitempire.modules.gyms.repository;

import com.fitempire.modules.gyms.entity.GymRegistrationDraft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GymRegistrationDraftRepository extends JpaRepository<GymRegistrationDraft, UUID> {
    Optional<GymRegistrationDraft> findByOwnerIdAndSubmittedFalse(UUID ownerId);
}