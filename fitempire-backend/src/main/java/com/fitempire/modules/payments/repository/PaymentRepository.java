package com.fitempire.modules.payments.repository;

import com.fitempire.modules.payments.entity.Payment;
import com.fitempire.modules.payments.entity.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByGatewayOrderId(String gatewayOrderId);

    Optional<Payment> findByGatewayPaymentId(String gatewayPaymentId);

    Page<Payment> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    @Query("SELECT SUM(p.netAmount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.createdAt BETWEEN :from AND :to")
    BigDecimal sumRevenueInPeriod(@Param("from") Instant from, @Param("to") Instant to);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status AND p.createdAt >= :since")
    long countByStatusSince(@Param("status") PaymentStatus status, @Param("since") Instant since);

    Page<Payment> findByStatusOrderByCreatedAtDesc(PaymentStatus status, Pageable pageable);
}
