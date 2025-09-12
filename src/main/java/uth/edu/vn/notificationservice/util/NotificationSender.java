package uth.edu.vn.notificationservice.util;

import org.springframework.stereotype.Component;

@Component
public class NotificationSender {

    // Dummy sender, ghi log ra console
    public void send(String message) {
        System.out.println("[NotificationSender] Sending notification: " + message);
        // Nếu muốn, có thể kết nối RabbitMQ, Kafka sau
    }
}
