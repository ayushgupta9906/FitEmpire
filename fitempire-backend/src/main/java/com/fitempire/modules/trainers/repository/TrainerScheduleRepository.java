package com.fitempire.modules.trainers.repository;

import com.fitempire.modules.trainers.entity.TrainerSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TrainerScheduleRepository extends JpaRepository<TrainerSchedule, UUID> {

    List<TrainerSchedule> findByTrainerId(UUID trainerId);

    List<TrainerSchedule> findByTrainerIdAndBranchId(UUID trainerId, UUID branchId);

    @Query("""
        SELECT s FROM TrainerSchedule s
        WHERE s.trainer.id = :trainerId
        AND s.dayOfWeek = :dayOfWeek
        AND s.available = true
        """)
    List<TrainerSchedule> findAvailableByTrainerAndDay(
            @Param("trainerId") UUID trainerId,
            @Param("dayOfWeek") short dayOfWeek
    );

    @Query("""
        SELECT COUNT(s) > 0 FROM TrainerSchedule s
        WHERE s.trainer.id = :trainerId
        AND s.dayOfWeek = :dayOfWeek
        AND s.available = true
        AND s.startTime <= :time
        AND s.endTime >= :time
        """)
    boolean isTrainerAvailableAt(
            @Param("trainerId") UUID trainerId,
            @Param("dayOfWeek") short dayOfWeek,
            @Param("time") LocalTime time
    );
}
