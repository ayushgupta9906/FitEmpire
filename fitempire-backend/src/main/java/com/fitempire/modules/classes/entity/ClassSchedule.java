package com.fitempire.modules.classes.entity;

import com.fitempire.modules.gyms.entity.GymBranch;
import com.fitempire.modules.trainers.entity.Trainer;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "class_schedules")
@Getter
@Setter
@NoArgsConstructor
public class ClassSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fitness_class_id", nullable = false)
    private FitnessClass fitnessClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private GymBranch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;

    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "max_capacity", nullable = false)
    private int maxCapacity;

    @Column(name = "booked_count", nullable = false)
    private int bookedCount = 0;

    @Column(name = "waitlist_count", nullable = false)
    private int waitlistCount = 0;

    @Column(name = "is_cancelled")
    private boolean cancelled = false;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
