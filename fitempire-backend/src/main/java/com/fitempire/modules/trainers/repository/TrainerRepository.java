package com.fitempire.modules.trainers.repository;

import com.fitempire.modules.trainers.entity.Trainer;
import com.fitempire.modules.trainers.entity.TrainerSpecialization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, UUID> {

    Optional<Trainer> findByUserIdAndDeletedFalse(UUID userId);

    @Query("SELECT t FROM Trainer t WHERE t.gym.id = :gymId AND t.deleted = false")
    List<Trainer> findByGymIdAndDeletedFalse(@Param("gymId") UUID gymId);

    @Query("SELECT t FROM Trainer t WHERE t.deleted = false AND t.available = true")
    Page<Trainer> findAllActive(Pageable pageable);

    @Query("SELECT t FROM Trainer t WHERE t.deleted = false AND t.featured = true AND t.available = true ORDER BY t.avgRating DESC")
    List<Trainer> findFeaturedActive();

    @Query("""
        SELECT t FROM Trainer t
        WHERE t.deleted = false
        AND t.available = true
        AND (
            LOWER(t.user.firstName) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(t.user.lastName) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(t.bio) LIKE LOWER(CONCAT('%', :query, '%'))
        )
        """)
    Page<Trainer> searchTrainers(@Param("query") String query, Pageable pageable);

    @Query(value = """
        SELECT * FROM trainers t
        WHERE t.is_deleted = false
        AND t.is_available = true
        AND :specialization = ANY(t.specializations)
        """, nativeQuery = true)
    Page<Trainer> findBySpecialization(@Param("specialization") String specialization, Pageable pageable);
}
