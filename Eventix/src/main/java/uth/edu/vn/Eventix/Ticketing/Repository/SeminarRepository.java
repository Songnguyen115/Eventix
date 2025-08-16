package uth.edu.vn.Eventix.Ticketing.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uth.edu.vn.Eventix.Ticketing.Pojo.Seminar;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.Optional;

@Repository
public interface SeminarRepository extends JpaRepository <Seminar, Long> {
    //khóa khi mà đủ capacity, số lượng student được tham gia
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s fro, Seminar s where s.id = :id")
    Optional<Seminar> lockById(@Param ("id") Long id);

}
