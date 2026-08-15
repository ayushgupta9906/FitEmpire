package com.fitempire.modules.gyms.entity;

import com.fitempire.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "gym_branches")
@Getter
@Setter
@NoArgsConstructor
public class GymBranch extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "address_line1", nullable = false)
    private String addressLine1;

    @Column(name = "address_line2")
    private String addressLine2;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "state", nullable = false, length = 100)
    private String state;

    @Column(name = "country", length = 100)
    private String country = "India";

    @Column(name = "pincode", length = 10)
    private String pincode;

    @Column(name = "latitude", precision = 10, scale = 8)
    private java.math.BigDecimal latitude;

    @Column(name = "longitude", precision = 11, scale = 8)
    private java.math.BigDecimal longitude;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "is_primary")
    private boolean primary = false;

    @Column(name = "is_active")
    private boolean active = true;

    @Column(name = "capacity")
    private int capacity = 50;


    @Column(name = "opening_time")
    private LocalTime openingTime;

    @Column(name = "closing_time")
    private LocalTime closingTime;

    /** Gym owner's own monthly membership price (e.g. ₹2000/month) */
    @Column(name = "monthly_membership_price", precision = 12, scale = 2)
    private java.math.BigDecimal monthlyMembershipPrice;

    /** Auto-calculated: monthlyMembershipPrice / 30 — used for per-visit settlement */
    @Column(name = "per_session_rate", precision = 10, scale = 2)
    private java.math.BigDecimal perSessionRate;

    @Column(name = "amenities", columnDefinition = "text[]")
    @JdbcTypeCode(SqlTypes.ARRAY)
    private String[] amenities;

    @Column(name = "working_days", columnDefinition = "varchar[]")
    @JdbcTypeCode(SqlTypes.ARRAY)
    private String[] workingDays;

    @OneToMany(mappedBy = "gymBranch", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<GymPhoto> photos = new ArrayList<>();
}
