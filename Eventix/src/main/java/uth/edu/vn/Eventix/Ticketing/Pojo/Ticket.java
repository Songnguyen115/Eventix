package uth.edu.vn.Eventix.Ticketing.Pojo;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long TicketId;

    @ManyToOne(optional=false, fetch = FetchType.LAZY)
    @JoinColumn(name="seminar_id")
    private Seminar seminar;
    // private Long SeminarId;
    private String SeminarName;

    @ManyToOne(optional=false, fetch = FetchType.LAZY)
    @JoinColumn(name="student_id")
    private Student student;
    // private Long StudentId;
    private String StudentName;

    private String QRCodePath;
    private int Capacity;
    
    @Column(nullable = false)
    private boolean isActive = true;

    private LocalDateTime TicketCreationTime;
    private String qrCodeContent; 
}