package com.fitempire.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class BusinessException extends RuntimeException {
    private final String errorCode;
    private final HttpStatus status;

    public BusinessException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
        this.status = HttpStatus.BAD_REQUEST;
    }

    public BusinessException(String message, String errorCode, HttpStatus status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
    }
}
