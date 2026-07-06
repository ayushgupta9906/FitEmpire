package com.fitempire.modules.gyms.repository;

import com.fitempire.modules.gyms.entity.GymBranch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GymBranchRepository extends JpaRepository<GymBranch, UUID> {

    List<GymBranch> findByGymIdAndDeletedFalse(UUID gymId);

    Optional<GymBranch> findByGymIdAndPrimaryTrueAndDeletedFalse(UUID gymId);

    @Query("""
        SELECT b FROM GymBranch b
        WHERE b.gym.id = :gymId
        AND b.deleted = false
        AND b.active = true
        ORDER BY b.primary DESC, b.createdAt
        """)
    List<GymBranch> findActiveByGymId(@Param("gymId") UUID gymId);
}
