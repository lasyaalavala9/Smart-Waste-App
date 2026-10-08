package com.smartwaste.controller;

import com.smartwaste.model.Role;
import com.smartwaste.model.User;
import com.smartwaste.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/authority")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/workers")
    public ResponseEntity<List<Map<String, Object>>> getSanitationWorkers() {
        List<User> workers = userRepository.findByRole(Role.ROLE_WORKER);
        List<Map<String, Object>> result = workers.stream().map(w -> Map.of(
                "id", (Object) w.getId(),
                "identifierId", w.getIdentifierId(),
                "fullName", w.getFullName(),
                "assignedZone", w.getAssignedZone() != null ? w.getAssignedZone() : "General Zone",
                "phoneNumber", w.getPhoneNumber() != null ? w.getPhoneNumber() : ""
        )).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
