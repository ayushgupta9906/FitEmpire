---

## 10. Production Implementation Code Snippets for Core Business Logic

### 10.1 Razorpay Webhook Verification & Idempotent Order Fulfillment (`RazorpayWebhookController.java`)

```java
package com.fitempire.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitempire.backend.service.OrderFulfillmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.HmacAlgorithms;
import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;

@Slf4j
@RestController
@RequestMapping("/v1/payments")
@RequiredArgsConstructor
public class RazorpayWebhookController {

    private final OrderFulfillmentService fulfillmentService;
    private final ObjectMapper objectMapper;

    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    @PostMapping(value = "/webhook", consumes = "application/json")
    public ResponseEntity<String> handleRazorpayWebhook(
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature,
            @RequestBody String rawPayload) {

        if (signature == null || signature.isBlank()) {
            log.warn("Rejected webhook: Missing X-Razorpay-Signature header");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing signature");
        }

        // Cryptographic HMAC-SHA256 signature verification
        String expectedSignature = new HmacUtils(HmacAlgorithms.HMAC_SHA_256, webhookSecret)
                .hmacHex(rawPayload.getBytes(StandardCharsets.UTF_8));

        if (!expectedSignature.equals(signature)) {
            log.error("SECURITY ALERT: Razorpay webhook HMAC signature mismatch! Possible spoofing attempt.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid signature");
        }

        try {
            JsonNode root = objectMapper.readTree(rawPayload);
            String eventType = root.path("event").asText();

            if ("payment.captured".equals(eventType) || "order.paid".equals(eventType)) {
                JsonNode paymentEntity = root.path("payload").path("payment").path("entity");
                String razorpayOrderId = paymentEntity.path("order_id").asText();
                String razorpayPaymentId = paymentEntity.path("id").asText();
                long amountInPaise = paymentEntity.path("amount").asLong();

                log.info("Processing captured payment: orderId={}, paymentId={}, amount={} paise",
                        razorpayOrderId, razorpayPaymentId, amountInPaise);

                // Execute idempotent fulfillment inside a managed transaction
                fulfillmentService.fulfillOrder(razorpayOrderId, razorpayPaymentId, amountInPaise);
            }

            return ResponseEntity.ok("WEBHOOK_PROCESSED_SUCCESSFULLY");

        } catch (Exception ex) {
            log.error("Failed to parse or fulfill Razorpay webhook payload: {}", ex.getMessage(), ex);
            // Return 200 to prevent Razorpay retry storms if issue is unrecoverable business logic error
            return ResponseEntity.ok("ERROR_HANDLED_INTERNALLY");
        }
    }
}
```

---

### 10.2 Dynamic Optical Turnstile QR Nonce Engine (`TurnstileSecurityService.java`)

```java
package com.fitempire.backend.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TurnstileSecurityService {

    private final StringRedisTemplate redisTemplate;

    @Value("${jwt.secret}")
    private String jwtSecret;

    private static final Duration QR_TTL = Duration.ofSeconds(60);

    /**
     * Generates a dynamic, signed QR code token backed by an atomic single-use nonce in Redis.
     */
    public Map<String, Object> generateDynamicPass(UUID userId, UUID membershipId) {
        String nonce = UUID.randomUUID().toString();
        Instant now = Instant.now();
        Instant expiry = now.plus(QR_TTL);

        // Store nonce in Redis with 60-second self-destruct TTL
        String redisKey = "qr_nonce:" + nonce;
        String payloadValue = userId + ":" + membershipId;
        redisTemplate.opsForValue().set(redisKey, payloadValue, QR_TTL);

        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        String signedQrJwt = Jwts.builder()
                .setSubject(userId.toString())
                .claim("membershipId", membershipId.toString())
                .claim("nonce", nonce)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiry))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        return Map.of(
                "qrToken", signedQrJwt,
                "nonce", nonce,
                "validForSeconds", 60,
                "expiresAt", expiry.toString()
        );
    }

    /**
     * Validates and atomically destroys the single-use nonce via Redis GETDEL command.
     */
    public boolean consumeSingleUseNonce(String nonce, UUID expectedUserId) {
        String redisKey = "qr_nonce:" + nonce;
        
        // GETDEL atomically retrieves and deletes the key in one single operation
        String cachedValue = redisTemplate.opsForValue().getAndDelete(redisKey);

        if (cachedValue == null) {
            log.warn("REPLAY OR EXPIRED QR ATTEMPT: Nonce {} not found in Redis", nonce);
            return false;
        }

        String[] parts = cachedValue.split(":");
        return parts[0].equals(expectedUserId.toString());
    }
}
```

