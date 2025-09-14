package uth.edu.vn.Eventix.Payment.ControllerP;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uth.edu.vn.Eventix.Payment.PojoP.Payment;
import uth.edu.vn.Eventix.Payment.PojoP.PaymentMethod;
import uth.edu.vn.Eventix.Payment.PojoP.PaymentStatus;
import uth.edu.vn.Eventix.Payment.ServiceP.PaymentService;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentApiController {

    @Autowired
    private PaymentService paymentService;

    /**
     * GET /api/payments - Get all payments from database
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllPayments() {
        List<Payment> payments = paymentService.findAll();
        
        List<Map<String, Object>> paymentMaps = payments.stream()
                .map(this::convertPaymentToMap)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(paymentMaps);
    }

    /**
     * GET /api/payments/summary - Get payment summary from database
     */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getPaymentSummary() {
        Map<String, Object> summary = paymentService.getPaymentSummary();
        return ResponseEntity.ok(summary);
    }

    /**
     * GET /api/payments/statistics - Get detailed payment statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getPaymentStatistics() {
        Map<String, Object> stats = paymentService.getPaymentStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/payments/recent - Get recent payments (last 30 days)
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Map<String, Object>>> getRecentPayments() {
        List<Payment> recentPayments = paymentService.getRecentPayments();
        
        List<Map<String, Object>> paymentMaps = recentPayments.stream()
                .map(this::convertPaymentToMap)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(paymentMaps);
    }

    /**
     * GET /api/payments/{id} - Get payment by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPaymentById(@PathVariable Long id) {
        return paymentService.findById(id)
                .map(payment -> ResponseEntity.ok(convertPaymentToMap(payment)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/payments - Create new payment
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            Payment payment = new Payment();
            payment.setTicketId(Long.valueOf(paymentData.get("ticketId").toString()));
            payment.setStudentId(Long.valueOf(paymentData.get("studentId").toString()));
            payment.setAmount(new BigDecimal(paymentData.get("amount").toString()));
            payment.setPaymentMethod(PaymentMethod.valueOf(paymentData.get("paymentMethod").toString()));
            payment.setDescription(paymentData.getOrDefault("description", "").toString());
            
            Payment savedPayment = paymentService.createPayment(payment);
            return ResponseEntity.ok(convertPaymentToMap(savedPayment));
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to create payment: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * PUT /api/payments/{transactionId}/confirm - Confirm payment
     */
    @PutMapping("/{transactionId}/confirm")
    public ResponseEntity<Map<String, Object>> confirmPayment(@PathVariable String transactionId) {
        try {
            Payment confirmedPayment = paymentService.confirmPayment(transactionId);
            return ResponseEntity.ok(convertPaymentToMap(confirmedPayment));
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * GET /api/payments/qr/{ticketId} - Get QR code info for checkin
     */
    @GetMapping("/qr/{ticketId}")
    public ResponseEntity<Map<String, Object>> getQRCodeInfo(@PathVariable Long ticketId) {
        try {
            // Find payment by ticket ID
            List<Payment> payments = paymentService.findByTicketId(ticketId);
            
            if (payments.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "No payment found for ticket ID: " + ticketId);
                error.put("ticketId", ticketId);
                return ResponseEntity.notFound().build();
            }
            
            // Get the most recent payment for this ticket
            Payment payment = payments.get(0);
            
            Map<String, Object> qrInfo = new HashMap<>();
            qrInfo.put("ticketId", ticketId);
            qrInfo.put("studentId", payment.getStudentId());
            qrInfo.put("amount", payment.getAmount());
            qrInfo.put("paymentMethod", payment.getPaymentMethod().name());
            qrInfo.put("status", payment.getStatus().name());
            qrInfo.put("transactionId", payment.getTransactionId());
            qrInfo.put("paymentDate", payment.getPaymentDate());
            qrInfo.put("description", payment.getDescription());
            qrInfo.put("qrCode", generateQRCodeData(ticketId, payment.getStudentId(), payment.getTransactionId()));
            qrInfo.put("checkinEligible", payment.getStatus() == PaymentStatus.SUCCESS);
            qrInfo.put("message", "QR code data retrieved successfully");
            
            return ResponseEntity.ok(qrInfo);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to get QR code info: " + e.getMessage());
            error.put("ticketId", ticketId);
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * GET /api/payments/verify/{transactionId} - Verify payment for checkin
     */
    @GetMapping("/verify/{transactionId}")
    public ResponseEntity<Map<String, Object>> verifyPayment(@PathVariable String transactionId) {
        try {
            Optional<Payment> paymentOpt = paymentService.findByTransactionId(transactionId);
            
            if (!paymentOpt.isPresent()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Payment not found");
                error.put("transactionId", transactionId);
                error.put("valid", false);
                return ResponseEntity.notFound().build();
            }
            
            Payment payment = paymentOpt.get();
            
            Map<String, Object> verification = new HashMap<>();
            verification.put("transactionId", transactionId);
            verification.put("ticketId", payment.getTicketId());
            verification.put("studentId", payment.getStudentId());
            verification.put("status", payment.getStatus().name());
            verification.put("valid", payment.getStatus() == PaymentStatus.SUCCESS);
            verification.put("amount", payment.getAmount());
            verification.put("paymentMethod", payment.getPaymentMethod().name());
            verification.put("checkinAllowed", payment.getStatus() == PaymentStatus.SUCCESS);
            verification.put("message", payment.getStatus() == PaymentStatus.SUCCESS ? 
                "Payment verified - Checkin allowed" : "Payment not successful - Checkin denied");
            
            return ResponseEntity.ok(verification);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to verify payment: " + e.getMessage());
            error.put("transactionId", transactionId);
            error.put("valid", false);
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * GET /api/payments/health - Health check
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Payment Service is running! Real database ready 🚀");
    }

    /**
     * Helper method to convert Payment entity to Map for JSON response
     */
    private Map<String, Object> convertPaymentToMap(Payment payment) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", payment.getId());
        map.put("ticketId", payment.getTicketId());
        map.put("studentId", payment.getStudentId());
        map.put("amount", payment.getAmount());
        map.put("paymentMethod", payment.getPaymentMethod().name());
        map.put("status", payment.getStatus().name());
        map.put("transactionId", payment.getTransactionId());
        map.put("paymentDate", payment.getPaymentDate());
        map.put("createdAt", payment.getCreatedAt());
        map.put("description", payment.getDescription());
        return map;
    }

    /**
     * Helper method to generate QR code data
     */
    private String generateQRCodeData(Long ticketId, Long studentId, String transactionId) {
        // Generate QR code data in format: TICKET_ID|STUDENT_ID|TRANSACTION_ID|TIMESTAMP
        long timestamp = System.currentTimeMillis();
        return String.format("TICKET_%d_%d_%s_%d", ticketId, studentId, transactionId, timestamp);
    }
}
