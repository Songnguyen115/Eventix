package uth.edu.vn.notificationservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uth.edu.vn.notificationservice.dto.NotificationRequest;
import uth.edu.vn.notificationservice.model.EventNotification;
import uth.edu.vn.notificationservice.repository.NotificationRepository;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;
    private final NotificationDispatcher dispatcher;

    public EventNotification createNotification(NotificationRequest req) {
        // Lưu DB
        EventNotification entity = EventNotification.builder()
                .channel(req.getChannel()) // channel là String
                .recipient(req.getEmail()) // hoặc req.getPhoneNumber() nếu là SMS
                .message(req.getMessage())
                .build();
        repository.save(entity);

        // Dispatch
        dispatcher.dispatch(req.getChannel(), req);

        return entity;
    }
}
