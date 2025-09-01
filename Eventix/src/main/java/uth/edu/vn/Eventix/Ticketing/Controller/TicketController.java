package uth.edu.vn.Eventix.Ticketing.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uth.edu.vn.Eventix.Ticketing.Dto.TicketRequest;
import uth.edu.vn.Eventix.Ticketing.Dto.TicketResponse;
import uth.edu.vn.Eventix.Ticketing.Service.TicketService;
import uth.edu.vn.Eventix.Ticketing.Pojo.Ticket;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // Tạo vé mới
    @PostMapping
    public ResponseEntity<TicketResponse> bookTicket(@RequestBody TicketRequest request) throws Exception {
        return ResponseEntity.ok(ticketService.bookTicket(request));
    }

    // Lấy thông tin vé theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Lấy tất cả vé
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

}
