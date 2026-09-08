---

## 9. Core Business Workflows & Sequence Diagrams

### 9.1 Dynamic Optical Turnstile Check-In (60-Second Single-Use Nonce)
This workflow mitigates screenshot pass sharing (Issue FE-152) and guarantees sub-100ms barrier opening:

```mermaid
sequenceDiagram
    autonumber
    actor Member as Member (Mobile App)
    participant Server as FitEmpire Backend
    participant Redis as Redis L2 Cache
    participant Scanner as Partner Desk / Turnstile
    participant Turnstile as Optical Barrier Relay Gate

    Member->>Server: GET /v1/membership/qr-token (JWT Bearer)
    Server->>Server: Verify Active Pass & Daily Check-in Quota
    Server->>Server: Generate Cryptographic Nonce (UUIDv4)
    Server->>Redis: SETEX qr_nonce:{nonce} 60 {userId, planId, branchId}
    Server-->>Member: Return Signed QR Payload (exp: 60s)
    Member->>Scanner: Present Screen to Turnstile Scanner
    Scanner->>Server: POST /v1/partner/check-in {qrPayload, turnstileSerial}
    Server->>Server: Verify JWT Signature & Check Expiration
    Server->>Redis: GETDEL qr_nonce:{nonce} (Atomic Single-Use Check)
    alt Nonce Missing or Already Consumed
        Server-->>Scanner: 400 REJECTED ("QR code already used or expired")
        Scanner-->>Member: Buzz Alarm & Display "Invalid Pass"
    else Nonce Valid
        Server->>Server: Insert ATTENDANCE_RECORDS (Status: APPROVED)
        Server->>Server: Increment Gym Current Occupancy
        Server-->>Scanner: 200 APPROVED ("Ayush Gupta - Platinum Pass")
        Scanner->>Turnstile: Send 12V GPIO Signal (Open Barrier)
        Turnstile-->>Member: Barrier Rotates Open
        Server->>Redis: PUBLISH turnstile:live:{branchId} {checkInData}
    end
```

---

### 9.2 Razorpay Webhook Payment Capture & Membership Provisioning
Guarantees zero lost orders even if the user closes their browser or loses connectivity after funds are deducted:

```mermaid
sequenceDiagram
    autonumber
    actor User as User Mobile Client
    participant Razorpay as Razorpay Gateway
    participant Backend as FitEmpire Backend Webhook
    participant Redis as Redis Lock
    participant DB as PostgreSQL Primary

    User->>Razorpay: Complete UPI Intent Payment (₹7,079.29)
    Razorpay-->>User: Show Payment Success Screen
    Note over Razorpay,Backend: Asynchronous Server-to-Server Webhook
    Razorpay->>Backend: POST /v1/payments/webhook (X-Razorpay-Signature)
    Backend->>Backend: Compute HMAC-SHA256(body, webhookSecret)
    alt Signature Mismatch (Spoofing Attempt)
        Backend-->>Razorpay: 401 Unauthorized (Ignore)
    else Signature Valid
        Backend->>Redis: SET lock:payment:{paymentId} NX PX 10000
        alt Lock Failed (Concurrent Duplicate Webhook)
            Backend-->>Razorpay: 200 OK ("Already Processing")
        else Lock Acquired
            Backend->>DB: Check Order Status (SELECT status FROM orders WHERE razorpay_order_id = ?)
            alt Order Already Marked CAPTURED
                Backend-->>Razorpay: 200 OK ("Idempotent No-Op")
            else Order Still PENDING
                Backend->>DB: UPDATE orders SET status = 'CAPTURED', razorpay_payment_id = ?
                Backend->>DB: INSERT INTO memberships (user_id, plan_id, start_date, end_date, status)
                Backend->>DB: INSERT INTO wallet_ledger (Audit entry)
                Backend-->>Razorpay: 200 OK ("Order Fulfilled")
                Backend->>User: Push Notification ("Membership Activated! 🎉")
            end
            Backend->>Redis: DEL lock:payment:{paymentId}
        end
    end
```

---

### 9.3 Corporate Work Email Verification & Subsidy Allocation Flow
Eliminates the vulnerability in `EcosystemController.java` (SEC-001) by enforcing strict domain verification and 6-digit email OTPs:

```mermaid
sequenceDiagram
    autonumber
    actor Employee as Corporate Employee
    participant Backend as FitEmpire Backend
    participant MailServer as Corporate MX Mail Server
    participant DB as PostgreSQL Primary

    Employee->>Backend: POST /v1/corporate/verify-domain {workEmail: "ayush@google.com"}
    Backend->>Backend: Extract Domain: "google.com"
    Backend->>DB: SELECT * FROM corporate_partnerships WHERE work_email_domain = 'google.com' AND is_active = true
    alt Company Not Found or Inactive
        Backend-->>Employee: 404 Not Found ("Your company is not an active corporate partner")
    else Company Active
        Backend->>Backend: Generate 6-Digit Cryptographic OTP (e.g. 849201)
        Backend->>Backend: Store OTP in Redis: SETEX corp_otp:{workEmail} 300 849201
        Backend->>MailServer: Send Email via AWS SES to ayush@google.com
        Backend-->>Employee: 200 OK ("Verification code sent to your work inbox")
        Employee->>Backend: POST /v1/corporate/verify-otp {workEmail, otp: "849201"}
        Backend->>Backend: Redis GETDEL corp_otp:{workEmail}
        alt OTP Mismatch or Expired
            Backend-->>Employee: 400 Bad Request ("Invalid or expired OTP")
        else OTP Valid
            Backend->>DB: UPDATE users SET corporate_partnership_id = ?, is_corporate_verified = true
            Backend-->>Employee: 200 OK ("Verified! 40% Corporate Subsidy Unlocked.")
        end
    end
```

---

### 9.4 Multi-Terminal Real-Time Attendance Synchronization (STOMP over WebSocket)

```mermaid
sequenceDiagram
    autonumber
    actor Desk1 as Desk Terminal 1 (Scanner)
    actor Desk2 as Desk Terminal 2 (Manager Monitor)
    participant Broker as WebSocket Broker (Spring Boot STOMP)
    participant PubSub as Redis Pub/Sub Bus

    Desk1->>Broker: CONNECT /ws (STOMP Protocol)
    Desk2->>Broker: CONNECT /ws (STOMP Protocol)
    Desk1->>Broker: SUBSCRIBE /topic/turnstile/{branchId}
    Desk2->>Broker: SUBSCRIBE /topic/turnstile/{branchId}
    Note over Desk1,Broker: Turnstile Scanner Approved a Check-In
    Desk1->>Broker: POST /v1/partner/check-in
    Broker->>PubSub: PUBLISH branch:{branchId}:checkin {memberData}
    PubSub->>Broker: Fan-out to all connected WebSocket pods
    Broker-->>Desk1: MESSAGE /topic/turnstile/{branchId} {memberData}
    Broker-->>Desk2: MESSAGE /topic/turnstile/{branchId} {memberData}
    Note over Desk1,Desk2: Both browser screens update live in <50ms without reload
```
