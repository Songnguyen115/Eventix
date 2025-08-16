package uth.edu.vn.Eventix.Ticketing.Service;

import uth.edu.vn.Eventix.Ticketing.Dto.TicketRequest;
import uth.edu.vn.Eventix.Ticketing.Dto.TicketResponse;

public interface TicketService {
    TicketResponse bookTicket(TicketRequest request) throws Exception;
}
