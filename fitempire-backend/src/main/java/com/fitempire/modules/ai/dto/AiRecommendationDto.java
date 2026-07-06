package com.fitempire.modules.ai.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class AiRecommendationDto {
    private UUID id;
    private UUID userId;
    private String type;
    private String content; // JSON content
    private String modelVersion;
    private String feedback;
    private boolean dismissed;
    private Instant createdAt;
}
