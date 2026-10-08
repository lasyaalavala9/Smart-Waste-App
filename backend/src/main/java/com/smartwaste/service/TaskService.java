package com.smartwaste.service;

import com.smartwaste.dto.TaskActionRequest;
import com.smartwaste.model.*;
import com.smartwaste.repository.ComplaintRepository;
import com.smartwaste.repository.TaskRepository;
import com.smartwaste.service.storage.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ComplaintRepository complaintRepository;
    private final NotificationService notificationService;
    private final EcoPointService ecoPointService;
    private final StorageService storageService;

    public TaskService(TaskRepository taskRepository,
                       ComplaintRepository complaintRepository,
                       NotificationService notificationService,
                       EcoPointService ecoPointService,
                       StorageService storageService) {
        this.taskRepository = taskRepository;
        this.complaintRepository = complaintRepository;
        this.notificationService = notificationService;
        this.ecoPointService = ecoPointService;
        this.storageService = storageService;
    }

    public List<Task> getTasksForWorker(Long workerId) {
        return taskRepository.findByAssignedWorkerIdOrderByAssignedAtDesc(workerId);
    }

    public Task getTaskById(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
    }

    public Task getTaskByComplaintId(Long complaintId) {
        return taskRepository.findByComplaintId(complaintId)
                .orElseThrow(() -> new RuntimeException("Task not found for complaint: " + complaintId));
    }

    @Transactional
    public Task startTask(Long taskId, TaskActionRequest req, User worker) {
        Task task = getTaskById(taskId);
        task.setStatus(ComplaintStatus.IN_PROGRESS);
        task.setStartedAt(LocalDateTime.now());

        if (req.getBeforeImageUrl() != null && !req.getBeforeImageUrl().isBlank()) {
            String storedUrl = storageService.storeImage(req.getBeforeImageUrl(), "tasks/before");
            task.setBeforeImageUrl(storedUrl);
            Complaint complaint = task.getComplaint();
            complaint.addImage(new ComplaintImage(storedUrl, ImageType.BEFORE, complaint));
        }

        Complaint complaint = task.getComplaint();
        complaint.setStatus(ComplaintStatus.IN_PROGRESS);
        complaint.setUpdatedAt(LocalDateTime.now());
        complaintRepository.save(complaint);
        Task updated = taskRepository.save(task);

        // Notify Citizen
        notificationService.sendNotification(
                complaint.getCitizen(),
                "Sanitation Worker In Progress",
                "Worker " + worker.getFullName() + " has arrived and begun collecting waste for report " + complaint.getComplaintCode(),
                NotificationType.TASK_STARTED,
                complaint.getId(),
                "COMPLAINT"
        );

        // Notify Authority
        notificationService.notifyAuthorities(
                "Task In Progress: " + complaint.getComplaintCode(),
                "Worker " + worker.getFullName() + " is actively working on task at " +
                        (complaint.getLocation() != null ? complaint.getLocation().getAddress() : ""),
                NotificationType.TASK_STARTED,
                complaint.getId(),
                "TASK"
        );

        return updated;
    }

    @Transactional
    public Task completeTask(Long taskId, TaskActionRequest req, User worker) {
        Task task = getTaskById(taskId);
        task.setStatus(ComplaintStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());
        task.setCompletionNotes(req.getCompletionNotes() != null ? req.getCompletionNotes() : "Area successfully cleared and sanitized.");

        Complaint complaint = task.getComplaint();
        complaint.setStatus(ComplaintStatus.COMPLETED);
        complaint.setUpdatedAt(LocalDateTime.now());

        if (req.getAfterImageUrl() != null && !req.getAfterImageUrl().isBlank()) {
            String storedUrl = storageService.storeImage(req.getAfterImageUrl(), "tasks/after");
            task.setAfterImageUrl(storedUrl);
            complaint.addImage(new ComplaintImage(storedUrl, ImageType.AFTER, complaint));
        }

        complaintRepository.save(complaint);
        Task updated = taskRepository.save(task);

        // Award bonus Eco Points to Citizen for verified resolution
        ecoPointService.awardPoints(complaint.getCitizen(), 25, "Cleanup Verified (" + complaint.getComplaintCode() + ")", complaint.getId());

        // Notify Citizen
        notificationService.sendNotification(
                complaint.getCitizen(),
                "Task Completed & Area Cleaned! 🌿",
                "Great news! Your complaint " + complaint.getComplaintCode() + " has been completed. You received +25 bonus Eco Points!",
                NotificationType.TASK_COMPLETED,
                complaint.getId(),
                "COMPLAINT"
        );

        // Notify Authority
        notificationService.notifyAuthorities(
                "Task Completed: " + complaint.getComplaintCode(),
                "Worker " + worker.getFullName() + " has completed collection for " + complaint.getComplaintCode(),
                NotificationType.TASK_COMPLETED,
                complaint.getId(),
                "TASK"
        );

        return updated;
    }
}
