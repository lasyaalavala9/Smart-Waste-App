package com.smartwaste.controller;

import com.smartwaste.dto.TaskActionRequest;
import com.smartwaste.model.Task;
import com.smartwaste.model.User;
import com.smartwaste.repository.UserRepository;
import com.smartwaste.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/worker")
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    public TaskController(TaskService taskService, UserRepository userRepository) {
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedWorker() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByIdentifierId(auth.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated worker not found"));
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getMyTasks() {
        User worker = getAuthenticatedWorker();
        List<Task> tasks = taskService.getTasksForWorker(worker.getId());
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<Task> getTaskDetails(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    @PostMapping("/tasks/{id}/start")
    public ResponseEntity<?> startTask(@PathVariable Long id, @RequestBody(required = false) TaskActionRequest req) {
        User worker = getAuthenticatedWorker();
        if (req == null) {
            req = new TaskActionRequest();
        }
        Task updated = taskService.startTask(id, req, worker);
        return ResponseEntity.ok(Map.of(
                "message", "Task started successfully",
                "task", updated
        ));
    }

    @PostMapping("/tasks/{id}/complete")
    public ResponseEntity<?> completeTask(@PathVariable Long id, @RequestBody TaskActionRequest req) {
        User worker = getAuthenticatedWorker();
        Task updated = taskService.completeTask(id, req, worker);
        return ResponseEntity.ok(Map.of(
                "message", "Task marked as completed successfully!",
                "task", updated
        ));
    }
}
