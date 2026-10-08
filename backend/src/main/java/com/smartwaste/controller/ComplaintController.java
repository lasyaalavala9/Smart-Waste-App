package com.smartwaste.controller;

import com.smartwaste.dto.AssignWorkerRequest;
import com.smartwaste.dto.ComplaintRequest;
import com.smartwaste.model.Complaint;
import com.smartwaste.model.User;
import com.smartwaste.repository.UserRepository;
import com.smartwaste.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class ComplaintController {

    private final ComplaintService complaintService;
    private final UserRepository userRepository;

    public ComplaintController(ComplaintService complaintService, UserRepository userRepository) {
        this.complaintService = complaintService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByIdentifierId(auth.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    // Citizen submits complaint
    @PostMapping("/api/citizen/complaints")
    public ResponseEntity<?> submitComplaint(@Valid @RequestBody ComplaintRequest request) {
        User citizen = getAuthenticatedUser();
        Complaint created = complaintService.createComplaint(request, citizen);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Citizen views their own complaints
    @GetMapping("/api/citizen/complaints")
    public ResponseEntity<List<Complaint>> getMyComplaints() {
        User citizen = getAuthenticatedUser();
        List<Complaint> list = complaintService.getComplaintsByCitizen(citizen.getId());
        return ResponseEntity.ok(list);
    }

    // Citizen views single complaint details
    @GetMapping("/api/citizen/complaints/{id}")
    public ResponseEntity<Complaint> getCitizenComplaint(@PathVariable Long id) {
        Complaint complaint = complaintService.getComplaintById(id);
        return ResponseEntity.ok(complaint);
    }

    // Authority views all complaints across city
    @GetMapping("/api/authority/complaints")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        List<Complaint> complaints = complaintService.getAllComplaints();
        return ResponseEntity.ok(complaints);
    }

    // Authority views single complaint
    @GetMapping("/api/authority/complaints/{id}")
    public ResponseEntity<Complaint> getAuthorityComplaint(@PathVariable Long id) {
        Complaint complaint = complaintService.getComplaintById(id);
        return ResponseEntity.ok(complaint);
    }

    // Authority assigns complaint to worker
    @PutMapping("/api/authority/complaints/{id}/assign")
    public ResponseEntity<?> assignWorker(@PathVariable Long id, @Valid @RequestBody AssignWorkerRequest request) {
        Complaint updated = complaintService.assignWorker(id, request.getWorkerId(), request.getPriority());
        return ResponseEntity.ok(Map.of(
                "message", "Worker assigned successfully to complaint " + updated.getComplaintCode(),
                "complaint", updated
        ));
    }
}
