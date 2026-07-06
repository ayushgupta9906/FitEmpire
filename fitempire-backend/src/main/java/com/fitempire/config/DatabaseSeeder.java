package com.fitempire.config;

import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.entity.UserRole;
import com.fitempire.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedAdminUser();
    }

    private void seedAdminUser() {
        String adminEmail = "ayush@fitempire.com";
        if (userRepository.findByEmailAndDeletedFalse(adminEmail).isEmpty()) {
            log.info("Admin user not found. Seeding admin user: {}", adminEmail);
            
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPasswordHash(passwordEncoder.encode("Arush098!"));
            admin.setFirstName("Ayush");
            admin.setLastName("Fitempire");
            admin.setDisplayName("Ayush Admin");
            admin.setRole(UserRole.SUPER_ADMIN);
            admin.setActive(true);
            admin.setEmailVerified(true);
            admin.setPhoneVerified(true);
            admin.setProfileComplete(true);

            userRepository.save(admin);
            log.info("Admin user successfully seeded!");
        } else {
            log.debug("Admin user {} already exists. Skipping seed.", adminEmail);
        }
    }
}
