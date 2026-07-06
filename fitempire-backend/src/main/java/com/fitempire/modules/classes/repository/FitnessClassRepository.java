package com.fitempire.modules.classes.repository;

import com.fitempire.modules.classes.entity.FitnessClass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FitnessClassRepository extends JpaRepository<FitnessClass, UUID> {

    @Query("SELECT c FROM FitnessClass c WHERE c.gym.id = :gymId AND c.deleted = false")
    List<FitnessClass> findByGymIdAndDeletedFalse(@Param("gymId") UUID gymId);

    @Query("SELECT c FROM FitnessClass c WHERE c.branch.id = :branchId AND c.deleted = false")
    List<FitnessClass> findByBranchIdAndDeletedFalse(@Param("branchId") UUID branchId);

    @Query("SELECT c FROM FitnessClass c WHERE c.deleted = false AND c.active = true")
    Page<FitnessClass> findAllActive(Pageable pageable);

    @Query("""
        SELECT c FROM FitnessClass c
        WHERE c.deleted = false
        AND c.active = true
        AND (
            LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(c.category) LIKE LOWER(CONCAT('%', :query, '%'))
        )
        """)
    Page<FitnessClass> searchClasses(@Param("query") String query, Pageable pageable);
}
