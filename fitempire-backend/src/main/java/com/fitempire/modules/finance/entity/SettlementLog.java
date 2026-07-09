package com.fitempire.modules.finance.entity;

import com.fitempire.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "settlement_logs")
@Getter
@Setter
@NoArgsConstructor
public class SettlementLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "settlement_id", nullable = false)
    private Settlement settlement;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private SettlementStatus status;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}