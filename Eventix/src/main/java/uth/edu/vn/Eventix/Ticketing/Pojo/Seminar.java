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

   @Column(nullable = false)
    private String seminarName;

    @Column(nullable=false)
    private String title;
    private String description;

}
