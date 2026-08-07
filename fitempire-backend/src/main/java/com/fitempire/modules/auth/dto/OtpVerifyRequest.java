package com.fitempire.modules.auth.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OtpVerifyRequest {

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(\\+91)?[6-9]\\d{9}$", message = "Invalid Indian mobile number")
    private String phone;

    @NotBlank(message = "OTP is required")
    @Size(min = 6, max = 6, message = "OTP must be exactly 6 digits")
    @Pattern(regexp = "^\\d{6}$", message = "OTP must contain only digits")
    private String otp;

    private String purpose;
    private String fcmToken;
}
