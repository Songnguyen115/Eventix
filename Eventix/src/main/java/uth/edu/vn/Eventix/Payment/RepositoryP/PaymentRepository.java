package uth.edu.vn.Eventix.Payment.RepositoryP;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uth.edu.vn.Eventix.Payment.PojoP.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
