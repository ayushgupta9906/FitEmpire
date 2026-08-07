package com.fitempire.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartnerRegistrationResultDto {
    private UUID partnerId;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String role;
    
    private UUID gymId;
    private String gymName;
    private String gymSlug;
    private String category;
    private String status;
    private String city;
}
