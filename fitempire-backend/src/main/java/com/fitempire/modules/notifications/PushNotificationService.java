package com.fitempire.modules.notifications;

import java.util.Map;
import java.util.UUID;

public interface PushNotificationService {
    void sendNotificationToUser(UUID userId, String title, String body, Map<String, String> data);
    void sendTopicNotification(String topic, String title, String body);
    void broadcastTurnstileAlert(UUID branchId, String message);
}
