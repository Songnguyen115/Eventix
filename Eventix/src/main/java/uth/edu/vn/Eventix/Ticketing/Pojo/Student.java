package uth.edu.vn.Eventix.Ticketing.Pojo;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long StudentId;

    @Column(nullable=false)
    private String StudentName;

    @Column(nullable=false)
    private String StudentEmail;
    
    private String PhoneNumber;
    private LocalDateTime AcountCreationTime;

    // Getters and Setters
    public Long getId() {
        return StudentId;
    }

    public void setId(Long id) {
        this.StudentId = id;
    }

    public String getName() {
        return StudentName;
    }

    public void setName(String name) {
        this.StudentName = name;
    }

    public String getEmail() {
        return StudentEmail;
    }

    public void setEmail(String studentEmail) {
        this.StudentEmail = studentEmail;
    }

    public String getPhoneNumber() {
        return PhoneNumber;
    }

    public void setPhoneNumber(String phonenumber) {
        this.PhoneNumber = phonenumber;
    }

}