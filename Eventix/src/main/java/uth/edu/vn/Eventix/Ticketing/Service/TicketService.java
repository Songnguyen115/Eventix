package uth.edu.vn.Eventix.Ticketing.Service;

import uth.edu.vn.Eventix.Ticketing.Dto.TicketRequest;
import uth.edu.vn.Eventix.Ticketing.Dto.TicketResponse;
import uth.edu.vn.Eventix.Ticketing.Pojo.Ticket;

import java.util.List;
import java.util.Optional;

public interface TicketService {
    TicketResponse bookTicket(TicketRequest request) throws Exception;
    Optional<Ticket> getTicketById(Long id);
    List<Ticket> getAllTickets();
    // TicketResponse updateTicket(Long ticketId, TicketRequest request) throws Exception;
}
