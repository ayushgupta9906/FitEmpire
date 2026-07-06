package com.fitempire.modules.gyms.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class GymBranchDto {
    private UUID id;
    private UUID gymId;
    private String name;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String phone;
    private String email;
    private boolean primary;
    private boolean active;
    private int capacity;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private String[] amenities;
    private String[] workingDays;
    private List<GymPhotoDto> photos;
    private Double distanceKm; // populated for nearby searches
}
