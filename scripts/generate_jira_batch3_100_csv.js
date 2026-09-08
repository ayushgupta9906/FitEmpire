const fs = require('fs');
const path = require('path');

// 100 Comprehensive Engineering Issues for FitEmpire (FE-141 to FE-240)
// Spanning: Backend (30), Mobile App (30), Partner Portal (20), Admin Console (10), DevOps & Infra (10)
// Rules:
// 1. All Improvements & Change Requests [CR] are strictly Priority: "Low"
// 2. Labels are strictly 1-2 words only and shared
// 3. Complete 7-section engineering description template for every issue

const batch3Issues = [
  // =========================================================================
  // BACKEND CORE & SECURITY (30 Issues: FE-141 to FE-170)
  // =========================================================================
  {
    summary: 'Missing Rate Limiting on OTP and Authentication Endpoints Permits Brute Force Attacks',
    issueType: 'Bug',
    priority: 'High',
    labels: 'backend security',
    description: `[SEVERITY & IMPACT]
P1 - Security Vulnerability. High risk of credential stuffing and SMS toll fraud.
The /api/v1/auth/login and /api/v1/auth/verify-otp endpoints do not enforce IP or user-based request throttling, allowing automated scripts to brute-force 4-digit or 6-digit SMS OTPs.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/controller/AuthController.java
- fitempire-backend/src/main/java/com/fitempire/security/SecurityConfig.java

[TECHNICAL ROOT CAUSE]
There is no Bucket4j or Redis-backed sliding window rate limiter filter registered on unauthenticated public authentication endpoints.

[STEPS TO REPRODUCE]
1. Send 1,000 rapid POST requests to /api/v1/auth/verify-otp with incrementing OTP codes.
2. Server processes all 1,000 requests without returning HTTP 429 Too Many Requests.
3. Attacker can guess a 4-digit OTP (10,000 possibilities) in under 2 minutes.

[EXPECTED BEHAVIOR]
After 5 failed OTP attempts from the same IP or phone number within 15 minutes, requests should be blocked with HTTP 429.

[ACTUAL BEHAVIOR]
Endpoint allows unlimited attempts without rate limiting.

[PROPOSED RESOLUTION]
Implement Redis token bucket rate limiting via Bucket4j or Spring Cloud Gateway filter allowing max 5 attempts per minute per IP/phone.`
  },
  {
    summary: 'Spring Security CORS Configuration Employs Overly Permissive Wildcard Allowed Origins',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'backend security',
    description: `[SEVERITY & IMPACT]
P3 - Security Hardening & Compliance.
Permitting wildcard or insecure origins in production opens the door to cross-origin data leakage and unauthorized API invocation from malicious domains.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/security/SecurityConfig.java (Lines 45-60)

[TECHNICAL ROOT CAUSE]
The CorsConfigurationSource bean configures setAllowedOriginPatterns(List.of("*")) or allows arbitrary localhost origins without environment-based profile isolation.

[STEPS TO REPRODUCE]
1. Send an OPTIONS preflight request to /api/v1/gyms with header Origin: https://evil-phishing-site.com.
2. Observe response header Access-Control-Allow-Origin: https://evil-phishing-site.com.

[EXPECTED BEHAVIOR]
CORS origins should be restricted to whitelist domains (fitempire.tech, admin.fitempire.tech, partner.fitempire.tech) in production.

[ACTUAL BEHAVIOR]
Wildcard origins are accepted in production configuration.

[PROPOSED RESOLUTION]
Externalize cors.allowed-origins to application.yml and inject strict whitelisted domain arrays in production.`
  },
  {
    summary: 'GlobalExceptionHandler Leaks Internal Database Tables and Stack Traces in 500 Responses',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'backend security',
    description: `[SEVERITY & IMPACT]
P2 - Information Disclosure Vulnerability.
Unhandled exceptions expose internal PostgreSQL schema names, SQL constraints, and Java class stack traces to API clients, aiding attackers in vulnerability exploitation.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/common/exception/GlobalExceptionHandler.java

[TECHNICAL ROOT CAUSE]
The fallback @ExceptionHandler(Exception.class) method formats ex.getMessage() and root cause traces into the ApiResponse.error() response body returned to the client.

[STEPS TO REPRODUCE]
1. Send a malformed payload to /api/v1/memberships/subscribe that triggers a foreign key violation.
2. Response contains raw PSQLException: Detail: Key (user_id)=(...) is not present in table "users".

[EXPECTED BEHAVIOR]
Internal server errors should return a generic message "An unexpected internal error occurred" with a correlation ID, keeping technical stack traces in server logs.

[ACTUAL BEHAVIOR]
Raw database exceptions and class traces are returned in client response JSON.

[PROPOSED RESOLUTION]
Sanitize error messages in GlobalExceptionHandler so generic exceptions return sanitized user-facing messages.`
  },
  {
    summary: 'Missing Format Validation on UUID Path Variables Causes Unhandled MethodArgumentTypeMismatchException',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'backend validation',
    description: `[SEVERITY & IMPACT]
P3 - API Hygiene & Log Noise.
When client passes an invalid UUID string (e.g. /v1/gyms/abc-123), Spring throws MethodArgumentTypeMismatchException resulting in unformatted 500 or generic 400 responses polluting error telemetry.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/gyms/controller/GymController.java
- fitempire-backend/src/main/java/com/fitempire/modules/bookings/controller/BookingController.java

[TECHNICAL ROOT CAUSE]
Controllers use @PathVariable UUID id without regex constraints or custom validators, causing Spring conversion service failure before reaching business logic.

[STEPS TO REPRODUCE]
1. Execute GET /api/v1/gyms/not-a-valid-uuid.
2. Server responds with ugly MethodArgumentTypeMismatchException and unformatted error payload.

[EXPECTED BEHAVIOR]
Endpoint should reject invalid UUID formats immediately with standard 400 Bad Request: "Invalid resource identifier format".

[ACTUAL BEHAVIOR]
Conversion error throws deep in Spring framework stack.

[PROPOSED RESOLUTION]
Add a dedicated MethodArgumentTypeMismatchException handler in GlobalExceptionHandler returning a structured RFC-7807 error payload.`
  },
  {
    summary: 'Missing Database Indexes on High-Volume Foreign Keys Causes Slow Full Table Scans',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'backend database',
    description: `[SEVERITY & IMPACT]
P3 - Database Performance & Query Latency.
As the bookings and attendance tables grow past 50,000 records, queries filtering by user_id, gym_id, and booking_date degrade from sub-10ms index scans to 800ms+ sequential table scans.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/resources/db/migration/V1__initial_schema.sql
- fitempire-backend/src/main/java/com/fitempire/modules/bookings/entity/Booking.java

[TECHNICAL ROOT CAUSE]
Foreign key columns (user_id, gym_id, branch_id) in the bookings table do not have explicit B-tree indexes defined in PostgreSQL DDL.

[STEPS TO REPRODUCE]
1. Populate database with 100,000 dummy bookings.
2. Run EXPLAIN ANALYZE SELECT * FROM bookings WHERE user_id = '...' AND booking_date = '2026-09-08'.
3. Query plan indicates Seq Scan on bookings with high execution cost.

[EXPECTED BEHAVIOR]
Query should utilize compound index idx_bookings_user_date for rapid index-only lookup.

[ACTUAL BEHAVIOR]
Full table sequential scan executed on every member bookings lookup.

[PROPOSED RESOLUTION]
Add Flyway migration creating indexes: CREATE INDEX idx_bookings_user_date ON bookings(user_id, booking_date) and idx_bookings_gym_status ON bookings(gym_id, status).`
  },
  {
    summary: 'HikariCP Pool Lacks Leak Detection Threshold and Aggressive Connection Eviction',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'backend database',
    description: `[SEVERITY & IMPACT]
P3 - Connection Pool Starvation Resilience.
If any thread hangs on an uncommitted transaction or third-party HTTP call inside @Transactional, the connection remains held indefinitely, starving the Hikari pool.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/resources/application.yml (Lines 44-52)

[TECHNICAL ROOT CAUSE]
application.yml defines connection-timeout: 30000 but omits leak-detection-threshold and max-lifetime tuning for Neon serverless pooler.

[STEPS TO REPRODUCE]
1. Simulate a long-running transaction held for 60 seconds.
2. Hikari logs provide no warning of a potential connection leak.
3. Once pool size of 10 is reached, all subsequent incoming API requests hang for 30s before throwing ConnectionTimeoutException.

[EXPECTED BEHAVIOR]
HikariCP should log an Apparent connection leak detected after 5,000ms with full stack trace.

[ACTUAL BEHAVIOR]
No leak detection configured.

[PROPOSED RESOLUTION]
Add spring.datasource.hikari.leak-detection-threshold: 5000 to application.yml.`
  },
  {
    summary: 'Wallet Balance Deduction Lacks Atomic Database Decrement Creating Negative Balance Vulnerability',
    issueType: 'Bug',
    priority: 'High',
    labels: 'backend payments',
    description: `[SEVERITY & IMPACT]
P1 - Financial Deficit & Fraud Risk.
Concurrent wallet transactions (e.g. paying for a class pass and buying a store item simultaneously) can double-spend the same wallet balance, driving wallet points into negative numbers.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/service/WalletService.java

[TECHNICAL ROOT CAUSE]
WalletService reads wallet.getBalance(), checks balance >= amount in Java memory, and then saves wallet.setBalance(balance - amount). Two concurrent threads read the same initial balance simultaneously.

[STEPS TO REPRODUCE]
1. User wallet contains ₹500 balance.
2. Fire two parallel requests at the exact same millisecond: Request A deducts ₹400, Request B deducts ₹400.
3. Both threads check 500 >= 400 (pass).
4. Both deduct ₹400, resulting in ₹800 spent from a ₹500 wallet balance.

[EXPECTED BEHAVIOR]
Second transaction should be rejected with Insufficient balance, or balance updated atomically via database lock.

[ACTUAL BEHAVIOR]
Balance is overwritten without concurrency protection, allowing double-spending.

[PROPOSED RESOLUTION]
Use atomic SQL update: UPDATE wallets SET balance = balance - :amount WHERE user_id = :userId AND balance >= :amount.`
  },
  {
    summary: 'Payment Order Creation Lacks Idempotency Key Allowing Duplicate Razorpay Orders',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'backend payments',
    description: `[SEVERITY & IMPACT]
P3 - Financial Audit & Order Clutter.
When mobile users experience network lag and tap "Pay Now" repeatedly, multiple distinct Razorpay order IDs are generated for the exact same cart or pass purchase.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/payments/controller/PaymentController.java (Lines 22-39)

[TECHNICAL ROOT CAUSE]
PaymentController.createOrder accepts payload without an Idempotency-Key header or check against pending existing orders for the same item within the last 5 minutes.

[STEPS TO REPRODUCE]
1. Send 3 identical POST requests to /v1/payments/create-order with identical paymentId and amount.
2. Razorpay service returns 3 distinct order_... IDs.

[EXPECTED BEHAVIOR]
Re-requesting order creation for an active unpaid payment within 5 minutes should return the existing active Razorpay order ID.

[ACTUAL BEHAVIOR]
A new order is minted on every HTTP POST request.

[PROPOSED RESOLUTION]
Store razorpay_order_id on Payment entity and return existing order ID if payment is in PENDING state.`
  },
  {
    summary: 'Missing @SQLRestriction Soft-Delete Annotations Cause Deleted Gym Reviews to Appear in Feed',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'backend database',
    description: `[SEVERITY & IMPACT]
P2 - Data Integrity & Content Moderation Leak.
When an administrator soft-deletes a spam or offensive gym review, the review continues to appear in public gym detail queries because JPA repository methods omit deleted = false checks.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/gyms/entity/GymReview.java
- fitempire-backend/src/main/java/com/fitempire/modules/gyms/repository/GymReviewRepository.java

[TECHNICAL ROOT CAUSE]
GymReview inherits BaseEntity (deleted boolean) but lacks Hibernate 6 @SQLRestriction("is_deleted = false") on the entity class.

[STEPS TO REPRODUCE]
1. Create a review on Iron Culture Gym.
2. Admin soft-deletes the review (deleted = true).
3. Fetch gym details with child reviews -> Soft-deleted review still appears in the JSON array.

[EXPECTED BEHAVIOR]
Soft-deleted reviews must be automatically filtered out of all public entity queries.

[ACTUAL BEHAVIOR]
Soft-deleted reviews remain visible to mobile users.

[PROPOSED RESOLUTION]
Add @SQLRestriction("is_deleted = false") to GymReview and related child entity classes.`
  },
  {
    summary: 'Gym Review Submission Lacks Verification of Actual Workout Attendance',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'backend business',
    description: `[SEVERITY & IMPACT]
P3 - Review Authenticity & Fraud Prevention.
Users can submit 5-star ratings or defamatory 1-star reviews for gyms they have never stepped foot into or booked a pass for.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/gyms/service/GymReviewService.java

[TECHNICAL ROOT CAUSE]
GymReviewService checks only if user exists and gym exists, omitting a validation query against the attendance or bookings repository verifying ATTENDED status.

[STEPS TO REPRODUCE]
1. User registers a brand new account.
2. User immediately sends POST /api/v1/gyms/{id}/reviews with rating 1 and text "Terrible place".
3. Review is saved and gym average rating drops.

[EXPECTED BEHAVIOR]
System should reject review with HTTP 403: "You can only review gyms where you have verified workout attendance."

[ACTUAL BEHAVIOR]
Anyone with an account can post arbitrary reviews for any gym.

[PROPOSED RESOLUTION]
Add verification in GymReviewService: attendanceRepository.existsByUserIdAndGymIdAndStatus(userId, gymId, 'CHECKED_IN').`
  },
  {
    summary: 'Absence of Max Limit Enforcement on Pageable size Parameter Risks OutOfMemory Denial of Service',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'backend performance',
    description: `[SEVERITY & IMPACT]
P2 - Server Denial of Service / OutOfMemoryError.
An attacker can request ?size=500000 on gym or booking listing endpoints, forcing Hibernate to instantiate hundreds of thousands of JPA entities into JVM heap, triggering GC pauses and OOM crashes.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/gyms/controller/GymController.java
- fitempire-backend/src/main/java/com/fitempire/modules/bookings/controller/BookingController.java

[TECHNICAL ROOT CAUSE]
Spring Data Pageable accepts arbitrary size query parameters without capping PageableHandlerMethodArgumentResolver.setMaxPageSize(100).

[STEPS TO REPRODUCE]
1. Send GET /api/v1/gyms?page=0&size=100000.
2. Server loads 100,000 gym rows into memory, causing JVM heap spike and high CPU latency.

[EXPECTED BEHAVIOR]
Page size should be clamped to a maximum of 50 or 100 items per page regardless of client request parameter.

[ACTUAL BEHAVIOR]
Server attempts to load all requested records into memory.

[PROPOSED RESOLUTION]
Configure spring.data.web.pageable.max-page-size: 100 in application.yml and sanitize Pageable in web config.`
  },
  {
    summary: 'Attendance QR Token Window Too Wide and Lacks Single-Use Nonce Permitting Token Replay',
    issueType: 'Bug',
    priority: 'High',
    labels: 'backend security',
    description: `[SEVERITY & IMPACT]
P1 - Membership Fraud & QR Sharing.
The dynamic QR code displayed on the member app can be screenshotted and shared on WhatsApp to allow multiple friends into the gym because the token validity window is 10 minutes and lacks single-use validation.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/service/QrCodeService.java
- fitempire-backend/src/main/java/com/fitempire/modules/partner/service/AttendanceService.java

[TECHNICAL ROOT CAUSE]
QR token payload contains user ID and expiry timestamp but lacks a cryptographically random nonce stored in Redis that gets consumed (deleted) upon first scan.

[STEPS TO REPRODUCE]
1. Member generates dynamic check-in QR code on phone.
2. Member takes a screenshot and sends to a friend via WhatsApp.
3. Member scans QR at turnstile 1 -> entry granted.
4. Friend scans the same screenshot 2 minutes later at turnstile 2 -> entry granted again.

[EXPECTED BEHAVIOR]
QR code must have a 60-second time-to-live and single-use nonce invalidated immediately upon first scan in Redis.

[ACTUAL BEHAVIOR]
Replay scans succeed within the generous timestamp window.

[PROPOSED RESOLUTION]
Store QR nonce in Redis with 60s TTL; use redisTemplate.delete(nonce) during check-in and reject if key does not exist.`
  },
  {
    summary: 'Spring Actuator Endpoints Expose Internal Health and Metrics Without Admin Role Restriction',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'backend security',
    description: `[SEVERITY & IMPACT]
P3 - Security Best Practice / Telemetry Protection.
Actuator endpoints provide operational visibility into database status, disk space, and application metrics which should not be publicly accessible to anonymous internet clients.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/resources/application.yml (Lines 220-235)
- fitempire-backend/src/main/java/com/fitempire/security/SecurityConfig.java

[TECHNICAL ROOT CAUSE]
management.endpoints.web.exposure.include: "*" is enabled, and SecurityConfig permits requestMatchers("/actuator/**").permitAll().

[STEPS TO REPRODUCE]
1. Open http://localhost:8080/actuator/beans or /actuator/env without an Authorization header.
2. System returns full JSON list of application context beans and configurations.

[EXPECTED BEHAVIOR]
Only /actuator/health should be public (for Kubernetes / ECS liveness probes); all other actuator endpoints must require SUPER_ADMIN authority.

[ACTUAL BEHAVIOR]
All exposed actuator endpoints respond to unauthenticated requests.

[PROPOSED RESOLUTION]
Restructure SecurityConfig to restrict /actuator/** (except /actuator/health) to hasRole('SUPER_ADMIN').`
  },
  {
    summary: 'Absence of Distributed Lock (ShedLock) on Scheduled Pass Expiry Batch Causes Redundant Runs in Clustered Deployment',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'backend async',
    description: `[SEVERITY & IMPACT]
P3 - Cluster Coordination & Database Contention.
When the backend runs on multiple Docker container replicas or AWS ECS instances, the midnight pass expiration cron (@Scheduled) executes simultaneously on all nodes, causing lock contention and duplicate notification triggers.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/service/MembershipSchedulerService.java

[TECHNICAL ROOT CAUSE]
@Scheduled(cron = "0 0 0 * * ?") lacks a distributed locking provider like ShedLock or Redisson, leading every active Spring context to fire the job concurrently.

[STEPS TO REPRODUCE]
1. Run two instances of FitEmpire backend connected to the same Neon database.
2. Fast-forward clock to midnight.
3. Both instances execute expireOverdueMemberships() at the same second.
4. Users with expiring passes receive duplicate SMS and push notifications.

[EXPECTED BEHAVIOR]
Only one node in the cluster should acquire the lock and execute the scheduled batch job.

[ACTUAL BEHAVIOR]
All running nodes execute the scheduled batch independently.

[PROPOSED RESOLUTION]
Add ShedLock dependency with Redis or JDBC lock provider: @SchedulerLock(name = "expireMembershipsLock", lockAtMostFor = "10m").`
  },
  {
    summary: 'Cache Eviction Annotations Missing on Gym Updates Result in Stale Gym Cache',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'backend cache',
    description: `[SEVERITY & IMPACT]
P2 - Stale Data & Customer Confusion.
When a gym updates its operating hours or amenities, users continue seeing old cached gym information for up to 1 hour because Redis cache keys are never invalidated on update.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/gyms/service/GymService.java

[TECHNICAL ROOT CAUSE]
getGymById is annotated with @Cacheable(value = "gyms", key = "#id"), but updateGym() and deleteGym() lack corresponding @CacheEvict(value = "gyms", key = "#id") annotations.

[STEPS TO REPRODUCE]
1. Member views gym details -> Cached in Redis key gyms::123.
2. Gym owner updates opening time from 06:00 AM to 08:00 AM in partner portal.
3. Member re-opens gym page -> Displays stale 06:00 AM opening time until Redis TTL expires.

[EXPECTED BEHAVIOR]
Modifying gym details should immediately evict the stale Redis cache entry.

[ACTUAL BEHAVIOR]
Cache remains stale until automatic expiration.

[PROPOSED RESOLUTION]
Annotate updateGym with @CacheEvict(value = "gyms", key = "#id") and clear gym list caches.`
  },
  {
    summary: 'Insecure Direct Object Reference (IDOR) on Member Booking Cancellation Endpoint',
    issueType: 'Bug',
    priority: 'High',
    labels: 'backend security',
    description: `[SEVERITY & IMPACT]
P1 - Authorization Bypass & Griefing Attack.
A malicious user can cancel arbitrary bookings belonging to other members by submitting other members booking UUIDs to /v1/bookings/{id}/cancel without ownership verification.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/bookings/service/BookingService.java

[TECHNICAL ROOT CAUSE]
BookingService.cancelBooking(UUID bookingId) looks up booking by ID and transitions status to CANCELLED without verifying booking.getUser().getId().equals(currentUser.getId()).

[STEPS TO REPRODUCE]
1. User A books a slot (bookingId: 1111).
2. User B logs in and sends PUT /api/v1/bookings/1111/cancel with User B auth token.
3. Server cancels User A booking and sends cancellation SMS to User A.

[EXPECTED BEHAVIOR]
Server must return 403 Forbidden: "You are not authorized to cancel this booking."

[ACTUAL BEHAVIOR]
Any authenticated user can cancel any other users bookings.

[PROPOSED RESOLUTION]
Add ownership check: if (!booking.getUser().getId().equals(currentUser.getId()) && !isAdmin) throw new AccessDeniedException(...).`
  },
  {
    summary: 'Customer Sensitive PII (Phone, Email, Passwords) Logged in Plaintext Application Logs',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'backend security',
    description: `[SEVERITY & IMPACT]
P3 - Compliance & Log Sanitization (DPDP Act / GDPR).
Logging raw incoming request payloads prints customer mobile numbers and plain passwords into standard output logs ingested by AWS CloudWatch or third-party log aggregators.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/security/jwt/JwtAuthenticationFilter.java
- fitempire-backend/src/main/java/com/fitempire/controller/AuthController.java

[TECHNICAL ROOT CAUSE]
log.info("Register request received: {}", request) logs the entire DTO including raw phone numbers and password fields without maskers.

[STEPS TO REPRODUCE]
1. Register a new user via mobile app.
2. Inspect backend console output or log file.
3. Notice full customer phone number and email logged in plaintext.

[EXPECTED BEHAVIOR]
PII fields must be masked (e.g. +91 98*** **520) and passwords excluded from toString() representation.

[ACTUAL BEHAVIOR]
Sensitive data printed directly to application logs.

[PROPOSED RESOLUTION]
Add @ToString.Exclude on sensitive DTO fields (password, otp, pin) and implement a Logback masking pattern.`
  },
  {
    summary: 'Missing Cascading Soft-Delete on Branches and Slots When Parent Gym Entity Is Deleted',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'backend database',
    description: `[SEVERITY & IMPACT]
P2 - Orphaned Child Records & Ghost Slots.
When a gym partner leaves the platform and admin soft-deletes the parent Gym entity, child branches and workout batches remain marked active = true and deleted = false, appearing in search queries.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/gyms/service/GymService.java
- fitempire-backend/src/main/java/com/fitempire/modules/gyms/entity/Gym.java

[TECHNICAL ROOT CAUSE]
softDelete() method on Gym sets only this.deleted = true without cascading the soft-delete flag down to child branch, batch, and slot collections.

[STEPS TO REPRODUCE]
1. Admin deletes "Gold Fitness Gym".
2. Gym entity is marked deleted = true.
3. Query /v1/slots/search -> Workout batches from Gold Fitness Gym still appear and can be booked by users.

[EXPECTED BEHAVIOR]
Soft-deleting a parent gym must cascade and deactivate all associated branches, batches, and active booking slots.

[ACTUAL BEHAVIOR]
Child records remain active and bookable.

[PROPOSED RESOLUTION]
Update GymService.deleteGym() to iterate and soft-delete all child branches and cancel unfulfilled future booking slots with refund.`
  },
  {
    summary: 'Fractional Percentage Rounding Inaccuracies in Coupon Discount Calculations',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'backend coupons',
    description: `[SEVERITY & IMPACT]
P3 - Financial Accounting Discrepancy.
When coupons apply percentage discounts (e.g. 15% off ₹799), floating-point arithmetic can produce values with fractional paise causing 1-paise reconciliation errors against Razorpay orders.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/coupons/service/CouponService.java (Lines 133-137)

[TECHNICAL ROOT CAUSE]
CouponService performs division with BigDecimal.valueOf(100.0) with RoundingMode.HALF_UP without enforcing currency scale(2, RoundingMode.DOWN) to prevent sub-paise truncation discrepancies.

[STEPS TO REPRODUCE]
1. Apply 15% discount on ₹799 pass -> Mathematical value is 119.85.
2. Test varying pricing amounts with coupons; observe slight discrepancies between cart summary and Razorpay captured amount.

[EXPECTED BEHAVIOR]
Standard banking rounding rules (HALF_EVEN or DOWN to 2 decimal places) enforced consistently across cart, payment, and invoice entities.

[ACTUAL BEHAVIOR]
Occasional 1-paise variance between coupon discount and Razorpay charge amount.

[PROPOSED RESOLUTION]
Enforce setScale(2, RoundingMode.HALF_EVEN) on all coupon and tax calculations.`
  },
  {
    summary: 'Lack of Validation on Overlapping Concurrent Booking Slots for the Same Member',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'backend bookings',
    description: `[SEVERITY & IMPACT]
P2 - Slot Hoarding & Schedule Conflicts.
A member can book two conflicting workout slots at the exact same hour in two different gyms located 15 kilometers apart, hoarding limited class capacity.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/bookings/service/BookingService.java

[TECHNICAL ROOT CAUSE]
BookingService checks slot capacity but does not verify whether the user already has an active CONFIRMED booking overlapping the requested slot time window on the same date.

[STEPS TO REPRODUCE]
1. Book Boxing Class at Gym A from 07:00 PM to 08:00 PM.
2. Book Swimming Slot at Gym B from 07:00 PM to 08:00 PM on the same date.
3. Both bookings succeed.

[EXPECTED BEHAVIOR]
System should reject the second booking with: "You already have a confirmed workout booking during this time slot."

[ACTUAL BEHAVIOR]
User can hoard overlapping workout slots simultaneously.

[PROPOSED RESOLUTION]
Add validation in BookingService: bookingRepository.existsOverlappingBooking(userId, date, startTime, endTime).`
  },
  {
    summary: 'Absence of Correlation ID (X-Request-ID) in Logging Pipeline Impedes Distributed Tracing',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'backend logging',
    description: `[SEVERITY & IMPACT]
P3 - Observability & Debugging Enhancement.
When multiple concurrent requests execute, log statements from different threads interleave, making it time-consuming to isolate the complete lifecycle of a single failed payment or booking request.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/resources/logback-spring.xml
- fitempire-backend/src/main/java/com/fitempire/security/jwt/JwtAuthenticationFilter.java

[TECHNICAL ROOT CAUSE]
The application does not use an MDC (Mapped Diagnostic Context) servlet filter to generate and attach a unique X-Request-ID header to every inbound request.

[STEPS TO REPRODUCE]
1. Send an API request to the backend.
2. Response headers lack X-Request-ID.
3. Inspect server log file; individual log lines have timestamps but no unifying trace ID.

[EXPECTED BEHAVIOR]
Every request should assign or propagate X-Request-ID, include it in log patterns ([%X{requestId}]), and return it in response headers.

[ACTUAL BEHAVIOR]
Logs lack unified request tracing identifiers.

[PROPOSED RESOLUTION]
Implement an MDCLoggingFilter extracting or generating UUID request ID and clearing MDC in a finally block.`
  },
  {
    summary: 'Missing Optimistic Lock Handling on Slot Booking Triggers Unhandled 500 Error Under Concurrency',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'backend bookings',
    description: `[SEVERITY & IMPACT]
P2 - Poor User Experience on Sold-Out Slots.
When multiple members attempt to book the final remaining slot in a class simultaneously, the losing thread throws ObjectOptimisticLockingFailureException resulting in a generic 500 crash instead of a clean "Slot is fully booked" message.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/bookings/service/BookingService.java
- fitempire-backend/src/main/java/com/fitempire/common/exception/GlobalExceptionHandler.java

[TECHNICAL ROOT CAUSE]
GlobalExceptionHandler does not have a dedicated handler for ObjectOptimisticLockingFailureException or StaleObjectStateException.

[STEPS TO REPRODUCE]
1. Class has 1 spot remaining.
2. Two users tap "Book" at the same instant.
3. User A succeeds; User B receives an unhandled 500 Internal Server Error dialog.

[EXPECTED BEHAVIOR]
User B should receive HTTP 409 Conflict: "This slot was just filled by another member. Please select another time."

[ACTUAL BEHAVIOR]
Generic 500 Internal Server Error displayed.

[PROPOSED RESOLUTION]
Add exception handler in GlobalExceptionHandler translating OptimisticLockingFailureException into HTTP 409 with friendly retry prompt.`
  },
  {
    summary: 'Email Dispatch Lacks Asynchronous Queue and Retry Mechanism for Transient SMTP Outages',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'backend notifications',
    description: `[SEVERITY & IMPACT]
P3 - Notification Reliability.
If Gmail SMTP server temporarily times out during password reset or pass purchase, the email is permanently lost with no retry mechanism.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/service/NotificationService.java

[TECHNICAL ROOT CAUSE]
Email dispatch executes directly via JavaMailSender without a persistent outbox pattern or Spring Retry (@Retryable) configuration.

[STEPS TO REPRODUCE]
1. Simulate temporary network interruption on SMTP port 587.
2. Purchase a pass.
3. Log shows MailSendException; email receipt is discarded permanently.

[EXPECTED BEHAVIOR]
Transient email failures should be retried 3 times with exponential backoff (1s, 2s, 4s).

[ACTUAL BEHAVIOR]
Failed emails are dropped immediately.

[PROPOSED RESOLUTION]
Add @Retryable(value = {MailException.class}, maxAttempts = 3, backoff = @Backoff(delay = 2000)) to email dispatch methods.`
  },
  {
    summary: 'Missing Webhook Replay Protection Allows Repeated Processing of Captured Webhook Payloads',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'backend payments',
    description: `[SEVERITY & IMPACT]
P2 - Financial Idempotency Flaw.
If Razorpay resends a webhook or an attacker captures and replays a legitimate webhook payload, the server could duplicate rewards or trigger multiple membership extensions.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/payments/service/RazorpayService.java

[TECHNICAL ROOT CAUSE]
Webhook processing does not record incoming webhook event IDs (x-razorpay-event-id) in a processed_events Redis table with duplicate check.

[STEPS TO REPRODUCE]
1. Intercept a legitimate captured payment webhook payload.
2. Re-send the exact payload to the server 10 minutes later with valid signature.
3. Backend processes the event again, triggering duplicate member credits.

[EXPECTED BEHAVIOR]
Duplicate webhook events must be detected via event ID and ignored with HTTP 200 "Event already processed".

[ACTUAL BEHAVIOR]
Server executes processing logic on every payload replay.

[PROPOSED RESOLUTION]
Implement an idempotency table storing razorpay_event_id with a 24-hour expiration window in Redis.`
  },
  {
    summary: 'Partner Settlement Calculator Omits Platform Commission Deductions',
    issueType: 'Bug',
    priority: 'High',
    labels: 'backend payments',
    description: `[SEVERITY & IMPACT]
P1 - Financial Accounting Discrepancy.
When generating monthly payouts for gym partners, payout calculations disburse 100% of gross check-in credits without subtracting the platform agreed 15% commission fee.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/partner/service/SettlementService.java

[TECHNICAL ROOT CAUSE]
SettlementService multiplies total check-ins by partner fixed rate without applying (grossAmount * (1.0 - commissionRate)).

[STEPS TO REPRODUCE]
1. Partner has 100 member visits at ₹200/visit = ₹20,000 gross.
2. Run settlement generation.
3. Payout statement generates for full ₹20,000 instead of ₹17,000 (after 15% platform commission).

[EXPECTED BEHAVIOR]
Settlement must cleanly separate Gross Earnings, Platform Commission (15%), TDS (1%), and Net Payable.

[ACTUAL BEHAVIOR]
Gross earnings are mapped directly to net payable.

[PROPOSED RESOLUTION]
Incorporate commissionRate and netPayable calculations in SettlementService before finalizing payout batches.`
  },
  {
    summary: 'Missing Health Indicators in Spring Boot Actuator for PostgreSQL, Redis and SMTP',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'backend infrastructure',
    description: `[SEVERITY & IMPACT]
P3 - Monitoring & Incident Response.
The /actuator/health endpoint reports status UP even when Redis or SMTP mail host is unreachable, preventing load balancers from detecting partial system degradation.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/resources/application.yml (Lines 220-235)

[TECHNICAL ROOT CAUSE]
management.endpoint.health.show-details: always is omitted, and custom HealthIndicator beans for Redis and external payment APIs are not configured.

[STEPS TO REPRODUCE]
1. Stop local Redis server.
2. Query /actuator/health -> Still reports {"status": "UP"}.
3. Application fails at runtime when attempting to read cached data.

[EXPECTED BEHAVIOR]
Health check should report STATUS: DEGRADED or DOWN with component-level status for db, redis, and diskSpace.

[ACTUAL BEHAVIOR]
Generic UP status masks underlying service connection failures.

[PROPOSED RESOLUTION]
Enable management.endpoint.health.show-details: when_authorized and register custom RedisHealthIndicator.`
  },
  {
    summary: 'Missing Database Migration Rollback Scripts (Undo Migrations) in Flyway Repository',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'backend infrastructure',
    description: `[SEVERITY & IMPACT]
P3 - Deployment Safety & Disaster Recovery.
If a production migration introduces a table locking issue or faulty constraint, engineering has no standardized undo migration scripts to roll back schema changes cleanly.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/resources/db/migration/

[TECHNICAL ROOT CAUSE]
Only forward migrations (V1__, V2__) exist; Flyway undo migrations (U1__, U2__) or documented rollback SQL scripts are absent.

[STEPS TO REPRODUCE]
1. Review src/main/resources/db/migration directory.
2. Only forward migrations are present.
3. In case of deployment failure, rollback requires manual emergency SQL execution.

[EXPECTED BEHAVIOR]
Every major DDL migration should have an accompanying, tested rollback script.

[ACTUAL BEHAVIOR]
No automated or documented rollback migration path exists.

[PROPOSED RESOLUTION]
Establish standard paired migration strategy with documented rollback SQL scripts for all schema changes.`
  },
  {
    summary: 'Missing Validation on User Date of Birth Allows Registration of Unrealistic Ages',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'backend validation',
    description: `[SEVERITY & IMPACT]
P3 - Data Hygiene & Liability.
Users can input dates of birth resulting in ages of 2 years old or 250 years old without validation triggering, creating invalid health metrics and liability concerns for gym entry.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/users/dto/UpdateProfileRequest.java

[TECHNICAL ROOT CAUSE]
LocalDate dateOfBirth field lacks custom validation verifying age is between 14 and 100 years old (@Past is used without range boundary).

[STEPS TO REPRODUCE]
1. Submit profile update with dateOfBirth = "2024-01-01" (age 2) or "1850-01-01" (age 176).
2. Server accepts update successfully.

[EXPECTED BEHAVIOR]
Profile update should reject users under 14 (minimum gym age) or over 100 years with HTTP 400.

[ACTUAL BEHAVIOR]
Arbitrary past dates are accepted without age range validation.

[PROPOSED RESOLUTION]
Create custom validation annotation @ValidAge(min = 14, max = 100) on dateOfBirth fields.`
  },
  {
    summary: 'User Account Soft Deletion Leaves Active Subscriptions in Auto-Renewal State',
    issueType: 'Bug',
    priority: 'High',
    labels: 'backend memberships',
    description: `[SEVERITY & IMPACT]
P1 - Erroneous Billing & Customer Complaints.
When a user deletes their account via privacy settings, their recurring membership subscription is not marked CANCELLED, causing external payment recurring mandates to charge users post-deletion.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/users/service/UserService.java

[TECHNICAL ROOT CAUSE]
UserService.deleteAccount() sets user.deleted = true but does not query and cancel active Membership entities or revoke recurring Razorpay subscription tokens.

[STEPS TO REPRODUCE]
1. User with active recurring monthly pass clicks "Delete Account".
2. User account is soft-deleted.
3. Next month recurring billing date arrives -> User is charged again for an account they cannot access.

[EXPECTED BEHAVIOR]
Account deletion must immediately cancel all active memberships and terminate payment gateway recurring mandates.

[ACTUAL BEHAVIOR]
Active memberships continue running in database post-account deletion.

[PROPOSED RESOLUTION]
In UserService.deleteAccount(), invoke membershipService.cancelAllActiveMemberships(userId, "Account deleted by user").`
  },
  {
    summary: 'Gym Check-In Frequency Limit Not Enforced Permitting Multiple Daily Entries on Single-Entry Passes',
    issueType: 'Bug',
    priority: 'High',
    labels: 'backend bookings',
    description: `[SEVERITY & IMPACT]
P1 - Revenue Leakage & Commercial Abuse.
Single-Scan Daily Pass holders can visit a gym in the morning and scan into another gym in the evening because the daily visit quota check is not enforced on attendance scan.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/partner/service/AttendanceService.java

[TECHNICAL ROOT CAUSE]
AttendanceService verifies membership status is ACTIVE, but fails to check attendanceRepository.countTodayCheckIns(userId, LocalDate.now()) against plan.maxDailyEntries.

[STEPS TO REPRODUCE]
1. User purchases "Single-Scan Daily Pass" (maxDailyEntries = 1).
2. User checks into Gym A at 08:00 AM -> Scan approved.
3. User checks into Gym B at 06:00 PM on the same day -> Scan approved again.

[EXPECTED BEHAVIOR]
Second scan should be rejected with: "Daily pass limit reached. Upgrade to FitEmpire 360 for dual daily entries."

[ACTUAL BEHAVIOR]
Unlimited check-ins allowed on single-entry passes.

[PROPOSED RESOLUTION]
Add daily visit quota verification in AttendanceService.validateAndCheckIn().`
  },

  // =========================================================================
  // MOBILE MEMBER APP (30 Issues: FE-171 to FE-200)
  // =========================================================================
  {
    summary: '[CR] Network Offline Banner and Connectivity State Listener Missing in Mobile App',
    issueType: 'Task',
    priority: 'Low',
    labels: 'mobile connectivity',
    description: `[SEVERITY & IMPACT]
P3 - Usability Enhancement.
When mobile connection drops in basement gyms, the app displays perpetual spinners or unhandled network errors without clearly communicating offline status to the user.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/_layout.tsx

[TECHNICAL ROOT CAUSE]
The root layout does not incorporate @react-native-community/netinfo listener to broadcast connectivity state to child screens and render an offline warning banner.

[STEPS TO REPRODUCE]
1. Turn off Wi-Fi and mobile data while using FitEmpire mobile app.
2. Tap on any tab or gym card.
3. App spins indefinitely or shows generic unformatted network error dialog.

[EXPECTED BEHAVIOR]
A subtle top banner should appear: "No Internet Connection - Showing offline cached data."

[ACTUAL BEHAVIOR]
No connectivity indicator is displayed.

[PROPOSED RESOLUTION]
Install @react-native-community/netinfo and render a persistent OfflineBanner component in root layout.`
  },
  {
    summary: '[CR] Biometric Authentication (Fingerprint / FaceID) for Fast Pass Check-In',
    issueType: 'Task',
    priority: 'Low',
    labels: 'mobile auth',
    description: `[SEVERITY & IMPACT]
P3 - User Convenience / Speed at Turnstile.
Users arriving at busy turnstiles must unlock phone, open app, and navigate to pass screen instead of using instant biometric pass display.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/(tabs)/index.tsx
- fitempire-mobile/src/app/membership.tsx

[TECHNICAL ROOT CAUSE]
App lacks integration with expo-local-authentication for biometric quick-actions.

[STEPS TO REPRODUCE]
1. Open FitEmpire app.
2. No option to authenticate via FaceID / Fingerprint for fast membership QR reveal.

[EXPECTED BEHAVIOR]
Option in Settings to enable "Biometric Quick Pass" to reveal turnstile QR instantly upon app launch.

[ACTUAL BEHAVIOR]
Standard manual navigation required.

[PROPOSED RESOLUTION]
Integrate expo-local-authentication and add quick-access pass widget with biometric lock.`
  },
  {
    summary: 'Deep Link Routing Lacks Query Parameter Sanitization and Fallback Error Screen',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'mobile navigation',
    description: `[SEVERITY & IMPACT]
P2 - App Crash on Malformed Marketing Deep Links.
Clicking a promotional deep link with missing or malformed gym IDs (e.g. fitempire://gym/invalid-id) causes an unhandled React runtime error instead of routing to Explore Gyms.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/gym/[id].tsx
- fitempire-mobile/app.json

[TECHNICAL ROOT CAUSE]
gym/[id].tsx attempts to call gymsApi.getById(id) without validating that id is a valid UUID, crashing the screen when the API returns 400.

[STEPS TO REPRODUCE]
1. Click link fitempire://gym/promo-special-2026 from SMS or browser.
2. App opens, attempts fetch with non-UUID id, encounters 400 error.
3. Screen displays empty black view with no back button or recovery action.

[EXPECTED BEHAVIOR]
App should validate param and gracefully redirect to Explore Gyms with toast: "Gym not found."

[ACTUAL BEHAVIOR]
App lands on an unrecoverable blank screen.

[PROPOSED RESOLUTION]
Add parameter validation and render a NotFoundView with "Browse Nearby Gyms" button.`
  },
  {
    summary: 'Hardware Android Back Button Gesture on Nested Modals Closes Entire Application',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'mobile navigation',
    description: `[SEVERITY & IMPACT]
P2 - Android User Navigation Frustration.
Pressing the physical or gesture back button on Android while a filter or coupon bottom sheet modal is open terminates the entire app instead of closing the modal.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/explore.tsx
- fitempire-mobile/src/components/FilterModal.tsx

[TECHNICAL ROOT CAUSE]
Custom modal components do not bind React Native BackHandler.addEventListener('hardwareBackPress') to dismiss the modal before default back navigation executes.

[STEPS TO REPRODUCE]
1. Open Explore screen on an Android device.
2. Tap "Filters" button to open the filter bottom sheet.
3. Press Android hardware/gesture back button.
4. App exits to Android home screen instead of closing filter sheet.

[EXPECTED BEHAVIOR]
Hardware back button should dismiss the open modal, leaving user on Explore screen.

[ACTUAL BEHAVIOR]
App exits completely.

[PROPOSED RESOLUTION]
Add BackHandler hook in modal components to intercept back press and trigger onClose().`
  },
  {
    summary: 'Profile Avatar Photo Upload Lacks Client-Side Image Compression',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile profile',
    description: `[SEVERITY & IMPACT]
P3 - Mobile Bandwidth & Upload Speed.
When users select high-resolution camera photos (12MP - 15MB) for their profile picture, the app attempts to upload the raw uncompressed JPEG, causing timeouts on 3G/4G connections.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/edit-profile.tsx

[TECHNICAL ROOT CAUSE]
expo-image-picker returns full-resolution asset without running expo-image-manipulator to resize to max 800x800 and compress quality to 0.7.

[STEPS TO REPRODUCE]
1. Tap Edit Profile -> Change Avatar.
2. Select high-resolution camera photo (10MB+).
3. Tap Save -> Upload progress hangs for 20+ seconds or fails with network timeout.

[EXPECTED BEHAVIOR]
Image should be automatically resized and compressed client-side to < 300KB in under 200ms before upload.

[ACTUAL BEHAVIOR]
Full-resolution 10MB+ file uploaded directly.

[PROPOSED RESOLUTION]
Use manipulateAsync from expo-image-manipulator with resize { width: 800 } and compress: 0.7.`
  },
  {
    summary: 'QR Code Scanner Camera Permission Denial Lacks Educational Guidance to App Settings',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile scanner',
    description: `[SEVERITY & IMPACT]
P3 - User Onboarding & Feature Accessibility.
When a user accidentally denies camera access once, tapping QR check-in displays a dead screen with no button to directly open Android/iOS app permission settings.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/scan.tsx

[TECHNICAL ROOT CAUSE]
Permission check displays a static text "Camera permission required" without Linking.openSettings() CTA button.

[STEPS TO REPRODUCE]
1. Deny camera permission when prompted.
2. Navigate to Scan QR screen.
3. Screen displays "Camera permission required" with no actionable button.
4. User cannot grant permission without manually digging through OS settings.

[EXPECTED BEHAVIOR]
Screen should display friendly illustration and "Open App Settings" button triggering Linking.openSettings().

[ACTUAL BEHAVIOR]
Static dead text with no link to OS settings.

[PROPOSED RESOLUTION]
Implement PermissionDeniedView with Linking.openSettings() trigger.`
  },
  {
    summary: 'Login and Signup Input Fields Covered by Virtual Keyboard on Small Android Devices',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'mobile ui',
    description: `[SEVERITY & IMPACT]
P2 - Form Usability / Signup Drop-off.
When typing in password or referral code fields on budget Android phones (e.g. 5.5 inch screens), the soft keyboard covers the submit button and active text input.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/(auth)/login.tsx
- fitempire-mobile/src/app/(auth)/register.tsx

[TECHNICAL ROOT CAUSE]
Auth screens do not wrap form contents in KeyboardAvoidingView with appropriate behavior={Platform.OS === 'ios' ? 'padding' : 'height'}.

[STEPS TO REPRODUCE]
1. Open Login screen on small screen Android device or emulator (720x1280).
2. Tap on "Password" field -> Virtual keyboard pops up.
3. Active input field and "Sign In" button are completely obscured by keyboard.

[EXPECTED BEHAVIOR]
View should automatically scroll or adjust padding so active field and primary CTA remain visible above keyboard.

[ACTUAL BEHAVIOR]
Keyboard covers interactive inputs.

[PROPOSED RESOLUTION]
Wrap form inside KeyboardAvoidingView with keyboardVerticalOffset and ScrollView.`
  },
  {
    summary: 'Missing Pull-to-Refresh Control on Explore Gyms and My Bookings Screens',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile ux',
    description: `[SEVERITY & IMPACT]
P3 - User Experience Standard.
Users cannot pull down to refresh gym availability, class schedules, or updated booking statuses without restarting the entire app.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/explore.tsx
- fitempire-mobile/src/app/my-bookings.tsx

[TECHNICAL ROOT CAUSE]
ScrollView / FlatList components omit refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}.

[STEPS TO REPRODUCE]
1. Open My Bookings screen.
2. Complete a booking from web or external device.
3. Pull down on mobile bookings screen -> No pull-to-refresh spinner or action triggered.

[EXPECTED BEHAVIOR]
Pulling down should display native refresh spinner and fetch latest records from API.

[ACTUAL BEHAVIOR]
List does not support swipe-down refresh gesture.

[PROPOSED RESOLUTION]
Add RefreshControl component to ScrollView/FlatList on all data feed screens.`
  },
  {
    summary: 'Missing AppState Listener Fails to Refresh Pass Status When App Returns from Background',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile lifecycle',
    description: `[SEVERITY & IMPACT]
P3 - State Staleness.
If a user purchases a pass on the web portal or front desk approves membership while mobile app is minimized in background, returning to app still displays "NO ACTIVE PLAN".

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/(tabs)/index.tsx
- fitempire-mobile/src/app/membership.tsx

[TECHNICAL ROOT CAUSE]
Components only fetch status inside initial useEffect([], []) without subscribing to AppState.addEventListener('change', ...).

[STEPS TO REPRODUCE]
1. Open mobile app (status: INACTIVE).
2. Switch to web browser and activate pass.
3. Switch back to mobile app -> App still shows INACTIVE until app process is killed and restarted.

[EXPECTED BEHAVIOR]
App should automatically re-fetch active membership status whenever app transition state is 'active'.

[ACTUAL BEHAVIOR]
Screen displays stale initial state indefinitely.

[PROPOSED RESOLUTION]
Add useAppState hook to trigger fetchActiveStatus() whenever app returns to foreground.`
  },
  {
    summary: 'Inconsistent Theme Flickering When System Appearance Toggles Between Dark and Light',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile ui',
    description: `[SEVERITY & IMPACT]
P3 - Visual Polish.
When Android scheduled dark mode activates at sunset while user is in the app, background colors change but text colors remain black, rendering labels unreadable.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/constants/theme.ts
- fitempire-mobile/src/components/themed-text.tsx

[TECHNICAL ROOT CAUSE]
Components hardcode fallback colors or use static Colors.dark references alongside dynamic useColorScheme() hooks inconsistently.

[STEPS TO REPRODUCE]
1. Launch app in Light mode.
2. Toggle Android system dark mode from quick settings tile.
3. Text contrast breaks across multiple card containers.

[EXPECTED BEHAVIOR]
Unified design token hierarchy responding dynamically to appearance changes without contrast degradation.

[ACTUAL BEHAVIOR]
Text labels become unreadable due to mismatched hardcoded text colors.

[PROPOSED RESOLUTION]
Standardize all color tokens through useThemeColor hook and lock app to dark theme in app.json if intended.`
  },
  {
    summary: 'Lack of Haptic Feedback on Successful QR Turnstile Check-In',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile ux',
    description: `[SEVERITY & IMPACT]
P3 - Tactile Feedback Enhancement.
In loud gym environments with music blasting, users cannot tell if their pass scan was accepted without staring closely at the phone screen.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/scan.tsx

[TECHNICAL ROOT CAUSE]
Scan success callback does not trigger expo-haptics notification vibration (Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)).

[STEPS TO REPRODUCE]
1. Scan QR code at gym turnstile.
2. Dialog appears on screen, but device produces zero physical vibration or tactile feedback.

[EXPECTED BEHAVIOR]
A distinct double-pulse haptic vibration should signal successful check-in immediately.

[ACTUAL BEHAVIOR]
Silent screen update only.

[PROPOSED RESOLUTION]
Install expo-haptics and trigger Haptics.notificationAsync(Success) on scan confirmation.`
  },
  {
    summary: 'Geolocation Prompt Lacks Pre-Permission Educational Dialog Explaining Proximity Value',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile permissions',
    description: `[SEVERITY & IMPACT]
P3 - Permission Opt-in Rate Optimization.
Prompting the raw Android location permission dialog on initial cold launch results in a 40%+ user denial rate because users do not understand why a fitness app needs GPS.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/(tabs)/index.tsx

[TECHNICAL ROOT CAUSE]
Location.requestForegroundPermissionsAsync() is called directly in root mount without showing a branded in-app rationale modal first.

[STEPS TO REPRODUCE]
1. Install fresh build on Android device.
2. Cold open app.
3. Generic OS dialog "Allow FitEmpire to access location?" appears immediately before any UI context.

[EXPECTED BEHAVIOR]
Show a friendly modal explaining "Find gyms within 5 minutes of your location" before triggering the OS prompt.

[ACTUAL BEHAVIOR]
Raw OS prompt triggered with zero context.

[PROPOSED RESOLUTION]
Implement an in-app LocationRationaleModal explaining benefits prior to calling requestForegroundPermissionsAsync.`
  },
  {
    summary: 'Unhandled Disabled Device GPS Throws Silent Error in Nearby Gyms Search',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'mobile location',
    description: `[SEVERITY & IMPACT]
P2 - Empty State / Silent Failure.
If a user has granted location permission to the app but device master Location toggle (GPS) is turned off in Android quick settings, nearby gym search hangs indefinitely.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/explore.tsx

[TECHNICAL ROOT CAUSE]
Location.getCurrentPositionAsync() is called without first checking Location.hasServicesEnabledAsync().

[STEPS TO REPRODUCE]
1. Turn off GPS toggle in Android settings.
2. Open FitEmpire Explore screen and tap "Near Me".
3. Loader spins indefinitely; no gyms appear and no prompt is displayed.

[EXPECTED BEHAVIOR]
App should detect disabled location services and prompt: "Please turn on device location/GPS to find nearby gyms."

[ACTUAL BEHAVIOR]
Silent infinite loading spinner.

[PROPOSED RESOLUTION]
Check await Location.hasServicesEnabledAsync() and show an alert prompting user to enable GPS.`
  },
  {
    summary: 'Memory Leak in Workout Countdown Timer Due to Uncleaned Interval on Screen Unmount',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'mobile performance',
    description: `[SEVERITY & IMPACT]
P2 - Memory Leak & Battery Drain.
Starting an interval timer on the workout screen and pressing the back button leaves setInterval running in the background, consuming CPU cycles and leaking memory.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/workout-timer.tsx

[TECHNICAL ROOT CAUSE]
useEffect creating setInterval(tick, 1000) does not return a cleanup function () => clearInterval(timerId).

[STEPS TO REPRODUCE]
1. Open Workout Timer screen and start 3-minute rest timer.
2. Immediately tap back button to return to Home.
3. Notice in debug console that tick logs continue printing every second indefinitely.

[EXPECTED BEHAVIOR]
Leaving the screen should cleanly tear down the timer and release resources.

[ACTUAL BEHAVIOR]
Timer interval runs continuously in background.

[PROPOSED RESOLUTION]
Return cleanup function in useEffect: return () => clearInterval(timerRef.current).`
  },
  {
    summary: 'Missing Skeleton Loading Placeholders on Explore Feed Causes Layout Shift (CLS)',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile ui',
    description: `[SEVERITY & IMPACT]
P3 - Visual Polish & Perceived Performance.
While gyms are loading over slow 4G networks, the screen shows a blank dark canvas, and then abruptly pops all cards into view, causing visual layout shifting.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/explore.tsx

[TECHNICAL ROOT CAUSE]
Loading state renders a single ActivityIndicator centered on screen instead of shimmering skeleton placeholder cards matching the gym card dimensions.

[STEPS TO REPRODUCE]
1. Open Explore screen on throttled 3G network.
2. A small spinner appears in screen center.
3. 2 seconds later, 10 cards flash into view simultaneously.

[EXPECTED BEHAVIOR]
Shimmering skeleton card placeholders should display immediately while data streams in.

[ACTUAL BEHAVIOR]
Abrupt card pop-in causing poor perceived performance.

[PROPOSED RESOLUTION]
Create GymCardSkeleton component with subtle pulse animation and display 4 skeletons during loading.`
  },
  {
    summary: 'Missing Global Error Boundary Component Leaves App on Unresponsive Blank Screen on JS Crash',
    issueType: 'Bug',
    priority: 'High',
    labels: 'mobile stability',
    description: `[SEVERITY & IMPACT]
P1 - Fatal Crash Handling.
If an unexpected rendering error or null pointer occurs in a deeply nested component, the entire React Native app crashes to a blank white/black screen with no way for user to recover without killing the process.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/_layout.tsx

[TECHNICAL ROOT CAUSE]
The root app tree lacks a top-level ErrorBoundary component catching componentDidCatch errors.

[STEPS TO REPRODUCE]
1. Trigger an intentional undefined property access (e.g. user.profile.address.city when address is null).
2. Screen goes completely blank; user touches are ignored.

[EXPECTED BEHAVIOR]
A friendly CrashRecoveryView should render: "Something went wrong. [Restart App] [Report Issue]".

[ACTUAL BEHAVIOR]
Unrecoverable blank screen.

[PROPOSED RESOLUTION]
Wrap root Stack inside an ErrorBoundary displaying a branded fallback view with an app reload button.`
  },
  {
    summary: 'Workout Timer Screen Allows Device Display to Sleep and Lock During Exercise Sets',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile workout',
    description: `[SEVERITY & IMPACT]
P3 - Gym Workout Convenience.
While performing a 90-second plank or rest timer, the phone screen dims and locks after 30 seconds according to Android OS display timeout, forcing users to unlock phone with sweaty hands.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/workout-timer.tsx

[TECHNICAL ROOT CAUSE]
WorkoutTimer screen does not activate expo-keep-awake to temporarily prevent screen sleep while timer is running.

[STEPS TO REPRODUCE]
1. Open Workout Timer, start 2-minute timer, and place phone on gym mat.
2. At 30 seconds, phone display turns off and locks.
3. User must pick up phone and unlock to check remaining time.

[EXPECTED BEHAVIOR]
Display should remain illuminated while timer is actively running, and allow sleep once timer finishes.

[ACTUAL BEHAVIOR]
Display locks automatically during active workout set.

[PROPOSED RESOLUTION]
Use useKeepAwake() from expo-keep-awake while isRunning is true.`
  },
  {
    summary: 'Wallet Transaction History Lacks Infinite Scroll Pagination Loading Entire History in Single Call',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile performance',
    description: `[SEVERITY & IMPACT]
P3 - Mobile Performance & Memory Footprint.
Active users with 300+ wallet transactions experience slow rendering and heavy memory usage because the wallet screen fetches all records in a single unpaginated API request.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/wallet.tsx

[TECHNICAL ROOT CAUSE]
FlatList renders full transaction list without onEndReached pagination triggers to load subsequent pages in chunks of 20.

[STEPS TO REPRODUCE]
1. Account with 200 wallet transactions navigates to Wallet tab.
2. Large payload returned from API; screen stutters during initial list layout calculation.

[EXPECTED BEHAVIOR]
Load initial 20 transactions; fetch next 20 when user scrolls within 20% of list bottom.

[ACTUAL BEHAVIOR]
All transactions loaded and rendered in one batch.

[PROPOSED RESOLUTION]
Implement onEndReached with page/size state in FlatList.`
  },
  {
    summary: 'Search Input Lacks Debounce Triggering Unnecessary API Requests on Every Keystroke',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile search',
    description: `[SEVERITY & IMPACT]
P3 - Network Bandwidth & Server Load.
Typing "Fitness First" (13 characters) in the gym search bar fires 13 individual HTTP requests to /api/v1/gyms/search, causing race conditions where early responses overwrite later ones.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/explore.tsx (Lines 60-80)

[TECHNICAL ROOT CAUSE]
onChangeText={text => searchGyms(text)} executes immediately without a 300ms debounce timer.

[STEPS TO REPRODUCE]
1. Open Explore search bar.
2. Rapidly type "Gold Gym".
3. Network log shows 8 rapid HTTP requests dispatched in under 1 second.

[EXPECTED BEHAVIOR]
API request should only fire 300ms after user pauses typing.

[ACTUAL BEHAVIOR]
HTTP request sent on every single letter typed.

[PROPOSED RESOLUTION]
Wrap search trigger in useDebounce hook with 300ms delay.`
  },
  {
    summary: 'Fast Consecutive Taps on Book Slot Button Fire Duplicate Booking Requests',
    issueType: 'Bug',
    priority: 'High',
    labels: 'mobile bookings',
    description: `[SEVERITY & IMPACT]
P1 - Double Booking & Credit Wastage.
Rapidly double-tapping "Confirm Booking" button dispatches two concurrent HTTP requests before the button disables, deducting two pass credits for the exact same class slot.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/class-detail.tsx

[TECHNICAL ROOT CAUSE]
TouchableOpacity does not disable immediately on first press (disabled={loading}), allowing secondary press events before React re-renders with loading = true.

[STEPS TO REPRODUCE]
1. Select a workout class slot.
2. Rapidly double-tap "Confirm Booking" button.
3. Two booking requests reach the server simultaneously.
4. User receives two booking confirmation SMS and 2 credits deducted.

[EXPECTED BEHAVIOR]
Button should disable synchronously on first touch, ignoring subsequent rapid taps.

[ACTUAL BEHAVIOR]
Double-tap triggers duplicate booking calls.

[PROPOSED RESOLUTION]
Use a ref boolean isSubmitting.current = true synchronously in onPress handler before initiating async API call.`
  },
  {
    summary: 'Membership QR Brightness Not Automatically Boosted for Optical Turnstile Scanners',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile scanner',
    description: `[SEVERITY & IMPACT]
P3 - Turnstile Scan Speed & User Convenience.
When users have screen brightness set to 20% in dark environments, optical turnstile barcode readers fail to scan the QR code until user manually pulls down notification shade to boost brightness.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/membership.tsx

[TECHNICAL ROOT CAUSE]
Screen does not use expo-brightness to temporarily elevate screen brightness to 100% while viewing the check-in QR code.

[STEPS TO REPRODUCE]
1. Set phone screen brightness to low (20%).
2. Present phone QR to optical laser turnstile scanner.
3. Scanner fails to read code due to low screen contrast.

[EXPECTED BEHAVIOR]
App should temporarily set brightness to 1.0 while QR is visible, and restore previous user brightness on exit.

[ACTUAL BEHAVIOR]
Brightness remains at whatever low setting the user has configured.

[PROPOSED RESOLUTION]
Integrate expo-brightness: Brightness.setBrightnessAsync(1.0) on mount and restore on unmount.`
  },
  {
    summary: 'Push Notification Click Handler Fails to Deep-Link to Specific Booking or Offer Screen',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'mobile notifications',
    description: `[SEVERITY & IMPACT]
P2 - Broken Marketing & Notification Engagement.
Tapping a push notification about a confirmed booking or 50% discount flash sale opens the default home screen rather than navigating directly to the relevant booking or coupon page.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/_layout.tsx

[TECHNICAL ROOT CAUSE]
Notifications.addNotificationResponseReceivedListener does not parse response.notification.request.content.data.url and route via router.push().

[STEPS TO REPRODUCE]
1. Receive push notification: "Your HIIT workout starts in 30 mins! Tap to view details."
2. Tap the notification banner.
3. App launches into default Home tab; user must manually navigate to My Bookings to locate the class.

[EXPECTED BEHAVIOR]
Tapping notification should navigate directly to /my-bookings?id=123.

[ACTUAL BEHAVIOR]
App opens home screen, ignoring notification payload data.

[PROPOSED RESOLUTION]
Implement notification response listener in root layout calling router.push(data.url).`
  },
  {
    summary: 'Favorites / Bookmarks Screen Missing Empty State Illustration and Action CTA',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile ui',
    description: `[SEVERITY & IMPACT]
P3 - UI Polish & User Guidance.
When a user visits their Saved/Favorite Gyms tab for the first time, the screen is a completely blank dark container with no helpful text or "Explore Nearby Gyms" button.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/favorites.tsx

[TECHNICAL ROOT CAUSE]
List renders null when favorites array length is 0 instead of displaying a branded EmptyState component.

[STEPS TO REPRODUCE]
1. Open Saved Gyms screen on a new account.
2. Screen displays blank space.

[EXPECTED BEHAVIOR]
Display heart icon illustration, text "No Saved Gyms Yet", and button "Explore Gyms Near You".

[ACTUAL BEHAVIOR]
Blank empty screen.

[PROPOSED RESOLUTION]
Render EmptyStateView with heart icon and router.push('/explore') button when list is empty.`
  },
  {
    summary: 'In-App Payment Gateway WebView Lacks Back and Reload Navigation Controls',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile payments',
    description: `[SEVERITY & IMPACT]
P3 - Payment Recovery UX.
If Razorpay netbanking page encounters a banking timeout, the user is trapped on a white webview screen with no back button, forced to force-close the mobile app.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/payment-webview.tsx

[TECHNICAL ROOT CAUSE]
WebView component renders fullscreen without a top header toolbar providing "Cancel Payment" and "Reload" controls.

[STEPS TO REPRODUCE]
1. Initiate netbanking checkout in WebView.
2. Bank portal hangs with network timeout.
3. User has no UI button to cancel or reload the payment session.

[EXPECTED BEHAVIOR]
Top navigation bar with "Close / Cancel" and reload buttons allowing safe return to cart.

[ACTUAL BEHAVIOR]
User trapped in unresponsive webview.

[PROPOSED RESOLUTION]
Add top navigation header with Close button confirming cancellation before exiting.`
  },
  {
    summary: 'Text Truncation and Overlapping Elements on Small Android Displays (320dp Width)',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile ui',
    description: `[SEVERITY & IMPACT]
P3 - UI Layout Polish.
On compact budget Android phones (e.g. 320dp screen width), gym badge labels ("FLAGSHIP 360") collide with price text, causing overlapping ugly characters.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/components/GymCard.tsx

[TECHNICAL ROOT CAUSE]
Fixed widths and non-wrapping flexDirection: 'row' containers without flexShrink: 1 or numberOfLines={1}.

[STEPS TO REPRODUCE]
1. Open app on Android emulator set to 320x640 screen resolution.
2. Observe gym cards -> Badges overlap price text.

[EXPECTED BEHAVIOR]
Responsive flex wrapping or ellipsis truncation preserving clean card layout.

[ACTUAL BEHAVIOR]
Visual text collisions on compact viewports.

[PROPOSED RESOLUTION]
Add flexShrink: 1 to badge wrappers and ensure price has flexShrink: 0.`
  },
  {
    summary: 'Unhandled Expired Refresh Token Causes Infinite 401 Loop in Mobile Axios Interceptor',
    issueType: 'Bug',
    priority: 'High',
    labels: 'mobile auth',
    description: `[SEVERITY & IMPACT]
P1 - App Lockout / Crash.
When both the JWT access token and refresh token expire after 30 days of inactivity, the axios response interceptor enters an infinite recursive retry loop attempting to refresh the token, freezing the UI.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/services/api.ts (Lines 40-75)

[TECHNICAL ROOT CAUSE]
The 401 interceptor attempts authApi.refreshToken() when a request fails with 401. If the refresh request itself returns 401, the interceptor re-invokes itself infinitely without clearing storage and redirecting to login.

[STEPS TO REPRODUCE]
1. Set expired access and refresh tokens in AsyncStorage.
2. Launch app -> Interceptor calls refresh endpoint.
3. Refresh endpoint returns 401.
4. Interceptor catches 401 and calls refresh endpoint again in an endless loop.

[EXPECTED BEHAVIOR]
If refresh token request fails with 401, immediately clear tokens from storage, reset auth state, and route to /login.

[ACTUAL BEHAVIOR]
App enters CPU-intensive infinite loop and freezes.

[PROPOSED RESOLUTION]
Track retry count or check config._retry flag; on refresh failure, execute authStorage.clear() and router.replace('/login').`
  },
  {
    summary: 'Workout Plan PDF Export Lacks Android 13+ Granular Storage Permissions Check',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile permissions',
    description: `[SEVERITY & IMPACT]
P3 - Android 13+ Compatibility.
On Android 13+ (API level 33), legacy WRITE_EXTERNAL_STORAGE permission is deprecated. Attempting to save generated AI workout routines fails silently without saving the file.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/workout-plan.tsx

[TECHNICAL ROOT CAUSE]
App relies on legacy PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE instead of using expo-sharing or expo-file-system StorageAccessFramework.

[STEPS TO REPRODUCE]
1. Generate workout plan on Android 13 or 14 device.
2. Tap "Download PDF".
3. Action fails silently with permission error; PDF is not saved to device Downloads.

[EXPECTED BEHAVIOR]
PDF should be saved to app cache and shared via native Android share sheet using Sharing.shareAsync().

[ACTUAL BEHAVIOR]
Silent download failure on Android 13+.

[PROPOSED RESOLUTION]
Save file to FileSystem.documentDirectory and invoke Sharing.shareAsync(uri).`
  },
  {
    summary: 'Missing Confirmation Modal Before Permanent Account Deletion Request',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile profile',
    description: `[SEVERITY & IMPACT]
P3 - Accidental Data Loss Prevention.
Tapping "Delete Account" in settings triggers account deletion without a two-step confirmation dialog or password verification, risking irreversible accidental deletions.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/settings-security.tsx

[TECHNICAL ROOT CAUSE]
Action invokes userApi.deleteAccount() with a basic one-tap alert without requiring user to type "DELETE" or input their account password.

[STEPS TO REPRODUCE]
1. Open Settings -> Security -> Delete Account.
2. Tap button -> Single alert appears; tapping OK immediately wipes user account.

[EXPECTED BEHAVIOR]
Destructive account deletion should require typing user password or typing confirmation keyword "DELETE".

[ACTUAL BEHAVIOR]
One-tap deletion without verification.

[PROPOSED RESOLUTION]
Implement AccountDeletionModal requiring password confirmation and warning of forfeiture of unused pass days.`
  },
  {
    summary: 'Referral Share Message Lacks Dynamic Play Store and App Store Download Links',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile referral',
    description: `[SEVERITY & IMPACT]
P3 - Viral Referral Conversion Rate.
The shared WhatsApp referral text contains only the code and website homepage URL without direct deep links to the Google Play Store and Apple App Store.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/refer.tsx (Lines 30-33)

[TECHNICAL ROOT CAUSE]
handleShare formats plain string without UTM parameters or platform-specific store download redirects.

[STEPS TO REPRODUCE]
1. Tap "Share on WhatsApp" on Refer screen.
2. Message text: "Use code EMPIRE-500 at https://fitempire.tech".
3. Friends clicking the link arrive at a generic landing page without direct app install prompt.

[EXPECTED BEHAVIOR]
Message should include smart branch / Firebase Dynamic Link: "Download FitEmpire: https://fitempire.page.link/referral?code=...".

[ACTUAL BEHAVIOR]
Plain website link with no install tracking.

[PROPOSED RESOLUTION]
Construct deep link with referral code parameters and direct store fallback URLs.`
  },
  {
    summary: 'In-App Update Checker Missing to Prompt Users on Critical Security and Bug Fix Releases',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'mobile maintenance',
    description: `[SEVERITY & IMPACT]
P3 - Version Fragmentation & Supportability.
Users on outdated mobile app versions (e.g. v1.0.0) remain vulnerable to known bugs and cannot access newly launched features without an in-app update prompt.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/_layout.tsx

[TECHNICAL ROOT CAUSE]
App lacks an update checker comparing Application.nativeApplicationVersion with backend minimum supported version config.

[STEPS TO REPRODUCE]
1. Launch older app build.
2. App runs normally without checking if backend APIs have deprecated this version.

[EXPECTED BEHAVIOR]
App should query /api/v1/config/app-version on launch; if current version < minRequiredVersion, show blocking update dialog: "Please update FitEmpire to continue."

[ACTUAL BEHAVIOR]
Outdated versions run indefinitely until crashing on deprecated APIs.

[PROPOSED RESOLUTION]
Add VersionCheck hook checking remote version config and prompting Google Play Store update.`
  },

  // =========================================================================
  // PARTNER PORTAL (20 Issues: FE-201 to FE-220)
  // =========================================================================
  {
    summary: '[CR] Idle Session Timeout Warning Modal Before Automatic Partner Logout',
    issueType: 'Task',
    priority: 'Low',
    labels: 'partner portal',
    description: `[SEVERITY & IMPACT]
P3 - Front Desk Usability & Security.
Gym reception PCs left unattended should automatically lock after 30 minutes of inactivity, but currently either stay logged in forever or log out abruptly mid-check-in without warning.

[AFFECTED FILES & LINES]
- fitempire-partner/src/context/AuthContext.tsx

[TECHNICAL ROOT CAUSE]
No idle activity tracker listening to DOM mousemove/keypress events to trigger a 60-second logout warning modal.

[STEPS TO REPRODUCE]
1. Leave partner portal open on gym front desk PC with no activity.
2. Portal either remains authenticated overnight or suddenly throws 401 when staff attempts to scan next member.

[EXPECTED BEHAVIOR]
After 25 minutes of inactivity, display modal: "Your session will expire in 5 minutes due to inactivity. [Stay Logged In]".

[ACTUAL BEHAVIOR]
No idle tracking or session warning modal.

[PROPOSED RESOLUTION]
Implement an IdleTimerProvider listening for user interactions and warning before JWT token invalidation.`
  },
  {
    summary: 'Camera Stream Hardware Not Released on Route Navigation Away from Partner Scanner Page',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'partner scanner',
    description: `[SEVERITY & IMPACT]
P2 - Hardware Resource Drain & Privacy Concern.
When front desk staff navigates away from the Scanner page to Attendance or Revenue, the web camera indicator light remains on, continuing to capture frames in the background.

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/ScannerPage.tsx

[TECHNICAL ROOT CAUSE]
ScannerPage does not call mediaStream.getTracks().forEach(track => track.stop()) in the useEffect unmount cleanup function.

[STEPS TO REPRODUCE]
1. Open Scanner page in partner portal; camera turns on (green laptop LED illuminates).
2. Click "Attendance" in sidebar navigation.
3. Observe camera hardware LED remains illuminated; webcam stream is still running in memory.

[EXPECTED BEHAVIOR]
Navigating away from Scanner must immediately stop all video tracks and release the camera device.

[ACTUAL BEHAVIOR]
Camera hardware stays active in background.

[PROPOSED RESOLUTION]
Add cleanup function in useEffect: return () => { if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop()); }.`
  },
  {
    summary: 'Attendance Table Lacks Virtualized Pagination for High-Volume Gyms Causing Browser Freeze',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'partner attendance',
    description: `[SEVERITY & IMPACT]
P3 - Front Desk PC Performance.
Flagship gyms with 800+ daily member visits experience severe browser tab lag and freezing when viewing the attendance page because all 800 table rows are rendered simultaneously into the DOM.

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/AttendancePage.tsx (Lines 140-190)

[TECHNICAL ROOT CAUSE]
records.map(...) renders hundreds of standard HTML <tr> DOM nodes without TanStack Virtual or server-side pagination.

[STEPS TO REPRODUCE]
1. Load attendance page for a gym with 1,000 check-ins today.
2. Browser DOM node count exceeds 15,000 nodes.
3. Typing in search bar suffers 1.5 second input latency.

[EXPECTED BEHAVIOR]
Table should use server-side pagination (25 records per page) or virtual scrolling.

[ACTUAL BEHAVIOR]
All records rendered in one gigantic DOM tree.

[PROPOSED RESOLUTION]
Add pagination controls (< Prev 1 2 3 ... Next >) with 25 records per page.`
  },
  {
    summary: '[CR] Multi-Language Support (English and Hindi) for Partner Front-Desk Receptionists',
    issueType: 'Task',
    priority: 'Low',
    labels: 'partner portal',
    description: `[SEVERITY & IMPACT]
P3 - Staff Adoption & Operational Ease.
Many gym front-desk staff and trainers in Tier-2 Indian cities prefer Hindi interface labels for daily operations (Check-In, Attendance, Member Pass Status).

[AFFECTED FILES & LINES]
- fitempire-partner/src/App.tsx
- fitempire-partner/src/locales/

[TECHNICAL ROOT CAUSE]
All UI strings in partner portal are hardcoded English without an i18n (react-i18next) localization provider.

[STEPS TO REPRODUCE]
1. Review partner portal pages.
2. All strings are hardcoded in English with no language toggle.

[EXPECTED BEHAVIOR]
Header language switch (EN / HI) allowing receptionists to view portal in Hindi or English.

[ACTUAL BEHAVIOR]
Only English text available.

[PROPOSED RESOLUTION]
Integrate react-i18next with English and Hindi translation dictionaries for core check-in workflows.`
  },
  {
    summary: 'Lack of Audit Log of Staff Member Identity for Manual Attendance Overrides',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'partner attendance',
    description: `[SEVERITY & IMPACT]
P2 - Partner Internal Fraud & Accountability.
When a receptionist manually checks in a member whose QR failed to scan, the system does not record which staff account performed the manual check-in override, creating internal theft risk.

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/AttendancePage.tsx
- fitempire-backend/src/main/java/com/fitempire/modules/partner/entity/AttendanceRecord.java

[TECHNICAL ROOT CAUSE]
Manual check-in endpoint accepts member phone number but does not record checked_by_staff_id on the attendance record.

[STEPS TO REPRODUCE]
1. Receptionist performs a manual attendance check-in.
2. Query attendance_records table in database.
3. checked_by column is null or generic SYSTEM string; gym owner cannot trace which staff member authorized entry.

[EXPECTED BEHAVIOR]
Record must log staffId, timestamp, and overrideReason ("QR Camera Glare", "Phone Battery Dead").

[ACTUAL BEHAVIOR]
Manual check-ins lack staff identity attribution.

[PROPOSED RESOLUTION]
Pass authenticated staff user ID in manual check-in request and persist in checked_by_user_id column.`
  },
  {
    summary: 'Gym Photo Gallery Upload Lacks Drag-and-Drop Reordering for Primary Display Picture',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'partner profile',
    description: `[SEVERITY & IMPACT]
P3 - Partner Usability.
Partners cannot change the primary display picture shown on the mobile explore card without deleting all photos and re-uploading them in exact order.

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/GymProfilePage.tsx

[TECHNICAL ROOT CAUSE]
Photos are stored as a flat array without a display_order attribute or drag-and-drop sortable list (@hello-pangea/dnd).

[STEPS TO REPRODUCE]
1. Partner uploads 5 gym photos.
2. Photo 4 is the best shot and partner wants it as the main cover picture.
3. No UI handle exists to drag Photo 4 to position 1.

[EXPECTED BEHAVIOR]
Partners can drag and drop photo cards to rearrange showcase order and set cover image.

[ACTUAL BEHAVIOR]
Static upload order locked.

[PROPOSED RESOLUTION]
Implement sortable photo grid with "Set as Cover" action button on each photo.`
  },
  {
    summary: 'Partner Member Search Input Does Not Support Partial Phone Number or Member ID',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'partner search',
    description: `[SEVERITY & IMPACT]
P3 - Front Desk Speed.
When a member arrives without their phone and gives the last 4 digits of their mobile number (e.g. "7252"), the search returns no results because it requires an exact full 10-digit number match.

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/AttendancePage.tsx (Lines 6-12)

[TECHNICAL ROOT CAUSE]
Filter logic uses m.phone === searchTerm instead of m.phone.includes(searchTerm) or clean numeric regex matching.

[STEPS TO REPRODUCE]
1. In partner attendance search, type "7252".
2. Search table is empty even though member with phone "+91 98800 72520" exists.

[EXPECTED BEHAVIOR]
Typing "7252" should match all members whose phone numbers or member IDs contain "7252".

[ACTUAL BEHAVIOR]
Partial number matching fails.

[PROPOSED RESOLUTION]
Update client search filter: record.phone.replace(/\\D/g, '').includes(searchTerm.replace(/\\D/g, '')) || record.name.toLowerCase().includes(searchTerm.toLowerCase()).`
  },
  {
    summary: 'Notification Bell Icon in Partner Header Displays Hardcoded Dummy Data',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'partner notifications',
    description: `[SEVERITY & IMPACT]
P2 - Missing Operational Alerts.
Clicking the notification bell in the partner header displays hardcoded static notifications from 3 months ago instead of real alerts regarding membership renewals, payout disbursements, or system updates.

[AFFECTED FILES & LINES]
- fitempire-partner/src/components/Header.tsx

[TECHNICAL ROOT CAUSE]
Header component contains hardcoded dummy notifications array with no API integration to /api/v1/partner/notifications.

[STEPS TO REPRODUCE]
1. Click notification bell icon in partner portal header.
2. Dropdown shows "Amit Kumar checked in 2h ago" (dummy data).
3. Even when new real check-ins occur, the bell count and dropdown never update.

[EXPECTED BEHAVIOR]
Notification dropdown should fetch real partner alerts from backend with "Mark as Read" functionality.

[ACTUAL BEHAVIOR]
Static dummy placeholder data.

[PROPOSED RESOLUTION]
Connect Header notification dropdown to partnerApi.getNotifications() with unread badge counter.`
  },
  {
    summary: 'Gym Operating Hours Editor Does Not Support Split-Shift Schedules (Morning and Evening Batches)',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'partner profile',
    description: `[SEVERITY & IMPACT]
P3 - Indian Gym Operational Reality.
Many gyms in India operate split shifts (e.g. Morning 06:00 AM - 11:00 AM, Closed afternoon, Evening 04:30 PM - 10:00 PM), but portal only allows a single opening and closing time.

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/GymProfilePage.tsx (Lines 53-54)

[TECHNICAL ROOT CAUSE]
Profile schema only defines openingTime and closingTime strings, omitting support for multiple shift intervals per day.

[STEPS TO REPRODUCE]
1. Gym partner tries to configure operating hours: Morning 6-11 AM, Evening 5-10 PM.
2. Portal UI only provides a single "Opens At" and "Closes At" input field.

[EXPECTED BEHAVIOR]
Option to add "Shift 2" (split-shift) for gyms that close during afternoon hours.

[ACTUAL BEHAVIOR]
Partner forced to set 06:00 AM - 10:00 PM, causing members to arrive when gym is closed in afternoon.

[PROPOSED RESOLUTION]
Expand operating hours schema to support an array of shifts: [{ open: "06:00", close: "11:00" }, { open: "16:30", close: "22:00" }].`
  },
  {
    summary: 'Missing Bulk Check-In Capability for Group Fitness and Corporate Batch Classes',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'partner classes',
    description: `[SEVERITY & IMPACT]
P3 - Front Desk Efficiency for Group Classes.
When a 30-person Zumba or CrossFit batch arrives, front desk staff must scan all 30 members one by one, creating entrance congestion.

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/ClassesPage.tsx

[TECHNICAL ROOT CAUSE]
ClassesPage only supports single member attendance toggles without a "Select All Roster" -> "Mark All Present" batch action.

[STEPS TO REPRODUCE]
1. Open class roster with 25 booked members.
2. Staff must click 25 individual checkboxes one by one to mark attendance.

[EXPECTED BEHAVIOR]
"Select All" checkbox allowing 1-click batch attendance confirmation for the entire registered class.

[ACTUAL BEHAVIOR]
Tedious single-click entry only.

[PROPOSED RESOLUTION]
Add "Mark All Present" button executing partnerApi.bulkAttendance(classId, memberIds).`
  },
  {
    summary: '[CR] Reception Desk Printable QR Standee Generator (PDF Download)',
    issueType: 'Task',
    priority: 'Low',
    labels: 'partner portal',
    description: `[SEVERITY & IMPACT]
P3 - Partner Onboarding & Turnstile Convenience.
New gym partners lack an easy way to print high-resolution branded FitEmpire QR code counter standees for their front desk reception.

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/ScannerPage.tsx
- fitempire-partner/src/pages/GymProfilePage.tsx

[TECHNICAL ROOT CAUSE]
No client-side or backend PDF standee generation template incorporating gym name, branch QR code, and FitEmpire branding.

[STEPS TO REPRODUCE]
1. Partner signs up and wants to print a table standee for front desk.
2. Partner portal provides no "Download Print Standee PDF" button.

[EXPECTED BEHAVIOR]
A "Download Counter Standee PDF" button generating a print-ready A4/A5 PDF with vector QR code and "Scan Here with FitEmpire App" instructions.

[ACTUAL BEHAVIOR]
Feature absent.

[PROPOSED RESOLUTION]
Add printable PDF generation using jsPDF / pdfmake with high-res QR code and FitEmpire counter branding.`
  },
  {
    summary: 'Partner Portal Lacks Role-Based Access Control (Owner vs Front Desk Staff vs Trainer)',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'partner security',
    description: `[SEVERITY & IMPACT]
P3 - Internal Security & Sensitive Financial Data Protection.
Front desk receptionists and fitness trainers use the same partner login credentials as the gym owner, exposing bank details, revenue settlements, and tax IDs to junior staff.

[AFFECTED FILES & LINES]
- fitempire-partner/src/context/AuthContext.tsx
- fitempire-partner/src/pages/RevenuePage.tsx

[TECHNICAL ROOT CAUSE]
All partner accounts share identical permissions with no sub-user role segregation (PARTNER_OWNER, PARTNER_DESK, PARTNER_TRAINER).

[STEPS TO REPRODUCE]
1. Gym owner creates login for front desk receptionist to scan members.
2. Receptionist logs in and can click "Revenue & Payouts" to view all monthly earnings and bank account details.

[EXPECTED BEHAVIOR]
Front desk staff accounts should only have access to Scanner and Attendance pages; Revenue should be restricted to PARTNER_OWNER.

[ACTUAL BEHAVIOR]
All screens accessible to anyone with partner credentials.

[PROPOSED RESOLUTION]
Implement role attribute on partner user and hide Revenue/Settlement routes for staff roles.`
  },
  {
    summary: 'Attendance CSV Export Lacks Date Range Picker Exporting Entire Historical Database',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'partner attendance',
    description: `[SEVERITY & IMPACT]
P3 - Export Usability & Server Load.
Clicking "Export CSV" on the attendance page downloads all historical check-ins from day one without allowing the partner to select "Today", "This Week", or "Custom Month".

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/AttendancePage.tsx (Line 2)

[TECHNICAL ROOT CAUSE]
Export action does not accept startDate and endDate query filters, pulling unfiltered table contents.

[STEPS TO REPRODUCE]
1. Click "Export CSV" on Attendance page.
2. CSV immediately generates for all 2 years of gym check-in records.

[EXPECTED BEHAVIOR]
Export dialog prompting: "Select Date Range: [Today | This Month | Custom Range] -> Export".

[ACTUAL BEHAVIOR]
Full unfiltered database dumped into CSV.

[PROPOSED RESOLUTION]
Add DateRangePicker component to Export button and pass start/end dates to export query.`
  },
  {
    summary: 'Attendance CSV Export Lacks UTF-8 BOM Causing Garbled Hindi Names in Microsoft Excel',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'partner attendance',
    description: `[SEVERITY & IMPACT]
P2 - Data Export Quality on Windows.
When partners open exported attendance CSVs in Microsoft Excel on Windows, non-ASCII characters and Hindi member names display as corrupted mojibake symbols (e.g. à¤°à¤¾à¤¹à¥\x81à¤²).

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/AttendancePage.tsx

[TECHNICAL ROOT CAUSE]
Blob is created without UTF-8 Byte Order Mark: new Blob([csv], { type: 'text/csv' }) instead of new Blob(['\\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }).

[STEPS TO REPRODUCE]
1. Export attendance containing Indian names or Rupee currency symbol (₹).
2. Double-click CSV to open in Microsoft Excel on Windows.
3. Currency symbols and names appear garbled (â‚¹).

[EXPECTED BEHAVIOR]
Excel should render UTF-8 characters and currency symbols cleanly.

[ACTUAL BEHAVIOR]
Garbled characters due to missing byte order mark.

[PROPOSED RESOLUTION]
Prepend '\\uFEFF' to CSV Blob content before download.`
  },
  {
    summary: 'Partner Dashboard Revenue Cards Lack Custom Date Comparison with Previous Period',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'partner analytics',
    description: `[SEVERITY & IMPACT]
P3 - Business Intelligence Enhancement.
Partners cannot see whether their gym visit volume is growing or declining compared to the previous month or previous week.

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/DashboardPage.tsx

[TECHNICAL ROOT CAUSE]
Dashboard metrics show only lifetime or current month static numbers without percentage delta comparison badges (+14% vs last month).

[STEPS TO REPRODUCE]
1. Open Partner Dashboard.
2. Stat card displays "Total Check-ins: 342" with no indication of whether this is up or down compared to last month.

[EXPECTED BEHAVIOR]
Stat card displays "+12.4% vs last month" with green/red trend indicator.

[ACTUAL BEHAVIOR]
Static counters with no comparison context.

[PROPOSED RESOLUTION]
Compute period-over-period percentage deltas on backend dashboard analytics endpoint.`
  },
  {
    summary: 'Class Capacity Counter Does Not Account for Simultaneous Active Check-Ins',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'partner classes',
    description: `[SEVERITY & IMPACT]
P2 - Studio Overcrowding & Safety Hazard.
If a class capacity is 20, the system permits walk-in partner scan entries even after 20 pre-booked members have arrived, overcrowding spinning and yoga studios.

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/ScannerPage.tsx
- fitempire-backend/src/main/java/com/fitempire/modules/partner/service/AttendanceService.java

[TECHNICAL ROOT CAUSE]
Scanner verification checks pass validity but does not query active batch capacity if the member is attending a scheduled group class.

[STEPS TO REPRODUCE]
1. Yoga studio capacity set to 15.
2. 15 pre-booked members check in.
3. 16th member scans pass at entrance -> Scan succeeds; studio exceeds safety fire capacity.

[EXPECTED BEHAVIOR]
System should warn: "Yoga Studio is at maximum capacity (15/15). Assign to Gym Floor workout instead?"

[ACTUAL BEHAVIOR]
Unrestricted entry permitted regardless of class capacity limits.

[PROPOSED RESOLUTION]
Add studio capacity check in AttendanceService when check-in is linked to a class batch.`
  },
  {
    summary: 'Partner Password Reset Link Lacks Visual Expiration Timer Creating Confusion on Expired Links',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'partner auth',
    description: `[SEVERITY & IMPACT]
P3 - User Experience on Password Recovery.
When a gym partner clicks a password reset link received by email, the page does not indicate how many minutes remain before the token expires, resulting in confusing sudden rejections.

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/ResetPasswordPage.tsx

[TECHNICAL ROOT CAUSE]
Reset password form does not calculate remaining seconds from token expiry payload to display a countdown bar.

[STEPS TO REPRODUCE]
1. Request password reset email (15-minute validity).
2. Open link at minute 14.
3. Type new password slowly; submit at minute 16.
4. Error appears: "Token invalid", with no prior warning that token was about to expire.

[EXPECTED BEHAVIOR]
Display banner: "This reset link is valid for 12 more minutes."

[ACTUAL BEHAVIOR]
No expiration feedback provided.

[PROPOSED RESOLUTION]
Parse token expiration time and render a countdown timer warning user if under 2 minutes remain.`
  },
  {
    summary: 'Revenue Settlement History Table Lacks Downloadable PDF Invoice / Statement for Tax Records',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'partner billing',
    description: `[SEVERITY & IMPACT]
P3 - GST Accounting & Legal Compliance.
Gym accountants need formal monthly tax invoices / credit notes with FitEmpire GSTIN and partner GSTIN for input tax credit (ITC) claims, but portal only provides on-screen HTML numbers.

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/RevenuePage.tsx

[TECHNICAL ROOT CAUSE]
No PDF invoice generation endpoint or client-side invoice rendering component exists in the partner billing module.

[STEPS TO REPRODUCE]
1. Open Revenue & Payouts page.
2. View completed payout of ₹45,000 for August 2026.
3. No button exists to download official GST Invoice / Tax Payout Statement PDF.

[EXPECTED BEHAVIOR]
"Download Tax Invoice" button on every payout row generating official GST-compliant PDF invoice.

[ACTUAL BEHAVIOR]
Only basic HTML table rows visible.

[PROPOSED RESOLUTION]
Add backend /api/v1/partner/settlements/{id}/invoice endpoint generating PDF invoice.`
  },
  {
    summary: 'Gym Profile Amenity Selection Lacks Informational Tooltips Explaining Verification Requirements',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'partner profile',
    description: `[SEVERITY & IMPACT]
P3 - Profile Quality & Verification Accuracy.
Partners select "Swimming Pool" or "Sauna" thinking it is a wishlist, unaware that FitEmpire quality team requires photo proof for premium amenity badges.

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/GymProfilePage.tsx (Lines 9-15)

[TECHNICAL ROOT CAUSE]
Amenity badges render as basic checkboxes without hover tooltips explaining that premium amenities require photo upload before badge activation.

[STEPS TO REPRODUCE]
1. Partner toggles "Swimming Pool" on Gym Profile page.
2. Badge appears on profile, but later customer complains gym does not have a pool.

[EXPECTED BEHAVIOR]
Hover tooltip explaining: "Toggling premium amenities (Pool, Sauna) requires at least one verified facility photo."

[ACTUAL BEHAVIOR]
No tooltip or explanation provided.

[PROPOSED RESOLUTION]
Add tooltip icons with explanatory text next to all premium amenity toggles.`
  },
  {
    summary: 'Partner Portal Theme Locked to Dark Mode Without Light Mode Option for Bright Gym Desks',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'partner ui',
    description: `[SEVERITY & IMPACT]
P3 - Accessibility & High-Glare Environments.
Gym front desks positioned near glass windows with direct sunlight suffer extreme screen glare on the dark #070B14 interface, making it difficult for staff to read member names.

[AFFECTED FILES & LINES]
- fitempire-partner/src/index.css
- fitempire-partner/src/components/Sidebar.tsx

[TECHNICAL ROOT CAUSE]
CSS variables are hardcoded to dark hex colors (#070B14, #111B30) without CSS theme classes (.light-mode) or a theme toggle button.

[STEPS TO REPRODUCE]
1. Open partner portal on laptop near bright window in sunny gym lobby.
2. High screen reflection on dark background impedes reading member names and phone numbers.

[EXPECTED BEHAVIOR]
Theme toggle icon in sidebar switching between "Dark Mode" and high-contrast "Daylight Mode".

[ACTUAL BEHAVIOR]
Portal locked exclusively to dark theme.

[PROPOSED RESOLUTION]
Refactor colors to CSS variables and provide a daylight high-contrast light theme toggle.`
  },

  // =========================================================================
  // ADMIN CONSOLE & WEB LANDING PAGE (10 Issues: FE-221 to FE-230)
  // =========================================================================
  {
    summary: 'Admin User Management Table Lacks Bulk Operations for Account Suspension and Notifications',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'admin console',
    description: `[SEVERITY & IMPACT]
P3 - Admin Operational Productivity.
When administrators need to suspend 20 fraudulent accounts or broadcast an announcement to 50 users, they must click into each account individually.

[AFFECTED FILES & LINES]
- fitempire-web/src/admin/pages/UsersPage.tsx

[TECHNICAL ROOT CAUSE]
Users table lacks row selection checkboxes and a floating Bulk Actions toolbar (Bulk Suspend, Bulk Email, Bulk Tag).

[STEPS TO REPRODUCE]
1. Open Admin Console -> Users.
2. Select multiple users -> No checkboxes exist; actions are restricted to individual row action menus.

[EXPECTED BEHAVIOR]
Select-all checkbox with action toolbar: "15 users selected -> [Suspend] [Send Email] [Add Tag]".

[ACTUAL BEHAVIOR]
Single-user operations only.

[PROPOSED RESOLUTION]
Add row selection state and BulkActionToolbar executing /api/v1/admin/users/bulk.`
  },
  {
    summary: 'Admin Gym Approval Queue Lacks In-App PDF Preview of Commercial Licenses and Fire Certificates',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'admin verification',
    description: `[SEVERITY & IMPACT]
P3 - Compliance Verification Speed.
Verifying documents for a new partner gym requires admin to download PDF files to local disk, review them in Adobe Reader, and return to browser, slowing verification turnaround.

[AFFECTED FILES & LINES]
- fitempire-web/src/admin/pages/GymsPage.tsx

[TECHNICAL ROOT CAUSE]
Document URLs render as raw download links without an inline modal PDF viewer (react-pdf or iframe previewer).

[STEPS TO REPRODUCE]
1. Admin opens pending gym application.
2. Click "Trade License" link -> File downloads to Downloads folder instead of opening modal preview.

[EXPECTED BEHAVIOR]
Clicking document opens an in-browser preview modal with zoom and rotate controls.

[ACTUAL BEHAVIOR]
File downloads to disk.

[PROPOSED RESOLUTION]
Embed DocumentPreviewModal using an iframe or PDF.js viewer.`
  },
  {
    summary: 'Landing Page City Selector Popup Does Not Remember User City in LocalStorage Across Sessions',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'frontend web',
    description: `[SEVERITY & IMPACT]
P2 - Landing Page Bounce Rate & Friction.
A user in Bengaluru selects "Bengaluru" in the city selector popup. When returning the next day or opening a new tab, the popup prompts them to pick their city again, defaulting back to Delhi NCR.

[AFFECTED FILES & LINES]
- fitempire-web/src/components/Navbar.tsx
- fitempire-web/src/components/CitySelectModal.tsx

[TECHNICAL ROOT CAUSE]
Selected city is stored solely in local React state without reading from or writing to localStorage.getItem('fitempire_selected_city').

[STEPS TO REPRODUCE]
1. Visit https://fitempire.tech.
2. Select "Bengaluru" from city selector.
3. Close tab and reopen website in a new tab.
4. City reverts to "Delhi NCR" and city popup reappears.

[EXPECTED BEHAVIOR]
Selected city should persist in localStorage and auto-populate across all browser sessions.

[ACTUAL BEHAVIOR]
City selection lost on tab close.

[PROPOSED RESOLUTION]
Save selected city to localStorage on change and initialize state from localStorage.`
  },
  {
    summary: 'Corporate Wellness Inquiry Form Lacks Anti-Spam Honeypot or reCAPTCHA Protection',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'frontend security',
    description: `[SEVERITY & IMPACT]
P3 - Lead Pipeline Quality & Spam Prevention.
The corporate inquiry form on the landing page is targeted by automated spam bots submitting hundreds of fake sales leads with cryptocurrency spam links.

[AFFECTED FILES & LINES]
- fitempire-web/src/components/CorporateSection.tsx

[TECHNICAL ROOT CAUSE]
Form submits directly to backend lead API without a hidden honeypot input field or Cloudflare Turnstile / Google reCAPTCHA v3 verification.

[STEPS TO REPRODUCE]
1. Send automated POST request with curl to /api/v1/leads/corporate.
2. Lead is created in database without human verification.

[EXPECTED BEHAVIOR]
Automated submissions should be blocked by a silent honeypot field or Cloudflare Turnstile token.

[ACTUAL BEHAVIOR]
Spam submissions pass freely.

[PROPOSED RESOLUTION]
Add a hidden honeypot input field (display: none) that rejects submission if filled by bots, or integrate Cloudflare Turnstile.`
  },
  {
    summary: 'Admin Coupon Creation Modal Allows Negative Discount Values and Zero Limits',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'admin console',
    description: `[SEVERITY & IMPACT]
P2 - Financial Logic Glitch.
Admin interface allows entering a negative discount amount (e.g. -500), which would mathematically INCREASE the customer pass price during checkout instead of discounting it.

[AFFECTED FILES & LINES]
- fitempire-web/src/admin/pages/CouponsPage.tsx

[TECHNICAL ROOT CAUSE]
Form inputs lack min="1" validation attributes and client-side form validation schema (Zod / Yup) checking value > 0.

[STEPS TO REPRODUCE]
1. Open Admin -> Coupons -> "Create Coupon".
2. Type discount value "-100" and submit.
3. Coupon is saved with negative discount value.

[EXPECTED BEHAVIOR]
Form should reject negative or zero values with validation error: "Discount value must be greater than 0."

[ACTUAL BEHAVIOR]
Negative discount values are submitted successfully.

[PROPOSED RESOLUTION]
Add min="1" HTML attribute and validate input > 0 in form submit handler.`
  },
  {
    summary: 'Admin Refund Management Interface Lacks Direct Trigger to Razorpay Refund API',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'admin payments',
    description: `[SEVERITY & IMPACT]
P3 - Operational Efficiency.
When an admin marks a refund request as "APPROVED", they must manually log into the separate Razorpay merchant dashboard to execute the bank refund, risking forgot-to-refund human errors.

[AFFECTED FILES & LINES]
- fitempire-web/src/admin/pages/RefundsPage.tsx
- fitempire-backend/src/main/java/com/fitempire/modules/payments/service/RazorpayService.java

[TECHNICAL ROOT CAUSE]
Approving a refund only updates the local database status to APPROVED without invoking Razorpay payment.refund(amount) via SDK.

[STEPS TO REPRODUCE]
1. Customer requests refund for unused pass.
2. Admin clicks "Approve Refund".
3. Status changes to APPROVED in admin panel, but no money is credited back to customer bank account until admin manually does it on Razorpay.

[EXPECTED BEHAVIOR]
Approving refund should prompt: "Process automated refund via Razorpay? [Yes, Refund ₹1,499]" and trigger Razorpay refund API.

[ACTUAL BEHAVIOR]
Local database update only; actual fund reversal remains manual.

[PROPOSED RESOLUTION]
Implement Razorpay automated refund integration in RefundService.approveRefund().`
  },
  {
    summary: 'Web Landing Page Testimonial Carousel Lacks Touch-Swipe Navigation on Mobile Browsers',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'frontend ui',
    description: `[SEVERITY & IMPACT]
P3 - Mobile Web Usability.
Users browsing FitEmpire on mobile web browsers (Safari / Chrome mobile) cannot swipe left/right across customer reviews, forced to tap tiny 8px navigation dot buttons.

[AFFECTED FILES & LINES]
- fitempire-web/src/components/TestimonialsSection.tsx

[TECHNICAL ROOT CAUSE]
Carousel relies on static CSS state with button clicks, omitting touchstart and touchend touch gesture delta calculations.

[STEPS TO REPRODUCE]
1. Open https://fitempire.tech on mobile phone browser.
2. Scroll to Testimonials section and attempt to swipe left.
3. Carousel does not move; only tiny pagination dots change slides.

[EXPECTED BEHAVIOR]
Smooth touch swipe gesture allowing thumb flicking between testimonial cards.

[ACTUAL BEHAVIOR]
Swiping does nothing.

[PROPOSED RESOLUTION]
Add touch gesture handlers (onTouchStart / onTouchEnd) or integrate Embla Carousel.`
  },
  {
    summary: 'Primary Landing Page Call-to-Action Buttons Lack Analytics Tracking Events',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'frontend analytics',
    description: `[SEVERITY & IMPACT]
P3 - Marketing Attribution & Conversion Analytics.
Growth and marketing teams cannot determine conversion rates because clicks on "Get Pass Now", "Download App", and "Join as Partner" do not fire Google Analytics (GA4) or Mixpanel event tags.

[AFFECTED FILES & LINES]
- fitempire-web/src/components/HeroSection.tsx
- fitempire-web/src/components/PricingSection.tsx

[TECHNICAL ROOT CAUSE]
Button onClick handlers trigger navigation only without dispatching window.gtag('event', 'cta_click', { ... }).

[STEPS TO REPRODUCE]
1. Open web inspector Network tab filtering for collect (Google Analytics).
2. Click "Get Empire Pass Now" in hero section.
3. No analytics beacon is dispatched.

[EXPECTED BEHAVIOR]
Every primary CTA click should fire an analytics event with button label and placement metadata.

[ACTUAL BEHAVIOR]
Zero analytics tracking on primary conversion CTAs.

[PROPOSED RESOLUTION]
Create trackEvent(action, category, label) utility and attach to all conversion buttons.`
  },
  {
    summary: 'Contact Us Form Submits Without Client-Side RFC Email Format Validation',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'frontend forms',
    description: `[SEVERITY & IMPACT]
P2 - Lead Quality & Data Hygiene.
Users entering typos like user@gmail (missing .com) or plain names can submit the contact form, resulting in broken leads that sales teams cannot reply to.

[AFFECTED FILES & LINES]
- fitempire-web/src/components/ContactSection.tsx

[TECHNICAL ROOT CAUSE]
Email input uses type="text" instead of type="email" and lacks standard regex email format validation before form dispatch.

[STEPS TO REPRODUCE]
1. Go to Contact form on landing page.
2. Enter email "rahulsharma@" and click Send Message.
3. Form submits successfully and displays "Thank you for reaching out!".
4. Invalid email stored in database.

[EXPECTED BEHAVIOR]
Form should block submission with validation tooltip: "Please enter a valid email address."

[ACTUAL BEHAVIOR]
Malformed emails accepted without error.

[PROPOSED RESOLUTION]
Enforce type="email" and regex validation /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/ before submission.`
  },
  {
    summary: 'Admin Financial Report Export Lacks CSV / Excel Download for Accounting Team',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'admin reports',
    description: `[SEVERITY & IMPACT]
P3 - Operational Efficiency.
Finance and tax accountants must manually copy-paste daily transaction rows into spreadsheets because the admin payments overview does not provide an "Export to Excel / CSV" button.

[AFFECTED FILES & LINES]
- fitempire-web/src/admin/pages/PaymentsPage.tsx

[TECHNICAL ROOT CAUSE]
Table component lacks export utility parsing payments array into CSV Blob for download.

[STEPS TO REPRODUCE]
1. Open Admin -> Payments & Transactions.
2. View 1,200 transactions.
3. No button exists to download data as spreadsheet.

[EXPECTED BEHAVIOR]
"Export CSV" button generating a spreadsheet containing Transaction ID, User, Amount, Razorpay Fee, GST, and Date.

[ACTUAL BEHAVIOR]
No export button available.

[PROPOSED RESOLUTION]
Add ExportPaymentsButton converting table records to formatted CSV.`
  },

  // =========================================================================
  // DEVOPS, DOCKER & CLOUD INFRASTRUCTURE (10 Issues: FE-231 to FE-240)
  // =========================================================================
  {
    summary: 'Production Dockerfile Runs Backend Container Process as Root User Instead of Dedicated Non-Root User',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'devops docker',
    description: `[SEVERITY & IMPACT]
P3 - Container Security Hardening (CIS Benchmark).
Running Java containers as root (UID 0) increases the blast radius of remote code execution vulnerabilities, allowing attackers to potentially break out of container boundaries to host OS.

[AFFECTED FILES & LINES]
- fitempire-backend/Dockerfile

[TECHNICAL ROOT CAUSE]
The Dockerfile uses FROM eclipse-temurin:21-jre without defining a dedicated system group and user (USER appuser).

[STEPS TO REPRODUCE]
1. Build and run backend Docker image: docker run fitempire-backend.
2. Run docker exec -it <container_id> whoami.
3. Output returns root.

[EXPECTED BEHAVIOR]
Container should execute under an unprivileged user (USER appuser / UID 10001).

[ACTUAL BEHAVIOR]
Process runs as root superuser.

[PROPOSED RESOLUTION]
Add user creation in Dockerfile: RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser; USER appuser.`
  },
  {
    summary: 'Docker Compose File Lacks Healthcheck Definitions for PostgreSQL and Redis Services',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'devops docker',
    description: `[SEVERITY & IMPACT]
P2 - Startup Race Condition & Container Boot Failures.
When running docker-compose up, the backend container starts simultaneously with PostgreSQL. Since Postgres takes 5-10 seconds to initialize, backend crashes with Connection refused before database is ready.

[AFFECTED FILES & LINES]
- docker-compose.yml (Lines 20-45)

[TECHNICAL ROOT CAUSE]
depends_on: [postgres, redis] only waits for container creation, not readiness, because postgres service lacks a healthcheck block (pg_isready -U postgres).

[STEPS TO REPRODUCE]
1. Run docker-compose down -v followed by docker-compose up.
2. Backend container boots instantly and throws org.postgresql.util.PSQLException: Connection to localhost:5432 refused.
3. Backend exits with code 1.

[EXPECTED BEHAVIOR]
Backend service should wait until PostgreSQL passes healthcheck: condition: service_healthy.

[ACTUAL BEHAVIOR]
Backend crashes on cold container startup due to race condition.

[PROPOSED RESOLUTION]
Add healthcheck test: ["CMD-SHELL", "pg_isready -U postgres"] to postgres service and update backend to depends_on: condition: service_healthy.`
  },
  {
    summary: 'Automated Daily PostgreSQL Database Backup Cron Script Missing for Production Recovery',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'devops backup',
    description: `[SEVERITY & IMPACT]
P3 - Disaster Recovery & Business Continuity.
In the event of accidental table drops, ransomware, or cloud provider region outage, the system lacks an automated daily cron dumping and uploading encrypted pg_dump archives to an isolated S3 bucket.

[AFFECTED FILES & LINES]
- scripts/aws/
- docker-compose.yml

[TECHNICAL ROOT CAUSE]
No automated backup script or cron job exists in repository automation scripts.

[STEPS TO REPRODUCE]
1. Inspect scripts/ directory.
2. Deployment scripts exist, but zero database backup, snapshot, or restore scripts are present.

[EXPECTED BEHAVIOR]
Automated nightly backup script dumping database (pg_dump -Fc), compressing, and pushing to AWS S3 with 30-day retention policy.

[ACTUAL BEHAVIOR]
No backup automation present.

[PROPOSED RESOLUTION]
Create scripts/backup-database.sh running nightly via crontab and uploading to private S3 bucket.`
  },
  {
    summary: 'GitHub Actions CI Pipeline Does Not Cache Maven and Node Dependencies Slowing Build Times',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'devops ci',
    description: `[SEVERITY & IMPACT]
P3 - CI/CD Velocity & GitHub Actions Minutes.
Every push to main re-downloads 400MB of Maven JARs and 500MB of npm node_modules from scratch, making pull request validation take 12+ minutes instead of 2 minutes.

[AFFECTED FILES & LINES]
- .github/workflows/ci.yml

[TECHNICAL ROOT CAUSE]
The actions/setup-java and actions/setup-node steps do not configure cache: 'maven' and cache: 'npm'.

[STEPS TO REPRODUCE]
1. Push a one-line README commit to GitHub.
2. Inspect GitHub Actions build log.
3. Maven downloads every dependency from Maven Central from scratch.

[EXPECTED BEHAVIOR]
Dependencies should be cached using actions/cache, reducing build time to under 3 minutes.

[ACTUAL BEHAVIOR]
Redundant downloads on every CI run.

[PROPOSED RESOLUTION]
Add cache: 'maven' to actions/setup-java and cache: 'npm' to actions/setup-node.`
  },
  {
    summary: 'Nginx Reverse Proxy Configuration Lacks Gzip and Brotli Compression for Static Web Bundles',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'devops nginx',
    description: `[SEVERITY & IMPACT]
P3 - Web Performance & Lighthouse Score.
Deploying the Vite web bundles without gzip compression serves raw 1.8MB JavaScript files over the wire, causing poor Google Lighthouse scores on mobile 4G networks.

[AFFECTED FILES & LINES]
- scripts/aws/deploy-frontends-ec2.sh
- nginx.conf

[TECHNICAL ROOT CAUSE]
Nginx configuration block lacks gzip on; and gzip_types application/javascript text/css application/json; directives.

[STEPS TO REPRODUCE]
1. Inspect response headers for /assets/index-*.js on production site.
2. Content-Encoding: gzip header is missing; full uncompressed payload transferred.

[EXPECTED BEHAVIOR]
Nginx should compress JavaScript and CSS assets, shrinking payload size by ~70% (1.8MB -> 420KB).

[ACTUAL BEHAVIOR]
Uncompressed static bundles served.

[PROPOSED RESOLUTION]
Enable gzip compression and gzip_comp_level 6 in Nginx server block.`
  },
  {
    summary: 'Production Docker Image Includes Development Build Tools and Maven Artifacts',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'devops docker',
    description: `[SEVERITY & IMPACT]
P3 - Docker Image Size & Security Surface.
Single-stage Docker builds leave the Maven compiler, source code, and local repository inside the production container image, inflating image size from 220MB to 1.2GB.

[AFFECTED FILES & LINES]
- fitempire-backend/Dockerfile

[TECHNICAL ROOT CAUSE]
Dockerfile does not implement a multi-stage build separating builder (maven:3.9-eclipse-temurin) from runtime (eclipse-temurin:21-jre-alpine).

[STEPS TO REPRODUCE]
1. Build backend Docker image.
2. Inspect image size: docker images fitempire-backend -> 1.25 GB.

[EXPECTED BEHAVIOR]
Lean multi-stage Docker image containing only the compiled JAR and minimal JRE runtime (< 250MB).

[ACTUAL BEHAVIOR]
Bloated 1.2GB image containing full build tooling.

[PROPOSED RESOLUTION]
Implement multi-stage Dockerfile: STAGE 1 (Build with Maven) -> STAGE 2 (Copy JAR to slim JRE image).`
  },
  {
    summary: 'Docker Daemon and Compose Lack Container Log Rotation Policy Risking Host Disk Exhaustion',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'devops docker',
    description: `[SEVERITY & IMPACT]
P3 - Host Stability & Uptime.
Docker default logging driver stores JSON logs indefinitely with no size limit. Over months of operation, backend logs grow to 50GB+, filling the host EC2 disk and crashing all services.

[AFFECTED FILES & LINES]
- docker-compose.yml

[TECHNICAL ROOT CAUSE]
Services do not define logging: { driver: 'json-file', options: { 'max-size': '50m', 'max-file': '5' } }.

[STEPS TO REPRODUCE]
1. Check container log files in /var/lib/docker/containers/*/*.log on production host.
2. Log files grow continuously with no rotation or truncation.

[EXPECTED BEHAVIOR]
Container logs should rotate at 50MB with maximum 5 files retained per container.

[ACTUAL BEHAVIOR]
Logs grow indefinitely until server disk space is exhausted.

[PROPOSED RESOLUTION]
Configure logging options with max-size: "50m" and max-file: "5" in docker-compose.yml.`
  },
  {
    summary: 'Nginx Reverse Proxy Lacks HTTP Strict Transport Security (HSTS) Header in Production SSL Block',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'devops security',
    description: `[SEVERITY & IMPACT]
P3 - SSL Stripping & Man-in-the-Middle Protection.
Without HSTS headers, a user typing fitempire.tech on public Wi-Fi is vulnerable to SSL-stripping attacks downgrading their initial connection to unencrypted HTTP before redirecting.

[AFFECTED FILES & LINES]
- scripts/aws/deploy-frontends-ec2.sh
- nginx.conf

[TECHNICAL ROOT CAUSE]
Nginx SSL server block omits add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;.

[STEPS TO REPRODUCE]
1. Send curl -I https://fitempire.tech.
2. Response headers lack Strict-Transport-Security.

[EXPECTED BEHAVIOR]
Browser should enforce HTTPS strictly via HSTS header with 1-year duration.

[ACTUAL BEHAVIOR]
HSTS header is absent.

[PROPOSED RESOLUTION]
Add add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always; to Nginx configuration.`
  },
  {
    summary: 'Missing Automated Smoke Test Post-Deployment Validation Script for Production Releases',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'devops automation',
    description: `[SEVERITY & IMPACT]
P3 - Release Quality & Deployment Safety.
After deployment scripts finish, engineering must manually click through 10 endpoints to verify that the database connection, Redis cache, and public APIs are operational.

[AFFECTED FILES & LINES]
- scripts/aws/deploy-frontends-ec2.sh
- scripts/smoke-test.sh

[TECHNICAL ROOT CAUSE]
No automated post-deployment health check script testing key HTTP status codes (health, auth, gyms list, partner login) exists.

[STEPS TO REPRODUCE]
1. Deploy new backend code.
2. Deployment completes without automated endpoint verification.
3. If database configuration was wrong, users discover the crash first.

[EXPECTED BEHAVIOR]
Deployment pipeline automatically runs a 10-second curl smoke test suite against /actuator/health, /api/v1/gyms, and /api/v1/plans.

[ACTUAL BEHAVIOR]
Manual verification required.

[PROPOSED RESOLUTION]
Create scripts/smoke-test.sh that validates HTTP 200 on core endpoints and aborts deployment on failure.`
  },
  {
    summary: 'Missing Content Security Policy (CSP) Headers in Production Web Frontend',
    issueType: 'Improvement',
    priority: 'Low',
    labels: 'devops security',
    description: `[SEVERITY & IMPACT]
P3 - Cross-Site Scripting (XSS) Mitigation.
Without a Content Security Policy header, any third-party script or compromised npm package can inject arbitrary scripts and exfiltrate user JWT tokens to external domains.

[AFFECTED FILES & LINES]
- fitempire-web/index.html
- nginx.conf

[TECHNICAL ROOT CAUSE]
HTML and Nginx do not configure Content-Security-Policy restricting script-src, style-src, and connect-src to trusted endpoints (Razorpay, Unsplash, Google Fonts).

[STEPS TO REPRODUCE]
1. Inspect response headers of web landing page.
2. Content-Security-Policy header is missing.

[EXPECTED BEHAVIOR]
Strict CSP header restricting script execution to self, Razorpay checkout, and whitelisted CDN domains.

[ACTUAL BEHAVIOR]
No CSP policy enforced.

[PROPOSED RESOLUTION]
Add Content-Security-Policy header in Nginx server block with whitelisted script-src and connect-src domains.`
  }
];

