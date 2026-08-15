package com.fitempire;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@Slf4j
@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "springSecurityAuditorAware")
@EnableCaching
@EnableAsync
@EnableScheduling
public class FitEmpireApplication {

    public static void main(String[] args) {
        SpringApplication.run(FitEmpireApplication.class, args);
    }

    @Bean
    public CommandLineRunner schemaMigrationRunner(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE gym_branches ADD COLUMN IF NOT EXISTS monthly_membership_price NUMERIC(12,2)");
                jdbcTemplate.execute("ALTER TABLE gym_branches ADD COLUMN IF NOT EXISTS per_session_rate NUMERIC(10,2)");
                log.info("✅ Database schema migration verified: gym_branches columns up to date.");
            } catch (Exception e) {
                log.warn("Schema migration notice: {}", e.getMessage());
            }
        };
    }
}
