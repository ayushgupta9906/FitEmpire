package com.fitempire.config;

import com.fitempire.modules.gyms.entity.Gym;
import com.fitempire.modules.gyms.entity.GymBranch;
import com.fitempire.modules.gyms.entity.GymCategory;
import com.fitempire.modules.gyms.entity.GymStatus;
import com.fitempire.modules.gyms.repository.GymRepository;
import com.fitempire.modules.gyms.repository.GymBranchRepository;
import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.entity.UserRole;
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
    private final GymRepository gymRepository;
    private final GymBranchRepository gymBranchRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-email}")
    private String adminEmail;

    @Value("${app.admin.default-password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        seedAdminUser();
    }

    private void seedAdminUser() {
        if (userRepository.findByEmailAndDeletedFalse(adminEmail).isEmpty()) {
            log.info("Admin user not found. Seeding admin user: {}", adminEmail);

            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setFirstName("Admin");
            admin.setLastName("FitEmpire");
            admin.setDisplayName("FitEmpire Admin");
            admin.setRole(UserRole.SUPER_ADMIN);
            admin.setActive(true);
            admin.setEmailVerified(true);
            admin.setPhoneVerified(true);
            admin.setProfileComplete(true);

            User savedAdmin = userRepository.save(admin);
            log.info("Admin user successfully seeded!");
            seedGyms(savedAdmin);
        } else {
            log.debug("Admin user {} already exists. Skipping seed.", adminEmail);
            User admin = userRepository.findByEmailAndDeletedFalse(adminEmail).get();
            seedGyms(admin);
        }
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
    }
}
