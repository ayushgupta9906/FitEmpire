package com.fitempire.modules.auth.service;

import com.fitempire.common.exception.BusinessException;
import com.fitempire.common.exception.DuplicateResourceException;
import com.fitempire.common.exception.OtpException;
import com.fitempire.common.exception.ResourceNotFoundException;
import com.fitempire.modules.auth.dto.*;
import com.fitempire.modules.auth.entity.OtpCode;
import com.fitempire.modules.auth.entity.OtpPurpose;
import com.fitempire.modules.auth.entity.RefreshToken;
import com.fitempire.modules.auth.repository.OtpCodeRepository;
import com.fitempire.modules.auth.repository.RefreshTokenRepository;
import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.entity.UserProfile;
import com.fitempire.modules.users.entity.UserRole;
import com.fitempire.modules.users.repository.UserProfileRepository;
import com.fitempire.modules.users.repository.UserRepository;
import com.fitempire.security.jwt.JwtService;
import com.fitempire.service.NotificationService;
import com.fitempire.service.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final OtpCodeRepository otpCodeRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final SmsService smsService;
    private final NotificationService notificationService;

    @Value("${app.otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    @Value("${app.otp.max-attempts:5}")
    private int maxOtpAttempts;

    private final SecureRandom secureRandom = new SecureRandom();

    // ── Registration ──────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailAndDeletedFalse(request.getEmail().toLowerCase())) {
            throw new DuplicateResourceException("An account with this email already exists.");
        }
        if (request.getPhone() != null
                && userRepository.existsByPhoneAndDeletedFalse(request.getPhone())) {
            throw new DuplicateResourceException("An account with this phone number already exists.");
        }

        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName() != null ? request.getLastName().trim() : null);
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.CUSTOMER);
        user.setActive(true);
        user.setReferralCode(generateReferralCode());

        // Handle referral
        if (request.getReferralCode() != null && !request.getReferralCode().isBlank()) {
            userRepository.findByReferralCodeAndDeletedFalse(request.getReferralCode())
                    .ifPresent(referrer -> user.setReferredById(referrer.getId()));
        }

        User savedUser = userRepository.save(user);

        // Create default profile
        UserProfile profile = new UserProfile();
        profile.setUser(savedUser);
        userProfileRepository.save(profile);

        // Send welcome email async
        notificationService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFirstName());

        log.info("New user registered: {} [{}]", savedUser.getEmail(), savedUser.getId());
        return buildAuthResponse(savedUser, true);
    }

    // ── Email/Password Login ───────────────────────────────────────────────────

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailAndDeletedFalse(request.getEmail().toLowerCase())
                .orElseThrow(() -> new BusinessException("Invalid email or password.", "INVALID_CREDENTIALS", HttpStatus.UNAUTHORIZED));

        if (user.isLocked() && user.getLockedUntil() != null && Instant.now().isBefore(user.getLockedUntil())) {
            throw new BusinessException("Account temporarily locked due to too many failed attempts. Try again later.", "ACCOUNT_LOCKED", HttpStatus.LOCKED);
        }

        if (!user.isActive()) {
            throw new BusinessException("Your account has been deactivated. Please contact support.", "ACCOUNT_DEACTIVATED", HttpStatus.FORBIDDEN);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            user.incrementFailedLogin();
            userRepository.save(user);
            throw new BusinessException("Invalid email or password.", "INVALID_CREDENTIALS", HttpStatus.UNAUTHORIZED);
        }

        user.resetFailedLogin();
        user.setLastLoginAt(Instant.now());
        if (request.getFcmToken() != null) {
            user.setFcmToken(request.getFcmToken());
        }
        userRepository.save(user);

        return buildAuthResponse(user, false);
    }

    // ── OTP Login (Send OTP) ──────────────────────────────────────────────────

    @Transactional
    public String sendOtp(OtpLoginRequest request) {
        // Rate limiting: max 5 OTPs per hour
        Instant oneHourAgo = Instant.now().minusSeconds(3600);
        long recentCount = otpCodeRepository.countRecentByPhone(request.getPhone(), OtpPurpose.LOGIN, oneHourAgo);
        if (recentCount >= 5) {
            throw new OtpException("Too many OTP requests. Please try again in an hour.", "OTP_RATE_LIMITED");
        }

        // Invalidate existing OTPs
        otpCodeRepository.invalidateAllByPhone(request.getPhone(), OtpPurpose.LOGIN);

        String otpCode = generateOtp();
        OtpCode otp = new OtpCode();
        otp.setPhone(request.getPhone());
        otp.setCode(otpCode);
        otp.setPurpose(OtpPurpose.LOGIN);
        otp.setExpiresAt(Instant.now().plusSeconds(otpExpiryMinutes * 60L));

        // Link to user if exists
        userRepository.findByPhoneAndDeletedFalse(request.getPhone())
                .ifPresent(otp::setUser);

        otpCodeRepository.save(otp);

        // Send via SMS
        smsService.sendOtp(request.getPhone(), otpCode);
        log.info("OTP sent to phone: {}", maskPhone(request.getPhone()));
        return otpCode;
    }

    // ── OTP Verify ────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse verifyOtp(OtpVerifyRequest request) {
        OtpCode otp = otpCodeRepository
                .findLatestValidByPhone(request.getPhone(), OtpPurpose.LOGIN, Instant.now())
                .orElseThrow(() -> new OtpException("OTP has expired or is invalid.", "OTP_INVALID"));

        if (otp.getAttempts() >= maxOtpAttempts) {
            throw new OtpException("Maximum OTP attempts exceeded. Please request a new OTP.", "OTP_MAX_ATTEMPTS");
        }

        if (!otp.getCode().equals(request.getOtp())) {
            otp.incrementAttempts();
            otpCodeRepository.save(otp);
            throw new OtpException("Incorrect OTP. " + (maxOtpAttempts - otp.getAttempts()) + " attempts remaining.", "OTP_INCORRECT");
        }

        otp.markUsed();
        otpCodeRepository.save(otp);

        // Find or create user
        User user = userRepository.findByPhoneAndDeletedFalse(request.getPhone())
                .orElseGet(() -> createPhoneOnlyUser(request.getPhone()));

        user.setPhoneVerified(true);
        user.setLastLoginAt(Instant.now());
        if (request.getFcmToken() != null) {
            user.setFcmToken(request.getFcmToken());
        }
        userRepository.save(user);

        boolean isNewUser = user.getCreatedAt().isAfter(Instant.now().minusSeconds(10));
        return buildAuthResponse(user, isNewUser);
    }

    // ── Refresh Token ─────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse refreshToken(String refreshTokenValue) {
        jwtService.validateTokenOrThrow(refreshTokenValue);

        String tokenHash = hashToken(refreshTokenValue);
        RefreshToken storedToken = refreshTokenRepository.findByTokenHashAndRevokedFalse(tokenHash)
                .orElseThrow(() -> new BusinessException("Refresh token not found or revoked.", "TOKEN_INVALID", HttpStatus.UNAUTHORIZED));

        if (storedToken.isExpired()) {
            storedToken.revoke();
            refreshTokenRepository.save(storedToken);
            throw new BusinessException("Refresh token has expired. Please log in again.", "TOKEN_EXPIRED", HttpStatus.UNAUTHORIZED);
        }

        User user = storedToken.getUser();

        // Rotate: revoke old, issue new
        storedToken.revoke();
        refreshTokenRepository.save(storedToken);

        return buildAuthResponse(user, false);
    }

    // ── Logout ────────────────────────────────────────────────────────────────

    @Transactional
    public void logout(UUID userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
        log.info("User {} logged out, all refresh tokens revoked", userId);
    }

    // ── Forgot Password ───────────────────────────────────────────────────────

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        // Don't reveal if email exists — always return success
        userRepository.findByEmailAndDeletedFalse(request.getEmail().toLowerCase()).ifPresent(user -> {
            String otpCode = generateOtp();
            OtpCode otp = new OtpCode();
            otp.setUser(user);
            otp.setEmail(user.getEmail());
            otp.setCode(otpCode);
            otp.setPurpose(OtpPurpose.PASSWORD_RESET);
            otp.setExpiresAt(Instant.now().plusSeconds(otpExpiryMinutes * 60L));
            otpCodeRepository.save(otp);

            notificationService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), otpCode);
        });
        log.info("Password reset OTP requested for: {}", request.getEmail());
    }

    // ── Reset Password ────────────────────────────────────────────────────────

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        OtpCode otp = otpCodeRepository
                .findLatestValidByEmail(request.getEmail().toLowerCase(), OtpPurpose.PASSWORD_RESET, Instant.now())
                .orElseThrow(() -> new OtpException("OTP is invalid or has expired.", "OTP_INVALID"));

        if (!otp.getCode().equals(request.getOtp())) {
            otp.incrementAttempts();
            otpCodeRepository.save(otp);
            throw new OtpException("Incorrect OTP.", "OTP_INCORRECT");
        }

        otp.markUsed();
        otpCodeRepository.save(otp);

        User user = userRepository.findByEmailAndDeletedFalse(request.getEmail().toLowerCase())
                .orElseThrow(() -> ResourceNotFoundException.of("User", "email", request.getEmail()));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.resetFailedLogin();
        userRepository.save(user);

        // Revoke all refresh tokens on password change
        refreshTokenRepository.revokeAllByUserId(user.getId());

        log.info("Password reset successfully for user: {}", user.getEmail());
    }

    // ── Private Helpers ───────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(User user, boolean isNewUser) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshTokenValue = jwtService.generateRefreshToken(user.getId(), user.getEmail());

        // Persist refresh token
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenHash(hashToken(refreshTokenValue));
        refreshToken.setExpiresAt(Instant.now().plusMillis(jwtService.getRefreshTokenExpiryMs()));
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .expiresIn(jwtService.getAccessTokenExpiryMs() / 1000)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .role(user.getRole().name())
                .profileComplete(user.isProfileComplete())
                .newUser(isNewUser)
                .build();
    }

    private User createPhoneOnlyUser(String phone) {
        User user = new User();
        user.setPhone(phone);
        user.setFirstName("User");
        user.setEmail(phone + "@fitempire.phone"); // temporary placeholder
        user.setRole(UserRole.CUSTOMER);
        user.setActive(true);
        user.setReferralCode(generateReferralCode());
        User saved = userRepository.save(user);

        UserProfile profile = new UserProfile();
        profile.setUser(saved);
        userProfileRepository.save(profile);

        return saved;
    }

    private String generateOtp() {
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }

    private String generateReferralCode() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder sb = new StringBuilder(8);
        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(secureRandom.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to hash token", e);
        }
    }

    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) return "****";
        return "****" + phone.substring(phone.length() - 4);
    }
}
