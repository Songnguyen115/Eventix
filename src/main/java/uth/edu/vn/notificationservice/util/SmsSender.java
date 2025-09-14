package uth.edu.vn.notificationservice.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import uth.edu.vn.notificationservice.dto.NotificationRequest;

@Component
@Slf4j
public class SmsSender implements NotificationSender {

    @Override
    public String getChannel() {
        return "SMS";
    }

    @Override
    @Async("notificationExecutor")
    public void send(NotificationRequest request) {
        if (request.getPhone() == null || request.getPhone().isBlank()) {
            throw new IllegalArgumentException("No phone number");
        }
        log.info("Pretend to send SMS to {} with message: {}", request.getPhone(), request.getMessage());
    }
}
