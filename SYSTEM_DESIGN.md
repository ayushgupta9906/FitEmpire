# FitEmpire — End-to-End System Design & Architecture Blueprint
**Version:** 2.0 | **Architecture Classification:** Modular Enterprise Fitness Ecosystem | **Date:** September 2026

---

## Table of Contents
1. [Executive Summary & Product Vision](#1-executive-summary--product-vision)
2. [Current Architecture — As-Built (What is ALREADY Developed)](#2-current-architecture--as-built-what-is-already-developed)
3. [Gap Analysis & Technical Debt (What is Mocked vs Missing)](#3-gap-analysis--technical-debt-what-is-mocked-vs-missing)
4. [Enterprise Target System Architecture](#4-enterprise-target-system-architecture)
5. [Complete Relational Database Schema & Data Models](#5-complete-relational-database-schema--data-models)
6. [Core Business Workflows & Sequence Diagrams](#6-core-business-workflows--sequence-diagrams)
7. [Department-by-Department Engineering Blueprint](#7-department-by-department-engineering-blueprint)
   - [7.1 Backend Engineering (Java 21 / Spring Boot 3.2.5)](#71-backend-engineering-java-21--spring-boot-325)
   - [7.2 Mobile Engineering (React Native / Android Studio Native)](#72-mobile-engineering-react-native--android-studio-native)
   - [7.3 Frontend Web Engineering (Partner Portal & Admin Console)](#73-frontend-web-engineering-partner-portal--admin-console)
   - [7.4 DevOps, Cloud & Site Reliability (AWS / Docker / CI/CD)](#74-devops-cloud--site-reliability-aws--docker--cicd)
   - [7.5 Information Security & Regulatory Compliance](#75-information-security--regulatory-compliance)
   - [7.6 AI & Machine Learning Engineering (FitCoach & ARIA)](#76-ai--machine-learning-engineering-fitcoach--aria)
8. [Prioritized 4-Phase Execution Roadmap](#8-prioritized-4-phase-execution-roadmap)

---

## 1. Executive Summary & Product Vision

### 1.1 Business Model Overview
FitEmpire is an omni-channel fitness ecosystem designed to directly disrupt legacy fitness aggregator models (such as Fitpass and Cult.fit) in the Indian subcontinent. The platform bridges three distinct stakeholder segments:
- **B2C Gym Members:** Single subscription pass granting daily entry access across 12,000+ gyms, swimming pools, yoga ashrams, MMA combat rings, and badminton academies, augmented by AI workout generation, meal tracking, and telehealth consultations.
- **B2B Gym Partners:** Front-desk check-in management, optical turnstile QR scanning, member attendance auditing, class/batch scheduling, and automated monthly revenue settlements.
- **B2B Corporate Enterprises:** Subsidized or co-funded fitness passes for enterprise employees (e.g. TCS, Google, Infosys) with corporate health risk assessment (HRA) tracking.

```
       ┌────────────────────────────────────────────────────────┐
       │                   FITEMPIRE PLATFORM                   │
       └───────────────────────────┬────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
 ┌───────────────┐         ┌───────────────┐         ┌───────────────┐
 │   B2C USERS   │         │ B2B PARTNERS  │         │ B2B CORPORATE │
 │ (Mobile App)  │         │(Portal & Desk)│         │ (HR / Subsidy)│
 └───────┬───────┘         └───────┬───────┘         └───────┬───────┘
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   ▼
                   ┌───────────────────────────────┐
                   │  SPRING BOOT MODULAR BACKEND  │
                   │ (Neon PostgreSQL + Redis L2)  │
                   └───────────────────────────────┘
```

---

## 2. Current Architecture — As-Built (What is ALREADY Developed)

The FitEmpire codebase is structured as a multi-repository workspace consisting of 4 client frontends and 1 Spring Boot backend:

```
FitEmpire/
├── fitempire-backend/         # Java 21 / Spring Boot 3.2.5 REST API Service
├── fitempire-mobile/          # React Native / Expo SDK 51 / Android Studio Native Member App
├── fitempire-partner/         # React 18 / Vite / Tailwind Partner Web Portal
├── fitempire-partner-mobile/  # React Native Partner Android Scanner App
├── fitempire-web/             # React 18 / Vite Customer Landing Page & Admin Console
├── scripts/                   # AWS deployment scripts, database seeders, Jira CSV utilities
└── docker-compose.yml         # Container definitions for Backend, Postgres, Redis
```

### 2.1 Backend Subsystem (`fitempire-backend`)
- **Runtime:** Java 21, Spring Boot 3.2.5, Spring Security 6.2, Spring Data JPA, Hibernate 6.4.
- **Database Layer:** Neon Cloud PostgreSQL (Serverless connection pooler on AWS `us-east-1`), HikariCP connection pool.
- **Caching Layer:** Redis 7 (Lettuce client) for token blacklisting and session metadata.
- **Security & Auth:** Stateless JWT authentication (`JwtAuthenticationFilter`), BCrypt password hashing (strength 12), Role-Based Access Control (`SUPER_ADMIN`, `PARTNER`, `USER`).
- **Payments:** Razorpay Java SDK 1.4.3 (`/v1/payments/create-order`, `/v1/payments/verify`).
- **Database Seeder (`DatabaseSeeder.java`):** Auto-seeds Super Admin (`admin@fitempire.tech`) and Partner accounts with BCrypt hashes.

### 2.2 Mobile Subsystem (`fitempire-mobile`)
- **Runtime:** React Native 0.74, Expo SDK 51, Expo Router (file-based navigation), TypeScript.
- **Native Android Shell:** Android Studio Gradle setup (`compileSdkVersion 34`, `targetSdkVersion 34`, Hermes JavaScript engine enabled).
- **Core Screens Implemented:**
  - `(tabs)/index.tsx`: Home dashboard with active pass status card, category pills, nearby gyms carousel.
  - `explore.tsx`: Geolocation Haversine gym finder with search, distance filtering, and city selectors.
  - `membership.tsx`: Plan comparison catalog (Flexi-Credits, Off-Peak, FitEmpire 360 Annual, Corporate), 1-tap pass freeze/pause.
  - `qr-checkin.tsx` & `scan.tsx`: Dynamic optical QR code generator for front-desk turnstile check-in.
  - `ai-workout.tsx`: FitCoach AI workout generator, routine builder, and macro nutrition counter.
  - `onboarding-hra.tsx`: 4-step Health Risk Assessment survey (BMI, daily calories, protein goals).
  - `refer.tsx`: Member referral code generation and wallet reward sharing.
  - `store.tsx`: Fitness apparel, adjustable dumbbells, and whey protein supplement catalog.
  - `tv.tsx`: Virtual HD on-demand workout classes library.
  - `corporate.tsx`: Corporate employee subsidy verification.

### 2.3 Partner Web Portal (`fitempire-partner`)
- **Runtime:** React 18, Vite, Lucide Icons, React Router v6.
- **Core Modules Implemented:**
  - `ScannerPage.tsx`: Hardware webcam barcode/QR scanner (`html5-qrcode`) decoding member tokens.
  - `AttendancePage.tsx`: Real-time attendance ledger, search by member phone, CSV export.
  - `ClassesPage.tsx`: Group fitness batch scheduler (Zumba, CrossFit, Yoga), trainer assignment, attendance roster.
  - `GymProfilePage.tsx`: Gym operational settings (operating hours, phone, amenities checkboxes, cover photo upload).
  - `RevenuePage.tsx`: Monthly settlement breakdown, check-in credit summaries, payout history.

### 2.4 Customer Landing Page & Admin Console (`fitempire-web`)
- **Landing Page:** Hero conversion funnel, pricing tables, gym network interactive locator, corporate inquiry form.
- **Admin Console (`/admin/*`):** User management table, gym approval verification queue, platform coupon code generator, refund request manager, financial payment audits.

---

## 3. Gap Analysis & Technical Debt (What is Mocked vs Missing)

While the user interface and core REST endpoints are established, our codebase audit revealed several critical functional gaps and technical debt:

| Component | Current State (What is in Code) | Target Enterprise Requirement |
|---|---|---|
| **Razorpay Webhooks** | Only client-side `/verify` exists; no `/v1/payments/webhook` endpoint. | Server-to-server webhook endpoint verifying `X-Razorpay-Signature` HMAC-SHA256 to guarantee fulfillment if user mobile battery dies mid-payment. |
| **Corporate Subsidy** | Naive substring check: `email.contains("google")` grants 100% discount on ₹7,999 passes to any fake email. | Strict domain verification (`@google.com`), corporate partnership quota enforcement, and 6-digit email OTP verification. |
| **Store & E-Commerce** | Products in `EcosystemController.java` are hardcoded in-memory maps; orders do not decrement inventory stock. | Relational `products`, `orders`, and `inventory` tables with atomic database decrements and courier PIN code serviceability checks. |
| **Telehealth Care** | Doctor profiles display static slots ("Today 04:30 PM"); "Book" triggers a mock `Alert.alert`. | Relational `doctor_appointments` table, slot concurrency locks, and WebRTC/Agora in-app video room launcher. |
| **Pass Freeze / Pause** | `catch (e)` blocks in `membership.tsx` swallow network errors and show fake "Pass Frozen" alert. | Robust error handling rolling back optimistic UI, alerting user of failure, and logging error telemetry. |
| **Turnstile Check-In Sync** | Partner attendance uses local browser DOM events (`fitempire:checkin`), failing multi-terminal desks. | WebSocket (STOMP over SockJS) or Server-Sent Events (SSE) broadcasting check-in events across all active terminals. |
| **Database Migrations** | `spring.jpa.hibernate.ddl-auto: update` with Flyway disabled (`flyway.enabled: false`). | `ddl-auto: validate` with versioned Flyway migrations (`V1__...`, `V2__...`) and automated rollback scripts. |
| **Async Thread Pool** | `@Async` uses unpooled `SimpleAsyncTaskExecutor`, risking thread exhaustion on notification bursts. | Dedicated `ThreadPoolTaskExecutor` bean with bounded queue capacity and backpressure rejection policies. |

---

## 4. Enterprise Target System Architecture

```mermaid
flowchart TB
    subgraph Clients["CLIENT CHANNELS"]
        M_APP["Member Mobile App\n(React Native / Android Studio)"]
        P_WEB["Partner Portal Web\n(React / Vite / Turnstile Scanner)"]
        A_WEB["Admin Web Console\n(React / Vite)"]
        L_WEB["Landing Website\n(Vite / SSR)"]
    end

    subgraph Gateway["API GATEWAY & EDGE SECURITY"]
        NGINX["Nginx Edge Proxy\n(SSL Termination / Gzip / HSTS / Rate Limiter)"]
        WAF["ModSecurity / Cloudflare WAF\n(DDoS / Bot Honeypot / OWASP Top 10)"]
    end

    subgraph BackendCluster["SPRING BOOT MODULAR MONOLITH (Java 21)"]
        direction TB
        AUTH_MOD["Security & Auth Module\n(JWT / BCrypt / RBAC)"]
        GYM_MOD["Gyms & Search Module\n(Haversine / PostGIS Spatial)"]
        PASS_MOD["Membership & Plans Module\n(Pass Freeze / Buddy Passes)"]
        BOOK_MOD["Bookings & Turnstile Module\n(QR Engine / Concurrency Locks)"]
        PAY_MOD["Payments & Ledger Module\n(Razorpay Webhooks / Wallet)"]
        ECO_MOD["Ecosystem & B2B Module\n(Store / AI FitCoach / Corporate)"]
        SCHED["Async & Scheduled Workers\n(ShedLock / Pass Expiry Batch)"]
    end

    subgraph Persistence["DATA & STORAGE LAYER"]
        POSTGRES[("PostgreSQL 16 Primary\n(Neon Cloud / Read Replicas)")]
        REDIS[("Redis 7 Cluster\n(Cache L2 / QR Nonces / Session / Rate Limit)")]
        S3[("AWS S3 Bucket\n(Gym Photos / Prescriptions / Standee PDFs)")]
    end

    subgraph External["THIRD-PARTY INTEGRATIONS"]
        RAZORPAY["Razorpay Payment Gateway\n(UPI / Cards / Recurring Mandates)"]
        SMS_GW["SMS Gateway (Twilio / Gupshup)\n(Transactional OTPs)"]
        FCM["Firebase Cloud Messaging (FCM)\n(Push Notifications)"]
        LLM["OpenAI / Claude API\n(FitCoach AI Workout Generator)"]
    end

    Clients --> WAF --> NGINX --> BackendCluster
    BackendCluster <--> POSTGRES
    BackendCluster <--> REDIS
    BackendCluster <--> S3
    BackendCluster <--> External
```

---

## 5. Complete Relational Database Schema & Data Models

The following Entity-Relationship schema unifies all 200 issue specifications across the system:

```mermaid
erDiagram
    USERS ||--o{ MEMBERSHIPS : purchases
    USERS ||--o{ BOOKINGS : reserves
    USERS ||--o{ ATTENDANCE_RECORDS : checks_in
    USERS ||--o{ WALLET_TRANSACTIONS : owns
    USERS ||--o{ ORDERS : places
    GYMS ||--|{ BRANCHES : operates
    BRANCHES ||--o{ WORKOUT_CLASSES : hosts
    WORKOUT_CLASSES ||--o{ BOOKINGS : contains
    BRANCHES ||--o{ ATTENDANCE_RECORDS : logs
    MEMBERSHIPS ||--o{ PASS_FREEZES : has
    ORDERS ||--|{ ORDER_ITEMS : contains
    CORPORATE_PARTNERSHIPS ||--o{ USERS : subsidizes

    USERS {
        uuid id PK
        string email UK
        string phone UK
        string password_hash
        string first_name
        string last_name
        string role
        string corporate_domain
        boolean is_deleted
        timestamp created_at
    }

    GYMS {
        uuid id PK
        string name
        string slug UK
        string status
        boolean featured
        float avg_rating
        uuid owner_id FK
        boolean is_deleted
    }

    BRANCHES {
        uuid id PK
        uuid gym_id FK
        string city
        string address
        decimal latitude
        decimal longitude
        jsonb operating_hours
        jsonb amenities
        boolean active
    }

    MEMBERSHIPS {
        uuid id PK
        uuid user_id FK
        string plan_code
        date start_date
        date end_date
        string status
        int daily_entry_limit
        int remaining_freeze_days
    }

    BOOKINGS {
        uuid id PK
        uuid user_id FK
        uuid branch_id FK
        uuid class_id FK
        date booking_date
        time start_time
        string status
        int version
    }

    ATTENDANCE_RECORDS {
        uuid id PK
        uuid user_id FK
        uuid branch_id FK
        uuid checked_by_staff_id FK
        timestamp check_in_time
        string verification_method
        string status
    }

    CORPORATE_PARTNERSHIPS {
        uuid id PK
        string company_name
        string email_domain UK
        int subsidy_percentage
        int allocated_quota
        int active_pass_count
    }
```

---

## 6. Core Business Workflows & Sequence Diagrams

### 6.1 Dynamic Optical Turnstile Check-In (60-Second Nonce Flow)
This flow mitigates QR screenshot sharing (Issue FE-152) and guarantees instant turnstile opening:

```mermaid
sequenceDiagram
    autonumber
    actor Member as Member (Mobile App)
    participant Server as FitEmpire Backend
    participant Redis as Redis L2 Cache
    participant Scanner as Partner Desk / Turnstile
    participant Turnstile as Optical Barrier Gate

    Member->>Server: GET /v1/membership/qr-token (JWT Bearer)
    Server->>Server: Verify Active Pass & Daily Entry Quota
    Server->>Server: Generate Cryptographic Nonce (UUID)
    Server->>Redis: SETEX qr_nonce:{nonce} 60 {userId, planId}
    Server-->>Member: Return Dynamic QR Payload (Signed JWT, exp: 60s)
    Member->>Scanner: Present QR Code to Optical Reader
    Scanner->>Server: POST /v1/partner/check-in {qrPayload, staffId}
    Server->>Server: Verify Signature & Expiry Timestamp
    Server->>Redis: GETDEL qr_nonce:{nonce} (Atomic Single-Use Check)
    alt Nonce Missing or Already Consumed (Replay Attack)
        Server-->>Scanner: 400 REJECTED ("QR code already used or expired")
    else Nonce Valid
        Server->>Server: Insert ATTENDANCE_RECORDS (Status: CHECKED_IN)
        Server->>Server: Increment Member Daily Visit Counter
        Server-->>Scanner: 200 APPROVED ("Rahul Sharma - Gold Pass")
        Scanner->>Turnstile: Trigger Relay Switch (Open Barrier)
        Server->>Member: Push Notification ("Welcome to Iron Culture Gym! 💪")
    end
```

### 6.2 Razorpay Webhook Payment Capture & Membership Provisioning
This flow guarantees zero lost memberships even if mobile connection terminates mid-payment (Issue FE-123 & FE-164):

```mermaid
sequenceDiagram
    autonumber
    actor User as Member Mobile App
    participant PG as Razorpay Gateway
    participant Backend as FitEmpire Backend
    participant DB as PostgreSQL Database
    participant Notifications as SMS & Email Worker

    User->>Backend: POST /v1/payments/create-order {planId: "fit360"}
    Backend->>PG: razorpayClient.orders.create({amount: 799900, currency: "INR"})
    PG-->>Backend: Return order_id: "order_K8dJ29x"
    Backend->>DB: Save Payment (Status: PENDING, OrderId: "order_K8dJ29x")
    Backend-->>User: Return order_id
    User->>PG: Complete UPI / Card Payment
    Note over User,PG: User mobile phone battery dies or cellular drops

    PG->>Backend: POST /v1/payments/webhook [Header: X-Razorpay-Signature]
    Backend->>Backend: Verify HMAC-SHA256(webhook_secret, payload)
    alt Signature Invalid
        Backend-->>PG: 400 Bad Request
    else Signature Valid
        Backend->>Backend: Check Idempotency (Event ID in Redis)
        Backend->>DB: UPDATE Payment SET status='PAID' WHERE order_id=...
        Backend->>DB: Provision Membership (start_date: today, end_date: today + 365d)
        Backend->>DB: Credit +500 FitPoints to Member Wallet
        Backend-->>PG: 200 OK
        Backend->>Notifications: Trigger Async Order Invoice Email & SMS
    end
```

---

## 7. Department-by-Department Engineering Blueprint

### 7.1 Backend Engineering (Java 21 / Spring Boot 3.2.5)
- **Framework & Dependencies:**
  - Enforce Java 21 Virtual Threads (Project Loom) in `application.yml`:
    ```yaml
    spring:
      threads:
        virtual:
          enabled: true
    ```
  - Transition Hibernate to `spring.jpa.hibernate.ddl-auto: validate` and maintain versioned Flyway scripts in `src/main/resources/db/migration/`.
- **Concurrency & Transaction Isolation:**
  - Protect wallet balance updates and coupon usage counters from race conditions using atomic SQL increments:
    ```sql
    UPDATE wallets SET balance = balance - :amount 
    WHERE user_id = :userId AND balance >= :amount;
    ```
  - Lock limited class slot rows using `@Lock(LockModeType.PESSIMISTIC_WRITE)` during slot reservation to prevent overbooking.
- **Asynchronous Task Architecture:**
  - Configure a dedicated `ThreadPoolTaskExecutor` bean in `AsyncConfig.java`:
    ```java
    @Bean("taskExecutor")
    public TaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(50);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("FitEmpire-Async-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
    ```

### 7.2 Mobile Engineering (React Native / Android Studio Native)
- **Android Studio Native Compilation (`android/app/build.gradle`):**
  - Configure ABI architecture splits to reduce release APK footprint from 95MB to ~35MB:
    ```groovy
    ndk {
        abiFilters "armeabi-v7a", "arm64-v8a"
    }
    ```
  - Add Razorpay release obfuscation keep rules in `android/app/proguard-rules.pro`:
    ```proguard
    -keep class com.razorpay.** { *; }
    -dontwarn com.razorpay.**
    ```
- **Offline-First Architecture & Network Resilience:**
  - Wrap app root in `@react-native-community/netinfo` connectivity listener.
  - Implement cache fallback using TanStack React Query with persistent `AsyncStorage` storage.
- **Hardware Integration:**
  - Boost display brightness to 100% via `expo-brightness` upon opening check-in QR modal for rapid optical turnstile penetration.
  - Fire `expo-haptics` double-pulse confirmation on scan success.

### 7.3 Frontend Web Engineering (Partner Portal & Admin Console)
- **Multi-Terminal Real-Time Check-In Sync:**
  - Replace local DOM window events with WebSocket (STOMP client over SockJS) subscribing to `/topic/partner/{branchId}/checkins`.
- **High-Volume Attendance Table Virtualization:**
  - Implement `@tanstack/react-virtual` in `AttendancePage.tsx` to maintain 60 FPS rendering when displaying 1,000+ daily check-in rows.
- **Printable Reception Desk Standee Generator:**
  - Integrate `jspdf` to allow gym owners to export high-resolution A4 counter standees with vector QR codes in 1 click.

### 7.4 DevOps, Cloud & Site Reliability (AWS / Docker / CI/CD)
- **Container Hardening (`Dockerfile`):**
  - Implement multi-stage builds separating Maven compilation from runtime JRE.
  - Execute container process under unprivileged non-root user (`appuser`, UID 10001).
- **Reverse Proxy Hardening (`nginx.conf`):**
  - Enforce Gzip/Brotli compression for static bundles (`gzip_comp_level 6`).
  - Inject security headers: `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`.
- **Database Backup Automation:**
  - Implement automated daily cron executing `pg_dump -Fc` with encrypted push to private AWS S3 bucket with 30-day lifecycle expiration.

### 7.5 Information Security & Regulatory Compliance
- **Digital Personal Data Protection (DPDP) Act Compliance:**
  - Implement right-to-be-forgotten cascading erasure while preserving anonymized financial ledger transactions for tax audits.
  - Mask all sensitive PII (passwords, phone numbers, OTPs) in application log streams.
- **Rate-Limiting Defense:**
  - Implement Redis token bucket filter restricting unauthenticated endpoints (`/auth/login`, `/auth/verify-otp`) to maximum 5 requests per minute per IP.

### 7.6 AI & Machine Learning Engineering (FitCoach & ARIA)
- **Prompt Injection Defense:**
  - Sanitize user goal input strings and enforce strict parameter schemas before invoking LLM APIs.
- **BMR & Macro Calculation Precision:**
  - Replace crude linear calculations with the medical standard Mifflin-St Jeor equation:
    $$\text{BMR} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age (y)} + s$$
    *(where $s = +5$ for men, $-161$ for women)*, multiplied by activity factors (1.2 to 1.9).

---

## 8. Prioritized 4-Phase Execution Roadmap

```mermaid
gantt
    title FitEmpire 4-Phase Engineering Execution Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1: Security & Financial
    Fix Admin Seeder Password Overwrite (FE-125) :p1_1, 2026-09-09, 2d
    Fix Corporate Subsidy Loopholes (FE-241)     :p1_2, after p1_1, 3d
    Implement Razorpay Webhook Endpoint (FE-123) :p1_3, after p1_1, 3d
    ProGuard Rules for Android Release (FE-279)  :p1_4, after p1_2, 2d

    section Phase 2: Database & Core Stability
    Flyway Migrations & DDL Validation (FE-121)  :p2_1, 2026-09-16, 4d
    Database Foreign Key Indexes (FE-145)        :p2_2, after p2_1, 2d
    Wallet Concurrency Atomic Decrement (FE-147) :p2_3, after p2_1, 3d
    Dedicated ThreadPoolTaskExecutor (FE-134)    :p2_4, after p2_2, 2d

    section Phase 3: Real-Time & Partner Portal
    WebSocket STOMP Turnstile Sync (FE-131)      :p3_1, 2026-09-25, 5d
    Scanner Camera Stream Lifecycle Fix (FE-202) :p3_2, after p3_1, 2d
    Virtual Table Pagination (FE-203)            :p3_3, after p3_1, 3d
    Printable Standee PDF Generator (FE-211)     :p3_4, after p3_2, 2d

    section Phase 4: Mobile Polish & AI Engine
    Offline Store Caching & NetInfo (FE-171)     :p4_1, 2026-10-05, 4d
    AI Generator Prompt Sanitization (FE-261)    :p4_2, after p4_1, 3d
    Biometric Fingerprint Pass Access (FE-172)   :p4_3, after p4_1, 4d
    Android 14 API 34 Foreground Services (FE-281):p4_4, after p4_2, 3d
```

### Milestone Summary
- **Sprint 1 (Immediate P0 Blockers):** Close security vulnerabilities, implement Razorpay webhook controller, add ProGuard rules for Android release builds.
- **Sprint 2–3 (Platform Hardening):** Migrate database to versioned Flyway scripts, add B-tree indexes, configure thread pools, fix wallet double-spend bugs.
- **Sprint 4–6 (Partner Ecosystem):** Launch real-time WebSocket attendance sync, virtualize partner tables, enable split-shift hours.
- **Sprint 7+ (Enterprise Scale & AI):** Roll out offline caching, biometric pass display, AI nutrition precision, and enterprise corporate HR self-service portal.
