package com.fitempire.modules.gyms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateGymRequest {

    @NotBlank(message = "Gym name is required")
    @Size(min = 3, max = 255, message = "Gym name must be between 3 and 255 characters")
    private String name;

    @Size(max = 5000, message = "Description cannot exceed 5000 characters")
    private String description;

    @Email(message = "Invalid email address")
    private String email;

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid mobile number")
    private String phone;

    @Pattern(regexp = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
            message = "Invalid GST number")
    private String gstNumber;

    @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", message = "Invalid PAN number")
    private String panNumber;

    private String websiteUrl;

    // Primary branch details
    @NotBlank(message = "Branch name is required")
    private String branchName;

    @NotBlank(message = "Address is required")
    private String addressLine1;

    private String addressLine2;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Invalid pincode")
    private String pincode;

    @DecimalMin(value = "-90.0") @DecimalMax(value = "90.0")
    private java.math.BigDecimal latitude;

    @DecimalMin(value = "-180.0") @DecimalMax(value = "180.0")
    private java.math.BigDecimal longitude;

    @Min(value = 1) @Max(value = 10000)
    private int capacity = 50;
}
