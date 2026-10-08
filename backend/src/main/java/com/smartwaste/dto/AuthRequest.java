package com.smartwaste.dto;

import jakarta.validation.constraints.NotBlank;

public class AuthRequest {
    @NotBlank(message = "Identifier ID is required")
    private String identifierId;

    @NotBlank(message = "Password is required")
    private String password;

    public AuthRequest() {}

    public AuthRequest(String identifierId, String password) {
        this.identifierId = identifierId;
        this.password = password;
    }

    public String getIdentifierId() { return identifierId; }
    public void setIdentifierId(String identifierId) { this.identifierId = identifierId; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
