package uth.edu.vn.Eventix.Util;


import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import uth.edu.vn.Eventix.Ticketing.Repository.StudentRepository;

@Component
public class DBChecker implements CommandLineRunner {

    private final StudentRepository studentRepository;

    public DBChecker(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public void run(String... args) {
        try {
            long count = studentRepository.count();
            System.out.println("Ket noi Database thanh cong. So student hien tai: " + count);
        } catch (Exception e) {
            System.err.println("Khong ket noi duoc Database:");
            e.printStackTrace();
        }
    }
}
