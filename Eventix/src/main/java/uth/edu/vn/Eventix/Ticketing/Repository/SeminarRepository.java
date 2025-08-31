package uth.edu.vn.Eventix.Ticketing.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uth.edu.vn.Eventix.Ticketing.Pojo.Seminar;

@Repository
public interface SeminarRepository extends JpaRepository<Seminar, Long> {
}
