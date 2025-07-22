package com.example.Controller;


import com.example.Dto.StudentDto;
import com.example.Request.StudentRequest;
import com.example.Service.StudentService;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/xddb")
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StudentController {
    StudentService studentService;

    // GET toàn bộ sinh viên
    @GetMapping
    public List<StudentDto> getStudents() {
        return studentService.getStudent();
    }

    // GET theo ID
    @GetMapping("{id}")
    public StudentDto getStudentById(@PathVariable("id") Integer id) {
        return studentService.getStudentById(id);
    }

    // ✅ POST: thêm sinh viên (dành cho Postman gửi JSON)
    @PostMapping
    public StudentDto createStudent(@RequestBody StudentRequest studentRequest) {
        return studentService.createStudent(studentRequest);
    }
    // @GetMapping("name") // --> KHÔNG dùng GET với @RequestBody
}
