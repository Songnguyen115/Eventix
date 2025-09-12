package uth.edu.vn.notificationservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uth.edu.vn.notificationservice.model.EventNotification;

public interface NotificationRepository extends JpaRepository<EventNotification, Long> {
}
