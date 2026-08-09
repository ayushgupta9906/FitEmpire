package com.fitempire.modules.auth.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OtpLoginRequest {

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9\\s\\-\\(\\)]{7,20}$", message = "Invalid mobile number")
    private String phone;

    private String purpose;
    private String deviceInfo;
    private String fcmToken;
}
