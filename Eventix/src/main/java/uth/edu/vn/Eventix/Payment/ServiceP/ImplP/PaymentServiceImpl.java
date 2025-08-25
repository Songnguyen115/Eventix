package uth.edu.vn.Eventix.Payment.ServiceP.ImplP;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import uth.edu.vn.Eventix.Payment.DtoP.PaymentRequest;
import uth.edu.vn.Eventix.Payment.DtoP.PaymentResponse;
import uth.edu.vn.Eventix.Payment.PojoP.Payment;
import uth.edu.vn.Eventix.Payment.PojoP.PaymentMethod;
import uth.edu.vn.Eventix.Payment.PojoP.PaymentStatus;
import uth.edu.vn.Eventix.Payment.RepositoryP.PaymentRepository;
import uth.edu.vn.Eventix.Ticketing.Pojo.Ticket;
import uth.edu.vn.Eventix.Ticketing.Repository.TicketRepository; // cần để lấy Ticket
import uth.edu.vn.Eventix.Payment.ServiceP.PaymentService;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor

public class PaymentServiceImpl implements PaymentService {
        private final PaymentRepository paymentRepository;
    private final TicketRepository ticketRepository;

    @Override
    public PaymentResponse processPayment(PaymentRequest request) throws Exception {
        // lấy ticket từ DB
        Long ticketId = request.getTicketId();
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));

        //   // kiểm tra còn slot không, test bên seminar
        // if (ticket.getRegisteredCount() >= ticket.getCapacity()) {
        //     throw new Exception("Sự kiện đã đủ người đăng ký");
        // }

        // build payment
        Payment payment = Payment.builder()
                .ticketId(ticket) // mapping đúng @OneToOne
                .method(PaymentMethod.valueOf(request.getMethod().toUpperCase())) // convert String -> Enum
                .amount(BigDecimal.valueOf(request.getAmount()))
                .status(PaymentStatus.SUCCESS) // giả lập thành công
                .transactionRef("TXN-" + System.currentTimeMillis()) // fake transaction ref
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

                Payment savedPayment = paymentRepository.save(payment);

                //bên seminar
                // ticket.setRegisteredCount(ticket.getRegisteredCount() + 1);
                // ticketRepository.save(ticket);

        // trả về response DTO
        return new PaymentResponse(
                savedPayment.getPaymentId(),
                savedPayment.getTicketId().getId(),
                savedPayment.getMethod().name(),
                savedPayment.getAmount(),
                savedPayment.getStatus().name(),
                savedPayment.getTransactionRef(),
                savedPayment.getCreatedAt()
        );
}

}