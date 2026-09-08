package com.fitempire.security.audit;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Component
public class SecurityAuditLogger {

    public void logAuthSuccess(String email, String ip) {
        log.info("[SECURITY_AUDIT] AUTH_SUCCESS | email: {} | ip: {} | time: {}", email, ip, Instant.now());
    }

    public void logAuthFailure(String email, String ip, String reason) {
        log.warn("[SECURITY_AUDIT] AUTH_FAILURE | email: {} | ip: {} | reason: {} | time: {}", email, ip, reason, Instant.now());
    }

    public void logPrivilegeEscalationAttempt(UUID userId, String targetRole) {
        log.error("[SECURITY_AUDIT] PRIVILEGE_ESCALATION_ATTEMPT | userId: {} | targetRole: {} | time: {}", userId, targetRole, Instant.now());
    }
}
