package com.smartwaste.controller;

import com.smartwaste.config.JwtTokenProvider;
import com.smartwaste.dto.AuthRequest;
import com.smartwaste.dto.AuthResponse;
import com.smartwaste.dto.RegisterRequest;
import com.smartwaste.model.Role;
import com.smartwaste.model.User;
import com.smartwaste.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        User user = userRepository.findByIdentifierId(request.getIdentifierId())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid ID or Password. Please try again."));
        }

        String token = tokenProvider.generateToken(user.getIdentifierId(), user.getRole().name(), user.getId());

        AuthResponse response = new AuthResponse(
                token,
                user.getId(),
                user.getIdentifierId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getEcoPoints(),
                user.getAssignedZone()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCitizen(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByIdentifierId(request.getIdentifierId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Citizen ID / Username is already taken."));
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email is already registered."));
        }

        User newUser = new User(
                request.getIdentifierId(),
                request.getFullName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                Role.ROLE_CITIZEN
        );
        newUser.setPhoneNumber(request.getPhoneNumber());
        newUser.setEcoPoints(100); // 100 welcome bonus eco points!

        User saved = userRepository.save(newUser);

        String token = tokenProvider.generateToken(saved.getIdentifierId(), saved.getRole().name(), saved.getId());

        AuthResponse response = new AuthResponse(
                token,
                saved.getId(),
                saved.getIdentifierId(),
                saved.getFullName(),
                saved.getEmail(),
                saved.getRole(),
                saved.getEcoPoints(),
                saved.getAssignedZone()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Not authenticated"));
        }

        User user = userRepository.findByIdentifierId(auth.getName())
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "identifierId", user.getIdentifierId(),
                "fullName", user.getFullName(),
                "email", user.getEmail() != null ? user.getEmail() : "",
                "role", user.getRole(),
                "ecoPoints", user.getEcoPoints(),
                "assignedZone", user.getAssignedZone() != null ? user.getAssignedZone() : "",
                "phoneNumber", user.getPhoneNumber() != null ? user.getPhoneNumber() : ""
        ));
    }
}
