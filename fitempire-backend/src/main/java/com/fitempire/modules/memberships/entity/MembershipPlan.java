package com.fitempire.modules.memberships.entity;

import com.fitempire.common.entity.BaseEntity;
import com.fitempire.modules.gyms.entity.Gym;
import com.fitempire.modules.gyms.entity.GymBranch;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "membership_plans")
@Getter
@Setter
@NoArgsConstructor
public class MembershipPlan extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private GymBranch branch;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private MembershipType type;

    @Column(name = "price", nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "gst_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal gstAmount = BigDecimal.ZERO;

    @Column(name = "total_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "duration_days")
    private Integer durationDays;

    @Column(name = "credit_count")
    private Integer creditCount;

    @Column(name = "max_freeze_days")
    private Integer maxFreezeDays = 7;

    @Column(name = "max_sessions_per_day")
    private Integer maxSessionsPerDay = 1;

    @Column(name = "includes_classes")
    private boolean includesClasses = true;

    @Column(name = "includes_personal_training")
    private boolean includesPersonalTraining = false;

    @Column(name = "includes_amenities", columnDefinition = "text[]")
    @JdbcTypeCode(SqlTypes.ARRAY)
    private String[] includesAmenities;

    @Column(name = "is_active")
    private boolean active = true;

    @Column(name = "is_corporate")
    private boolean corporate = false;

    @Column(name = "sort_order")
    private int sortOrder = 0;
}
