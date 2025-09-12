package uth.edu.vn.notificationservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import uth.edu.vn.notificationservice.dto.EventNotificationDTO;
import uth.edu.vn.notificationservice.model.EventNotification;
import uth.edu.vn.notificationservice.service.NotificationService;

@RestController
@RequestMapping("/notify")
public class NotificationController {

    @Autowired
    private NotificationService service;

    @PostMapping
    public EventNotification sendNotification(@RequestBody EventNotificationDTO dto) {
        return service.createNotification(dto.getMessage());
    }

    @GetMapping("/test")
    public String test() {
        return "Notification Service is running!";
    }
}
