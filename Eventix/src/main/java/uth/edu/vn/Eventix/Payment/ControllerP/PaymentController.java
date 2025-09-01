package uth.edu.vn.Eventix.Payment.ControllerP;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import uth.edu.vn.Eventix.Payment.DtoP.PaymentRequest;
import uth.edu.vn.Eventix.Payment.DtoP.PaymentResponse;
import uth.edu.vn.Eventix.Payment.ServiceP.PaymentService;
import uth.edu.vn.Eventix.Payment.PojoP.Payment;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor

public class PaymentController {
    private final PaymentService paymentService;

   @PostMapping("/process")
public ResponseEntity<?> processPayment(@RequestBody PaymentRequest request) {
    try {
        PaymentResponse response = paymentService.processPayment(request);
        return ResponseEntity.ok(response);
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body("Error: " + e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Internal error: " + e.getMessage());
    }
}

    // Lấy tất cả payments
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // Lấy payment theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint để test callback từ MoMo (mô phỏng)
    @PostMapping("/return")
    public ResponseEntity<String> paymentReturn(@RequestParam String orderId, 
                                              @RequestParam String resultCode) {
        if ("0".equals(resultCode)) {
            return ResponseEntity.ok("Payment successful for order: " + orderId);
        } else {
            return ResponseEntity.ok("Payment failed for order: " + orderId);
        }
    }

    @PostMapping("/notify")
    public ResponseEntity<String> paymentNotify(@RequestBody String payload) {
        // Log payload để debug
        System.out.println("MoMo notify: " + payload);
        return ResponseEntity.ok("OK");
    }

}