function escapeCsvField(field) {
  if (field === null || field === undefined) return '""';
  const str = String(field);
  return '"' + str.replace(/"/g, '""') + '"';
}

const headers = ['Summary', 'Issue Type', 'Priority', 'Labels', 'Description'];
const rows = [headers.map(escapeCsvField).join(',')];

for (const item of batch3Issues) {
  const row = [
    escapeCsvField(item.summary),
    escapeCsvField(item.issueType),
    escapeCsvField(item.priority),
    escapeCsvField(item.labels),
    escapeCsvField(item.description)
  ];
  rows.push(row.join(','));
}

const csvContent = rows.join('\n');

// 1. Output standalone Batch 3 (100 issues) CSV
const batch3Path = path.resolve(__dirname, '..', 'jira_issues_batch3_100.csv');
fs.writeFileSync(batch3Path, csvContent, 'utf8');
console.log(`✅ Successfully generated Batch 3 Jira CSV at: ${batch3Path}`);
console.log(`   Total issues in batch 3: ${batch3Issues.length}`);

// 2. Output Master Combined CSV (Batch 1 [20] + Batch 2 [20] + Batch 3 [100] = 140 issues)
const batch1Path = path.resolve(__dirname, '..', 'jira_issues_fitempire.csv');
const batch2Path = path.resolve(__dirname, '..', 'jira_issues_batch2.csv');

if (fs.existsSync(batch1Path) && fs.existsSync(batch2Path)) {
  const b1Lines = fs.readFileSync(batch1Path, 'utf8').trim().split('\n');
  const b2Lines = fs.readFileSync(batch2Path, 'utf8').trim().split('\n');
  const b3DataLines = rows.slice(1).join('\n');

  // b1 includes header, b2 drop header, b3 drop header
  const b2DataLines = b2Lines.slice(1).join('\n');
  const masterContent = b1Lines.join('\n') + '\n' + b2DataLines + '\n' + b3DataLines;
  
  const masterPath = path.resolve(__dirname, '..', 'jira_issues_master_140.csv');
  fs.writeFileSync(masterPath, masterContent, 'utf8');
  console.log(`✅ Successfully generated Master Combined 140-issue CSV at: ${masterPath}`);
}
