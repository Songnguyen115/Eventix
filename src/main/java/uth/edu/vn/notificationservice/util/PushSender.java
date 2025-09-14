package uth.edu.vn.notificationservice.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import uth.edu.vn.notificationservice.dto.NotificationRequest;

@Component
@Slf4j
public class PushSender implements NotificationSender {

    @Override
    public String getChannel() {
        return "PUSH";
    }

    @Override
    @Async("notificationExecutor")
    public void send(NotificationRequest request) {
        log.info("Pretend to send Push Notification with message: {}", request.getMessage());
    }
}
