package com.fitempire.modules.bookings.dto;

import com.fitempire.modules.bookings.entity.BookingType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class CreateBookingRequest {

    @NotNull(message = "Gym ID is required")
    private UUID gymId;

    @NotNull(message = "Branch ID is required")
    private UUID branchId;

    private UUID membershipId;
    private UUID classScheduleId;
    private UUID trainerId;

    @NotNull(message = "Booking type is required")
    private BookingType bookingType;

    @NotNull(message = "Booking date is required")
    @FutureOrPresent(message = "Booking date cannot be in the past")
    private LocalDate bookingDate;

    private LocalTime startTime;
    private LocalTime endTime;
    private String notes;
}
