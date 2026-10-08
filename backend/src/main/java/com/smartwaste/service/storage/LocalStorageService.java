package com.smartwaste.service.storage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {

    private static final Logger log = LoggerFactory.getLogger(LocalStorageService.class);

    @Value("${upload.dir:./uploads}")
    private String uploadDir;

    @Override
    public String storeImage(String imagePayload, String category) {
        if (imagePayload == null || imagePayload.trim().isEmpty()) {
            return null;
        }

        // If it's already an external HTTPS URL (e.g. from an existing S3/Cloud bucket)
        if (imagePayload.startsWith("http://") || imagePayload.startsWith("https://")) {
            return imagePayload;
        }

        try {
            // Check if it's a data URI format (e.g., "data:image/jpeg;base64,...")
            String base64Data = imagePayload;
            String extension = ".jpg";

            if (imagePayload.startsWith("data:image/")) {
                int commaIndex = imagePayload.indexOf(",");
                if (commaIndex != -1) {
                    String metadata = imagePayload.substring(0, commaIndex);
                    base64Data = imagePayload.substring(commaIndex + 1);

                    if (metadata.contains("png")) extension = ".png";
                    else if (metadata.contains("webp")) extension = ".webp";
                }
            }

            // Create target directory if it doesn't exist
            Path targetDirPath = Paths.get(uploadDir, category);
            if (!Files.exists(targetDirPath)) {
                Files.createDirectories(targetDirPath);
            }

            // Decode and save to file
            byte[] imageBytes = Base64.getDecoder().decode(base64Data);
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = targetDirPath.resolve(filename);

            try (OutputStream out = new FileOutputStream(filePath.toFile())) {
                out.write(imageBytes);
            }

            log.info("Stored evidence image file: {}", filePath.toAbsolutePath());
            
            // For now, return the data URI or file reference so frontend renders immediately
            // If the original payload was already a clean data URI, return imagePayload to ensure immediate browser rendering
            return imagePayload;
        } catch (Exception ex) {
            log.warn("Failed to write image to disk, falling back to data URI representation: {}", ex.getMessage());
            return imagePayload;
        }
    }

    @Override
    public boolean isStorageHealthy() {
        try {
            File dir = new File(uploadDir);
            return dir.exists() || dir.mkdirs();
        } catch (Exception e) {
            return false;
        }
    }
}
