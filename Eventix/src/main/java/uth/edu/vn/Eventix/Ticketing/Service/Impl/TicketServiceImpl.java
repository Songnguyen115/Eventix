
package uth.edu.vn.Eventix.Ticketing.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uth.edu.vn.Eventix.Ticketing.Dto.TicketRequest;
import uth.edu.vn.Eventix.Ticketing.Dto.TicketResponse;
import uth.edu.vn.Eventix.Ticketing.Pojo.Seminar;
import uth.edu.vn.Eventix.Ticketing.Pojo.Student;
import uth.edu.vn.Eventix.Ticketing.Pojo.Ticket;
import uth.edu.vn.Eventix.Ticketing.Service.TicketService;
import uth.edu.vn.Eventix.Ticketing.Repository.SeminarRepository;
import uth.edu.vn.Eventix.Ticketing.Repository.StudentRepository;
import uth.edu.vn.Eventix.Ticketing.Repository.TicketRepository;
import uth.edu.vn.Eventix.Util.QRCodeGenerator;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {
  private final SeminarRepository seminarRepo;
  private final StudentRepository studentRepo;
  private final TicketRepository ticketRepo;

  @Value("${eventix.qr.dir:qr_codes}")
  private String qrDir;

  @Override
  @Transactional
  public TicketResponse bookTicket(TicketRequest request) throws Exception {
    // Khóa seminar để đảm bảo không vượt capacity
    Seminar seminar = seminarRepo.lockById(request.seminarId())
        .orElseThrow(() -> new IllegalArgumentException("Seminar not found"));

    if (seminar.getRegisteredCount() >= seminar.getCapacity()) {
      throw new IllegalStateException("Seminar is full");
    }

    // Tìm/tạo student theo email
    Student student = studentRepo.findByEmail(request.studentEmail())
        .orElseGet(() -> studentRepo.save(Student.builder()
          .name(request.studentName())
          .email(request.studentEmail())
          .accountCreationTime(LocalDateTime.now())
          .build()));

    // Chuẩn bị thư mục QR
    Files.createDirectories(Path.of(qrDir));
    String qrContent = "seminar:" + seminar.getId() + "|student:" + student.getId() + "|" + System.currentTimeMillis();
    String qrPath = qrDir + "/TICKET_" + seminar.getId() + "_" + student.getId() + "_" + System.currentTimeMillis() + ".png";
    QRCodeGenerator.generateQRCode(qrContent, qrPath);

    Ticket ticket = Ticket.builder()
        .seminar(seminar)
        .student(student)
        .qrCodeContent(qrContent)
        .qrCodePath(qrPath)
        .active(true)
        .createdAt(LocalDateTime.now())
        .build();

    ticketRepo.save(ticket);

    // tăng registeredCount
    seminar.setRegisteredCount(seminar.getRegisteredCount() + 1);
    // Không cần gọi save() nếu bật dirty checking, nhưng gọi rõ ràng cho chắc
    seminarRepo.save(seminar);

    return new TicketResponse(ticket.getId(), seminar.getId(), student.getId(), qrPath);
  }
}
