package uth.edu.vn.Eventix.Payment.RepositoryP;

import org.springframework.data.jpa.repository.JpaRepository;

import uth.edu.vn.Eventix.Payment.PojoP.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
}