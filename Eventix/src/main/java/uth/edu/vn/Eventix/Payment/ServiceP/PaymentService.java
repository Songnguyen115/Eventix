package uth.edu.vn.Eventix.Payment.ServiceP;

import uth.edu.vn.Eventix.Payment.PojoP.Payment;
import uth.edu.vn.Eventix.Payment.PojoP.PaymentStatus;
import uth.edu.vn.Eventix.Payment.PojoP.PaymentMethod;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service interface for Payment operations
 */
public interface PaymentService {

    // Basic CRUD operations
    Payment createPayment(Payment payment);
    Payment updatePayment(Payment payment);
    Optional<Payment> findById(Long id);
    List<Payment> findAll();
    void deleteById(Long id);

    // Business logic methods
    List<Payment> findByStudentId(Long studentId);
    List<Payment> findByTicketId(Long ticketId);
    List<Payment> findByStatus(PaymentStatus status);
    Optional<Payment> findByTransactionId(String transactionId);

    // Payment processing
    Payment processPayment(Long ticketId, Long studentId, BigDecimal amount, PaymentMethod method);
    Payment confirmPayment(String transactionId);
    Payment cancelPayment(String transactionId);
    Payment refundPayment(String transactionId);

    // Statistics and reporting
    Map<String, Object> getPaymentSummary();
    Map<String, Object> getPaymentStatistics();
    List<Payment> getRecentPayments();
    
    // Validation methods
    boolean isPaymentValid(Payment payment);
    boolean hasSuccessfulPaymentForTicket(Long ticketId);
    
    // Summary methods for API
    Long getTotalPaymentCount();
    Long getSuccessfulPaymentCount();
    BigDecimal getTotalSuccessfulAmount();
    Map<PaymentMethod, Long> getPaymentCountByMethod();
}
