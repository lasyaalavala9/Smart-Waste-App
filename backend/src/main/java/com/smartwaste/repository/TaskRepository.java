package com.smartwaste.repository;

import com.smartwaste.model.ComplaintStatus;
import com.smartwaste.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedWorkerIdOrderByAssignedAtDesc(Long workerId);
    Optional<Task> findByComplaintId(Long complaintId);
    List<Task> findByStatus(ComplaintStatus status);
    List<Task> findByAssignedWorkerIdAndStatus(Long workerId, ComplaintStatus status);
}
