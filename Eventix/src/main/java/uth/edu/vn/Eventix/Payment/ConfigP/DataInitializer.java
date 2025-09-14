package uth.edu.vn.Eventix.Payment.ConfigP;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import uth.edu.vn.Eventix.Payment.PojoP.Payment;
import uth.edu.vn.Eventix.Payment.PojoP.PaymentMethod;
import uth.edu.vn.Eventix.Payment.PojoP.PaymentStatus;
import uth.edu.vn.Eventix.Payment.ServiceP.PaymentService;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Initialize sample payment data programmatically
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private PaymentService paymentService;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if database is empty
        if (paymentService.getTotalPaymentCount() == 0) {
            initializeSampleData();
            System.out.println("✅ Sample payment data initialized successfully!");
        } else {
            System.out.println("📊 Database already contains payment data.");
        }
    }

    private void initializeSampleData() {
        // Create sample payments
        createPayment(1001L, 10001L, new BigDecimal("150000.00"), PaymentMethod.BANK_TRANSFER, 
                     PaymentStatus.SUCCESS, "TXN_1701234567_ABC12345", "Payment for Spring Boot Workshop");
        
        createPayment(1002L, 10002L, new BigDecimal("200000.00"), PaymentMethod.MOMO, 
                     PaymentStatus.SUCCESS, "TXN_1701234568_DEF67890", "Payment for React Conference");
        
        createPayment(1003L, 10003L, new BigDecimal("100000.00"), PaymentMethod.VNPAY, 
                     PaymentStatus.SUCCESS, "TXN_1701234569_GHI13579", "Payment for AI Seminar");
        
        createPayment(1004L, 10004L, new BigDecimal("175000.00"), PaymentMethod.CREDIT_CARD, 
                     PaymentStatus.PENDING, "TXN_1701234570_JKL24680", "Payment for DevOps Training");
        
        createPayment(1005L, 10005L, new BigDecimal("250000.00"), PaymentMethod.BANK_TRANSFER, 
                     PaymentStatus.SUCCESS, "TXN_1701234571_MNO97531", "Payment for Full Stack Course");
        
        createPayment(1006L, 10006L, new BigDecimal("120000.00"), PaymentMethod.MOMO, 
                     PaymentStatus.FAILED, "TXN_1701234572_PQR86420", "Payment for Mobile Development");
        
        createPayment(1007L, 10007L, new BigDecimal("180000.00"), PaymentMethod.ZALO_PAY, 
                     PaymentStatus.SUCCESS, "TXN_1701234573_STU75319", "Payment for Cloud Computing");
        
        createPayment(1008L, 10008L, new BigDecimal("300000.00"), PaymentMethod.VNPAY, 
                     PaymentStatus.SUCCESS, "TXN_1701234574_VWX64208", "Payment for Data Science Workshop");
        
        createPayment(1009L, 10009L, new BigDecimal("90000.00"), PaymentMethod.BANK_TRANSFER, 
                     PaymentStatus.CANCELLED, "TXN_1701234575_YZA53197", "Payment for UI/UX Design");
        
        createPayment(1010L, 10010L, new BigDecimal("220000.00"), PaymentMethod.CREDIT_CARD, 
                     PaymentStatus.SUCCESS, "TXN_1701234576_BCD42086", "Payment for Cybersecurity Course");

        // Recent payments
        createRecentPayment(2001L, 20001L, new BigDecimal("160000.00"), PaymentMethod.MOMO, 
                           PaymentStatus.SUCCESS, "TXN_2025_RECENT01", "Recent Payment - Blockchain Workshop", 5);
        
        createRecentPayment(2002L, 20002L, new BigDecimal("140000.00"), PaymentMethod.VNPAY, 
                           PaymentStatus.SUCCESS, "TXN_2025_RECENT02", "Recent Payment - Machine Learning", 3);
        
        createRecentPayment(2003L, 20003L, new BigDecimal("190000.00"), PaymentMethod.BANK_TRANSFER, 
                           PaymentStatus.PENDING, "TXN_2025_RECENT03", "Recent Payment - IoT Development", 1);
    }

    private void createPayment(Long ticketId, Long studentId, BigDecimal amount, 
                              PaymentMethod method, PaymentStatus status, 
                              String transactionId, String description) {
        Payment payment = new Payment();
        payment.setTicketId(ticketId);
        payment.setStudentId(studentId);
        payment.setAmount(amount);
        payment.setPaymentMethod(method);
        payment.setStatus(status);
        payment.setTransactionId(transactionId);
        payment.setDescription(description);
        payment.setPaymentDate(LocalDateTime.now().minusDays((long)(Math.random() * 30)));
        payment.setCreatedAt(LocalDateTime.now().minusDays((long)(Math.random() * 30)));
        
        paymentService.createPayment(payment);
    }

    private void createRecentPayment(Long ticketId, Long studentId, BigDecimal amount, 
                                   PaymentMethod method, PaymentStatus status, 
                                   String transactionId, String description, int daysAgo) {
        Payment payment = new Payment();
        payment.setTicketId(ticketId);
        payment.setStudentId(studentId);
        payment.setAmount(amount);
        payment.setPaymentMethod(method);
        payment.setStatus(status);
        payment.setTransactionId(transactionId);
        payment.setDescription(description);
        payment.setPaymentDate(LocalDateTime.now().minusDays(daysAgo));
        payment.setCreatedAt(LocalDateTime.now().minusDays(daysAgo));
        
        paymentService.createPayment(payment);
    }
}
