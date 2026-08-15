package com.fitempire.modules.bookings.dto;

import com.fitempire.modules.bookings.entity.BookingStatus;
import com.fitempire.modules.bookings.entity.BookingType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {
    private UUID id;
    private UUID gymId;
    private String gymName;
    private UUID branchId;
    private String branchName;
    private BookingType bookingType;
    private BookingStatus status;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String qrToken;
    private Instant qrExpiresAt;
    private Instant checkedInAt;
    private Instant checkedOutAt;
    private Instant createdAt;
}
