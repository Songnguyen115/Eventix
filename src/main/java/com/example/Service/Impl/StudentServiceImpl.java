package com.example.Service.Impl;


import com.example.Dto.StudentDto;
import com.example.model.Student;
import com.example.Repository.StudentRepository;
import com.example.Request.StudentRequest;
import com.example.Service.StudentService;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    public List<StudentDto> getStudent() {
        List<Student> students = studentRepository.findAll();
        return students.stream().map(this::getDto).toList();
    }

    private StudentDto getDto(Student student){
        if (student == null) return null;
        return new StudentDto(student.getId(), student.getName(), student.getMail());
    }


    @Override
    public StudentDto getStudentById(int id) {
        Student student = studentRepository.findById(id).orElse(null);
        return getDto(student);
    }

    @Override
    public StudentDto createStudent(StudentRequest studentDto){
        if (studentDto == null){
            return null;
        }

        Student student = new Student();
        student.setName(studentDto.getName());
        student.setMail(studentDto.getMail());
        studentRepository.save(student);

        return new StudentDto(student.getId(), student.getName(), student.getMail());
    }


}
