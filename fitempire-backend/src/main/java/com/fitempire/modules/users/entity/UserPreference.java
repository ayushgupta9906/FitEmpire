package com.fitempire.modules.users.entity;

import com.fitempire.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "user_preferences")
@Getter
@Setter
@NoArgsConstructor
public class UserPreference extends BaseEntity {

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "push_notifications_enabled", nullable = false)
    private boolean pushNotificationsEnabled = true;

    @Column(name = "sms_alerts_enabled", nullable = false)
    private boolean smsAlertsEnabled = false;

    @Column(name = "email_digest_enabled", nullable = false)
    private boolean emailDigestEnabled = true;

    @Column(name = "preferred_city", length = 64)
    private String preferredCity = "Delhi-NCR";
}
