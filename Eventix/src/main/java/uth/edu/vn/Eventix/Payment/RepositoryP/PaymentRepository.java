package uth.edu.vn.Eventix.Payment.RepositoryP;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uth.edu.vn.Eventix.Payment.PojoP.Payment;
import uth.edu.vn.Eventix.Payment.PojoP.PaymentStatus;
import uth.edu.vn.Eventix.Payment.PojoP.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Payment entity operations
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Find payments by student ID
    List<Payment> findByStudentId(Long studentId);

    // Find payments by ticket ID
    List<Payment> findByTicketId(Long ticketId);

    // Find payments by status
    List<Payment> findByStatus(PaymentStatus status);

    // Find payments by payment method
    List<Payment> findByPaymentMethod(PaymentMethod paymentMethod);

    // Find payment by transaction ID
    Optional<Payment> findByTransactionId(String transactionId);

    // Find payments by student and status
    List<Payment> findByStudentIdAndStatus(Long studentId, PaymentStatus status);

    // Find payments within date range
    @Query("SELECT p FROM Payment p WHERE p.paymentDate BETWEEN :startDate AND :endDate")
    List<Payment> findPaymentsBetweenDates(@Param("startDate") LocalDateTime startDate, 
                                         @Param("endDate") LocalDateTime endDate);

    // Get payment summary statistics
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status")
    Long countByStatus(@Param("status") PaymentStatus status);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status")
    BigDecimal sumAmountByStatus(@Param("status") PaymentStatus status);

    @Query("SELECT COUNT(p) FROM Payment p")
    Long getTotalPaymentCount();

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCESS'")
    BigDecimal getTotalSuccessfulAmount();

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'SUCCESS'")
    Long getSuccessfulPaymentCount();

    // Find recent payments (last 30 days)
    @Query("SELECT p FROM Payment p WHERE p.paymentDate >= :thirtyDaysAgo ORDER BY p.paymentDate DESC")
    List<Payment> findRecentPayments(@Param("thirtyDaysAgo") LocalDateTime thirtyDaysAgo);

    // Check if payment exists for ticket
    boolean existsByTicketIdAndStatus(Long ticketId, PaymentStatus status);

    // Get payments grouped by method
    @Query("SELECT p.paymentMethod, COUNT(p), SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCESS' GROUP BY p.paymentMethod")
    List<Object[]> getPaymentStatsByMethod();
}
