package com.fitempire.modules.gyms.dto;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class GymPhotoDto {
    private UUID id;
    private String url;
    private String thumbnailUrl;
    private String caption;
    private int sortOrder;
    private boolean primary;
}
