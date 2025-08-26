package uth.edu.vn.Eventix.Payment.DtoP;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Long ticketId;   // ID vé cần thanh toán
    private String method;   // Ví dụ: VNPay, Momo, ZaloPay
    private BigDecimal amount; // Số tiền thanh toán
}
