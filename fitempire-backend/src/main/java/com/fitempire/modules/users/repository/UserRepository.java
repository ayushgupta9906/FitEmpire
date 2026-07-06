package com.fitempire.modules.users.repository;

import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmailAndDeletedFalse(String email);

    Optional<User> findByPhoneAndDeletedFalse(String phone);

    Optional<User> findByReferralCodeAndDeletedFalse(String referralCode);

    Optional<User> findByOauthProviderAndOauthProviderIdAndDeletedFalse(
            String oauthProvider, String oauthProviderId);

    boolean existsByEmailAndDeletedFalse(String email);

    boolean existsByPhoneAndDeletedFalse(String phone);

    @Query("SELECT u FROM User u WHERE u.deleted = false AND u.role = :role ORDER BY u.createdAt DESC")
    Page<User> findAllByRole(@Param("role") UserRole role, Pageable pageable);

    @Query("""
        SELECT u FROM User u
        WHERE u.deleted = false
        AND (
            LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))
            OR u.phone LIKE CONCAT('%', :query, '%')
        )
        ORDER BY u.createdAt DESC
        """)
    Page<User> searchUsers(@Param("query") String query, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.deleted = false ORDER BY u.createdAt DESC")
    Page<User> findAllActive(Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u WHERE u.deleted = false AND u.role = :role")
    long countByRole(@Param("role") UserRole role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.deleted = false AND u.createdAt >= :since")
    long countNewUsersSince(@Param("since") Instant since);

    @Modifying
    @Query("UPDATE User u SET u.failedLoginCount = 0, u.locked = false, u.lockedUntil = null WHERE u.id = :userId")
    void resetLoginAttempts(@Param("userId") UUID userId);

    @Modifying
    @Query("UPDATE User u SET u.fcmToken = :token WHERE u.id = :userId")
    void updateFcmToken(@Param("userId") UUID userId, @Param("token") String token);

    @Query("SELECT u FROM User u WHERE u.locked = true AND u.lockedUntil < :now")
    List<User> findExpiredLocks(@Param("now") Instant now);
}
