package com.fitempire.modules.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
