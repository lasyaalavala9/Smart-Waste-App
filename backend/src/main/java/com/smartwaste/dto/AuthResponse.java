package com.smartwaste.dto;

import com.smartwaste.model.Role;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long userId;
    private String identifierId;
    private String fullName;
    private String email;
    private Role role;
    private Integer ecoPoints;
    private String assignedZone;

    public AuthResponse() {}

    public AuthResponse(String token, Long userId, String identifierId, String fullName, String email, Role role, Integer ecoPoints, String assignedZone) {
        this.token = token;
        this.userId = userId;
        this.identifierId = identifierId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.ecoPoints = ecoPoints;
        this.assignedZone = assignedZone;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getIdentifierId() { return identifierId; }
    public void setIdentifierId(String identifierId) { this.identifierId = identifierId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Integer getEcoPoints() { return ecoPoints; }
    public void setEcoPoints(Integer ecoPoints) { this.ecoPoints = ecoPoints; }

    public String getAssignedZone() { return assignedZone; }
    public void setAssignedZone(String assignedZone) { this.assignedZone = assignedZone; }
}
