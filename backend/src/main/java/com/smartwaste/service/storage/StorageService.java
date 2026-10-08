package com.smartwaste.service.storage;

public interface StorageService {
    /**
     * Stores an image (data URI, base64 payload, or external URL) and returns the storage reference.
     * Decoupled from controller and entity logic to enable seamless integration with AWS S3,
     * Google Cloud Storage, Cloudinary, or local persistent volume.
     *
     * @param imagePayload Image data (data URI, base64, or URL)
     * @param category Directory/category identifier (e.g. complaints, tasks-before, tasks-after)
     * @return Stored image URL or normalized URI
     */
    String storeImage(String imagePayload, String category);

    /**
     * Checks if the storage system is available.
     */
    boolean isStorageHealthy();
}
