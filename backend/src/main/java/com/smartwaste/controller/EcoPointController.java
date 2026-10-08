package com.smartwaste.controller;

import com.smartwaste.model.EcoPointTransaction;
import com.smartwaste.model.User;
import com.smartwaste.repository.UserRepository;
import com.smartwaste.service.EcoPointService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/citizen/eco-points")
public class EcoPointController {

    private final EcoPointService ecoPointService;
    private final UserRepository userRepository;

    public EcoPointController(EcoPointService ecoPointService, UserRepository userRepository) {
        this.ecoPointService = ecoPointService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByIdentifierId(auth.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<?> getEcoPoints() {
        User user = getAuthenticatedUser();
        int balance = ecoPointService.getUserBalance(user.getId());
        List<EcoPointTransaction> history = ecoPointService.getUserHistory(user.getId());

        return ResponseEntity.ok(Map.of(
                "balance", balance,
                "history", history
        ));
    }
}
