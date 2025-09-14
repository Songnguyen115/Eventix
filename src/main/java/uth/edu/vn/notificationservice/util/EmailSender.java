package uth.edu.vn.notificationservice.util;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import uth.edu.vn.notificationservice.dto.NotificationRequest;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailSender implements NotificationSender {

    private final JavaMailSender mailSender;

    @Override
    public String getChannel() {
        return "EMAIL";
    }

    @Override
    @Async("notificationExecutor")
    @Retryable(value = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 2000))
    public void send(NotificationRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("No recipient email provided");
        }

        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, "UTF-8");
            helper.setTo(request.getEmail());
            helper.setSubject("Notification from Eventix");
            helper.setText(request.getMessage(), true);
            mailSender.send(mime);
            log.info("Email sent to {}", request.getEmail());
        } catch (Exception e) {
            log.error("Failed to send email", e);
        }
    }

}