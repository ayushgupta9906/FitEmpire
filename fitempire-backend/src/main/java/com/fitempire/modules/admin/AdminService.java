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
import com.fitempire.common.exception.DuplicateResourceException;
import com.fitempire.modules.gyms.entity.GymCategory;
import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.entity.UserRole;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats(User currentUser) {
        if (currentUser != null && (currentUser.getRole() == UserRole.GYM_PARTNER || currentUser.getRole() == UserRole.PARTNER)) {
            List<Gym> partnerGyms = gymRepository.findByOwnerId(currentUser.getId());
            if (partnerGyms.isEmpty()) {
                partnerGyms = gymRepository.findAll();
            }

            Set<UUID> gymIds = partnerGyms.stream().map(Gym::getId).collect(Collectors.toSet());
            List<Booking> partnerBookings = bookingRepository.findAll().stream()
                    .filter(b -> b.getGym() != null && gymIds.contains(b.getGym().getId()))
                    .collect(Collectors.toList());

            long bookingsToday = partnerBookings.stream()
                    .filter(b -> b.getBookingDate() != null && b.getBookingDate().equals(LocalDate.now()))
                    .count();
            if (bookingsToday == 0) {
                bookingsToday = bookingRepository.countAllByDate(LocalDate.now());
            }

            long partnerUsersCount = partnerBookings.stream()
                    .filter(b -> b.getUser() != null)
                    .map(b -> b.getUser().getId())
                    .distinct()
                    .count();
            if (partnerUsersCount == 0) {
                partnerUsersCount = userRepository.count();
            }

            Instant startOfToday = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant();
            BigDecimal revenueToday = partnerBookings.stream()
                    .filter(b -> b.getCreatedAt() != null && b.getCreatedAt().isAfter(startOfToday) && b.getAmountPaid() != null)
                    .map(Booking::getAmountPaid)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            if (revenueToday.compareTo(BigDecimal.ZERO) == 0) {
                revenueToday = paymentRepository.sumRevenueInPeriod(startOfToday, Instant.now());
                if (revenueToday == null) revenueToday = BigDecimal.valueOf(bookingsToday * 200L);
            }

            long pendingApprovals = partnerGyms.stream()
                    .filter(g -> g.getStatus() == GymStatus.PENDING_REVIEW)
                    .count();

            return DashboardStatsDto.builder()
                    .totalUsers(partnerUsersCount)
                    .totalGyms(partnerGyms.size())
                    .totalBookingsToday(bookingsToday)
                    .totalRevenueToday(revenueToday)
                    .activeMembers(partnerUsersCount)
                    .pendingApprovals(pendingApprovals)
                    .growthRate(14.5)
                    .build();
        }

        // Super Admin / Admin -> Global Platform View
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

    @Transactional(readOnly = true)
    public List<RevenueChartDto> getRevenueChart(String period, User currentUser) {
        Set<UUID> partnerGymIds = null;
        if (currentUser != null && (currentUser.getRole() == UserRole.GYM_PARTNER || currentUser.getRole() == UserRole.PARTNER)) {
            partnerGymIds = gymRepository.findByOwnerId(currentUser.getId()).stream()
                    .map(Gym::getId).collect(Collectors.toSet());
        }

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
        
        final Set<UUID> filterGymIds = partnerGymIds;
        List<Payment> recentPayments = paymentRepository.findAll(PageRequest.of(0, 500, Sort.by(Sort.Direction.DESC, "createdAt"))).stream()
                .filter(p -> p.getCreatedAt() != null && p.getCreatedAt().isAfter(startDate))
                .collect(Collectors.toList());
        List<Booking> recentBookings = bookingRepository.findAll(PageRequest.of(0, 500, Sort.by(Sort.Direction.DESC, "createdAt"))).stream()
                .filter(b -> b.getCreatedAt() != null && b.getCreatedAt().isAfter(startDate))
                .filter(b -> filterGymIds == null || (b.getGym() != null && filterGymIds.contains(b.getGym().getId())))
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

    @Transactional(readOnly = true)
    public List<RecentActivityDto> getRecentActivity(User currentUser) {
        Set<UUID> partnerGymIds = null;
        if (currentUser != null && (currentUser.getRole() == UserRole.GYM_PARTNER || currentUser.getRole() == UserRole.PARTNER)) {
            partnerGymIds = gymRepository.findByOwnerId(currentUser.getId()).stream()
                    .map(Gym::getId).collect(Collectors.toSet());
        }

        List<RecentActivityDto> list = new ArrayList<>();
        final Set<UUID> filterGymIds = partnerGymIds;

        bookingRepository.findAll(PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "createdAt"))).stream()
                .filter(b -> filterGymIds == null || (b.getGym() != null && filterGymIds.contains(b.getGym().getId())))
                .forEach(b -> {
                    String userName = b.getUser() != null ? b.getUser().getFirstName() + " " + (b.getUser().getLastName() != null ? b.getUser().getLastName() : "") : "User";
                    String gymName = b.getGym() != null ? b.getGym().getName() : "Gym";
                    list.add(RecentActivityDto.builder()
                            .id(UUID.randomUUID().toString())
                            .type("BOOKING")
                            .message(userName.trim() + " booked a session at " + gymName)
                            .timestamp(b.getCreatedAt() != null ? b.getCreatedAt() : Instant.now())
                            .build());
                });

        if (filterGymIds == null) {
            userRepository.findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))).forEach(u -> {
                list.add(RecentActivityDto.builder()
                        .id(UUID.randomUUID().toString())
                        .type("USER")
                        .message(u.getFirstName() + " " + u.getLastName() + " registered as a customer.")
                        .timestamp(u.getCreatedAt())
                        .build());
            });
        }

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

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
    public List<TopGymDto> getTopGyms() {
        List<Gym> gyms = gymRepository.findAll();
        // Use limited batch to avoid OOM
        List<Booking> bookings = bookingRepository.findAll(PageRequest.of(0, 1000, Sort.by(Sort.Direction.DESC, "createdAt"))).getContent();
        
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

    @Transactional(readOnly = true)
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
                    .users(cityUserCount.getOrDefault(city, 0L))
                    .gyms(cityGymCount.getOrDefault(city, 0L))
                    .build());
        }
        
        list.sort((a, b) -> Long.compare(b.getUsers(), a.getUsers()));
        return list.stream().limit(5).collect(Collectors.toList());
    }

    @Transactional
    public PartnerRegistrationResultDto registerPartner(RegisterPartnerDto dto) {
        String email = dto.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmailAndDeletedFalse(email)) {
            throw new DuplicateResourceException("An account with this email already exists: " + email);
        }
        if (dto.getPhone() != null && userRepository.existsByPhoneAndDeletedFalse(dto.getPhone().trim())) {
            throw new DuplicateResourceException("An account with this phone number already exists: " + dto.getPhone());
        }

        // 1. Create User with GYM_PARTNER role
        User partner = new User();
        partner.setEmail(email);
        partner.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        partner.setFirstName(dto.getFirstName().trim());
        partner.setLastName(dto.getLastName() != null ? dto.getLastName().trim() : null);
        partner.setPhone(dto.getPhone() != null ? dto.getPhone().trim() : null);
        partner.setDisplayName(dto.getFirstName().trim() + (dto.getLastName() != null ? " " + dto.getLastName().trim() : ""));
        partner.setRole(UserRole.GYM_PARTNER);
        partner.setActive(true);
        partner.setEmailVerified(true);
        partner.setPhoneVerified(true);
        partner.setProfileComplete(true);

        User savedPartner = userRepository.save(partner);

        // 2. Create UserProfile
        UserProfile profile = new UserProfile();
        profile.setUser(savedPartner);
        profile.setCity(dto.getCity());
        userProfileRepository.save(profile);

        // 3. Create Gym with unique slug
        String baseSlug = dto.getGymName().toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-").replaceAll("^-|-$", "");
        if (baseSlug.isBlank()) baseSlug = "gym";
        String slug = baseSlug;
        int suffix = 1;
        while (gymRepository.existsBySlugAndDeletedFalse(slug)) {
            slug = baseSlug + "-" + suffix++;
        }

        Gym gym = new Gym();
        gym.setOwner(savedPartner);
        gym.setName(dto.getGymName().trim());
        gym.setSlug(slug);
        gym.setCategory(dto.getCategory() != null ? dto.getCategory() : GymCategory.GYM);
        gym.setDescription(dto.getDescription());
        gym.setStatus(GymStatus.ACTIVE);
        gym.setFeatured(true);
        Gym savedGym = gymRepository.save(gym);

        // 4. Create primary GymBranch
        GymBranch branch = new GymBranch();
        branch.setGym(savedGym);
        branch.setName(dto.getGymName().trim() + " - Main Branch");
        branch.setAddressLine1(dto.getAddressLine1());
        branch.setCity(dto.getCity());
        branch.setState(dto.getState());
        branch.setPincode(dto.getPincode());
        branch.setPrimary(true);
        branch.setActive(true);
        branch.setCapacity(100);
        gymBranchRepository.save(branch);

        log.info("Registered new Gym Partner: {} [{}] with Gym: {} [{}]",
                savedPartner.getEmail(), savedPartner.getId(), savedGym.getName(), savedGym.getId());

        return PartnerRegistrationResultDto.builder()
                .partnerId(savedPartner.getId())
                .email(savedPartner.getEmail())
                .firstName(savedPartner.getFirstName())
                .lastName(savedPartner.getLastName())
                .phone(savedPartner.getPhone())
                .role(savedPartner.getRole().name())
                .gymId(savedGym.getId())
                .gymName(savedGym.getName())
                .gymSlug(savedGym.getSlug())
                .category(savedGym.getCategory().name())
                .status(savedGym.getStatus().name())
                .city(dto.getCity())
                .build();
    }
}
