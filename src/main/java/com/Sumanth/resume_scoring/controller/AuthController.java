package com.Sumanth.resume_scoring.controller;

import com.Sumanth.resume_scoring.dto.request.AuthRequestDTO;
import com.Sumanth.resume_scoring.dto.request.RegisterRequestDTO;
import com.Sumanth.resume_scoring.dto.response.AuthResponseDTO;
import com.Sumanth.resume_scoring.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(
            @RequestBody RegisterRequestDTO request
    ) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> authenticate(
            @RequestBody AuthRequestDTO request
    ) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}
