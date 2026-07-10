package com.fitempire.modules.gyms.repository;

import com.fitempire.modules.gyms.entity.GymDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface GymDocumentRepository extends JpaRepository<GymDocument, UUID> {
    List<GymDocument> findByGymId(UUID gymId);
}
