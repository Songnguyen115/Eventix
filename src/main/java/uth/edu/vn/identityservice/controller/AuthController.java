package uth.edu.vn.identityservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import uth.edu.vn.identityservice.dto.*;
import uth.edu.vn.identityservice.model.User;
import uth.edu.vn.identityservice.repository.UserRepository;
import uth.edu.vn.identityservice.security.JwtService;
import uth.edu.vn.identityservice.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public JwtResponse login(@RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!authService.checkPassword(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }
        String token = jwtService.generateToken(user.getUsername());
        return new JwtResponse(token);
    }

    @GetMapping("/test")
    public String test() {
        return "Identity Service running!";
    }
}
