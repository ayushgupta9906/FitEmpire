package com.fitempire.modules.coupons.repository;

import com.fitempire.modules.coupons.entity.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, UUID> {

    Optional<Coupon> findByCodeAndDeletedFalse(String code);

    @Query("SELECT c FROM Coupon c WHERE c.deleted = false AND c.active = true")
    Page<Coupon> findAllActive(Pageable pageable);

    @Query("""
        SELECT c FROM Coupon c
        WHERE c.deleted = false
        AND (
            LOWER(c.code) LIKE LOWER(CONCAT('%', :query, '%'))
        )
        """)
    Page<Coupon> searchCoupons(@Param("query") String query, Pageable pageable);
}
