package uth.edu.vn.Eventix.Payment.ControllerP;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uth.edu.vn.Eventix.Payment.PojoP.Payment;
import uth.edu.vn.Eventix.Payment.ServiceP.PaymentService;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor

public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<Payment> processPayment (
        @RequestParam Long ticketid,
        @RequestParam String method,
        @RequestParam Double amount
    )
    {
        return ResponseEntity.ok(paymentService.processPayment(ticketid, method, amount));
    }
}
