package com.fitempire.modules.classes.entity;

import com.fitempire.common.entity.BaseEntity;
import com.fitempire.modules.users.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "class_waitlists")
@Getter
@Setter
@NoArgsConstructor
public class ClassWaitlist extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    private ClassSchedule schedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "queue_position", nullable = false)
    private int queuePosition;

    @Column(name = "notified", nullable = false)
    private boolean notified = false;
}
