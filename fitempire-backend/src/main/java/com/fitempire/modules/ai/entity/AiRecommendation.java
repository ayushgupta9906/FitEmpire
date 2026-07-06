package com.fitempire.modules.ai.entity;

import com.fitempire.modules.users.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ai_recommendations")
@Getter
@Setter
@NoArgsConstructor
public class AiRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "type", nullable = false, length = 50)
    private String type; // e.g. WORKOUT, NUTRITION

    @Column(name = "content", nullable = false, columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String content; // JSON payload of recommendation

    @Column(name = "model_version", length = 50)
    private String modelVersion;

    @Column(name = "feedback", length = 50)
    private String feedback; // e.g. HELPFUL, NOT_HELPFUL

    @Column(name = "is_dismissed")
    private boolean dismissed = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
