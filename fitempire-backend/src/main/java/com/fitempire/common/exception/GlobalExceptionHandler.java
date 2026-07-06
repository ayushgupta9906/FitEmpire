package com.fitempire.common.exception;

import com.fitempire.common.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ── Domain Exceptions ─────────────────────────────────────────────────────

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFoundException(
            ResourceNotFoundException ex, HttpServletRequest request) {
        log.warn("Resource not found: {} [{}]", ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage(), "RESOURCE_NOT_FOUND"));
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(
            BusinessException ex, HttpServletRequest request) {
        log.warn("Business rule violation: {} [{}]", ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(ex.getStatus())
                .body(ApiResponse.error(ex.getMessage(), ex.getErrorCode()));
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateResourceException(
            DuplicateResourceException ex, HttpServletRequest request) {
        log.warn("Duplicate resource: {} [{}]", ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(ex.getMessage(), "DUPLICATE_RESOURCE"));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorizedException(
            UnauthorizedException ex, HttpServletRequest request) {
        log.warn("Unauthorized access: {} [{}]", ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(ex.getMessage(), "UNAUTHORIZED"));
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ApiResponse<Void>> handleForbiddenException(
            ForbiddenException ex, HttpServletRequest request) {
        log.warn("Forbidden access: {} [{}]", ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error(ex.getMessage(), "FORBIDDEN"));
    }

    @ExceptionHandler(PaymentException.class)
    public ResponseEntity<ApiResponse<Void>> handlePaymentException(
            PaymentException ex, HttpServletRequest request) {
        log.error("Payment error: {} [{}]", ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                .body(ApiResponse.error(ex.getMessage(), ex.getErrorCode()));
    }

    @ExceptionHandler(OtpException.class)
    public ResponseEntity<ApiResponse<Void>> handleOtpException(
            OtpException ex, HttpServletRequest request) {
        log.warn("OTP error: {} [{}]", ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage(), ex.getErrorCode()));
    }

    @ExceptionHandler(RateLimitException.class)
    public ResponseEntity<ApiResponse<Void>> handleRateLimitException(
            RateLimitException ex, HttpServletRequest request) {
        log.warn("Rate limit exceeded: [{}]", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponse.error(ex.getMessage(), "RATE_LIMIT_EXCEEDED"));
    }

    @ExceptionHandler(FileUploadException.class)
    public ResponseEntity<ApiResponse<Void>> handleFileUploadException(
            FileUploadException ex, HttpServletRequest request) {
        log.error("File upload error: {} [{}]", ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage(), "FILE_UPLOAD_ERROR"));
    }

    // ── Spring Security Exceptions ────────────────────────────────────────────

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(
            AccessDeniedException ex, HttpServletRequest request) {
        log.warn("Access denied: [{}]", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("You do not have permission to perform this action.", "ACCESS_DENIED"));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentialsException(
            BadCredentialsException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Invalid credentials.", "INVALID_CREDENTIALS"));
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ApiResponse<Void>> handleDisabledException(
            DisabledException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("Your account has been disabled.", "ACCOUNT_DISABLED"));
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<ApiResponse<Void>> handleLockedException(
            LockedException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.LOCKED)
                .body(ApiResponse.error("Your account has been locked.", "ACCOUNT_LOCKED"));
    }

    // ── Validation Exceptions ─────────────────────────────────────────────────

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = error instanceof FieldError
                    ? ((FieldError) error).getField()
                    : error.getObjectName();
            errors.put(fieldName, error.getDefaultMessage());
        });
        log.warn("Validation failed: {} errors [{}]", errors.size(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.<Map<String, String>>builder()
                        .success(false)
                        .message("Validation failed")
                        .errorCode("VALIDATION_ERROR")
                        .data(errors)
                        .build());
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleConstraintViolationException(
            ConstraintViolationException ex, HttpServletRequest request) {
        Map<String, String> errors = ex.getConstraintViolations().stream()
                .collect(Collectors.toMap(
                        v -> v.getPropertyPath().toString(),
                        ConstraintViolation::getMessage,
                        (a, b) -> a
                ));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.<Map<String, String>>builder()
                        .success(false)
                        .message("Constraint violation")
                        .errorCode("CONSTRAINT_VIOLATION")
                        .data(errors)
                        .build());
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<Void>> handleMissingParam(
            MissingServletRequestParameterException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Required parameter '" + ex.getParameterName() + "' is missing.", "MISSING_PARAMETER"));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Invalid value '" + ex.getValue() + "' for parameter '" + ex.getName() + "'.", "TYPE_MISMATCH"));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Malformed JSON request body.", "MALFORMED_JSON"));
    }

    // ── Database Exceptions ───────────────────────────────────────────────────

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolation(
            DataIntegrityViolationException ex, HttpServletRequest request) {
        log.error("Data integrity violation: [{}]", request.getRequestURI(), ex);
        String message = "Data integrity constraint violated.";
        if (ex.getMessage() != null && ex.getMessage().contains("duplicate key")) {
            message = "A record with the same unique value already exists.";
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(message, "DUPLICATE_KEY"));
        }
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(message, "DATA_INTEGRITY_ERROR"));
    }

    // ── File Upload ───────────────────────────────────────────────────────────

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse<Void>> handleMaxUploadSizeExceeded(
            MaxUploadSizeExceededException ex) {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(ApiResponse.error("File size exceeds the maximum allowed limit of 10MB.", "FILE_TOO_LARGE"));
    }

    // ── Fallback ──────────────────────────────────────────────────────────────

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(
            Exception ex, HttpServletRequest request) {
        String traceId = UUID.randomUUID().toString();
        log.error("Unhandled exception [traceId={}] [{}]: {}", traceId, request.getRequestURI(), ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(
                        "An unexpected error occurred. Please contact support with traceId: " + traceId,
                        "INTERNAL_SERVER_ERROR",
                        traceId
                ));
    }
}
