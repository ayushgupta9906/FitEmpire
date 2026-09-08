package com.fitempire.modules.bookings.entity;

import com.fitempire.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "turnstile_audit_events")
@Getter
@Setter
@NoArgsConstructor
public class TurnstileAuditEvent extends BaseEntity {

    @Column(name = "gym_id", nullable = false)
    private UUID gymId;

    @Column(name = "branch_id", nullable = false)
    private UUID branchId;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "gate_id", length = 64)
    private String gateId;

    @Column(name = "scanned_token", length = 128)
    private String scannedToken;

    @Column(name = "verdict", nullable = false, length = 32)
    private String verdict; // GRANTED, DENIED, EXPIRED, REVOKED

    @Column(name = "failure_reason", length = 255)
    private String failureReason;

    @Column(name = "event_timestamp", nullable = false)
    private Instant eventTimestamp = Instant.now();
}
