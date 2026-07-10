package com.fitempire.modules.users.dto;

import com.fitempire.modules.users.entity.FitnessGoal;
import com.fitempire.modules.users.entity.UserRole;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class UserDto {
    private UUID id;
    private String email;
    private String phone;
    private boolean phoneVerified;
    private boolean emailVerified;
    private String firstName;
    private String lastName;
    private String displayName;
    private String profilePictureUrl;
    private UserRole role;
    private boolean active;
    private boolean profileComplete;
    private String referralCode;
    private Instant lastLoginAt;
    private Instant createdAt;
    private UserProfileDto profile;
    private UUID gymId;
}
