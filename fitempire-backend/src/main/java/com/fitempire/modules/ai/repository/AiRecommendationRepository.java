package com.fitempire.modules.ai.repository;

import com.fitempire.modules.ai.entity.AiRecommendation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AiRecommendationRepository extends JpaRepository<AiRecommendation, UUID> {

    @Query("""
        SELECT r FROM AiRecommendation r
        WHERE r.user.id = :userId
        AND r.dismissed = false
        ORDER BY r.createdAt DESC
        """)
    List<AiRecommendation> findActiveRecommendations(@Param("userId") UUID userId);

    Page<AiRecommendation> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
}
