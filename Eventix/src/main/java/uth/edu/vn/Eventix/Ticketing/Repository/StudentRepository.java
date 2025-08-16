package uth.edu.vn.Eventix.Ticketing.Repository;

import uth.edu.vn.Eventix.Ticketing.Pojo.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional <Student> findByEmail(String email);
    Optional <Student> findById(String studentid);
    
}
