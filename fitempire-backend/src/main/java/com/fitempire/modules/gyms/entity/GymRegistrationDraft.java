package com.fitempire.modules.gyms.entity;

import com.fitempire.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.UUID;

@Entity
@Table(name = "gym_registration_drafts")
@Getter
@Setter
@NoArgsConstructor
public class GymRegistrationDraft extends BaseEntity {

    @Column(name = "owner_id", nullable = false)
    private UUID ownerId;

    @Column(name = "current_step", nullable = false)
    private int currentStep = 1;

    @Column(name = "is_submitted", nullable = false)
    private boolean submitted = false;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "draft_data", columnDefinition = "jsonb")
    private String draftData;
}