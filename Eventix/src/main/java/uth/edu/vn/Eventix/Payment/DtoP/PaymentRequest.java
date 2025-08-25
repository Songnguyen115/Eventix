package uth.edu.vn.Eventix.Payment.DtoP;

import jakarta.validation.constraints.*;

public record PaymentRequest(
  @NotNull Long seminarId,
  @NotNull Long TicketId,
  @NotBlank String qrCodePath,
  @NotBlank String studentName
) {}
