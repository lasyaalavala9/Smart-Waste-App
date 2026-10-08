package com.smartwaste.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "eco_point_transactions")
public class EcoPointTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer points;

    @Column(nullable = false)
    private String reason;

    private Long complaintId;

    private LocalDateTime createdAt = LocalDateTime.now();

    public EcoPointTransaction() {}

    public EcoPointTransaction(User user, Integer points, String reason, Long complaintId) {
        this.user = user;
        this.points = points;
        this.reason = reason;
        this.complaintId = complaintId;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
