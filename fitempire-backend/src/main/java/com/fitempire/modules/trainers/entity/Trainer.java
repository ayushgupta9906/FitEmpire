package com.fitempire.modules.trainers.entity;

import com.fitempire.common.entity.BaseEntity;
import com.fitempire.modules.gyms.entity.Gym;
import com.fitempire.modules.users.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trainers")
@Getter
@Setter
@NoArgsConstructor
public class Trainer extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "certifications", columnDefinition = "text[]")
    @JdbcTypeCode(SqlTypes.ARRAY)
    private String[] certifications;

    @Column(name = "specializations", columnDefinition = "trainer_specialization[]")
    @JdbcTypeCode(SqlTypes.ARRAY)
    private TrainerSpecialization[] specializations;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @Column(name = "hourly_rate", precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Column(name = "is_available")
    private boolean available = true;

    @Column(name = "avg_rating", precision = 3, scale = 2)
    private BigDecimal avgRating = BigDecimal.ZERO;

    @Column(name = "total_reviews")
    private int totalReviews = 0;

    @Column(name = "total_sessions")
    private int totalSessions = 0;

    @Column(name = "is_featured")
    private boolean featured = false;

    @OneToMany(mappedBy = "trainer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrainerSchedule> schedules = new ArrayList<>();
}
