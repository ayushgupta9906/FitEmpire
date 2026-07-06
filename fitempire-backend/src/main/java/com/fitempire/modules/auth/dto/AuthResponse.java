package com.fitempire.modules.auth.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private long expiresIn;
    private UUID userId;
    private String email;
    private String firstName;
    private String role;
    private boolean profileComplete;
    private boolean newUser;
}
