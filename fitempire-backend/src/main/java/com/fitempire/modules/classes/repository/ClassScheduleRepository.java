package com.fitempire.modules.classes.repository;

import com.fitempire.modules.classes.entity.ClassSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, UUID> {

    @Query("""
        SELECT s FROM ClassSchedule s
        WHERE s.branch.id = :branchId
        AND s.scheduledDate = :date
        AND s.cancelled = false
        ORDER BY s.startTime ASC
        """)
    List<ClassSchedule> findActiveByBranchAndDate(
            @Param("branchId") UUID branchId,
            @Param("date") LocalDate date
    );

    @Query("""
        SELECT s FROM ClassSchedule s
        WHERE s.branch.id = :branchId
        AND s.scheduledDate BETWEEN :startDate AND :endDate
        AND s.cancelled = false
        ORDER BY s.scheduledDate ASC, s.startTime ASC
        """)
    List<ClassSchedule> findActiveByBranchAndDateRange(
            @Param("branchId") UUID branchId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    List<ClassSchedule> findByFitnessClassId(UUID fitnessClassId);

    @Query("""
        SELECT s FROM ClassSchedule s
        WHERE s.trainer.id = :trainerId
        AND s.scheduledDate = :date
        AND s.cancelled = false
        """)
    List<ClassSchedule> findActiveByTrainerAndDate(
            @Param("trainerId") UUID trainerId,
            @Param("date") LocalDate date
    );
}
