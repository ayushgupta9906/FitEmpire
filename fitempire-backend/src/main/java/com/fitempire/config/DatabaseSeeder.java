package com.fitempire.config;

import com.fitempire.modules.gyms.entity.Gym;
import com.fitempire.modules.gyms.entity.GymBranch;
import com.fitempire.modules.gyms.entity.GymCategory;
import com.fitempire.modules.gyms.entity.GymStatus;
import com.fitempire.modules.gyms.repository.GymRepository;
import com.fitempire.modules.gyms.repository.GymBranchRepository;
import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.entity.UserProfile;
import com.fitempire.modules.users.entity.UserRole;
import com.fitempire.modules.users.repository.UserProfileRepository;
import com.fitempire.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import org.springframework.beans.factory.annotation.Value;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final GymRepository gymRepository;
    private final GymBranchRepository gymBranchRepository;
    private final com.fitempire.modules.memberships.repository.MembershipPlanRepository membershipPlanRepository;
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
    }

    private void seedAdminUser() {
        String email = "admin@fitempire.in";
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
        User savedAdmin = userRepository.save(admin);
        log.info("Admin user ready with BCrypt credentials [admin@fitempire.in / AdminPassword@123]");
        seedGyms(savedAdmin);
    }

    private void seedPartnerUser() {
        String partnerEmail = "partner@fitempire.in";
        User partner = userRepository.findByEmailAndDeletedFalse(partnerEmail).orElse(null);
        if (partner == null) {
            log.info("Partner user not found. Seeding partner user: {}", partnerEmail);
            partner = new User();
            partner.setEmail(partnerEmail);
            partner.setFirstName("Gym");
            partner.setLastName("Partner");
            partner.setDisplayName("FitEmpire Flagship Partner");
            partner.setRole(UserRole.GYM_PARTNER);
            partner.setPhone("+919876543210");
            partner.setActive(true);
            partner.setEmailVerified(true);
            partner.setPhoneVerified(true);
            partner.setProfileComplete(true);
        }
        partner.setPasswordHash(passwordEncoder.encode("Partner@123"));
        userRepository.save(partner);
        log.info("Partner user seeded successfully [partner@fitempire.in / Partner@123]");
    }

    private void seedCustomerUser() {
        String userEmail = "testuser@fitempire.in";
        User customer = userRepository.findByEmailAndDeletedFalse(userEmail).orElse(null);
        if (customer == null) {
            log.info("Customer user not found. Seeding member: {}", userEmail);
            customer = new User();
            customer.setEmail(userEmail);
            customer.setFirstName("Rahul");
            customer.setLastName("Sharma");
            customer.setDisplayName("Rahul Sharma");
            customer.setRole(UserRole.CUSTOMER);
            customer.setPhone("+919876543210");
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
        log.info("Customer user seeded successfully [testuser@fitempire.in / Password@123]");
    }

    private void seedGyms(User owner) {
        if (gymRepository.count() == 0) {
            log.info("Seeding gym and partner centers...");

            createGymCenter(owner, "Gold's Gym Elite", GymCategory.GYM,
                    "Premium gym with top tier cardio and weight equipment.");
            createGymCenter(owner, "Strike Force MMA", GymCategory.MMA,
                    "Mixed Martial Arts training center covering BJJ, Muay Thai, and wrestling.");
            createGymCenter(owner, "Rocky's Boxing Club", GymCategory.BOXING,
                    "Professional boxing academy for all skill levels.");
            createGymCenter(owner, "Kicking Warriors Arena", GymCategory.KICKBOXING,
                    "High intensity kickboxing classes and sparring sessions.");
            createGymCenter(owner, "Rhythm & Beats Studio", GymCategory.DANCE,
                    "Zumba, salsa, hip hop, and fitness dance classes.");
            createGymCenter(owner, "Blue Wave Aquatics", GymCategory.SWIMMING,
                    "Olympic size swimming pool with coaching and free sessions.");
            createGymCenter(owner, "Zen Yoga & Meditation", GymCategory.YOGA,
                    "Peaceful studio for Hatha, Vinyasa, and spiritual yoga.");
            createGymCenter(owner, "Huddle Sports Complex", GymCategory.SPORTS,
                    "Multi-sport arena with turf booking for football, cricket, and badminton.");
            createGymCenter(owner, "Cue & Pin Gaming Lounge", GymCategory.GAMES,
                    "Recreational center for snooker, bowling, table tennis, and darts.");

            log.info("Partner centers successfully seeded!");
        }
    }

    private void createGymCenter(User owner, String name, GymCategory category, String description) {
        Gym gym = new Gym();
        gym.setOwner(owner);
        gym.setName(name);
        gym.setSlug(name.toLowerCase().replace(" ", "-").replace("'", ""));
        gym.setDescription(description);
        gym.setCategory(category);
        gym.setStatus(GymStatus.ACTIVE);
        gym.setFeatured(true);
        Gym savedGym = gymRepository.save(gym);

        GymBranch branch = new GymBranch();
        branch.setGym(savedGym);
        branch.setName(name + " - Main Branch");
        branch.setAddressLine1("123 Sector 5");
        branch.setCity("Gurgaon");
        branch.setState("Haryana");
        branch.setPincode("122001");
        branch.setLatitude(new java.math.BigDecimal("28.4595"));
        branch.setLongitude(new java.math.BigDecimal("77.0266"));
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
                    com.fitempire.modules.memberships.entity.MembershipType.MONTHLY, new java.math.BigDecimal("2999.00"), 30);
            createPlan(gym, branch, "FitEmpire Platinum VIP", "All-Access Pass + Personal Trainer session + AI Workout & Diet Coach.",
                    com.fitempire.modules.memberships.entity.MembershipType.QUARTERLY, new java.math.BigDecimal("7499.00"), 90);
            createPlan(gym, branch, "FitEmpire Single Day Pass", "1-Day all-access entry to any FitEmpire partner gym.",
                    com.fitempire.modules.memberships.entity.MembershipType.DAY_PASS, new java.math.BigDecimal("299.00"), 1);
            log.info("FitEmpire membership plans seeded successfully!");
        }
    }

    private void createPlan(Gym gym, GymBranch branch, String name, String desc,
                            com.fitempire.modules.memberships.entity.MembershipType type,
                            java.math.BigDecimal price, int days) {
        com.fitempire.modules.memberships.entity.MembershipPlan plan = new com.fitempire.modules.memberships.entity.MembershipPlan();
        plan.setGym(gym);
        plan.setBranch(branch);
        plan.setName(name);
        plan.setDescription(desc);
        plan.setType(type);
        plan.setPrice(price);
        plan.setTotalPrice(price.multiply(new java.math.BigDecimal("1.18")));
        plan.setDurationDays(days);
        plan.setActive(true);
        membershipPlanRepository.save(plan);
    }
}
