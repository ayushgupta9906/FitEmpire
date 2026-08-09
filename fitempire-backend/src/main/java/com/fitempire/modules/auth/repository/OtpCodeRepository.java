package com.fitempire.modules.auth.repository;

import com.fitempire.modules.auth.entity.OtpCode;
import com.fitempire.modules.auth.entity.OtpPurpose;
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
public interface OtpCodeRepository extends JpaRepository<OtpCode, UUID> {

    @Query("""
        SELECT o FROM OtpCode o
        WHERE o.phone = :phone
        AND o.purpose = :purpose
        AND o.used = false
        AND o.expiresAt > :now
        ORDER BY o.createdAt DESC
        """)
    Optional<OtpCode> findLatestValidByPhone(
            @Param("phone") String phone,
            @Param("purpose") OtpPurpose purpose,
            @Param("now") Instant now
    );

    @Query("""
        SELECT o FROM OtpCode o
        WHERE o.email = :email
        AND o.purpose = :purpose
        AND o.used = false
        AND o.expiresAt > :now
        ORDER BY o.createdAt DESC
        """)
    Optional<OtpCode> findLatestValidByEmail(
            @Param("email") String email,
            @Param("purpose") OtpPurpose purpose,
            @Param("now") Instant now
    );

    @Query("SELECT COUNT(o) FROM OtpCode o WHERE o.phone = :phone AND o.purpose = :purpose AND o.createdAt > :since")
    long countRecentByPhone(
            @Param("phone") String phone,
            @Param("purpose") OtpPurpose purpose,
            @Param("since") Instant since
    );

    @Modifying
    @Query("UPDATE OtpCode o SET o.used = true WHERE o.phone = :phone AND o.purpose = :purpose")
    void invalidateAllByPhone(@Param("phone") String phone, @Param("purpose") OtpPurpose purpose);

    @Modifying
    @Query("UPDATE OtpCode o SET o.used = true WHERE o.email = :email AND o.purpose = :purpose")
    void invalidateAllByEmail(@Param("email") String email, @Param("purpose") OtpPurpose purpose);

    @Modifying
    @Query("DELETE FROM OtpCode o WHERE o.expiresAt < :before")
    void deleteExpiredOtps(@Param("before") Instant before);
}
