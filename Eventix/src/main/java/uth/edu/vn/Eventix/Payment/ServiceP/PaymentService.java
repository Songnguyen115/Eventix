package uth.edu.vn.Eventix.Payment.ServiceP;

import uth.edu.vn.Eventix.Payment.DtoP.PaymentRequest;
import uth.edu.vn.Eventix.Payment.DtoP.PaymentResponse;
import uth.edu.vn.Eventix.Payment.PojoP.Payment;

import java.util.List;
import java.util.Optional;

public interface PaymentService {
    PaymentResponse processPayment(PaymentRequest request) throws Exception;
    List<Payment> getAllPayments();
    Optional<Payment> getPaymentById(Long id);
}
