package com.fitempire.modules.finance.entity;

import com.fitempire.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "platform_revenues")
@Getter
@Setter
@NoArgsConstructor
public class PlatformRevenue extends BaseEntity {

    @Column(name = "source", nullable = false)
    private String source; // e.g., COMMISSION, AD_REVENUE, SUBSCRIPTION

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "reference_id")
    private String referenceId;
}