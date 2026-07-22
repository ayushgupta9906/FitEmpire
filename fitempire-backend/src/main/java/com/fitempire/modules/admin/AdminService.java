package com.fitempire.modules.admin;

import com.fitempire.modules.admin.dto.*;
import com.fitempire.modules.gyms.entity.Gym;
import com.fitempire.modules.gyms.entity.GymBranch;
import com.fitempire.modules.gyms.entity.GymStatus;
import com.fitempire.modules.gyms.repository.GymRepository;
import com.fitempire.modules.gyms.repository.GymBranchRepository;
import com.fitempire.modules.payments.repository.PaymentRepository;
import com.fitempire.modules.payments.entity.Payment;
import com.fitempire.modules.bookings.repository.BookingRepository;
import com.fitempire.modules.bookings.entity.Booking;
import com.fitempire.modules.memberships.repository.UserMembershipRepository;
import com.fitempire.modules.users.entity.UserProfile;
import com.fitempire.modules.users.repository.UserRepository;
import com.fitempire.modules.users.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final GymRepository gymRepository;
    private final GymBranchRepository gymBranchRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final UserMembershipRepository userMembershipRepository;

    public DashboardStatsDto getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalGyms = gymRepository.count();
        long bookingsToday = bookingRepository.countAllByDate(LocalDate.now());

        Instant startOfToday = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfToday = Instant.now();
        BigDecimal revenueToday = paymentRepository.sumRevenueInPeriod(startOfToday, endOfToday);
        if (revenueToday == null) {
            revenueToday = BigDecimal.ZERO;
        }

        long activeMembers = userMembershipRepository.count();
        long pendingApprovals = gymRepository.countByStatus(GymStatus.PENDING_REVIEW);

        return DashboardStatsDto.builder()
                .totalUsers(totalUsers)
                .totalGyms(totalGyms)
                .totalBookingsToday(bookingsToday)
                .totalRevenueToday(revenueToday)
                .activeMembers(activeMembers)
                .pendingApprovals(pendingApprovals)
                .growthRate(0.0)
                .build();
    }

    public List<RevenueChartDto> getRevenueChart(String period) {
        List<RevenueChartDto> data = new ArrayList<>();
        LocalDate today = LocalDate.now();

        int points = 7;
        if ("month".equalsIgnoreCase(period)) {
            points = 30;
        } else if ("year".equalsIgnoreCase(period)) {
            points = 12;
        }

        Instant startDate;
        if ("year".equalsIgnoreCase(period)) {
            startDate = today.minusMonths(points).atStartOfDay(ZoneId.systemDefault()).toInstant();
        } else {
            startDate = today.minusDays(points).atStartOfDay(ZoneId.systemDefault()).toInstant();
        }
        
        List<Payment> recentPayments = paymentRepository.findAll().stream()
                .filter(p -> p.getCreatedAt() != null && p.getCreatedAt().isAfter(startDate))
                .collect(Collectors.toList());
        List<Booking> recentBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getCreatedAt() != null && b.getCreatedAt().isAfter(startDate))
                .collect(Collectors.toList());

        for (int i = points - 1; i >= 0; i--) {
            LocalDate date;
            String label;
            Instant startPeriod;
            Instant endPeriod;

            if ("year".equalsIgnoreCase(period)) {
                date = today.minusMonths(i).withDayOfMonth(1);
                label = date.getMonth().toString().substring(0, 3) + " " + date.getYear();
                startPeriod = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
                endPeriod = date.plusMonths(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
            } else {
                date = today.minusDays(i);
                label = date.getDayOfWeek().toString().substring(0, 3) + " " + date.getDayOfMonth();
                startPeriod = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
                endPeriod = date.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
            }

            BigDecimal revenueVal = recentPayments.stream()
                    .filter(p -> p.getCreatedAt().isAfter(startPeriod) && p.getCreatedAt().isBefore(endPeriod) && "COMPLETED".equals(p.getStatus().name()))
                    .map(Payment::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            long bookingCount = recentBookings.stream()
                    .filter(b -> b.getCreatedAt().isAfter(startPeriod) && b.getCreatedAt().isBefore(endPeriod))
                    .count();

            data.add(RevenueChartDto.builder()
                    .date(label)
                    .revenue(revenueVal)
                    .bookings(bookingCount)
                    .build());
        }
        return data;
    }

    public List<RecentActivityDto> getRecentActivity() {
        List<RecentActivityDto> list = new ArrayList<>();

        userRepository.findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))).forEach(u -> {
            list.add(RecentActivityDto.builder()
                    .id(UUID.randomUUID().toString())
                    .type("USER")
                    .message(u.getFirstName() + " " + u.getLastName() + " registered as a customer.")
                    .timestamp(u.getCreatedAt())
                    .build());
        });

        gymRepository.findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))).forEach(g -> {
            list.add(RecentActivityDto.builder()
                    .id(UUID.randomUUID().toString())
                    .type("GYM")
                    .message(g.getName() + " was registered.")
                    .timestamp(g.getCreatedAt())
                    .build());
        });

        paymentRepository.findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))).forEach(p -> {
            list.add(RecentActivityDto.builder()
                    .id(UUID.randomUUID().toString())
                    .type("PAYMENT")
                    .message("Received payment of ₹" + p.getAmount() + " from " + p.getUser().getFirstName())
                    .timestamp(p.getCreatedAt())
                    .build());
        });

        bookingRepository.findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))).forEach(b -> {
            list.add(RecentActivityDto.builder()
                    .id(UUID.randomUUID().toString())
                    .type("BOOKING")
                    .message(b.getUser().getFirstName() + " booked at " + b.getGym().getName())
                    .timestamp(b.getCreatedAt())
                    .build());
        });

        list.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
        return list.stream().limit(5).collect(Collectors.toList());
    }

    public AnalyticsOverviewDto getAnalyticsOverview() {
        BigDecimal totalRevenue = paymentRepository.findAll().stream()
                .filter(p -> "COMPLETED".equals(p.getStatus().name()))
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        long totalBookings = bookingRepository.count();
        long totalUsers = userRepository.count();
        
        double conversionRate = totalUsers > 0 ? (double) totalBookings / totalUsers * 100 : 0.0;
        BigDecimal avgOrderValue = totalBookings > 0 ? totalRevenue.divide(new BigDecimal(totalBookings), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;

        return AnalyticsOverviewDto.builder()
                .totalRevenue(totalRevenue)
                .totalBookings(totalBookings)
                .conversionRate(Math.round(conversionRate * 100.0) / 100.0)
                .avgOrderValue(avgOrderValue)
                .build();
    }

    public List<TopGymDto> getTopGyms() {
        List<Gym> gyms = gymRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();
        
        List<TopGymDto> list = new ArrayList<>();
        for (Gym gym : gyms) {
            long gymBookings = bookings.stream().filter(b -> b.getGym().getId().equals(gym.getId())).count();
            // Estimating revenue for the gym based on bookings for MVP
            BigDecimal gymRevenue = new BigDecimal(gymBookings).multiply(new BigDecimal("300")); 
            
            list.add(TopGymDto.builder()
                    .gymId(gym.getId())
                    .gymName(gym.getName())
                    .totalBookings(gymBookings)
                    .revenue(gymRevenue)
                    .build());
        }
        
        list.sort((a, b) -> Long.compare(b.getTotalBookings(), a.getTotalBookings()));
        return list.stream().limit(5).collect(Collectors.toList());
    }

    public List<CityDataDto> getTopCities() {
        List<UserProfile> profiles = userProfileRepository.findAll();
        Map<String, Long> cityUserCount = profiles.stream()
                .filter(p -> p.getCity() != null)
                .collect(Collectors.groupingBy(UserProfile::getCity, Collectors.counting()));

        // GymBranch has the city, not Gym
        List<GymBranch> branches = gymBranchRepository.findAll();
        Map<String, Long> cityGymCount = branches.stream()
                .filter(b -> b.getCity() != null && !b.isDeleted())
                .collect(Collectors.groupingBy(GymBranch::getCity, Collectors.counting()));
                
        Set<String> allCities = new HashSet<>();
        allCities.addAll(cityUserCount.keySet());
        allCities.addAll(cityGymCount.keySet());
        
        List<CityDataDto> list = new ArrayList<>();
        for (String city : allCities) {
            list.add(CityDataDto.builder()
                    .city(city)
                    .users(cityUserCount.getOrDefault(city, 0L).intValue())
                    .gyms(cityGymCount.getOrDefault(city, 0L).intValue())
                    .build());
        }
        
        list.sort((a, b) -> Integer.compare(b.getUsers(), a.getUsers()));
        return list.stream().limit(5).collect(Collectors.toList());
    }
}
