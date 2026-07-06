package com.fitempire.modules.memberships.repository;

import com.fitempire.modules.memberships.entity.MembershipStatus;
import com.fitempire.modules.memberships.entity.UserMembership;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserMembershipRepository extends JpaRepository<UserMembership, UUID> {

    Page<UserMembership> findByUserIdAndDeletedFalseOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    @Query("""
        SELECT m FROM UserMembership m
        WHERE m.user.id = :userId
        AND m.status = 'ACTIVE'
        AND m.deleted = false
        AND (m.endDate IS NULL OR m.endDate >= :today)
        ORDER BY m.createdAt DESC
        """)
    List<UserMembership> findActiveMemberships(@Param("userId") UUID userId, @Param("today") LocalDate today);

    @Query("""
        SELECT m FROM UserMembership m
        WHERE m.status = 'ACTIVE'
        AND m.deleted = false
        AND m.endDate BETWEEN :from AND :to
        """)
    List<UserMembership> findExpiringBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);

    Optional<UserMembership> findByIdAndUserIdAndDeletedFalse(UUID id, UUID userId);
}
