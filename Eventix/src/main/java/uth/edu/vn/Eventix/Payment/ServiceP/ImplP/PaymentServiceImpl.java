package uth.edu.vn.Eventix.Payment.ServiceP.ImplP;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import uth.edu.vn.Eventix.Payment.ConfigP.PaymentConfig;
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
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final TicketRepository ticketRepository;
    private final PaymentConfig paymentConfig;

        public void printConfig() {
        System.out.println("Partner Code: " + paymentConfig.getPartnerCode());
        System.out.println("Endpoint: " + paymentConfig.getEndpoint());
    }

    @Override
    public PaymentResponse processPayment(PaymentRequest request) throws Exception {
        // lấy ticket từ DB
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + request.getTicketId()));

        //   // kiểm tra còn slot không, test bên seminar
        // if (ticket.getRegisteredCount() >= ticket.getCapacity()) {
        //     throw new Exception("Sự kiện đã đủ người đăng ký");
        // }

        // build payment
        Payment payment = Payment.builder()
                .ticket(ticket)// mapping đúng @OneToOne
                .method(PaymentMethod.valueOf(request.getMethod().toUpperCase())) // convert String -> Enum
                .amount(request.getAmount())
                .status(PaymentStatus.SUCCESS) // mặc định thành công (cho CASH)
                .transactionRef("TXN-" + System.currentTimeMillis()) // fake transaction ref
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // xử lý call API MoMo
        if ("MOMO".equalsIgnoreCase(request.getMethod())) {
            try {
                RestTemplate restTemplate = new RestTemplate();

                 Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("partnerCode", paymentConfig.getPartnerCode());
                requestBody.put("accessKey", paymentConfig.getAccessKey());
                requestBody.put("requestId", UUID.randomUUID().toString());
                requestBody.put("amount", payment.getAmount().toString());
                requestBody.put("orderId", UUID.randomUUID().toString());
                requestBody.put("orderInfo", "Thanh toan ticket " + request.getTicketId());
                requestBody.put("returnUrl", paymentConfig.getReturnUrl());
                requestBody.put("notifyUrl", paymentConfig.getNotifyUrl());
                requestBody.put("extraData", "");

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

                ResponseEntity<Map> response = restTemplate.postForEntity(paymentConfig.getEndpoint(), entity, Map.class);

                String qrUrl = (String) response.getBody().get("payUrl");

                payment.setStatus(PaymentStatus.PENDING); // chờ thanh toán
                Payment savedPayment = paymentRepository.save(payment);

                // trả về response DTO
                return new PaymentResponse(
                        savedPayment.getPaymentId(),
                        savedPayment.getTicket().getTicketId(),   
                        savedPayment.getMethod().name(),
                        savedPayment.getAmount(),
                        savedPayment.getStatus().name(),
                        savedPayment.getTransactionRef(),
                        savedPayment.getCreatedAt(),
                        qrUrl // URL trả về từ MoMo
                );
            } catch (Exception e) {
                return new PaymentResponse(
                        null,
                        request.getTicketId(), // Sửa ở đây
                        "MOMO",
                        BigDecimal.ZERO,
                        "ERROR",
                        null,
                        LocalDateTime.now(),
                        null
                );
            }
        }

        // giữ logic cũ cho CASH hoặc phương thức khác
        payment.setStatus(PaymentStatus.SUCCESS);
        Payment savedPayment = paymentRepository.save(payment);

        return new PaymentResponse(
        savedPayment.getPaymentId(),
        savedPayment.getTicket().getTicketId(),  // sửa ở đây
        savedPayment.getMethod().name(),
        savedPayment.getAmount(),
        savedPayment.getStatus().name(),
        savedPayment.getTransactionRef(),
        savedPayment.getCreatedAt(),
        null
);

    }
}
