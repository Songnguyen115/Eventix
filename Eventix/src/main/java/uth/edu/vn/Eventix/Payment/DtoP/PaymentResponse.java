package uth.edu.vn.Eventix.Payment.DtoP;

public record PaymentResponse (
    Long TicketId,
    Long SeminarId,
    String qrCodePath,
    String status,          
    Double amount,
    int registeredCount
)
{}
