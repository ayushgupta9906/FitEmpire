package com.fitempire.modules.bookings.repository;

import com.fitempire.modules.bookings.entity.Booking;
import com.fitempire.modules.bookings.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    Optional<Booking> findByQrToken(String qrToken);

    List<Booking> findByStatusOrderByCheckedInAtDesc(BookingStatus status);

    List<Booking> findTop20ByOrderByCreatedAtDesc();

    List<Booking> findByGymIdOrderByCreatedAtDesc(UUID gymId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE DATE(b.createdAt) = :date")
    long countAllByDate(@Param("date") java.time.LocalDate date);
}
