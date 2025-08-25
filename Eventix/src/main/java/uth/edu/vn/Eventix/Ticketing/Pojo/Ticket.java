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

    @Column(nullable = false)
    @Builder.Default
    private boolean isActive = true;
    
    private String qrCodeContent; 
    // thời gian tạo vé
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
         // Custom getId method to match expected naming convention
    public Long getId() {
        return TicketId;
    }
    
    public void setId(Long id) {
        this.TicketId = id;
    }
  
}