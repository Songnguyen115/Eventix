package uth.edu.vn.Eventix.Ticketing.Dto;

public record TicketResponse (
    Long TicketId,
    Long SeminarId,
    Long StudentId,
    String qrCodePath
){}