---

### 10.3 Concurrency Control: Class Booking with Pessimistic Row Locking (`BookingService.java`)

```java
package com.fitempire.backend.service;

import com.fitempire.backend.exception.ClassFullException;
import com.fitempire.backend.model.ClassBooking;
import com.fitempire.backend.model.ClassSchedule;
import com.fitempire.backend.model.User;
import com.fitempire.backend.repository.ClassBookingRepository;
import com.fitempire.backend.repository.ClassScheduleRepository;
import com.fitempire.backend.repository.UserRepository;
import jakarta.persistence.LockModeType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final ClassScheduleRepository scheduleRepository;
    private final ClassBookingRepository bookingRepository;
    private final UserRepository userRepository;

    /**
     * Executes class booking under a PESSIMISTIC_WRITE row lock (SELECT ... FOR UPDATE)
     * to guarantee zero slot overbooking even under 100 concurrent requests.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public ClassBooking bookClassSlot(UUID scheduleId, UUID userId) {
        
        // Acquire exclusive row-level database lock on the class schedule row
        ClassSchedule schedule = scheduleRepository.findByIdWithPessimisticLock(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("Class schedule not found: " + scheduleId));

        if (schedule.getAvailableSlots() <= 0) {
            throw new ClassFullException("All slots for this class are booked.");
        }

        // Prevent duplicate bookings by the same user
        if (bookingRepository.existsByScheduleIdAndUserId(scheduleId, userId)) {
            throw new IllegalStateException("User has already reserved a slot in this class.");
        }

        // Decrement slot atomically inside the locked row transaction
        schedule.setAvailableSlots(schedule.getAvailableSlots() - 1);
        scheduleRepository.save(schedule);

        User user = userRepository.getReferenceById(userId);

        ClassBooking booking = ClassBooking.builder()
                .schedule(schedule)
                .user(user)
                .status(ClassBooking.BookingStatus.CONFIRMED)
                .bookedAt(Instant.now())
                .build();

        return bookingRepository.save(booking);
    }
}
```

---

### 10.4 Distributed Rate Limiting via Redis Lua Script (`RedisRateLimiter.java`)

```java
package com.fitempire.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class RedisRateLimiter {

    private final StringRedisTemplate redisTemplate;

    // Atomic Token-Bucket Lua Script executing inside Redis engine
    private static final String TOKEN_BUCKET_LUA =
            "local key = KEYS[1] " +
            "local limit = tonumber(ARGV[1]) " +
            "local current = tonumber(redis.call('get', key) or '0') " +
            "if current + 1 > limit then " +
            "    return 0 " + // Rate limit exceeded
            "else " +
            "    redis.call('INCRBY', key, 1) " +
            "    if current == 0 then " +
            "        redis.call('EXPIRE', key, tonumber(ARGV[2])) " +
            "    end " +
            "    return 1 " + // Allowed
            "end";

    public boolean isAllowed(String clientIdentifier, int maxRequestsPerWindow, int windowSeconds) {
        String key = "ratelimit:" + clientIdentifier;
        DefaultRedisScript<Long> script = new DefaultRedisScript<>(TOKEN_BUCKET_LUA, Long.class);

        Long result = redisTemplate.execute(
                script,
                Collections.singletonList(key),
                String.valueOf(maxRequestsPerWindow),
                String.valueOf(windowSeconds)
        );

        return result != null && result == 1L;
    }
}
```

