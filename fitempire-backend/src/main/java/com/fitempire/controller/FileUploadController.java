package com.fitempire.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.service.StorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name = "Media & Uploads", description = "Endpoints for uploading gym photos, logos, and media assets")
public class FileUploadController {

    private final StorageService storageService;

    @Value("${fitempire.upload.dir:uploads}")
    private String uploadBaseDir;

    @Value("${fitempire.server.base-url:http://localhost:8080}")
    private String serverBaseUrl;

    private static final Set<String> ALLOWED_TYPES = Set.of(
        "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"
    );
    private static final long MAX_SIZE_BYTES = 10L * 1024 * 1024; // 10 MB

    /**
     * Standard Gym Photo Upload endpoint.
     * POST /api/v1/upload/gym-photo
     */
    @PostMapping(value = "/v1/upload/gym-photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload gym photo/banner", description = "Uploads a photo for gym cover, logo, or gallery with fallback storage")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadGymPhoto(
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("No file provided", "UPLOAD_EMPTY"));
        }
        String contentType = file.getContentType() != null ? file.getContentType().toLowerCase() : "";
        if (!ALLOWED_TYPES.contains(contentType)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Only JPG, PNG, WebP images are allowed", "INVALID_TYPE"));
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("File too large. Maximum size is 10MB", "FILE_TOO_LARGE"));
        }

        String originalName = Optional.ofNullable(file.getOriginalFilename()).orElse("photo.jpg");
        String ext = originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf('.')).toLowerCase()
                : ".jpg";

        String filename = UUID.randomUUID().toString() + ext;
        String url;

        // Try local storage
        try {
            Path uploadDir = Paths.get(uploadBaseDir, "gym-photos");
            Files.createDirectories(uploadDir);
            Path filePath = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            url = serverBaseUrl + "/uploads/gym-photos/" + filename;
            log.info("Gym photo stored locally: {} -> {}", originalName, url);
        } catch (Exception localEx) {
            log.warn("Local storage write failed, falling back to storage service: {}", localEx.getMessage());
            try {
                url = storageService.uploadFile("gym-photos", file);
            } catch (Exception s3Ex) {
                log.error("All storage options failed: {}", s3Ex.getMessage(), s3Ex);
                return ResponseEntity.internalServerError()
                        .body(ApiResponse.error("Failed to store image: " + s3Ex.getMessage(), "UPLOAD_FAILED"));
            }
        }

        Map<String, String> result = new LinkedHashMap<>();
        result.put("url", url);
        result.put("filename", filename);
        result.put("originalName", originalName);
        result.put("sizeBytes", String.valueOf(file.getSize()));

        return ResponseEntity.ok(ApiResponse.success("Photo uploaded successfully", result));
    }

    /**
     * General Media Upload endpoint.
     * POST /api/v1/media/upload
     */
    @PostMapping(value = "/v1/media/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image or file", description = "Uploads file to storage and returns public URL")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "uploads") String folder
    ) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("File cannot be empty", "INVALID_FILE"));
        }

        String safeFolder = folder.replaceAll("[^a-zA-Z0-9_-]", "");
        if (safeFolder.isBlank()) safeFolder = "uploads";

        String url;
        try {
            url = storageService.uploadFile(safeFolder, file);
        } catch (Exception e) {
            log.warn("S3 upload failed, using local disk fallback: {}", e.getMessage());
            try {
                String originalName = Optional.ofNullable(file.getOriginalFilename()).orElse("file.bin");
                String ext = originalName.contains(".") ? originalName.substring(originalName.lastIndexOf('.')) : ".bin";
                String filename = UUID.randomUUID().toString() + ext;
                Path uploadDir = Paths.get(uploadBaseDir, safeFolder);
                Files.createDirectories(uploadDir);
                Path filePath = uploadDir.resolve(filename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                url = serverBaseUrl + "/uploads/" + safeFolder + "/" + filename;
            } catch (Exception localEx) {
                return ResponseEntity.internalServerError()
                        .body(ApiResponse.error("Failed to upload file: " + localEx.getMessage(), "UPLOAD_FAILED"));
            }
        }

        log.info("File uploaded successfully to folder [{}]: {}", safeFolder, url);

        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "url", url,
                "fileName", file.getOriginalFilename() != null ? file.getOriginalFilename() : "file",
                "fileSize", file.getSize(),
                "contentType", file.getContentType() != null ? file.getContentType() : "application/octet-stream",
                "folder", safeFolder
        )));
    }
}
