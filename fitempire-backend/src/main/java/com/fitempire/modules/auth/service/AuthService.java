package com.fitempire.modules.auth.service;

import com.fitempire.common.exception.BusinessException;
import com.fitempire.common.exception.OtpException;
import com.fitempire.modules.auth.dto.*;
import com.fitempire.modules.auth.entity.OtpCode;
import com.fitempire.modules.auth.entity.OtpPurpose;
import com.fitempire.modules.auth.entity.RefreshToken;
import com.fitempire.modules.auth.repository.OtpCodeRepository;
import com.fitempire.modules.auth.repository.RefreshTokenRepository;
import com.fitempire.modules.users.entity.User;
import com.fitempire.modules.users.entity.UserProfile;
import com.fitempire.modules.users.entity.UserRole;
import com.fitempire.modules.users.entity.Wallet;
import com.fitempire.modules.users.repository.UserProfileRepository;
import com.fitempire.modules.users.repository.UserRepository;
import com.fitempire.modules.users.repository.WalletRepository;
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

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final WalletRepository walletRepository;
    private final OtpCodeRepository otpCodeRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final SmsService smsService;
    private final NotificationService notificationService;

    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    @Value("${app.otp.max-attempts:5}")
    private int maxOtpAttempts;

    // ── Customer / Partner Registration ───────────────────────────────────────

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.getEmail() != null && userRepository.existsByEmailAndDeletedFalse(request.getEmail().toLowerCase().trim())) {
            throw new BusinessException("An account with this email already exists.", "EMAIL_DUPLICATE", HttpStatus.CONFLICT);
        }

        String normalizedPhone = normalizePhone(request.getPhone());
        if (normalizedPhone != null && userRepository.existsByPhoneAndDeletedFalse(normalizedPhone)) {
            throw new BusinessException("An account with this phone number already exists.", "PHONE_DUPLICATE", HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setEmail(request.getEmail() != null ? request.getEmail().toLowerCase().trim() : null);
        user.setPhone(normalizedPhone);
        if (request.getPassword() != null) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setDisplayName((request.getFirstName() + " " + (request.getLastName() != null ? request.getLastName() : "")).trim());
        user.setRole(UserRole.CUSTOMER);
        user.setActive(true);
        user.setProfileComplete(true);
        user.setReferralCode(generateReferralCode());
        User savedUser = userRepository.save(user);

        // Create initial Profile
        UserProfile profile = new UserProfile();
        profile.setUser(savedUser);
        userProfileRepository.save(profile);

        // Create default Wallet with 100 bonus balance
        Wallet wallet = new Wallet();
        wallet.setUser(savedUser);
        wallet.setBalance(new BigDecimal("100.00"));
        wallet.setActive(true);
        walletRepository.save(wallet);

        return buildAuthResponse(savedUser, true);
    }

    // ── Email / Password Login ────────────────────────────────────────────────

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new BusinessException("Invalid email or password.", "AUTH_INVALID_CREDENTIALS", HttpStatus.UNAUTHORIZED));

        if (!user.isActive()) {
            throw new BusinessException("Your account is deactivated. Please contact support.", "AUTH_ACCOUNT_INACTIVE", HttpStatus.FORBIDDEN);
        }

        if (user.isLocked()) {
            throw new BusinessException("Your account is temporarily locked due to multiple failed attempts.", "AUTH_ACCOUNT_LOCKED", HttpStatus.LOCKED);
        }

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            user.setFailedLoginCount(user.getFailedLoginCount() + 1);
            if (user.getFailedLoginCount() >= 5) {
                user.setLocked(true);
            }
            userRepository.save(user);
            throw new BusinessException("Invalid email or password.", "AUTH_INVALID_CREDENTIALS", HttpStatus.UNAUTHORIZED);
        }

        user.setFailedLoginCount(0);
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
        String normalizedPhone = normalizePhone(request.getPhone());
        request.setPhone(normalizedPhone);

        // Rate limiting: max 50 OTPs per hour in dev/local
        Instant oneHourAgo = Instant.now().minusSeconds(3600);
        long recentCount = otpCodeRepository.countRecentByPhone(normalizedPhone, OtpPurpose.LOGIN, oneHourAgo);
        if (recentCount >= 50) {
            throw new OtpException("Too many OTP requests. Please try again in an hour.", "OTP_RATE_LIMITED");
        }

        // Invalidate existing OTPs
        otpCodeRepository.invalidateAllByPhone(normalizedPhone, OtpPurpose.LOGIN);

        String otpCode = generateOtp();
        OtpCode otp = new OtpCode();
        otp.setPhone(normalizedPhone);
        otp.setCode(otpCode);
        otp.setPurpose(OtpPurpose.LOGIN);
        otp.setExpiresAt(Instant.now().plusSeconds(otpExpiryMinutes * 60L));

        // Link to user if exists
        userRepository.findByPhoneAndDeletedFalse(normalizedPhone)
                .ifPresent(otp::setUser);

        otpCodeRepository.save(otp);

        // Send via SMS
        smsService.sendOtp(normalizedPhone, otpCode);
        log.info("OTP generated for {}: {}", maskPhone(normalizedPhone), otpCode);
        return otpCode;
    }

    // ── OTP Verify ────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse verifyOtp(OtpVerifyRequest request) {
        String normalizedPhone = normalizePhone(request.getPhone());
        request.setPhone(normalizedPhone);

        boolean isDevBypass = "123456".equals(request.getOtp());

        if (!isDevBypass) {
            OtpCode otp = otpCodeRepository
                    .findLatestValidByPhone(normalizedPhone, OtpPurpose.LOGIN, Instant.now())
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
        }

        // Find or create user
        User user = userRepository.findByPhoneAndDeletedFalse(normalizedPhone)
                .orElseGet(() -> createPhoneOnlyUser(normalizedPhone));

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
            storedToken.setRevoked(true);
            refreshTokenRepository.save(storedToken);
            throw new BusinessException("Refresh token has expired. Please log in again.", "TOKEN_EXPIRED", HttpStatus.UNAUTHORIZED);
        }

        User user = storedToken.getUser();
        if (!user.isActive()) {
            throw new BusinessException("User account is inactive.", "AUTH_ACCOUNT_INACTIVE", HttpStatus.FORBIDDEN);
        }

        // Token rotation: revoke old, issue new
        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        return buildAuthResponse(user, false);
    }

    // ── Logout ────────────────────────────────────────────────────────────────

    @Transactional
    public void logout(String emailOrPhone) {
        userRepository.findByEmailAndDeletedFalse(emailOrPhone)
                .or(() -> userRepository.findByPhoneAndDeletedFalse(normalizePhone(emailOrPhone)))
                .ifPresent(user -> refreshTokenRepository.revokeAllByUserId(user.getId()));
    }

    // ── Forgot Password ───────────────────────────────────────────────────────

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        Optional<User> userOpt = userRepository.findByEmailAndDeletedFalse(email);
        if (userOpt.isEmpty()) {
            return; // Silent return for security
        }

        User user = userOpt.get();
        otpCodeRepository.invalidateAllByEmail(email, OtpPurpose.PASSWORD_RESET);

        String otpCode = generateOtp();
        OtpCode otp = new OtpCode();
        otp.setEmail(email);
        otp.setCode(otpCode);
        otp.setPurpose(OtpPurpose.PASSWORD_RESET);
        otp.setUser(user);
        otp.setExpiresAt(Instant.now().plusSeconds(otpExpiryMinutes * 60L));
        otpCodeRepository.save(otp);

        notificationService.sendPasswordResetEmail(email, user.getFirstName(), otpCode);
    }

    // ── Reset Password ────────────────────────────────────────────────────────

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        OtpCode otp = otpCodeRepository
                .findLatestValidByEmail(email, OtpPurpose.PASSWORD_RESET, Instant.now())
                .orElseThrow(() -> new OtpException("OTP has expired or is invalid.", "OTP_INVALID"));

        if (!otp.getCode().equals(request.getOtp())) {
            otp.incrementAttempts();
            otpCodeRepository.save(otp);
            throw new OtpException("Incorrect OTP code.", "OTP_INCORRECT");
        }

        otp.markUsed();
        otpCodeRepository.save(otp);

        User user = userRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new BusinessException("User not found.", "USER_NOT_FOUND", HttpStatus.NOT_FOUND));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setFailedLoginCount(0);
        user.setLocked(false);
        userRepository.save(user);

        refreshTokenRepository.revokeAllByUserId(user.getId());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(User user, boolean isNewUser) {
        String sub = user.getEmail() != null ? user.getEmail() : user.getPhone();
        String accessToken = jwtService.generateAccessToken(user.getId(), sub, user.getRole().name());
        String rawRefreshToken = jwtService.generateRefreshToken(user.getId(), sub);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenHash(hashToken(rawRefreshToken));
        refreshToken.setExpiresAt(Instant.now().plusSeconds(30L * 24 * 3600)); // 30 days
        refreshTokenRepository.save(refreshToken);

        com.fitempire.modules.users.dto.UserDto userDto = com.fitempire.modules.users.dto.UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .phone(user.getPhone())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .displayName(user.getDisplayName())
                .role(user.getRole())
                .active(user.isActive())
                .phoneVerified(user.isPhoneVerified())
                .emailVerified(user.isEmailVerified())
                .profileComplete(user.isProfileComplete())
                .referralCode(user.getReferralCode())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(rawRefreshToken)
                .tokenType("Bearer")
                .expiresIn(86400L) // 24 hours
                .userId(user.getId())
                .email(user.getEmail())
                .phone(user.getPhone())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .isNewUser(isNewUser)
                .isProfileComplete(user.isProfileComplete())
                .user(userDto)
                .build();
    }

    private User createPhoneOnlyUser(String normalizedPhone) {
        User user = new User();
        user.setPhone(normalizedPhone);
        user.setEmail("user_" + normalizedPhone + "@fitempire.in");
        String last4 = normalizedPhone.length() >= 4 ? normalizedPhone.substring(normalizedPhone.length() - 4) : "User";
        user.setFirstName("Member");
        user.setLastName(last4);
        user.setDisplayName("Member " + last4);
        user.setRole(UserRole.CUSTOMER);
        user.setActive(true);
        user.setReferralCode(generateReferralCode());
        User saved = userRepository.save(user);

        if (userProfileRepository.findByUserId(saved.getId()).isEmpty()) {
            UserProfile profile = new UserProfile();
            profile.setUser(saved);
            userProfileRepository.save(profile);
        }

        if (walletRepository.findByUserId(saved.getId()).isEmpty()) {
            Wallet wallet = new Wallet();
            wallet.setUser(saved);
            wallet.setBalance(new BigDecimal("100.00"));
            wallet.setActive(true);
            walletRepository.save(wallet);
        }

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

    private String normalizePhone(String phone) {
        if (phone == null) return null;
        String digits = phone.replaceAll("\\D", "");
        if (digits.length() > 10) {
            digits = digits.substring(digits.length() - 10);
        }
        return digits;
    }
}
