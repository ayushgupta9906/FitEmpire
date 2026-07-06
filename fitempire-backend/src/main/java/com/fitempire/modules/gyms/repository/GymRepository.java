package com.fitempire.modules.gyms.repository;

import com.fitempire.modules.gyms.entity.Gym;
import com.fitempire.modules.gyms.entity.GymStatus;
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
public interface GymRepository extends JpaRepository<Gym, UUID> {

    Optional<Gym> findBySlugAndDeletedFalse(String slug);

    @Query("SELECT g FROM Gym g WHERE g.deleted = false AND g.status = :status ORDER BY g.featured DESC, g.avgRating DESC")
    Page<Gym> findByStatus(@Param("status") GymStatus status, Pageable pageable);

    @Query("SELECT g FROM Gym g WHERE g.owner.id = :ownerId AND g.deleted = false ORDER BY g.createdAt DESC")
    List<Gym> findByOwnerId(@Param("ownerId") UUID ownerId);

    @Query("""
        SELECT g FROM Gym g
        JOIN g.branches b
        WHERE g.deleted = false
        AND g.status = 'ACTIVE'
        AND b.deleted = false
        AND b.active = true
        AND (
            LOWER(g.name) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(b.city) LIKE LOWER(CONCAT('%', :query, '%'))
        )
        ORDER BY g.featured DESC, g.avgRating DESC
        """)
    Page<Gym> searchGyms(@Param("query") String query, Pageable pageable);

    @Query("""
        SELECT g FROM Gym g
        JOIN g.branches b
        WHERE g.deleted = false
        AND g.status = 'ACTIVE'
        AND b.deleted = false
        AND b.active = true
        AND b.city = :city
        ORDER BY g.featured DESC, g.avgRating DESC
        """)
    Page<Gym> findByCity(@Param("city") String city, Pageable pageable);

    @Query("""
        SELECT g FROM Gym g
        WHERE g.deleted = false
        AND g.status = 'ACTIVE'
        AND g.featured = true
        ORDER BY g.avgRating DESC
        """)
    List<Gym> findFeatured(Pageable pageable);

    @Query("""
        SELECT DISTINCT g FROM Gym g
        JOIN g.branches b
        WHERE g.deleted = false
        AND g.status = 'ACTIVE'
        AND b.deleted = false
        AND b.active = true
        AND (6371 * ACOS(
            COS(RADIANS(:lat)) * COS(RADIANS(CAST(b.latitude AS double)))
            * COS(RADIANS(CAST(b.longitude AS double)) - RADIANS(:lng))
            + SIN(RADIANS(:lat)) * SIN(RADIANS(CAST(b.latitude AS double)))
        )) <= :radiusKm
        ORDER BY g.avgRating DESC
        """)
    List<Gym> findNearby(
            @Param("lat") double latitude,
            @Param("lng") double longitude,
            @Param("radiusKm") double radiusKm,
            Pageable pageable
    );

    @Query("SELECT COUNT(g) FROM Gym g WHERE g.deleted = false AND g.status = :status")
    long countByStatus(@Param("status") GymStatus status);
}
