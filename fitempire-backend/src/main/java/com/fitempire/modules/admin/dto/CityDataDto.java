package com.fitempire.modules.admin.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CityDataDto {
    private String city;
    private long users;
    private long gyms;
}
