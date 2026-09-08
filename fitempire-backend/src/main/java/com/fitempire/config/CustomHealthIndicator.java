package com.fitempire.config;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

@Component
public class CustomHealthIndicator implements HealthIndicator {

    private final DataSource dataSource;

    public CustomHealthIndicator(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Health health() {
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(2)) {
                return Health.up()
                        .withDetail("database", "Neon PostgreSQL Connected")
                        .withDetail("status", "READY")
                        .build();
            }
        } catch (Exception e) {
            return Health.down(e)
                    .withDetail("database", "Connection failed")
                    .build();
        }
        return Health.down().withDetail("database", "Unreachable").build();
    }
}
