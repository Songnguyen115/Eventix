package uth.edu.vn.Eventix.Payment.PojoP;

/**
 * Enum representing payment methods
 */
public enum PaymentMethod {
    CASH("Tiền mặt"),
    BANK_TRANSFER("Chuyển khoản ngân hàng"),
    CREDIT_CARD("Thẻ tín dụng"),
    MOMO("Ví MoMo"),
    ZALO_PAY("ZaloPay"),
    VNPAY("VNPay");

    private final String description;

    PaymentMethod(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
