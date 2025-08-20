package uth.edu.vn.EVENT.CONTENTSERVICES.service;

import uth.edu.vn.EVENT.CONTENTSERVICES.model.event.Event;
import uth.edu.vn.EVENT.CONTENTSERVICES.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
    private final EventRepository repository;

    public EventService(EventRepository repository) {
        this.repository = repository;
    }

    public List<Event> getAllEvents() {
        return repository.findAll();
    }

    public Event createEvent(Event event) {
        return repository.save(event);
    }
}