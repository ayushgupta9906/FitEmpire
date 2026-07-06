package com.fitempire.modules.auth.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class OtpLoginRequest {

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian mobile number")
    private String phone;

    private String deviceInfo;
    private String fcmToken;
}
