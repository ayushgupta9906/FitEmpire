package com.fitempire.modules.coupons.repository;

import com.fitempire.modules.coupons.entity.CouponUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsage, UUID> {

    List<CouponUsage> findByUserId(UUID userId);

    @Query("""
        SELECT COUNT(u) FROM CouponUsage u
        WHERE u.coupon.id = :couponId
        AND u.user.id = :userId
        """)
    long countUsageByCouponAndUser(
            @Param("couponId") UUID couponId,
            @Param("userId") UUID userId
    );
}
