package uth.edu.vn.Eventix.Ticketing.Repository;

import uth.edu.vn.Eventix.Ticketing.Pojo.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
}