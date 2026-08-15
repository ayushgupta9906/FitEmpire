package com.fitempire.modules.admin.dto;

import com.fitempire.modules.gyms.entity.GymCategory;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

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

    private String websiteUrl;

    private String gymEmail;

    private String gymPhone;

    private String gstNumber;

    // ── Gym Media ─────────────────────────────────────────────

    private String logoUrl;

    private String coverImageUrl;

    private List<String> galleryUrls;

    // ── Primary Branch Address ─────────────────────────────────

    @NotBlank(message = "Address is required")
    private String addressLine1;

    private String addressLine2;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    // ── Location Coordinates ───────────────────────────────────

    private BigDecimal latitude;

    private BigDecimal longitude;

    // ── Operating Hours & Days ────────────────────────────────

    /** Format: "HH:MM" e.g. "05:00" */
    private String openingTime;

    /** Format: "HH:MM" e.g. "22:00" */
    private String closingTime;

    /** e.g. ["MON","TUE","WED","THU","FRI","SAT","SUN"] */
    private List<String> workingDays;

    // ── Amenities ─────────────────────────────────────────────

    /** e.g. ["AC","PARKING","SHOWERS","LOCKERS","SAUNA","WIFI","STEAM","POOL"] */
    private List<String> amenities;

    // ── Gym Custom Monthly Pricing Model ─────────────────────

    /** Gym's own monthly membership price (e.g. ₹2000/month) */
    private BigDecimal gymMonthlyPrice;

    /** Auto-calculated per-session rate (e.g. ₹2000 / 30 = ₹66.67) */
    private BigDecimal perSessionRate;

    // ── Initial Membership Plans (partner-only, not public) ──

    /** Quick plans to create at registration time */
    private List<InitialPlanDto> initialPlans;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InitialPlanDto {
        private String name;
        private String description;
        private Double price;
        private Integer durationDays;
        private String planType; // DAY_PASS, MONTHLY, QUARTERLY, ANNUAL
    }
}
