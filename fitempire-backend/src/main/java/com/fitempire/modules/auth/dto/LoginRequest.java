package com.fitempire.modules.auth.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private String deviceInfo;
    private String fcmToken;
}
