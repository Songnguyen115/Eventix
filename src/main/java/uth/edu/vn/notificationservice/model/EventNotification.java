package uth.edu.vn.notificationservice.model;

import java.time.Instant;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private String channel; // EMAIL / SMS / PUSH / ALL
    private String recipient; // email or phone or token
    private String status; // PENDING, SENT, FAILED
    private Integer attempts;
    private String lastError;

    private Instant createdAt;
    private Instant sentAt;
}
