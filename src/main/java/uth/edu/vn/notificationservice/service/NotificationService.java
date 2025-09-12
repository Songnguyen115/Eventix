package uth.edu.vn.notificationservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uth.edu.vn.notificationservice.exception.NotificationException;
import uth.edu.vn.notificationservice.model.EventNotification;
import uth.edu.vn.notificationservice.repository.NotificationRepository;
import uth.edu.vn.notificationservice.util.NotificationSender;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repository;

    @Autowired
    private NotificationSender sender;

    public EventNotification createNotification(String message) {
        if (message == null || message.isEmpty()) {
            throw new NotificationException("Message cannot be empty");
        }

        EventNotification notification = EventNotification.builder()
                .message(message)
                .build();

        EventNotification saved = repository.save(notification);

        // Gửi notification
        sender.send(message);

        return saved;
    }
}
