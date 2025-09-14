package uth.edu.vn.Eventix.Payment.PojoP;

/**
 * Enum representing payment status
 */
public enum PaymentStatus {
    PENDING("Chờ thanh toán"),
    SUCCESS("Thành công"), 
    FAILED("Thất bại"),
    CANCELLED("Đã hủy"),
    REFUNDED("Đã hoàn tiền");

    private final String description;

    PaymentStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
