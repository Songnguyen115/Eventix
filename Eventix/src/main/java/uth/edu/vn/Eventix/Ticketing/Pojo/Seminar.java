package uth.edu.vn.Eventix.Ticketing.Pojo;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="seminar")

public class Seminar {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long seminarId;

    @Column(nullable=false)
    private String title;
    private String description;

    @Column(nullable=false)
    private int capacity; // đề bao nhiêu sinh viên có thể đăng kí vào buổi hội thảo này

    @Column(nullable=false)
    private int registeredCount =0; // số sinh viên đã đăng kí vào buổi hội thảo

        // Custom getId method to match expected naming convention
    public Long getId() {
        return seminarId;
    }
    
    public void setId(Long id) {
        this.seminarId = id;
    }
}
