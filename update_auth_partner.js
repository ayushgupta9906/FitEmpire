const fs = require('fs');
const path = require('path');

// 1. Update UserDto.java
const userDtoPath = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'users', 'dto', 'UserDto.java');
let userDtoContent = fs.readFileSync(userDtoPath, 'utf8');

if (!userDtoContent.includes('private UUID gymId;')) {
    userDtoContent = userDtoContent.replace(
        'private UserProfileDto profile;',
        'private UserProfileDto profile;\n    private UUID gymId;'
    );
    fs.writeFileSync(userDtoPath, userDtoContent);
    console.log("Updated UserDto.java");
}

// 2. Update AuthService.java
const authServicePath = path.join(__dirname, 'fitempire-backend', 'src', 'main', 'java', 'com', 'fitempire', 'modules', 'auth', 'service', 'AuthService.java');
let authServiceContent = fs.readFileSync(authServicePath, 'utf8');

if (!authServiceContent.includes('import com.fitempire.modules.gyms.repository.GymRepository;')) {
    authServiceContent = authServiceContent.replace(
        'import com.fitempire.modules.users.repository.UserRepository;',
        'import com.fitempire.modules.users.repository.UserRepository;\nimport com.fitempire.modules.gyms.repository.GymRepository;\nimport com.fitempire.modules.gyms.entity.Gym;\nimport java.util.List;'
    );
    authServiceContent = authServiceContent.replace(
        'private final UserRepository userRepository;',
        'private final UserRepository userRepository;\n    private final GymRepository gymRepository;'
    );
    fs.writeFileSync(authServicePath, authServiceContent);
    console.log("Updated AuthService.java imports and injection");
}

if (!authServiceContent.includes('if (user.getRole() == UserRole.PARTNER) {')) {
    const buildAuthResponseLogic = `
    private AuthResponse buildAuthResponse(User user, boolean isNewUser) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        // Save refresh token
        RefreshToken rt = new RefreshToken();
        rt.setUser(user);
        rt.setToken(refreshToken);
        rt.setExpiresAt(Instant.now().plus(jwtService.getRefreshTokenDuration()));
        refreshTokenRepository.save(rt);

        UserDto.UserDtoBuilder builder = UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .phone(user.getPhone())
                .phoneVerified(user.isPhoneVerified())
                .emailVerified(user.isEmailVerified())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .active(user.isActive())
                .referralCode(user.getReferralCode())
                .createdAt(user.getCreatedAt());

        if (user.getRole() == UserRole.PARTNER) {
            List<Gym> gyms = gymRepository.findByOwnerId(user.getId());
            if (!gyms.isEmpty()) {
                builder.gymId(gyms.get(0).getId());
            }
        }

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .isNewUser(isNewUser)
                .user(builder.build())
                .build();
    }
`;

    // Regex replace buildAuthResponse
    authServiceContent = authServiceContent.replace(
        /private AuthResponse buildAuthResponse\(User user, boolean isNewUser\) \{[\s\S]*?return AuthResponse\.builder\(\)[\s\S]*?\.build\(\);\n    \}/,
        buildAuthResponseLogic
    );
    fs.writeFileSync(authServicePath, authServiceContent);
    console.log("Updated buildAuthResponse in AuthService.java");
}
