package uth.edu.vn.Eventix.Payment.ServiceP.ImplP;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uth.edu.vn.Eventix.Payment.PojoP.Payment;
import uth.edu.vn.Eventix.Payment.PojoP.PaymentMethod;
import uth.edu.vn.Eventix.Payment.PojoP.PaymentStatus;
import uth.edu.vn.Eventix.Payment.RepositoryP.PaymentRepository;
import uth.edu.vn.Eventix.Ticketing.Pojo.Ticket;
import uth.edu.vn.Eventix.Ticketing.Repository.TicketRepository; // cần để lấy Ticket

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor

public class PaymentServiceImpl {
      private final PaymentRepository paymentRepository;
    private final TicketRepository ticketRepository;

    public Payment processPayment(Long ticketId, String method, Double amount) {
        // lấy ticket từ DB
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));

        //   // kiểm tra còn slot không
        // if (ticket.getRegisteredCount() >= ticket.getCapacity()) {
        //     throw new Exception("Sự kiện đã đủ người đăng ký");
        // }

        // build payment
        Payment payment = Payment.builder()
                .ticketId(ticket) // mapping đúng @OneToOne
                .method(PaymentMethod.valueOf(method.toUpperCase())) // convert String -> Enum
                .amount(BigDecimal.valueOf(amount))
                .status(PaymentStatus.SUCCESS) // giả lập thành công
                .transactionRef("TXN-" + System.currentTimeMillis()) // fake transaction ref
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return paymentRepository.save(payment);
}
}