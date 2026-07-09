package com.fitempire.modules.finance.entity;

import com.fitempire.common.entity.BaseEntity;
import com.fitempire.modules.gyms.entity.GymCategory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "commission_rules")
@Getter
@Setter
@NoArgsConstructor
public class CommissionRule extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "applicable_category")
    private GymCategory applicableCategory;

    @Column(name = "percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal percentage;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;
}