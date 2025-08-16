package uth.edu.vn.Eventix.Payment.PojoP;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import uth.edu.vn.Eventix.Ticketing.Pojo.Ticket;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity  
@Table(name = "payments") 
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;   

    
    @OneToOne(optional=false, fetch = FetchType.LAZY)
    @JoinColumn(name="ticket_id", unique = true)
    private Ticket ticket;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private PaymentMethod method;

    @Column(nullable=false, precision = 18, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private PaymentStatus status;

    private String transactionRef;   // mã giao dịch từ cổng thanh toán
    private String invoicePath;      // file hóa đơn (stub)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
