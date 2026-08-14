package com.fitempire.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StorageService {

    private final S3Client s3Client;

    @Value("${app.aws.s3-bucket:fitempire-media}")
    private String bucketName;

    @Value("${app.aws.cdn-url:}")
    private String cdnUrl;

    @Value("${app.aws.region:ap-south-1}")
    private String region;

    public String uploadFile(String key, byte[] data, String contentType) {
        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(request, RequestBody.fromBytes(data));

            String url;
            if (cdnUrl != null && !cdnUrl.isBlank() && !cdnUrl.contains("cdn.fitempire.in")) {
                url = cdnUrl.replaceAll("/+$", "") + "/" + key;
            } else {
                url = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + key;
            }
            log.info("File uploaded to S3: {}", url);
            return url;
        } catch (Exception e) {
            log.error("Failed to upload file to S3: {} - {}", key, e.getMessage(), e);
            throw new com.fitempire.common.exception.FileUploadException("Failed to upload file: " + e.getMessage(), e);
        }
    }

    public String uploadFile(String key, org.springframework.web.multipart.MultipartFile file) {
        try {
            String extension = getFileExtension(file.getOriginalFilename());
            String uniqueKey = key + "/" + UUID.randomUUID() + "." + extension;
            return uploadFile(uniqueKey, file.getBytes(), file.getContentType());
        } catch (Exception e) {
            throw new com.fitempire.common.exception.FileUploadException("Failed to read file: " + e.getMessage(), e);
        }
    }

    public void deleteFile(String key) {
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build());
            log.info("File deleted from S3: {}", key);
        } catch (Exception e) {
            log.error("Failed to delete file from S3: {}", key, e);
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "bin";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
