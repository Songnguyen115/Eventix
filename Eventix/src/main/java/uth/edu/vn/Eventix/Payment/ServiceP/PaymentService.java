package uth.edu.vn.Eventix.Payment.ServiceP;

import uth.edu.vn.Eventix.Payment.DtoP.PaymentRequest;
import uth.edu.vn.Eventix.Payment.DtoP.PaymentResponse;

public interface PaymentService {
    PaymentResponse processPayment(PaymentRequest request) throws Exception;
}