---

### 10.5 React Native Dynamic Turnstile Pass Modal (`DynamicPassModal.tsx`)

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Brightness from 'expo-brightness';
import * as Haptics from 'expo-haptics';

interface DynamicPassModalProps {
  visible: boolean;
  onClose: () => void;
  tokenEndpoint: string;
}

export const DynamicPassModal: React.FC<DynamicPassModalProps> = ({ visible, onClose, tokenEndpoint }) => {
  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(60);
  const [loading, setLoading] = useState<boolean>(true);
  const originalBrightness = useRef<number>(0.5);

  const fetchPass = async () => {
    try {
      setLoading(true);
      const res = await fetch(tokenEndpoint, {
        headers: { 'Authorization': 'Bearer ' + 'USER_AUTH_TOKEN' }
      });
      const data = await res.json();
      if (data.success) {
        setQrPayload(data.data.qrToken);
        setCountdown(data.data.validForSeconds || 60);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (err) {
      console.error('Failed to load dynamic pass', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      // Save user brightness and boost to 100% for high-contrast optical scanners
      Brightness.getBrightnessAsync().then(val => { originalBrightness.current = val; });
      Brightness.setBrightnessAsync(1.0);
      fetchPass();

      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            fetchPass();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
        Brightness.setBrightnessAsync(originalBrightness.current);
      };
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Dynamic Turnstile Pass</Text>
          <Text style={styles.subtitle}>Present this QR code to the optical barrier reader</Text>

          <View style={styles.qrContainer}>
            {loading || !qrPayload ? (
              <ActivityIndicator size="large" color="#E11D48" />
            ) : (
              <QRCode value={qrPayload} size={220} backgroundColor="#FFFFFF" color="#000000" />
            )}
          </View>

          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>Refreshes in {countdown}s</Text>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  card: { width: '85%', backgroundColor: '#18181B', borderRadius: 24, padding: 24, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: '#FAFAFA' },
  subtitle: { fontSize: 13, color: '#A1A1AA', textAlign: 'center', marginTop: 4, marginBottom: 20 },
  qrContainer: { padding: 16, backgroundColor: '#FFFFFF', borderRadius: 16 },
  timerBadge: { marginTop: 16, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#27272A', borderRadius: 20 },
  timerText: { color: '#E11D48', fontWeight: '600', fontSize: 13 },
  closeBtn: { marginTop: 24, paddingVertical: 12, width: '100%', backgroundColor: '#27272A', borderRadius: 12, alignItems: 'center' },
  closeBtnText: { color: '#FAFAFA', fontWeight: '600', fontSize: 16 }
});
```

---

### 10.6 React Partner Portal STOMP WebSocket Turnstile Hook (`useLiveTurnstileFeed.ts`)

```typescript
import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface TurnstileCheckInEvent {
  checkInId: string;
  memberId: string;
  fullName: string;
  membershipTier: string;
  status: 'APPROVED' | 'REJECTED';
  timestamp: string;
  avatarUrl?: string;
}

export function useLiveTurnstileFeed(branchId: string) {
  const [events, setEvents] = useState<TurnstileCheckInEvent[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!branchId) return;

    const stompClient = new Client({
      webSocketFactory: () => new SockJS('https://api.fitempire.in/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true);
        stompClient.subscribe(`/topic/turnstile/${branchId}`, message => {
          if (message.body) {
            const newEvent: TurnstileCheckInEvent = JSON.parse(message.body);
            setEvents(prev => [newEvent, ...prev.slice(0, 49)]); // Keep last 50 events in buffer
          }
        });
      },
      onDisconnect: () => setIsConnected(false),
      onStompError: frame => console.error('STOMP Broker Error:', frame.headers['message'])
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [branchId]);

  return { events, isConnected };
}
```
