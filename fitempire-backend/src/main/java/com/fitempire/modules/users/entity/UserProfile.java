package com.fitempire.modules.users.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(name = "fitness_goal")
    private FitnessGoal fitnessGoal;

    @Column(name = "fitness_level", length = 50)
    private String fitnessLevel;

    @Column(name = "height_cm", precision = 5, scale = 2)
    private BigDecimal heightCm;

    @Column(name = "weight_kg", precision = 5, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "target_weight_kg", precision = 5, scale = 2)
    private BigDecimal targetWeightKg;

    @Column(name = "bmi", precision = 4, scale = 2)
    private BigDecimal bmi;

    @Column(name = "fitness_score")
    private Integer fitnessScore = 0;

    @Column(name = "total_checkins")
    private Integer totalCheckins = 0;

    @Column(name = "total_classes")
    private Integer totalClasses = 0;

    @Column(name = "preferred_workout_time", length = 50)
    private String preferredWorkoutTime;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "country", length = 100)
    private String country = "India";

    @Column(name = "pincode", length = 10)
    private String pincode;

    @Column(name = "address_line1")
    private String addressLine1;

    @Column(name = "address_line2")
    private String addressLine2;

    @Column(name = "notification_push")
    private Boolean notificationPush = true;

    @Column(name = "notification_email")
    private Boolean notificationEmail = true;

    @Column(name = "notification_sms")
    private Boolean notificationSms = true;

    @Column(name = "dark_mode")
    private Boolean darkMode = false;

    @Column(name = "language", length = 10)
    private String language = "en";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public void calculateBmi() {
        if (heightCm != null && weightKg != null && heightCm.compareTo(BigDecimal.ZERO) > 0) {
            double heightM = heightCm.doubleValue() / 100.0;
            double bmiVal = weightKg.doubleValue() / (heightM * heightM);
            this.bmi = BigDecimal.valueOf(Math.round(bmiVal * 100.0) / 100.0);
        }
    }
}
