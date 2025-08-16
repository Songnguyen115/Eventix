package uth.edu.vn.Eventix.Payment.ServiceP;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uth.edu.vn.Eventix.Payment.PojoP.Payment;
import uth.edu.vn.Eventix.Payment.RepositoryP.PaymentRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor

public class PaymentService {
    private final PaymentRepository paymentRepository;

    public Payment processPayment(Long ticketId,String method,Double amount)
    {
        Payment payment = Payment.builder()
                .ticketId(ticketId)
                .paymentMethod(method)
                .amount(amount)
                .paymentDate(LocalDateTime.now())
                .success(true) // giả lập thành công
                .build();
        return paymentRepository.save(payment);
    }
}
