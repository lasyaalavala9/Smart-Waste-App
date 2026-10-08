package com.smartwaste.dto;

import com.smartwaste.model.Priority;
import com.smartwaste.model.WasteType;
import jakarta.validation.constraints.NotNull;

public class ComplaintRequest {
    @NotNull(message = "Waste type is required")
    private WasteType wasteType;

    private Priority priority = Priority.MEDIUM;
    private String description;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String address;
    private String landmark;
    private String area;
    private String city;

    private String imageBase64;
    private Double estimatedWeightKg;

    public ComplaintRequest() {}

    public WasteType getWasteType() { return wasteType; }
    public void setWasteType(WasteType wasteType) { this.wasteType = wasteType; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getImageBase64() { return imageBase64; }
    public void setImageBase64(String imageBase64) { this.imageBase64 = imageBase64; }

    public Double getEstimatedWeightKg() { return estimatedWeightKg; }
    public void setEstimatedWeightKg(Double estimatedWeightKg) { this.estimatedWeightKg = estimatedWeightKg; }
}
