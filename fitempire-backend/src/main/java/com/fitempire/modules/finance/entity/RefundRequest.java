package com.fitempire.modules.finance.entity;

import com.fitempire.common.entity.BaseEntity;
import com.fitempire.modules.bookings.entity.Booking;
import com.fitempire.modules.users.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "refund_requests")
@Getter
@Setter
@NoArgsConstructor
public class RefundRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RefundStatus status = RefundStatus.REQUESTED;

    @Enumerated(EnumType.STRING)
    @Column(name = "refund_destination", nullable = false)
    private RefundDestination refundDestination;

    @Column(name = "refund_reason", columnDefinition = "TEXT")
    private String refundReason;
}