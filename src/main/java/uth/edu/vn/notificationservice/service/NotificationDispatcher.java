package uth.edu.vn.notificationservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uth.edu.vn.notificationservice.dto.NotificationRequest;
import uth.edu.vn.notificationservice.util.NotificationSender;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationDispatcher {

    private final List<NotificationSender> senders;

    public void dispatch(String channel, NotificationRequest request) {
        senders.stream()
                .filter(s -> s.getChannel().equalsIgnoreCase(channel))
                .forEach(s -> s.send(request));
    }
}
