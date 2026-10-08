package com.smartwaste.dto;

import com.smartwaste.model.Priority;
import jakarta.validation.constraints.NotNull;

public class AssignWorkerRequest {
    @NotNull(message = "Worker ID is required")
    private Long workerId;

    private Priority priority;

    public AssignWorkerRequest() {}

    public Long getWorkerId() { return workerId; }
    public void setWorkerId(Long workerId) { this.workerId = workerId; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
}
