package com.fitempire.service;

import com.fitempire.modules.bookings.entity.Booking;
import com.fitempire.modules.payments.entity.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.from-name}")
    private String fromName;

    @Async
    public void sendWelcomeEmail(String toEmail, String firstName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, fromName);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to FitEmpire 🏋️ - Your fitness journey starts now!");
            helper.setText(buildWelcomeHtml(firstName), true);
            mailSender.send(message);
            log.info("Welcome email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String firstName, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, fromName);
            helper.setTo(toEmail);
            helper.setSubject("FitEmpire — Password Reset OTP");
            helper.setText(buildPasswordResetHtml(firstName, otp), true);
            mailSender.send(message);
            log.info("Password reset email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendBookingConfirmation(String toEmail, Booking booking) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Booking Confirmed — " + booking.getGym().getName());
            message.setText(String.format(
                "Your booking has been confirmed!\n\nGym: %s\nDate: %s\nType: %s\nQR Token: %s\n\nSee you there! 💪",
                booking.getGym().getName(),
                booking.getBookingDate(),
                booking.getBookingType(),
                booking.getQrToken()
            ));
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send booking confirmation to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendBookingCancellation(String toEmail, Booking booking) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Booking Cancelled — " + booking.getGym().getName());
            message.setText(String.format(
                "Your booking at %s for %s has been cancelled.\n\nReason: %s",
                booking.getGym().getName(),
                booking.getBookingDate(),
                booking.getCancellationReason()
            ));
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send booking cancellation email: {}", e.getMessage());
        }
    }

    @Async
    public void sendPaymentConfirmation(String toEmail, Payment payment) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Payment Successful ✅ — FitEmpire");
            message.setText(String.format(
                "Payment of ₹%.2f has been received successfully.\n\nPayment ID: %s\n\nYour membership is now active!",
                payment.getNetAmount(), payment.getId()
            ));
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send payment confirmation: {}", e.getMessage());
        }
    }

    @Async
    public void sendRefundConfirmation(String toEmail, BigDecimal amount, Payment payment) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Refund Processed — FitEmpire");
            message.setText(String.format(
                "A refund of ₹%.2f has been processed for payment %s.\n\nIt may take 5-7 business days to reflect in your account.",
                amount, payment.getId()
            ));
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send refund confirmation: {}", e.getMessage());
        }
    }

    // ── HTML Email Templates ──────────────────────────────────────────────────

    private String buildWelcomeHtml(String firstName) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="font-family:Inter,sans-serif;background:#0a0a0a;color:#fff;margin:0;padding:40px">
              <div style="max-width:600px;margin:0 auto;background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:20px;padding:40px">
                <h1 style="background:linear-gradient(135deg,#6c63ff,#ff6584);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:32px;margin:0 0 20px">
                  Welcome to FitEmpire! 🏋️
                </h1>
                <p style="color:#a0aec0;font-size:16px">Hey %s,</p>
                <p style="color:#a0aec0;font-size:16px">
                  India's next-generation fitness platform is now at your fingertips.
                  Discover gyms, book classes, track progress, and earn rewards — all in one place.
                </p>
                <a href="https://fitempire.in/app" style="display:inline-block;background:linear-gradient(135deg,#6c63ff,#ff6584);color:#fff;text-decoration:none;padding:14px 30px;border-radius:50px;font-weight:700;font-size:16px;margin-top:20px">
                  Get Started →
                </a>
                <p style="color:#4a5568;font-size:13px;margin-top:40px">Team FitEmpire 💪</p>
              </div>
            </body>
            </html>
            """.formatted(firstName);
    }

    private String buildPasswordResetHtml(String firstName, String otp) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="font-family:Inter,sans-serif;background:#0a0a0a;color:#fff;margin:0;padding:40px">
              <div style="max-width:600px;margin:0 auto;background:#1a1a2e;border-radius:20px;padding:40px">
                <h1 style="color:#fff;font-size:24px">Password Reset Request</h1>
                <p style="color:#a0aec0">Hey %s, use the OTP below to reset your password:</p>
                <div style="background:#6c63ff;color:#fff;font-size:40px;font-weight:900;letter-spacing:12px;text-align:center;padding:20px 30px;border-radius:12px;margin:30px 0">
                  %s
                </div>
                <p style="color:#718096;font-size:13px">Valid for 10 minutes. Do not share this OTP with anyone.</p>
              </div>
            </body>
            </html>
            """.formatted(firstName, otp);
    }
}
