package com.fitempire.modules.gyms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "gym_photos")
@Getter
@Setter
@NoArgsConstructor
public class GymPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_branch_id", nullable = false)
    private GymBranch gymBranch;

    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "caption", length = 255)
    private String caption;

    @Column(name = "sort_order")
    private int sortOrder = 0;

    @Column(name = "is_primary")
    private boolean primary = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
