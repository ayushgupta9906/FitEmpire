package com.fitempire.modules.bookings.repository;

import com.fitempire.modules.bookings.entity.Booking;
import com.fitempire.modules.bookings.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    Optional<Booking> findByQrTokenAndDeletedFalse(String qrToken);

    Page<Booking> findByUserIdAndDeletedFalseOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    @Query("""
        SELECT COUNT(b) > 0 FROM Booking b
        WHERE b.user.id = :userId
        AND b.branch.id = :branchId
        AND b.bookingDate = :date
        AND b.status IN :statuses
        AND b.deleted = false
        """)
    boolean existsByUserIdAndBranchIdAndBookingDateAndStatusIn(
            @Param("userId") UUID userId,
            @Param("branchId") UUID branchId,
            @Param("date") LocalDate date,
            @Param("statuses") BookingStatus[] statuses
    );

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.gym.id = :gymId AND b.bookingDate = :date AND b.deleted = false")
    long countByGymAndDate(@Param("gymId") UUID gymId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.bookingDate = :date AND b.deleted = false")
    long countAllByDate(@Param("date") LocalDate date);

    Page<Booking> findByGymIdAndDeletedFalseOrderByCreatedAtDesc(UUID gymId, Pageable pageable);

    @Query("""
        SELECT b FROM Booking b
        WHERE b.branch.id = :branchId
        AND b.bookingDate = :date
        AND b.status IN ('CONFIRMED', 'CHECKED_IN')
        AND b.deleted = false
        """)
    java.util.List<Booking> findActiveByBranchAndDate(
            @Param("branchId") UUID branchId, @Param("date") LocalDate date);
}
