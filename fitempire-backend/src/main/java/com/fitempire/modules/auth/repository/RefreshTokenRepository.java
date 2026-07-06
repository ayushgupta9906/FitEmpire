package com.fitempire.modules.auth.repository;

import com.fitempire.modules.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByTokenHashAndRevokedFalse(String tokenHash);

    @Modifying
    @Query("UPDATE RefreshToken r SET r.revoked = true WHERE r.user.id = :userId")
    void revokeAllByUserId(@Param("userId") UUID userId);

    @Modifying
    @Query("DELETE FROM RefreshToken r WHERE r.expiresAt < :before OR r.revoked = true")
    void deleteExpiredOrRevoked(@Param("before") Instant before);
}
