package uth.edu.vn.Eventix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// import uth.edu.vn.Eventix.Repository.StudentRepository;

@SpringBootApplication
public class EventixApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventixApplication.class, args);

		try {
            System.out.println("Ket noi database thanh cong");
        } catch (Exception e) {
            System.err.println("Khong ket noi duoc database:");
            e.printStackTrace();
        }
	}

}


