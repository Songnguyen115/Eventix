// ticketing/controller/TicketController.java
package uth.edu.vn.Eventix.Ticketing.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uth.edu.vn.Eventix.Ticketing.Dto.TicketRequest;
import uth.edu.vn.Eventix.Ticketing.Dto.TicketResponse;
import uth.edu.vn.Eventix.Ticketing.Service.TicketService;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {
  private final TicketService ticketService;

  @PostMapping("/book")
  public ResponseEntity<TicketResponse> book(@Valid @RequestBody TicketRequest request) throws Exception {
    return ResponseEntity.ok(ticketService.bookTicket(request));
  }
}
