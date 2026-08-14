package com.fitempire.controller;

import com.fitempire.common.response.ApiResponse;
import com.fitempire.service.StorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/v1/media")
@RequiredArgsConstructor
@Tag(name = "Media & S3 Uploads", description = "Endpoints for uploading images and assets to AWS S3")
public class FileUploadController {

    private final StorageService storageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image or file to AWS S3", description = "Uploads file to AWS S3 bucket and returns public CDN / S3 URL")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "uploads") String folder
    ) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("File cannot be empty", "INVALID_FILE"));
        }

        // Clean folder name
        String safeFolder = folder.replaceAll("[^a-zA-Z0-9_-]", "");
        if (safeFolder.isBlank()) safeFolder = "uploads";

        String url = storageService.uploadFile(safeFolder, file);
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
