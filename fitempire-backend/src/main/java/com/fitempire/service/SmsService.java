package com.fitempire.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SmsService {

    @Value("${app.twilio.account-sid}")
    private String accountSid;

    @Value("${app.twilio.auth-token}")
    private String authToken;

    @Value("${app.twilio.from-number}")
    private String fromNumber;

    @PostConstruct
    public void init() {
        if (accountSid != null && !accountSid.isBlank()) {
            Twilio.init(accountSid, authToken);
            log.info("Twilio SMS service initialized");
        }
    }

    @Async
    public void sendOtp(String toPhone, String otp) {
        String internationalPhone = "+91" + toPhone;
        String messageBody = "Your FitEmpire OTP is: " + otp + ". Valid for 10 minutes. Do NOT share this with anyone. -FitEmpire";

        if (accountSid == null || accountSid.isBlank()) {
            log.warn("SMS not sent (Twilio not configured). OTP for {}: {}", maskPhone(toPhone), otp);
            return;
        }

        try {
            Message message;
            if (fromNumber != null && fromNumber.trim().startsWith("MG")) {
                message = Message.creator(
                        new PhoneNumber(internationalPhone),
                        fromNumber.trim(),
                        messageBody
                ).create();
            } else {
                message = Message.creator(
                        new PhoneNumber(internationalPhone),
                        new PhoneNumber(fromNumber),
                        messageBody
                ).create();
            }
            log.info("OTP SMS sent to {} [SID: {}]", maskPhone(toPhone), message.getSid());
        } catch (Exception e) {
            log.error("Failed to send OTP SMS to {}: {}", maskPhone(toPhone), e.getMessage());
        }
    }

    @Async
    public void sendSms(String toPhone, String message) {
        if (accountSid == null || accountSid.isBlank()) {
            log.warn("SMS not configured. Would send to {}: {}", maskPhone(toPhone), message);
            return;
        }
        try {
            if (fromNumber != null && fromNumber.trim().startsWith("MG")) {
                Message.creator(
                        new PhoneNumber("+91" + toPhone),
                        fromNumber.trim(),
                        message
                ).create();
            } else {
                Message.creator(
                        new PhoneNumber("+91" + toPhone),
                        new PhoneNumber(fromNumber),
                        message
                ).create();
            }
        } catch (Exception e) {
            log.error("Failed to send SMS to {}: {}", maskPhone(toPhone), e.getMessage());
        }
    }

    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) return "****";
        return "****" + phone.substring(phone.length() - 4);
    }
}
