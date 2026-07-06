package com.fitempire.modules.payments.entity;

import com.fitempire.modules.users.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "invoice_number", nullable = false, unique = true, length = 50)
    private String invoiceNumber;

    @Column(name = "subtotal", nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "gst_rate", nullable = false, precision = 4, scale = 2)
    private BigDecimal gstRate = BigDecimal.valueOf(18.0);

    @Column(name = "gst_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal gstAmount;

    @Column(name = "discount", precision = 10, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "total", nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    @Column(name = "pdf_url")
    private String pdfUrl;

    @Column(name = "issued_at", nullable = false)
    private Instant issuedAt = Instant.now();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
