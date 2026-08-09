package com.fitempire.modules.auth.dto;

import com.fitempire.modules.users.dto.UserDto;
import com.fitempire.modules.users.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn;
    private UUID userId;
    private String email;
    private String phone;
    private String firstName;
    private String lastName;
    private UserRole role;
    private Boolean isNewUser;
    private Boolean isProfileComplete;
    private UserDto user;
}
