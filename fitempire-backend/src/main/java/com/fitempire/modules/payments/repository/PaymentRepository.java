package com.fitempire.modules.payments.repository;

import com.fitempire.modules.payments.entity.Payment;
import com.fitempire.modules.payments.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByStatusAndIsSettledFalse(PaymentStatus status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'COMPLETED' AND p.createdAt BETWEEN :start AND :end")
    java.math.BigDecimal sumRevenueInPeriod(@Param("start") java.time.Instant start, @Param("end") java.time.Instant end);

    java.util.Optional<Payment> findByGatewayOrderId(String gatewayOrderId);
}
