package uth.edu.vn.notificationservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import uth.edu.vn.notificationservice.dto.NotificationRequest;
import uth.edu.vn.notificationservice.model.EventNotification;
import uth.edu.vn.notificationservice.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @PostMapping
    public ResponseEntity<EventNotification> sendNotification(@RequestBody @Valid NotificationRequest req) {
        EventNotification saved = service.createNotification(req);
        return ResponseEntity.accepted().body(saved);
    }

    @GetMapping("/test")
    public String test() {
        return "Notification Service is running!";
    }
}
