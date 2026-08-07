package com.fitempire.modules.admin.dto;

import com.fitempire.modules.gyms.entity.GymCategory;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterPartnerDto {

    // ── Partner User Credentials ───────────────────────────────

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "First name is required")
    private String firstName;

    private String lastName;

    @NotBlank(message = "Phone number is required")
    private String phone;

    // ── Gym & Center Details ───────────────────────────────────

    @NotBlank(message = "Gym name is required")
    private String gymName;

    private GymCategory category;

    private String description;

    // ── Primary Branch Address ─────────────────────────────────

    @NotBlank(message = "Address is required")
    private String addressLine1;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pincode is required")
    private String pincode;
}
