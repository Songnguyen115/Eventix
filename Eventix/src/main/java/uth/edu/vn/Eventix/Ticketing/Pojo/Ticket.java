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
    private Long ticketId;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "seminar_id")
    private Seminar seminar;

    private String seminarName;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    private String studentName;

    private String qrCodePath;

    @Column(nullable = false)
    @Builder.Default
    private boolean isActive = true;

    private String qrCodeContent;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

}
