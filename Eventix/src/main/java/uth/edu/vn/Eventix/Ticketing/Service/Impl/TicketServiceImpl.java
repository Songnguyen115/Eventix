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
import uth.edu.vn.Eventix.Ticketing.Repository.SeminarRepository;
import uth.edu.vn.Eventix.Ticketing.Repository.StudentRepository;
import uth.edu.vn.Eventix.Ticketing.Repository.TicketRepository;
import uth.edu.vn.Eventix.Util.QRCodeGenerator;
import uth.edu.vn.Eventix.Ticketing.Service.TicketService;

// import java.nio.file.Files;
// import java.nio.file.Path;
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
    Seminar seminar = seminarRepo.findById(request.seminarId())
            .orElseThrow(() -> new IllegalArgumentException("Seminar not found"));

    Student student = studentRepo.findByStudentEmail(request.studentEmail())
            .orElseGet(() -> studentRepo.save(Student.builder()
                    .studentName(request.studentName())
                    .studentEmail(request.studentEmail())
                    .accountCreationTime(LocalDateTime.now())
                    .build()));

    Ticket ticket = Ticket.builder()
            .seminar(seminar)
            .seminarName(seminar.getSeminarName())
            .student(student)
            .studentName(student.getStudentName())
            .createdAt(LocalDateTime.now())
            .build();

    // Lưu lần 1 để có ticketId auto-gen
    ticketRepo.save(ticket);

    // Tạo QR code
    String qrContent = "seminar:" + seminar.getSeminarId() + "|student:" + student.getStudentId() + "|ticket:" + ticket.getTicketId();
    String qrPath = qrDir + "/TICKET_" + seminar.getSeminarId() + "_" + student.getStudentId() + "_" + ticket.getTicketId() + ".png";
    QRCodeGenerator.generateQRCode(qrContent, qrPath);

    ticket.setQrCodeContent(qrContent);
    ticket.setQrCodePath(qrPath);

    ticketRepo.save(ticket);

    return new TicketResponse(ticket.getTicketId(), seminar.getSeminarId(), student.getStudentId(), qrPath);
}

}
