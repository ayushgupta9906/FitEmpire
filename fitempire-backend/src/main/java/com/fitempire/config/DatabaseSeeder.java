package com.fitempire.config;

import com.fitempire.modules.bookings.entity.Booking;
import com.fitempire.modules.bookings.entity.BookingStatus;
import com.fitempire.modules.bookings.entity.BookingType;
import com.fitempire.modules.bookings.repository.BookingRepository;
import com.fitempire.modules.classes.entity.ClassDifficulty;
import com.fitempire.modules.classes.entity.FitnessClass;
import com.fitempire.modules.classes.repository.FitnessClassRepository;
import com.fitempire.modules.gyms.entity.Gym;
import com.fitempire.modules.gyms.entity.GymBranch;
import com.fitempire.modules.gyms.entity.GymCategory;
import com.fitempire.modules.gyms.entity.GymStatus;
import com.fitempire.modules.gyms.repository.GymBranchRepository;
import com.fitempire.modules.gyms.repository.GymRepository;
import com.fitempire.modules.memberships.entity.MembershipPlan;
import com.fitempire.modules.memberships.entity.MembershipType;
import com.fitempire.modules.memberships.repository.MembershipPlanRepository;
import com.fitempire.modules.payments.entity.Payment;
import com.fitempire.modules.payments.entity.PaymentMethod;
import com.fitempire.modules.payments.entity.PaymentStatus;
import com.fitempire.modules.payments.repository.PaymentRepository;
import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.entity.UserProfile;
import com.fitempire.modules.users.entity.UserRole;
import com.fitempire.modules.users.repository.UserProfileRepository;
import com.fitempire.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final GymRepository gymRepository;
    private final GymBranchRepository gymBranchRepository;
    private final MembershipPlanRepository membershipPlanRepository;
    private final FitnessClassRepository fitnessClassRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-email:admin@fitempire.in}")
    private String adminEmail;

    @Value("${app.admin.default-password:AdminPassword@123}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        seedAdminUser();
        seedPartnerUser();
        seedCustomerUser();
        seedGyms();
        seedMembershipPlansStandalone();
        seedFitnessClasses();
        seedBookingsAndPayments();
    }

    private void seedMembershipPlansStandalone() {
        if (membershipPlanRepository.count() == 0) {
            List<Gym> gyms = gymRepository.findAll();
            if (gyms.isEmpty()) return;
            Gym gym = gyms.get(0);
            List<GymBranch> branches = gymBranchRepository.findByGymIdAndDeletedFalse(gym.getId());
            GymBranch branch = branches.isEmpty() ? null : branches.get(0);

            log.info("Seeding membership plans standalone for FitEmpire...");
            createPlan(gym, branch, "FitEmpire Pro Unlimited", "All-access daily entry to 12,000+ partner centers, unlimited classes, and personal AI coaching.",
                    MembershipType.MONTHLY, new BigDecimal("1999.00"), 30);
            createPlan(gym, branch, "FitEmpire Gold Elite Pass", "Unlimited gym entry, MMA & pool access across all partner centers + 1 PT session/month.",
                    MembershipType.QUARTERLY, new BigDecimal("4999.00"), 90);
            createPlan(gym, branch, "FitEmpire Platinum Annual Pass", "Full 365-day all-access Pass + Unlimited AI Coach + Nutrition Plan + Free Guest Passes.",
                    MembershipType.ANNUAL, new BigDecimal("14999.00"), 365);
            createPlan(gym, branch, "FitEmpire Single Day Pass", "1-Day all-access entry to any FitEmpire partner gym.",
                    MembershipType.DAY_PASS, new BigDecimal("299.00"), 1);
            log.info("FitEmpire membership plans seeded successfully!");
        }
    }

    private void seedAdminUser() {
        for (String email : List.of("admin@fitempire.tech", "admin@fitempire.in")) {
            try {
                User admin = userRepository.findByEmailAndDeletedFalse(email).orElse(null);
                if (admin == null) {
                    log.info("Admin user not found. Seeding admin user: {}", email);
                    admin = new User();
                    admin.setEmail(email);
                    admin.setFirstName("Admin");
                    admin.setLastName("FitEmpire");
                    admin.setDisplayName("FitEmpire Admin");
                    admin.setRole(UserRole.SUPER_ADMIN);
                    admin.setActive(true);
                    admin.setEmailVerified(true);
                    admin.setPhoneVerified(true);
                    admin.setProfileComplete(true);
                }
                admin.setPasswordHash(passwordEncoder.encode("AdminPassword@123"));
                userRepository.save(admin);
                log.info("Admin user ready with BCrypt credentials [{} / AdminPassword@123]", email);
            } catch (Exception e) {
                log.warn("Could not seed admin user {}: {}", email, e.getMessage());
            }
        }
    }

    private void seedPartnerUser() {
        for (String partnerEmail : List.of("partner@fitempire.tech", "partner@fitempire.in")) {
            try {
                User partner = userRepository.findByEmailAndDeletedFalse(partnerEmail).orElse(null);
                if (partner == null) {
                    log.info("Partner user not found. Seeding partner user: {}", partnerEmail);
                    partner = new User();
                    partner.setEmail(partnerEmail);
                    partner.setFirstName("Gym");
                    partner.setLastName("Partner");
                    partner.setDisplayName("FitEmpire Flagship Partner");
                    partner.setRole(UserRole.GYM_PARTNER);
                    String targetPhone = partnerEmail.contains(".tech") ? "+919880072520" : "+919880072521";
                    if (!userRepository.existsByPhoneAndDeletedFalse(targetPhone)) {
                        partner.setPhone(targetPhone);
                    }
                    partner.setActive(true);
                    partner.setEmailVerified(true);
                    partner.setPhoneVerified(true);
                    partner.setProfileComplete(true);
                }
                partner.setPasswordHash(passwordEncoder.encode("Partner@123"));
                userRepository.save(partner);
                log.info("Partner user seeded successfully [{} / Partner@123]", partnerEmail);
            } catch (Exception e) {
                log.warn("Could not seed partner user {}: {}", partnerEmail, e.getMessage());
            }
        }
    }

    private void seedCustomerUser() {
        for (String userEmail : List.of("testuser@fitempire.tech", "testuser@fitempire.in")) {
            try {
                User customer = userRepository.findByEmailAndDeletedFalse(userEmail).orElse(null);
                if (customer == null) {
                    log.info("Customer user not found. Seeding member: {}", userEmail);
                    customer = new User();
                    customer.setEmail(userEmail);
                    customer.setFirstName("Rahul");
                    customer.setLastName("Sharma");
                    customer.setDisplayName("Rahul Sharma");
                    customer.setRole(UserRole.CUSTOMER);
                    String targetPhone = userEmail.contains(".tech") ? "+919876543210" : "+919876543211";
                    if (!userRepository.existsByPhoneAndDeletedFalse(targetPhone)) {
                        customer.setPhone(targetPhone);
                    }
                    customer.setActive(true);
                    customer.setEmailVerified(true);
                    customer.setPhoneVerified(true);
                    customer.setProfileComplete(true);
                }
                customer.setPasswordHash(passwordEncoder.encode("Password@123"));
                User savedCustomer = userRepository.save(customer);

                if (userProfileRepository.findByUserId(savedCustomer.getId()).isEmpty()) {
                    UserProfile profile = new UserProfile();
                    profile.setUser(savedCustomer);
                    userProfileRepository.save(profile);
                }
                log.info("Customer user seeded successfully [{} / Password@123]", userEmail);
            } catch (Exception e) {
                log.warn("Could not seed customer user {}: {}", userEmail, e.getMessage());
            }
        }
    }

    private void seedGyms() {
        User admin = userRepository.findByEmailAndDeletedFalse("admin@fitempire.in").orElse(null);
        User partner = userRepository.findByEmailAndDeletedFalse("partner@fitempire.in").orElse(admin);
        if (admin == null && partner == null) return;
        User primaryOwner = partner != null ? partner : admin;

        if (gymRepository.count() == 0) {
            log.info("Seeding gym and partner centers...");

            createGymCenter(primaryOwner, "Gold's Gym Elite", GymCategory.GYM,
                    "Premium gym with top tier cardio and weight equipment.", "Koramangala 5th Block", "Bangalore", "Karnataka", "560095");
            createGymCenter(primaryOwner, "FitEmpire Flagship Arena", GymCategory.GYM,
                    "Flagship fitness hub with advanced strength training & recovery zone.", "Indiranagar 100ft Rd", "Bangalore", "Karnataka", "560038");
            createGymCenter(primaryOwner, "Strike Force MMA", GymCategory.MMA,
                    "Mixed Martial Arts training center covering BJJ, Muay Thai, and wrestling.", "HSR Layout Sector 2", "Bangalore", "Karnataka", "560102");
            createGymCenter(admin, "Rocky's Boxing Club", GymCategory.BOXING,
                    "Professional boxing academy for all skill levels.", "Cyber City Phase 2", "Gurgaon", "Haryana", "122002");
            createGymCenter(admin, "Kicking Warriors Arena", GymCategory.KICKBOXING,
                    "High intensity kickboxing classes and sparring sessions.", "Sector 29 Market", "Gurgaon", "Haryana", "122001");
            createGymCenter(admin, "Rhythm & Beats Studio", GymCategory.DANCE,
                    "Zumba, salsa, hip hop, and fitness dance classes.", "Connaught Place", "Delhi", "Delhi", "110001");
            createGymCenter(admin, "Blue Wave Aquatics", GymCategory.SWIMMING,
                    "Olympic size swimming pool with coaching and free sessions.", "Jubilee Hills", "Hyderabad", "Telangana", "500033");
            createGymCenter(admin, "Zen Yoga & Meditation", GymCategory.YOGA,
                    "Peaceful studio for Hatha, Vinyasa, and spiritual yoga.", "Bandra West", "Mumbai", "Maharashtra", "400050");
            createGymCenter(admin, "Huddle Sports Complex", GymCategory.SPORTS,
                    "Multi-sport arena with turf booking for football, cricket, and badminton.", "Whitefield", "Bangalore", "Karnataka", "560066");

            log.info("Partner centers successfully seeded!");
        } else if (partner != null) {
            List<Gym> partnerGyms = gymRepository.findByOwnerId(partner.getId());
            if (partnerGyms.isEmpty()) {
                List<Gym> allGyms = gymRepository.findAll();
                if (!allGyms.isEmpty()) {
                    Gym flagship = allGyms.get(0);
                    flagship.setOwner(partner);
                    gymRepository.save(flagship);
                    log.info("Assigned gym '{}' to partner@fitempire.in", flagship.getName());
                }
            }
        }
    }

    private void createGymCenter(User owner, String name, GymCategory category, String description,
                                 String address, String city, String state, String pincode) {
        Gym gym = new Gym();
        gym.setOwner(owner);
        gym.setName(name);
        gym.setSlug(name.toLowerCase().replace(" ", "-").replace("'", "").replace("&", "and"));
        gym.setDescription(description);
        gym.setCategory(category);
        gym.setStatus(GymStatus.ACTIVE);
        gym.setFeatured(true);
        Gym savedGym = gymRepository.save(gym);

        GymBranch branch = new GymBranch();
        branch.setGym(savedGym);
        branch.setName(name + " - Main Center");
        branch.setAddressLine1(address);
        branch.setCity(city);
        branch.setState(state);
        branch.setPincode(pincode);
        branch.setLatitude(new BigDecimal("12.9352"));
        branch.setLongitude(new BigDecimal("77.6245"));
        branch.setCapacity(100);
        branch.setPrimary(true);
        branch.setActive(true);
        gymBranchRepository.save(branch);

        seedMembershipPlans(savedGym, branch);
    }

    private void seedMembershipPlans(Gym gym, GymBranch branch) {
        if (membershipPlanRepository.count() == 0) {
            log.info("Seeding membership plans for FitEmpire...");
            createPlan(gym, branch, "FitEmpire All-Access Gold", "Unlimited gym entry, MMA & pool access across all partner centers.",
                    MembershipType.MONTHLY, new BigDecimal("2999.00"), 30);
            createPlan(gym, branch, "FitEmpire Platinum VIP", "All-Access Pass + Personal Trainer session + AI Workout & Diet Coach.",
                    MembershipType.QUARTERLY, new BigDecimal("7499.00"), 90);
            createPlan(gym, branch, "FitEmpire Single Day Pass", "1-Day all-access entry to any FitEmpire partner gym.",
                    MembershipType.DAY_PASS, new BigDecimal("299.00"), 1);
            log.info("FitEmpire membership plans seeded successfully!");
        }
    }

    private void createPlan(Gym gym, GymBranch branch, String name, String desc,
                            MembershipType type, BigDecimal price, int days) {
        MembershipPlan plan = new MembershipPlan();
        plan.setGym(gym);
        plan.setBranch(branch);
        plan.setName(name);
        plan.setDescription(desc);
        plan.setType(type);
        plan.setPrice(price);
        BigDecimal gst = price.multiply(new BigDecimal("0.18"));
        plan.setGstAmount(gst);
        plan.setTotalPrice(price.add(gst));
        plan.setDurationDays(days);
        plan.setActive(true);
        membershipPlanRepository.save(plan);
        log.info("Seeded membership plan: {}", name);
    }

    private void seedFitnessClasses() {
        if (fitnessClassRepository.count() == 0) {
            List<Gym> gyms = gymRepository.findAll();
            if (gyms.isEmpty()) return;
            Gym gym = gyms.get(0);
            List<GymBranch> branches = gymBranchRepository.findByGymIdAndDeletedFalse(gym.getId());
            GymBranch branch = branches.isEmpty() ? null : branches.get(0);

            createClass(gym, branch, "High-Intensity Crossfit", "Explosive strength conditioning and cardio intervals.", 45, ClassDifficulty.INTERMEDIATE);
            createClass(gym, branch, "Power Yoga & Core", "Vinyasa flow targeting core stability, flexibility and mindful breathing.", 60, ClassDifficulty.ALL_LEVELS);
            createClass(gym, branch, "Zumba Cardio Blast", "High-energy dance workout set to upbeat latin rhythms.", 50, ClassDifficulty.BEGINNER);
            log.info("Fitness classes seeded successfully!");
        }
    }

    private void createClass(Gym gym, GymBranch branch, String name, String desc, int duration, ClassDifficulty difficulty) {
        FitnessClass fc = new FitnessClass();
        fc.setGym(gym);
        fc.setBranch(branch);
        fc.setName(name);
        fc.setDescription(desc);
        fc.setDurationMins(duration);
        fc.setMaxCapacity(20);
        fc.setDifficulty(difficulty);
        fc.setCategory("GENERAL");
        fitnessClassRepository.save(fc);
    }

    private void seedBookingsAndPayments() {
        if (bookingRepository.count() == 0) {
            User customer = userRepository.findByEmailAndDeletedFalse("testuser@fitempire.in").orElse(null);
            if (customer == null) return;
            List<Gym> gyms = gymRepository.findAll();
            if (gyms.isEmpty()) return;
            Gym gym = gyms.get(0);
            List<GymBranch> branches = gymBranchRepository.findByGymIdAndDeletedFalse(gym.getId());
            GymBranch branch = branches.isEmpty() ? null : branches.get(0);

            for (int i = 1; i <= 3; i++) {
                Booking b = new Booking();
                b.setUser(customer);
                b.setGym(gym);
                b.setBranch(branch);
                b.setBookingType(BookingType.GYM_ACCESS);
                b.setStatus(BookingStatus.CHECKED_IN);
                b.setBookingDate(LocalDate.now());
                b.setQrToken("FP-" + (8890 + i));
                b.setAmountPaid(new BigDecimal("299.00"));
                b.setCheckedInAt(Instant.now().minus(i * 15L, ChronoUnit.MINUTES));
                bookingRepository.save(b);

                Payment p = new Payment();
                p.setUser(customer);
                p.setAmount(new BigDecimal("299.00"));
                p.setNetAmount(new BigDecimal("299.00"));
                p.setGstAmount(BigDecimal.ZERO);
                p.setDiscountAmount(BigDecimal.ZERO);
                p.setWalletAmount(BigDecimal.ZERO);
                p.setCurrency("INR");
                p.setStatus(PaymentStatus.COMPLETED);
                p.setPaymentMethod(PaymentMethod.UPI);
                p.setPaymentGateway(com.fitempire.modules.payments.entity.PaymentGateway.RAZORPAY);
                p.setGatewayPaymentId("pay_" + UUID.randomUUID().toString().substring(0, 12));
                p.setCreatedAt(Instant.now());
                p.setUpdatedAt(Instant.now());
                paymentRepository.save(p);
            }
            log.info("Live sample bookings and payments seeded!");
        }
    }
}
