package com.example.Service;

import com.example.Dto.StudentDto;
import com.example.Request.StudentRequest;

import java.util.List;

public interface StudentService {
    List<StudentDto> getStudent();

    StudentDto getStudentById(int id);

    StudentDto createStudent(StudentRequest studentDto);
}
