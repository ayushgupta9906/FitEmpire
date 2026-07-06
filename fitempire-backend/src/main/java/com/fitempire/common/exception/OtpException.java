package com.fitempire.common.exception;

import lombok.Getter;

@Getter
public class OtpException extends RuntimeException {
    private final String errorCode;

    public OtpException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}
