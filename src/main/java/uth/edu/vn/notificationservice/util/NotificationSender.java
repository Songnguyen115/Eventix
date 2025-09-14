package uth.edu.vn.notificationservice.util;

import uth.edu.vn.notificationservice.dto.NotificationRequest;

public interface NotificationSender {
    String getChannel();

    void send(NotificationRequest request);
}
