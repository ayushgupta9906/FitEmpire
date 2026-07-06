package com.fitempire.modules.bookings.service;

import com.fitempire.common.exception.BusinessException;
import com.fitempire.common.exception.OtpException;
import com.fitempire.common.exception.ResourceNotFoundException;
import com.fitempire.common.response.PagedResponse;
import com.fitempire.modules.bookings.dto.*;
import com.fitempire.modules.bookings.entity.*;
import com.fitempire.modules.bookings.repository.BookingRepository;
import com.fitempire.modules.gyms.entity.Gym;
import com.fitempire.modules.gyms.entity.GymBranch;
import com.fitempire.modules.gyms.repository.GymBranchRepository;
import com.fitempire.modules.gyms.repository.GymRepository;
import com.fitempire.modules.memberships.entity.UserMembership;
import com.fitempire.modules.memberships.repository.UserMembershipRepository;
import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.repository.UserRepository;
import com.fitempire.service.NotificationService;
import com.fitempire.service.QrCodeService;
import com.fitempire.service.RewardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final GymRepository gymRepository;
    private final GymBranchRepository gymBranchRepository;
    private final UserRepository userRepository;
    private final UserMembershipRepository userMembershipRepository;
    private final QrCodeService qrCodeService;
    private final NotificationService notificationService;
    private final RewardService rewardService;

    @Transactional
    public BookingDto createBooking(CreateBookingRequest request, UUID userId) {
        User user = findUserOrThrow(userId);
        Gym gym = gymRepository.findById(request.getGymId())
                .orElseThrow(() -> ResourceNotFoundException.of("Gym", request.getGymId()));
        GymBranch branch = gymBranchRepository.findById(request.getBranchId())
                .orElseThrow(() -> ResourceNotFoundException.of("GymBranch", request.getBranchId()));

        // Validate membership
        UserMembership membership = null;
        if (request.getMembershipId() != null) {
            membership = userMembershipRepository.findById(request.getMembershipId())
                    .orElseThrow(() -> ResourceNotFoundException.of("UserMembership", request.getMembershipId()));

            if (!membership.getUser().getId().equals(userId)) {
                throw new BusinessException("Membership does not belong to this user.", "MEMBERSHIP_ACCESS_DENIED");
            }
            if (!membership.canCheckIn()) {
                throw new BusinessException("Your membership does not allow check-in at this time.", "MEMBERSHIP_CANNOT_CHECKIN");
            }
        }

        // Check for duplicate booking on same day for same branch
        if (bookingRepository.existsByUserIdAndBranchIdAndBookingDateAndStatusIn(
                userId, request.getBranchId(), request.getBookingDate(),
                new BookingStatus[]{BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN})) {
            throw new BusinessException("You already have a booking at this branch on this date.", "DUPLICATE_BOOKING");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setGym(gym);
        booking.setBranch(branch);
        booking.setMembership(membership);
        booking.setBookingType(request.getBookingType());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setClassScheduleId(request.getClassScheduleId());
        booking.setTrainerId(request.getTrainerId());
        booking.setNotes(request.getNotes());

        // Generate QR token (valid from day before until end of day)
        String qrToken = qrCodeService.generateQrToken(userId, request.getGymId(), request.getBranchId());
        booking.setQrToken(qrToken);
        booking.setQrExpiresAt(Instant.now()
                .plusSeconds(24 * 3600)); // 24 hours validity

        Booking savedBooking = bookingRepository.save(booking);

        // Award rewards
        rewardService.awardBookingPoints(userId);

        // Send confirmation
        notificationService.sendBookingConfirmation(user.getEmail(), savedBooking);

        log.info("Booking created: {} for user: {} at gym: {}", savedBooking.getId(), userId, gym.getName());
        return mapToDto(savedBooking);
    }

    @Transactional
    public BookingDto checkIn(String qrToken, UUID gymBranchId) {
        Booking booking = bookingRepository.findByQrTokenAndDeletedFalse(qrToken)
                .orElseThrow(() -> new OtpException("Invalid QR code.", "QR_INVALID"));

        if (!booking.isQrValid()) {
            throw new BusinessException("QR code has expired.", "QR_EXPIRED", HttpStatus.BAD_REQUEST);
        }
        if (!booking.getBranch().getId().equals(gymBranchId)) {
            throw new BusinessException("QR code is not valid for this branch.", "QR_WRONG_BRANCH", HttpStatus.BAD_REQUEST);
        }
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BusinessException("Booking is not in CONFIRMED status.", "BOOKING_INVALID_STATUS", HttpStatus.BAD_REQUEST);
        }
        if (!booking.getBookingDate().equals(LocalDate.now())) {
            throw new BusinessException("This booking is not for today.", "BOOKING_WRONG_DATE", HttpStatus.BAD_REQUEST);
        }

        booking.checkIn();
        bookingRepository.save(booking);

        // Use credit if credit-pack membership
        if (booking.getMembership() != null
                && booking.getMembership().getPlan().getCreditCount() != null) {
            booking.getMembership().useCredit();
            booking.getMembership().recordSession();
        } else if (booking.getMembership() != null) {
            booking.getMembership().recordSession();
        }

        // Award check-in rewards
        rewardService.awardCheckInPoints(booking.getUser().getId());

        log.info("Check-in successful: booking={}, user={}", booking.getId(), booking.getUser().getId());
        return mapToDto(booking);
    }

    @Transactional
    public BookingDto cancelBooking(UUID bookingId, String reason, UUID userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> ResourceNotFoundException.of("Booking", bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BusinessException("Booking does not belong to this user.", "BOOKING_ACCESS_DENIED");
        }
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BusinessException("Only confirmed bookings can be cancelled.", "BOOKING_CANNOT_CANCEL");
        }

        booking.cancel(reason);
        bookingRepository.save(booking);

        notificationService.sendBookingCancellation(booking.getUser().getEmail(), booking);
        log.info("Booking cancelled: {} by user: {}", bookingId, userId);
        return mapToDto(booking);
    }

    @Transactional(readOnly = true)
    public PagedResponse<BookingDto> getMyBookings(UUID userId, Pageable pageable) {
        Page<Booking> page = bookingRepository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId, pageable);
        return PagedResponse.of(page.map(this::mapToDto));
    }

    @Transactional(readOnly = true)
    public BookingDto getQrCode(UUID bookingId, UUID userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> ResourceNotFoundException.of("Booking", bookingId));
        if (!booking.getUser().getId().equals(userId)) {
            throw new BusinessException("Booking does not belong to this user.", "BOOKING_ACCESS_DENIED");
        }
        return mapToDto(booking);
    }

    private BookingDto mapToDto(Booking b) {
        return BookingDto.builder()
                .id(b.getId())
                .gymId(b.getGym().getId())
                .gymName(b.getGym().getName())
                .branchId(b.getBranch().getId())
                .branchName(b.getBranch().getName())
                .bookingType(b.getBookingType())
                .status(b.getStatus())
                .bookingDate(b.getBookingDate())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .qrToken(b.getQrToken())
                .qrExpiresAt(b.getQrExpiresAt())
                .checkedInAt(b.getCheckedInAt())
                .checkedOutAt(b.getCheckedOutAt())
                .createdAt(b.getCreatedAt())
                .build();
    }

    private User findUserOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
    }
}
