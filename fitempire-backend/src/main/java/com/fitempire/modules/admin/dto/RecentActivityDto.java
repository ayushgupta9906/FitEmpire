package com.fitempire.modules.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class RecentActivityDto {
    private String id;
    private String type;
    private String message;
    private Instant timestamp;
}
