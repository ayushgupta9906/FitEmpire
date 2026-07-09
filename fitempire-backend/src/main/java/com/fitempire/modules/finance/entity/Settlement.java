package com.fitempire.modules.finance.entity;

import com.fitempire.common.entity.BaseEntity;
import com.fitempire.modules.gyms.entity.Gym;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "settlements")
@Getter
@Setter
@NoArgsConstructor
public class Settlement extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "commission_deducted", nullable = false, precision = 12, scale = 2)
    private BigDecimal commissionDeducted = BigDecimal.ZERO;

    @Column(name = "tax_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "net_payable", nullable = false, precision = 12, scale = 2)
    private BigDecimal netPayable = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SettlementStatus status = SettlementStatus.PENDING;

    @Column(name = "settlement_date")
    private Instant settlementDate;

    @Column(name = "bank_ref_number")
    private String bankRefNumber;
}