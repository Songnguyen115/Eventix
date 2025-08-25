package uth.edu.vn.Eventix.Payment.DtoP;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private Long ticketId;
    private String method;
    private BigDecimal amount;
    private String status;
    private String transactionRef;
    private LocalDateTime createdAt;
}
