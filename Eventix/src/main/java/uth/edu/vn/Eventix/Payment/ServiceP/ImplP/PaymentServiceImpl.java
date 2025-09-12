package uth.edu.vn.Eventix.Payment.ServiceP.ImplP;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uth.edu.vn.Eventix.Payment.DtoP.PaymentRequest;
import uth.edu.vn.Eventix.Payment.DtoP.PaymentResponse;
import uth.edu.vn.Eventix.Payment.PojoP.Payment;
import uth.edu.vn.Eventix.Payment.PojoP.PaymentMethod;
import uth.edu.vn.Eventix.Payment.PojoP.PaymentStatus;
import uth.edu.vn.Eventix.Payment.RepositoryP.PaymentRepository;
import uth.edu.vn.Eventix.Payment.ServiceP.PaymentService;
import uth.edu.vn.Eventix.Ticketing.Pojo.Ticket;
import uth.edu.vn.Eventix.Ticketing.Repository.TicketRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final TicketRepository ticketRepository;

    // =====================
    // Xử lý thanh toán
    // =====================
    @Override
    public PaymentResponse processPayment(PaymentRequest request) throws Exception {
        // Kiểm tra vé có tồn tại không
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new Exception("Ticket not found with ID: " + request.getTicketId()));

        // Tạo đối tượng Payment mới
        Payment payment = Payment.builder()
                .ticket(ticket)
                .method(PaymentMethod.valueOf(request.getMethod().toUpperCase()))
                .amount(request.getAmount())
                .status(PaymentStatus.PENDING)
                .transactionRef("TXN-" + System.currentTimeMillis()) // sinh mã giao dịch giả
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Lưu vào DB
        Payment saved = paymentRepository.save(payment);

        // Trả về DTO
        return new PaymentResponse(
                saved.getPaymentId(),
                saved.getTicket().getTicketId(),
                saved.getMethod().name(),
                saved.getAmount(),
                saved.getStatus().name(),
                saved.getTransactionRef(),
                saved.getCreatedAt(),
                null // QR code URL có thể generate sau
        );
    }

    // =====================
    // Lấy tất cả payments
    // =====================
@Override
public List<Payment> getAllPayments() {
    return paymentRepository.findAll();
}

@Override
public Optional<Payment> getPaymentById(Long id) {
    return paymentRepository.findById(id);
    }

}
