const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'finance', 'entity');
fs.mkdirSync(baseDir, { recursive: true });

const files = {
    'SettlementStatus.java': `package com.fitempire.modules.finance.entity;

public enum SettlementStatus {
    PENDING,
    PROCESSING,
    COMPLETED,
    FAILED
}`,
    'RefundStatus.java': `package com.fitempire.modules.finance.entity;

public enum RefundStatus {
    REQUESTED,
    APPROVED,
    REJECTED,
    REFUNDED
}`,
    'RefundDestination.java': `package com.fitempire.modules.finance.entity;

public enum RefundDestination {
    WALLET,
    ORIGINAL_PAYMENT
}`,
    'Settlement.java': `package com.fitempire.modules.finance.entity;

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
}`,
    'SettlementLog.java': `package com.fitempire.modules.finance.entity;

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
}`,
    'RefundRequest.java': `package com.fitempire.modules.finance.entity;

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
}`,
    'CommissionRule.java': `package com.fitempire.modules.finance.entity;

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
}`,
    'PlatformRevenue.java': `package com.fitempire.modules.finance.entity;

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
}`
};

for (const [filename, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(baseDir, filename), content);
    console.log("Created: " + filename);
}
