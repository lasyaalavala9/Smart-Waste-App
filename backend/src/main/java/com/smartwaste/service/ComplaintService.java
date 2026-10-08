package com.smartwaste.service;

import com.smartwaste.dto.ComplaintRequest;
import com.smartwaste.model.*;
import com.smartwaste.repository.ComplaintRepository;
import com.smartwaste.repository.TaskRepository;
import com.smartwaste.repository.UserRepository;
import com.smartwaste.service.storage.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final EcoPointService ecoPointService;
    private final NotificationService notificationService;
    private final StorageService storageService;

    private static final AtomicLong COMPLAINT_COUNTER = new AtomicLong(1001);

    public ComplaintService(ComplaintRepository complaintRepository,
                            TaskRepository taskRepository,
                            UserRepository userRepository,
                            EcoPointService ecoPointService,
                            NotificationService notificationService,
                            StorageService storageService) {
        this.complaintRepository = complaintRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.ecoPointService = ecoPointService;
        this.notificationService = notificationService;
        this.storageService = storageService;
    }

    @Transactional
    public Complaint createComplaint(ComplaintRequest req, User citizen) {
        String code = "SW-" + LocalDateTime.now().getYear() + "-" + COMPLAINT_COUNTER.incrementAndGet();

        Complaint complaint = new Complaint();
        complaint.setComplaintCode(code);
        complaint.setCitizen(citizen);
        complaint.setWasteType(req.getWasteType());
        complaint.setPriority(req.getPriority() != null ? req.getPriority() : Priority.MEDIUM);
        complaint.setStatus(ComplaintStatus.SUBMITTED);
        complaint.setDescription(req.getDescription());
        complaint.setEstimatedWeightKg(req.getEstimatedWeightKg() != null ? req.getEstimatedWeightKg() : 5.0);

        Location loc = new Location(
                req.getLatitude(),
                req.getLongitude(),
                req.getAddress() != null ? req.getAddress() : "Sector " + (int)(Math.random() * 20 + 1) + ", City Central",
                req.getLandmark() != null ? req.getLandmark() : "Near Community Park",
                req.getArea() != null ? req.getArea() : "Central District",
                req.getCity() != null ? req.getCity() : "EcoCity"
        );
        complaint.setLocation(loc);

        // Store evidence using pluggable storage service
        if (req.getImageBase64() != null && !req.getImageBase64().isBlank()) {
            String storedImageUrl = storageService.storeImage(req.getImageBase64(), "complaints");
            ComplaintImage img = new ComplaintImage(storedImageUrl, ImageType.CITIZEN_REPORT, complaint);
            complaint.addImage(img);
        }

        Complaint saved = complaintRepository.save(complaint);

        // Award 50 eco points to the reporting citizen
        ecoPointService.awardPoints(citizen, 50, "Waste Reported (" + req.getWasteType().name() + ")", saved.getId());

        // Notify Authorities
        notificationService.notifyAuthorities(
                "New Waste Complaint: " + code,
                "A citizen reported " + req.getWasteType() + " waste at " + loc.getAddress(),
                NotificationType.COMPLAINT_SUBMITTED,
                saved.getId(),
                "COMPLAINT"
        );

        // Notify Citizen confirmation
        notificationService.sendNotification(
                citizen,
                "Report Submitted Successfully",
                "Your complaint " + code + " has been received! You earned +50 Eco Points.",
                NotificationType.ECO_POINTS_AWARDED,
                saved.getId(),
                "COMPLAINT"
        );

        return saved;
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Complaint> getComplaintsByCitizen(Long citizenId) {
        return complaintRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId);
    }

    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + id));
    }

    @Transactional
    public Complaint assignWorker(Long complaintId, Long workerId, Priority priority) {
        Complaint complaint = getComplaintById(complaintId);
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Sanitation Worker not found with id: " + workerId));

        complaint.setAssignedWorker(worker);
        complaint.setStatus(ComplaintStatus.ASSIGNED);
        if (priority != null) {
            complaint.setPriority(priority);
        }
        complaint.setUpdatedAt(LocalDateTime.now());
        Complaint updated = complaintRepository.save(complaint);

        // Create or update Task for Worker
        Task task = taskRepository.findByComplaintId(complaintId).orElseGet(() -> new Task(complaint, worker));
        task.setAssignedWorker(worker);
        task.setStatus(ComplaintStatus.ASSIGNED);
        task.setAssignedAt(LocalDateTime.now());
        task.setDistanceKm(Math.round((Math.random() * 3.5 + 0.5) * 10.0) / 10.0);
        taskRepository.save(task);

        // Notify Worker
        notificationService.sendNotification(
                worker,
                "New Task Assigned: " + complaint.getComplaintCode(),
                "You have been assigned to collect " + complaint.getWasteType() + " at " +
                        (complaint.getLocation() != null ? complaint.getLocation().getAddress() : "designated area"),
                NotificationType.COMPLAINT_ASSIGNED,
                complaint.getId(),
                "TASK"
        );

        // Notify Citizen
        notificationService.sendNotification(
                complaint.getCitizen(),
                "Worker Assigned to Your Report",
                "Worker " + worker.getFullName() + " has been assigned to complaint " + complaint.getComplaintCode(),
                NotificationType.STATUS_CHANGED,
                complaint.getId(),
                "COMPLAINT"
        );

        return updated;
    }
}
