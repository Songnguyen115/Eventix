package uth.edu.vn.Eventix.Payment.ServiceP.ImplP;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uth.edu.vn.Eventix.Payment.PojoP.Payment;
import uth.edu.vn.Eventix.Payment.PojoP.PaymentMethod;
import uth.edu.vn.Eventix.Payment.PojoP.PaymentStatus;
import uth.edu.vn.Eventix.Payment.RepositoryP.PaymentRepository;
import uth.edu.vn.Eventix.Payment.ServiceP.PaymentService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of PaymentService interface
 */
@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public Payment createPayment(Payment payment) {
        payment.setCreatedAt(LocalDateTime.now());
        if (payment.getStatus() == null) {
            payment.setStatus(PaymentStatus.PENDING);
        }
        return paymentRepository.save(payment);
    }

    @Override
    public Payment updatePayment(Payment payment) {
        payment.setUpdatedAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Payment> findById(Long id) {
        return paymentRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payment> findAll() {
        return paymentRepository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        paymentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payment> findByStudentId(Long studentId) {
        return paymentRepository.findByStudentId(studentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payment> findByTicketId(Long ticketId) {
        return paymentRepository.findByTicketId(ticketId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payment> findByStatus(PaymentStatus status) {
        return paymentRepository.findByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Payment> findByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId);
    }

    @Override
    public Payment processPayment(Long ticketId, Long studentId, BigDecimal amount, PaymentMethod method) {
        Payment payment = new Payment(ticketId, studentId, amount, method);
        
        // Generate transaction ID
        String transactionId = generateTransactionId();
        payment.setTransactionId(transactionId);
        payment.setDescription("Payment for ticket " + ticketId);
        
        return createPayment(payment);
    }

    @Override
    public Payment confirmPayment(String transactionId) {
        Optional<Payment> paymentOpt = findByTransactionId(transactionId);
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setPaymentDate(LocalDateTime.now());
            return updatePayment(payment);
        }
        throw new RuntimeException("Payment not found with transaction ID: " + transactionId);
    }

    @Override
    public Payment cancelPayment(String transactionId) {
        Optional<Payment> paymentOpt = findByTransactionId(transactionId);
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            payment.setStatus(PaymentStatus.CANCELLED);
            return updatePayment(payment);
        }
        throw new RuntimeException("Payment not found with transaction ID: " + transactionId);
    }

    @Override
    public Payment refundPayment(String transactionId) {
        Optional<Payment> paymentOpt = findByTransactionId(transactionId);
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            if (payment.getStatus() == PaymentStatus.SUCCESS) {
                payment.setStatus(PaymentStatus.REFUNDED);
                return updatePayment(payment);
            }
            throw new RuntimeException("Can only refund successful payments");
        }
        throw new RuntimeException("Payment not found with transaction ID: " + transactionId);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getPaymentSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        Long totalPayments = getTotalPaymentCount();
        Long successfulPayments = getSuccessfulPaymentCount();
        BigDecimal totalAmount = getTotalSuccessfulAmount();
        
        summary.put("totalPayments", totalPayments != null ? totalPayments : 0L);
        summary.put("successfulPayments", successfulPayments != null ? successfulPayments : 0L);
        summary.put("totalAmount", totalAmount != null ? totalAmount.doubleValue() : 0.0);
        summary.put("message", "Real database API call successful!");
        summary.put("timestamp", LocalDateTime.now().toString());
        
        return summary;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getPaymentStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Basic counts
        stats.put("totalPayments", getTotalPaymentCount());
        stats.put("successfulPayments", getSuccessfulPaymentCount());
        stats.put("totalAmount", getTotalSuccessfulAmount());
        
        // Status breakdown
        Map<String, Long> statusBreakdown = new HashMap<>();
        for (PaymentStatus status : PaymentStatus.values()) {
            Long count = paymentRepository.countByStatus(status);
            statusBreakdown.put(status.name(), count != null ? count : 0L);
        }
        stats.put("statusBreakdown", statusBreakdown);
        
        // Method breakdown
        stats.put("methodBreakdown", getPaymentCountByMethod());
        
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payment> getRecentPayments() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return paymentRepository.findRecentPayments(thirtyDaysAgo);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isPaymentValid(Payment payment) {
        return payment != null 
            && payment.getAmount() != null 
            && payment.getAmount().compareTo(BigDecimal.ZERO) > 0
            && payment.getTicketId() != null
            && payment.getStudentId() != null
            && payment.getPaymentMethod() != null;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasSuccessfulPaymentForTicket(Long ticketId) {
        return paymentRepository.existsByTicketIdAndStatus(ticketId, PaymentStatus.SUCCESS);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getTotalPaymentCount() {
        return paymentRepository.getTotalPaymentCount();
    }

    @Override
    @Transactional(readOnly = true)
    public Long getSuccessfulPaymentCount() {
        return paymentRepository.getSuccessfulPaymentCount();
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTotalSuccessfulAmount() {
        BigDecimal amount = paymentRepository.getTotalSuccessfulAmount();
        return amount != null ? amount : BigDecimal.ZERO;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<PaymentMethod, Long> getPaymentCountByMethod() {
        List<Object[]> results = paymentRepository.getPaymentStatsByMethod();
        return results.stream()
                .collect(Collectors.toMap(
                    result -> (PaymentMethod) result[0],
                    result -> (Long) result[1],
                    (existing, replacement) -> existing
                ));
    }

    private String generateTransactionId() {
        return "TXN_" + System.currentTimeMillis() + "_" + 
               UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
