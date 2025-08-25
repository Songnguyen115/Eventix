package uth.edu.vn.Eventix.Ticketing.Dto;

import jakarta.validation.constraints.*;

public record TicketRequest(
  @NotNull Long seminarId,
  @NotBlank String studentName,
  @Email @NotBlank String studentEmail
) {}
