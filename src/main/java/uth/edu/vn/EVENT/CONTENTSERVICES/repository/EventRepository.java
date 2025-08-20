package uth.edu.vn.EVENT.CONTENTSERVICES.repository;

import uth.edu.vn.EVENT.CONTENTSERVICES.model.event.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}