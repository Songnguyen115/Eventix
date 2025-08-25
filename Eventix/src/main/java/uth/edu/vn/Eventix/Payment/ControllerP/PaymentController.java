package uth.edu.vn.Eventix.Payment.ControllerP;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import uth.edu.vn.Eventix.Payment.DtoP.PaymentRequest;
import uth.edu.vn.Eventix.Payment.DtoP.PaymentResponse;
import uth.edu.vn.Eventix.Payment.ServiceP.PaymentService;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor

public class PaymentController {
    private final PaymentService paymentService;

   @PostMapping("/process")
public ResponseEntity<PaymentResponse> processPayment(@RequestBody PaymentRequest request) throws Exception {
    return ResponseEntity.ok(paymentService.processPayment(request));
}

}
