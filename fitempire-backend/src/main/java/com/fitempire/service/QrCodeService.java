package com.fitempire.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.EnumMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
public class QrCodeService {

    private final SecureRandom secureRandom = new SecureRandom();

    public String generateQrToken(UUID userId, UUID gymId, UUID branchId) {
        String randomPart = Long.toHexString(secureRandom.nextLong());
        long timestamp = Instant.now().toEpochMilli();
        return "FE-" + userId.toString().replace("-", "").substring(0, 8).toUpperCase()
                + "-" + randomPart.toUpperCase()
                + "-" + timestamp;
    }

    public byte[] generateQrCodeImage(String content, int width, int height) {
        try {
            MultiFormatWriter writer = new MultiFormatWriter();
            Map<EncodeHintType, Object> hints = new EnumMap<>(EncodeHintType.class);
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.MARGIN, 2);

            BitMatrix bitMatrix = writer.encode(content, BarcodeFormat.QR_CODE, width, height, hints);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate QR code: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }

    public String generateQrCodeBase64(String content, int width, int height) {
        byte[] imageBytes = generateQrCodeImage(content, width, height);
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
    }
}
