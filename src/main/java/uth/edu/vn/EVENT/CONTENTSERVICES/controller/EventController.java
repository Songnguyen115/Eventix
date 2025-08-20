package uth.edu.vn.EVENT.CONTENTSERVICES.controller;

import uth.edu.vn.EVENT.CONTENTSERVICES.model.event.Event;
import uth.edu.vn.EVENT.CONTENTSERVICES.service.EventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    private final EventService service;

    public EventController(EventService service) {
        this.service = service;
    }

    @GetMapping
    public List<Event> getEvents() {
        return service.getAllEvents();
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return service.createEvent(event);
    }
}