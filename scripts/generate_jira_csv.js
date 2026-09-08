const fs = require('fs');
const path = require('path');

const issues = [
  {
    summary: 'Plaintext Production Neon Database Credentials Exposed in Source Control',
    issueType: 'Bug',
    priority: 'Highest',
    labels: 'security production credentials database p0-blocker',
    component: 'Infrastructure & Security',
    environment: 'Production / Spring Boot 3.2.5 / Neon PostgreSQL Cloud',
    affectedFiles: 'fitempire-backend/src/main/resources/application.yml (Lines 40-42)',
    description: `[SEVERITY & IMPACT]
P0 - Critical Security Breach. Full database compromise risk.
Anyone with read access to the GitHub repository can directly connect to the production Neon PostgreSQL database, query customer PII (passwords, phone numbers, emails), modify wallet balances, or drop tables.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/resources/application.yml (Lines 40-42)

[TECHNICAL ROOT CAUSE]
The application configuration file contains default fallback credentials pointing to the live production database host:
datasource:
  url: \${SPRING_DATASOURCE_URL:jdbc:postgresql://ep-lingering-sky-atwtj0vn-pooler.c-9.us-east-1.aws.neon.tech:5432/neondb?sslmode=require}
  username: \${SPRING_DATASOURCE_USERNAME:neondb_owner}
  password: \${SPRING_DATASOURCE_PASSWORD:npg_BsZ4re0zCHiS}

[STEPS TO REPRODUCE]
1. Clone the FitEmpire repository.
2. Open fitempire-backend/src/main/resources/application.yml.
3. Copy the JDBC URL, username (neondb_owner), and password (npg_BsZ4re0zCHiS).
4. Run 'psql "postgresql://neondb_owner:npg_BsZ4re0zCHiS@ep-lingering-sky-atwtj0vn-pooler.c-9.us-east-1.aws.neon.tech:5432/neondb?sslmode=require"'.
5. Database prompt opens with full superuser/owner privileges.

[EXPECTED BEHAVIOR]
Source code must never contain production credentials or fallback passwords. Secrets must be injected exclusively via runtime environment variables or AWS Secrets Manager.

[ACTUAL BEHAVIOR]
Production database credentials are committed in plaintext in git history.

[PROPOSED RESOLUTION]
1. Immediately rotate the password for 'neondb_owner' in the Neon Cloud Console.
2. Update application.yml to require runtime environment variables without plaintext fallbacks:
   datasource:
     url: \${SPRING_DATASOURCE_URL}
     username: \${SPRING_DATASOURCE_USERNAME}
     password: \${SPRING_DATASOURCE_PASSWORD}
3. Add a git pre-commit hook / git-secrets scan to prevent future credential commits.`
  },
  {
    summary: 'Unauthenticated Universal Password Reset Vulnerability (Account Takeover)',
    issueType: 'Bug',
    priority: 'Highest',
    labels: 'security auth account-takeover spring-security p0-blocker',
    component: 'Admin & Authentication',
    environment: 'Production API / Spring Boot 3.2.5',
    affectedFiles: 'SecurityConfig.java (Line 85), AdminController.java (Lines 235-247), AdminService.java (Lines 523-532)',
    description: `[SEVERITY & IMPACT]
P0 - Critical Account Takeover.
Any anonymous actor on the internet can hijack any customer or administrator account without providing the current password, email OTP, or authentication token.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/security/config/SecurityConfig.java (Line 85)
- fitempire-backend/src/main/java/com/fitempire/modules/admin/AdminController.java (Lines 235-247)
- fitempire-backend/src/main/java/com/fitempire/modules/admin/AdminService.java (Lines 523-532)

[TECHNICAL ROOT CAUSE]
The endpoint POST /v1/admin/users/reset-password-by-email was marked with permitAll() in SecurityConfig and @PreAuthorize("permitAll()") in AdminController. It accepts a raw JSON body with 'email' and 'newPassword' and resets the database password hash immediately.

[STEPS TO REPRODUCE]
1. Target an admin or user email: 'admin@fitempire.com'.
2. Execute:
   curl -X POST "https://ayush150152-fitempire-api.hf.space/api/v1/admin/users/reset-password-by-email" \\
     -H "Content-Type: application/json" \\
     -d '{"email":"admin@fitempire.com","newPassword":"AttackerPassword@123"}'
3. Server returns HTTP 200: "Password reset to AttackerPassword@123 for admin@fitempire.com".
4. Attacker logs into the admin dashboard using the new password.

[EXPECTED BEHAVIOR]
Password resets must require either a cryptographically secure 6-digit OTP sent to the registered email or an active authenticated session with admin credentials.

[ACTUAL BEHAVIOR]
Anyone can overwrite any account password via a single unauthenticated API call.

[PROPOSED RESOLUTION]
1. Remove /v1/admin/users/reset-password-by-email from permitAll() in SecurityConfig.
2. Route all password resets through the OTP-verified flow in AuthController (POST /v1/auth/reset-password).`
  },
  {
    summary: 'Unverified Wallet Top-Up Endpoint Allows Free Arbitrary Balance Crediting',
    issueType: 'Bug',
    priority: 'Highest',
    labels: 'exploit wallet billing razorpay payments p0-blocker',
    component: 'Wallet & Payments Module',
    environment: 'Production API / Spring Boot 3.2.5',
    affectedFiles: 'WalletController.java (Lines 45-60), WalletService.java (Lines 71-105)',
    description: `[SEVERITY & IMPACT]
P0 - Direct Financial Loss / Free Money Exploit.
Authenticated users can add unlimited funds (e.g. ₹10,00,000) to their FitEmpire wallet without paying real money, then use these credits to purchase memberships and merchandise.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/users/controller/WalletController.java (Lines 45-60)
- fitempire-backend/src/main/java/com/fitempire/modules/users/service/WalletService.java (Lines 71-105)

[TECHNICAL ROOT CAUSE]
POST /api/v1/wallets/me/top-up directly calls walletService.creditWallet(userId, request.getAmount(), ...) without checking Razorpay payment gateway verification, payment status, or cryptographic signature.

[STEPS TO REPRODUCE]
1. Log into FitEmpire mobile app or web app.
2. Send HTTP POST to /api/v1/wallets/me/top-up with header Authorization: Bearer <TOKEN> and JSON payload:
   {"amount": 50000, "paymentMethod": "UPI"}
3. Receive HTTP 200: "Wallet recharged successfully".
4. GET /api/v1/wallets/me shows available balance increased by ₹50,000.

[EXPECTED BEHAVIOR]
Wallet top-ups must verify Razorpay payment signatures (razorpay_order_id, razorpay_payment_id, razorpay_signature) on the server before crediting the ledger.

[ACTUAL BEHAVIOR]
Wallet is credited immediately based entirely on untrusted client request input.

[PROPOSED RESOLUTION]
1. Convert top-up flow into a two-step process:
   - Step 1: POST /api/v1/payments/create-order (creates Razorpay order).
   - Step 2: POST /api/v1/payments/verify (validates HMAC SHA256 signature and credits wallet in a transactional block).
2. Delete the unverified /me/top-up endpoint or restrict it strictly to INTERNAL batch jobs.`
  },
  {
    summary: 'Double-Spending Race Condition in Wallet Debit Engine',
    issueType: 'Bug',
    priority: 'Highest',
    labels: 'concurrency race-condition wallet payments database p0-blocker',
    component: 'Wallet & Payments Module',
    environment: 'Production API / PostgreSQL / Spring Boot 3.2.5',
    affectedFiles: 'WalletService.java (Lines 108-144), WalletRepository.java',
    description: `[SEVERITY & IMPACT]
P0 - Concurrency Vulnerability.
Users can exploit network race conditions (e.g. rapid double-clicking checkout) to spend more wallet balance than they possess.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/users/service/WalletService.java (Lines 108-144)

[TECHNICAL ROOT CAUSE]
In WalletService.debitWallet(), the wallet entity is retrieved with simple findByUserId() without database-level locking. Under concurrent threads, both transactions read the initial balance before either commits, passing the balance check and saving overwritten values.

[STEPS TO REPRODUCE]
1. User wallet balance is ₹500.
2. User fires two simultaneous checkout requests for ₹400 each (Total ₹800).
3. Thread A reads 500 >= 400 (True).
4. Thread B reads 500 >= 400 (True).
5. Thread A subtracts 400 -> balance becomes 100.
6. Thread B subtracts 400 -> balance becomes 100.
7. User receives ₹800 worth of services while spending only ₹400.

[EXPECTED BEHAVIOR]
Database must enforce row-level locking (SELECT FOR UPDATE) or optimistic locking (@Version). The second concurrent transaction must fail with INSUFFICIENT_FUNDS.

[ACTUAL BEHAVIOR]
Lost update anomaly allows spending more credits than available.

[PROPOSED RESOLUTION]
1. Add pessimistic write lock to WalletRepository:
   @Lock(LockModeType.PESSIMISTIC_WRITE)
   @Query("SELECT w FROM Wallet w WHERE w.user.id = :userId")
   Optional<Wallet> findByUserIdForUpdate(@Param("userId") UUID userId);
2. Use findByUserIdForUpdate in debitWallet().
3. Add an @Version column to the Wallet entity.`
  },
  {
    summary: 'Unrestricted Public Media Upload Allows Stored XSS & Arbitrary File Storage',
    issueType: 'Bug',
    priority: 'Highest',
    labels: 'security upload xss file-storage public-api p0-blocker',
    component: 'Media & Storage Service',
    environment: 'Production API / Spring Boot 3.2.5',
    affectedFiles: 'SecurityConfig.java (Lines 86-87), FileUploadController.java (Lines 107-140)',
    description: `[SEVERITY & IMPACT]
P0 - Stored Cross-Site Scripting (XSS) & Arbitrary File Upload.
Unauthenticated users can upload arbitrary HTML, SVG, script, or executable files that are permanently stored and served publicly from the server domain.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/security/config/SecurityConfig.java (Lines 86-87)
- fitempire-backend/src/main/java/com/fitempire/controller/FileUploadController.java (Lines 107-140)

[TECHNICAL ROOT CAUSE]
1. POST /v1/media/upload is permitted for all anonymous requests.
2. The controller does not check file MIME types, content signatures (magic bytes), or extensions.
3. Original file extensions (.html, .svg, .exe) are preserved and served under /uploads/** with permitAll().

[STEPS TO REPRODUCE]
1. Create a file 'payload.html' containing: <script>alert(document.cookie)</script>.
2. Run:
   curl -X POST -F "file=@payload.html" "https://ayush150152-fitempire-api.hf.space/api/v1/media/upload"
3. Receive URL: https://ayush150152-fitempire-api.hf.space/uploads/uploads/UUID.html.
4. Open the link in a web browser; the JavaScript executes under the API domain context.

[EXPECTED BEHAVIOR]
Media upload must require authentication, enforce a strict MIME whitelist (image/jpeg, image/png, image/webp), limit file sizes to 5MB, and serve user uploads with Content-Disposition: attachment.

[ACTUAL BEHAVIOR]
Unauthenticated arbitrary file upload with direct browser execution.

[PROPOSED RESOLUTION]
1. Require Authentication for /v1/media/upload.
2. Validate content type using Apache Tika or explicit whitelist.
3. Add response header 'X-Content-Type-Options: nosniff' and serve user uploads from a dedicated CDN sandbox.`
  },
  {
    summary: 'Scanner Auto-Grants Entry on API Failure via Fallback Handler',
    issueType: 'Bug',
    priority: 'Highest',
    labels: 'security access-control partner scanner bypass p0-blocker',
    component: 'Partner Web Portal - QR Scanner',
    environment: 'Partner Portal / React Vite / Production',
    affectedFiles: 'fitempire-partner/src/pages/ScannerPage.tsx (Lines 69-95)',
    description: `[SEVERITY & IMPACT]
P0 - Complete Physical Access Control Bypass.
Any person presenting a fake, expired, or non-existent QR pass is automatically granted turnstile entry whenever the backend returns an error or network drops.

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/ScannerPage.tsx (Lines 69-95)

[TECHNICAL ROOT CAUSE]
Inside handleVerify(), the catch (err) block catches API rejections and auto-injects a mock active member object with verifiedSuccess = true:
catch (err: any) {
  const fallbackData = {
    memberName: 'Rahul Sharma',
    passTier: 'FitEmpire All-Access Gold',
    status: 'CHECKED_IN',
  };
  setScanResult(fallbackData);
  setVerifiedSuccess(true);
}

[STEPS TO REPRODUCE]
1. Open the partner portal at https://fitempirepartner.vercel.app/scanner.
2. Enter an invalid code: 'INVALID-EXPIRED-CODE-0000'.
3. Click 'Verify Pass'.
4. Scanner catch block triggers, showing a green checkmark: 'VERIFIED ACTIVE PASS - ACCESS GRANTED' for Rahul Sharma.

[EXPECTED BEHAVIOR]
If the API returns an error or the pass is invalid, the scanner must display a red 'ACCESS DENIED' banner and refuse entry.

[ACTUAL BEHAVIOR]
API failure triggers automatic access approval with mock data.

[PROPOSED RESOLUTION]
1. Replace catch block with:
   catch (err: any) {
     setScanResult(null);
     setVerifiedSuccess(false);
     setError(err.response?.data?.message || 'Verification failed. Pass is invalid or expired.');
   }`
  },
  {
    summary: 'QR Verification Auto-Creates Fake Attendance on Random User for Invalid Codes',
    issueType: 'Bug',
    priority: 'High',
    labels: 'data-integrity checkin bookings backend audit p1-high',
    component: 'Check-In Service',
    environment: 'Production API / Spring Boot 3.2.5',
    affectedFiles: 'fitempire-backend/src/main/java/com/fitempire/modules/bookings/service/BookingService.java (Lines 139-170)',
    description: `[SEVERITY & IMPACT]
P1 - Data Corruption & False Billing.
Scanning an unrecognized QR token causes the backend to create a real attendance record against 'testuser@fitempire.in' or any active user in the database with status CHECKED_IN and ₹299 amount.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/bookings/service/BookingService.java (Lines 139-170)

[TECHNICAL ROOT CAUSE]
In verifyAndCheckIn(), if bookingRepository.findByQrToken(cleanToken) returns empty, fallback logic queries the database for 'testuser@fitempire.in' or the first active user, creates a new Booking object, and saves it as checked in.

[STEPS TO REPRODUCE]
1. Send POST /api/v1/bookings/verify-qr with {"token": "COMPLETELY_RANDOM_GARBAGE"}.
2. Server responds HTTP 200 with status: CHECKED_IN.
3. Query database table 'bookings': a new checked-in record is created.

[EXPECTED BEHAVIOR]
If token does not match any valid booking, the API must return HTTP 404 / 400 with message "Invalid or expired QR token".

[ACTUAL BEHAVIOR]
Phantom bookings are generated and saved against random database users.

[PROPOSED RESOLUTION]
Remove the fallback user creation block and throw:
throw new BusinessException("QR Pass not found or expired", "INVALID_PASS", HttpStatus.NOT_FOUND);`
  },
  {
    summary: 'Missing Slot Capacity & Double-Booking Validations in Booking Service',
    issueType: 'Bug',
    priority: 'High',
    labels: 'business-logic bookings capacity gym-management p1-high',
    component: 'Bookings Module',
    environment: 'Production API / Spring Boot 3.2.5',
    affectedFiles: 'fitempire-backend/src/main/java/com/fitempire/modules/bookings/service/BookingService.java (Lines 46-78)',
    description: `[SEVERITY & IMPACT]
P1 - Overbooking & Physical Capacity Violation.
Users can book an unlimited number of slots at the same gym and time, exceeding gym capacity. Single users can also create overlapping bookings in multiple cities simultaneously.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/bookings/service/BookingService.java (Lines 46-78)

[TECHNICAL ROOT CAUSE]
createBooking() does not query existing bookings for the specified branch and slot, nor does it check if the user already has a conflicting reservation.

[STEPS TO REPRODUCE]
1. Create a script sending 50 concurrent booking requests for the same branch and time slot.
2. All 50 return HTTP 200 CONFIRMED even if gym capacity is 20.
3. User can also book 8:00 AM slots in Delhi and Bangalore on the same day.

[EXPECTED BEHAVIOR]
1. If existing active bookings >= branch.maxCapacity, reject with "Slot is fully booked".
2. If user already has an active booking for that date/time window, reject with "Conflicting booking exists".

[ACTUAL BEHAVIOR]
Infinite bookings are accepted without capacity or conflict checks.

[PROPOSED RESOLUTION]
Add capacity verification in BookingService:
long count = bookingRepository.countByBranchIdAndBookingDateAndStartTimeAndStatusNot(branchId, date, time, BookingStatus.CANCELLED);
if (count >= branch.getMaxCapacity()) {
    throw new BusinessException("Slot is fully booked", "SLOT_FULL", HttpStatus.BAD_REQUEST);
}`
  },
  {
    summary: 'Zero-Cost Bookings Allowed Without Active Membership Verification',
    issueType: 'Bug',
    priority: 'High',
    labels: 'revenue-leakage bookings membership paywall p1-high',
    component: 'Bookings Module',
    environment: 'Production API / Spring Boot 3.2.5',
    affectedFiles: 'fitempire-backend/src/main/java/com/fitempire/modules/bookings/service/BookingService.java (Lines 56-75)',
    description: `[SEVERITY & IMPACT]
P1 - Revenue Leakage.
Any registered user with a free account can book workouts and gym access indefinitely without buying a membership pass.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/modules/bookings/service/BookingService.java (Lines 56-75)

[TECHNICAL ROOT CAUSE]
createBooking() sets booking.setAmountPaid(BigDecimal.ZERO) and status CONFIRMED without checking if the user has an active membership pass or sufficient wallet credits.

[STEPS TO REPRODUCE]
1. Register a new user. Do not purchase any pass.
2. Call POST /api/v1/bookings with valid gymId and branchId.
3. Booking succeeds with status CONFIRMED and generates a turnstile QR code.

[EXPECTED BEHAVIOR]
Booking must verify user has an active membership covering the target bookingDate, or deduct 1 session credit. If neither exists, respond HTTP 402 Payment Required.

[ACTUAL BEHAVIOR]
Unmetered access granted to unpaying users.

[PROPOSED RESOLUTION]
Inject UserMembershipRepository and validate:
boolean hasActivePass = userMembershipRepository.existsActivePassForUserOnDate(userId, request.getBookingDate());
if (!hasActivePass) {
    throw new BusinessException("Active membership required to book sessions", "NO_ACTIVE_MEMBERSHIP", HttpStatus.PAYMENT_REQUIRED);
}`
  },
  {
    summary: 'Insecure CORS Configuration: Wildcard Origin Allowed with Credentials',
    issueType: 'Bug',
    priority: 'High',
    labels: 'security cors headers browser-security p1-high',
    component: 'Security & Web Config',
    environment: 'Production API / Spring Boot 3.2.5',
    affectedFiles: 'fitempire-backend/src/main/java/com/fitempire/security/config/SecurityConfig.java (Lines 174-178)',
    description: `[SEVERITY & IMPACT]
P1 - Cross-Origin Security Misconfiguration.
Wildcard origins combined with allowed credentials permit untrusted third-party websites to make authenticated AJAX requests and inspect sensitive response data.

[AFFECTED FILES & LINES]
- fitempire-backend/src/main/java/com/fitempire/security/config/SecurityConfig.java (Lines 174-178)

[TECHNICAL ROOT CAUSE]
In corsConfigurationSource():
config.setAllowedOriginPatterns(Arrays.asList("*"));
config.setAllowCredentials(true);
This overrides the specific allowedOrigins list with a permissive wildcard.

[STEPS TO REPRODUCE]
1. Send curl preflight request:
   curl -X OPTIONS "https://ayush150152-fitempire-api.hf.space/api/v1/users/profile/me" \\
     -H "Origin: https://attacker-website.com" \\
     -H "Access-Control-Request-Method: GET"
2. Response headers reflect:
   Access-Control-Allow-Origin: https://attacker-website.com
   Access-Control-Allow-Credentials: true

[EXPECTED BEHAVIOR]
Only authorized production domains (fitempire.tech, fitempiremobile.vercel.app, fitempirepartner.vercel.app) should be reflected in Access-Control-Allow-Origin.

[ACTUAL BEHAVIOR]
Any origin is permitted with credentials.

[PROPOSED RESOLUTION]
Remove setAllowedOriginPatterns(Arrays.asList("*")) and set allowed origins to explicit trusted URLs only.`
  },
  {
    summary: 'Offline Network Catch Injects Invalid Demo Tokens Causing Auth Loops',
    issueType: 'Bug',
    priority: 'High',
    labels: 'auth mobile offline asyncstorage react-native p1-high',
    component: 'Mobile App - AuthContext',
    environment: 'Mobile App / React Native Expo / Android & iOS',
    affectedFiles: 'fitempire-mobile/src/services/auth-context.tsx (Lines 107-122)',
    description: `[SEVERITY & IMPACT]
P1 - App Usability & Authentication Lockout.
When user logs in during spotty network connectivity, the mobile app writes a dummy demo token into AsyncStorage. Once connection resumes, every subsequent API call is rejected with HTTP 401.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/services/auth-context.tsx (Lines 107-122)

[TECHNICAL ROOT CAUSE]
Inside login(), if apiErr has no response (offline/timeout), fallback code stores:
await AsyncStorage.setItem('fitempire_access_token', 'demo_member_jwt_token');
setUser(demoUser);
setIsAuthenticated(true);

[STEPS TO REPRODUCE]
1. Open mobile app in airplane mode or unstable network.
2. Attempt login.
3. App transitions to Home screen using dummy token.
4. Disable airplane mode.
5. All subsequent requests fail with 401 Unauthorized because 'demo_member_jwt_token' is rejected by the backend.

[EXPECTED BEHAVIOR]
Offline login attempts should display an error alert: "No internet connection. Please try again." without mutating AsyncStorage.

[ACTUAL BEHAVIOR]
App falsely reports successful login with invalid tokens.

[PROPOSED RESOLUTION]
Remove dummy token fallback in catch blocks and throw an explicit NetworkError.`
  },
  {
    summary: 'Axios 401 Response Interceptor Lacks Mutex Locking During Token Refresh',
    issueType: 'Bug',
    priority: 'High',
    labels: 'networking mobile axios interceptor refresh-token p1-high',
    component: 'Mobile App - API Client',
    environment: 'Mobile App / React Native Expo',
    affectedFiles: 'fitempire-mobile/src/services/api.ts (Lines 33-60)',
    description: `[SEVERITY & IMPACT]
P1 - Random User Logout.
When access token expires, multiple parallel queries fire /auth/refresh simultaneously. Because refresh tokens are single-use, subsequent calls fail, wiping AsyncStorage and logging the user out.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/services/api.ts (Lines 33-60)

[TECHNICAL ROOT CAUSE]
apiClient.interceptors.response lacks an isRefreshing mutex lock or request queue. Concurrent 401s each trigger independent refresh requests.

[STEPS TO REPRODUCE]
1. Set access token expiration to 1 minute.
2. Wait for token to expire.
3. Open the app; Home screen executes getProfile(), getMyActiveMemberships(), and getWallet() in parallel.
4. Three concurrent refresh calls fire. Two fail with "Invalid Refresh Token".
5. App calls logOut() and redirects user to login screen.

[EXPECTED BEHAVIOR]
Only one refresh request should fire. Other requests should wait in a queue and replay with the newly acquired access token.

[ACTUAL BEHAVIOR]
Multiple refresh calls race, causing session destruction.

[PROPOSED RESOLUTION]
Implement an isRefreshing flag and failedQueue subscriber pattern in the Axios interceptor.`
  },
  {
    summary: 'Timezone Shift Bug in Date Formatting Leads to Off-By-One Day Bookings',
    issueType: 'Bug',
    priority: 'High',
    labels: 'timezone dates mobile booking ist expo p1-high',
    component: 'Mobile App - Booking Flow',
    environment: 'Mobile App / React Native Expo / India IST (UTC+5:30)',
    affectedFiles: 'fitempire-mobile/src/app/booking.tsx (Lines 81, 100)',
    description: `[SEVERITY & IMPACT]
P1 - Booking Date Corruption.
Users booking gym slots between 12:00 AM and 5:29 AM IST unintentionally book slots for yesterday's date due to UTC conversion.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/booking.tsx (Lines 81, 100)

[TECHNICAL ROOT CAUSE]
Code converts date using selectedDate.toISOString().split('T')[0]. In India (UTC+5:30), toISOString() converts local time to UTC, shifting early morning hours to the previous calendar day.

[STEPS TO REPRODUCE]
1. Set device clock to 2:30 AM IST on September 9th.
2. Open Booking screen and select "Today".
3. Click Confirm Booking.
4. Payload sends bookingDate: "2026-09-08" instead of "2026-09-09".

[EXPECTED BEHAVIOR]
Booking date string should represent local device calendar date.

[ACTUAL BEHAVIOR]
Date shifts back by one day during early morning hours.

[PROPOSED RESOLUTION]
Format dates using local components:
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const dateStr = \`\${year}-\${month}-\${day}\`;`
  },
  {
    summary: 'Hardcoded Dummy UUID Fallbacks in Booking Flow Cause DB Foreign Key Violations',
    issueType: 'Bug',
    priority: 'High',
    labels: 'validation mobile uuid foreign-key api-error p1-high',
    component: 'Mobile App - Booking Flow',
    environment: 'Mobile App / React Native Expo',
    affectedFiles: 'fitempire-mobile/src/app/booking.tsx (Lines 102-103)',
    description: `[SEVERITY & IMPACT]
P1 - User Flow Crash.
When navigation parameters are missing, fallback dummy UUIDs trigger 404/500 database foreign key violations instead of user-friendly validation.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/booking.tsx (Lines 102-103)

[TECHNICAL ROOT CAUSE]
handleConfirmBooking uses hardcoded fallbacks:
gymId: params.gymId || '11111111-1111-1111-1111-111111111111',
branchId: params.branchId || '22222222-2222-2222-2222-222222222222',
These UUIDs do not exist in the production database.

[STEPS TO REPRODUCE]
1. Direct link or route to /booking without query params.
2. Select a slot and click confirm.
3. Backend returns 404 ResourceNotFoundException or 500 DB constraint failure.

[EXPECTED BEHAVIOR]
Screen should validate params.gymId on mount and navigate back with an alert if parameters are missing.

[ACTUAL BEHAVIOR]
Fake UUIDs are submitted to the live backend.

[PROPOSED RESOLUTION]
Validate parameters in useEffect():
if (!params.gymId || !params.branchId) {
    Alert.alert('Error', 'Invalid gym selection. Please select a gym first.');
    router.replace('/(tabs)/explore');
}`
  },
  {
    summary: 'Digital Pass Client-Side Random Token Regeneration Bypasses Backend Validation',
    issueType: 'Bug',
    priority: 'High',
    labels: 'security qr-pass mobile turnstile token p1-high',
    component: 'Mobile App - Digital Pass',
    environment: 'Mobile App / React Native Expo',
    affectedFiles: 'fitempire-mobile/src/app/(tabs)/ticket.tsx (Lines 33-48)',
    description: `[SEVERITY & IMPACT]
P1 - Broken Check-In Experience.
When the 60-second in-app QR timer expires, the ticket regenerates a local client-side random string that does not exist in the backend database, causing gym turnstiles to reject the pass.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/(tabs)/ticket.tsx (Lines 33-48)

[TECHNICAL ROOT CAUSE]
ticket.tsx setInterval calls generateFreshToken():
const generateFreshToken = () => {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  setQrToken(\`EMPIRE-TOKEN-\${randomSuffix}-\${Date.now().toString().slice(-4)}\`);
};
This creates an unsynchronized client token without updating the server.

[STEPS TO REPRODUCE]
1. Open Digital Entry Ticket screen.
2. Wait 60 seconds until the countdown reaches 0.
3. QR code refreshes to a random token.
4. Scan with partner app; verification fails with "Pass not found".

[EXPECTED BEHAVIOR]
Token refresh must invoke bookingsApi.refreshQr(bookingId) to retrieve a server-signed rotated token.

[ACTUAL BEHAVIOR]
Local pseudo-random token is generated client-side.

[PROPOSED RESOLUTION]
Replace generateFreshToken with an async API call to /bookings/{id}/refresh-qr.`
  },
  {
    summary: 'Partner Portal Rigid 420px Mobile Phone Frame Breaks Desktop/Tablet Usability',
    issueType: 'Improvement',
    priority: 'Medium',
    labels: 'ui-ux responsive partner layout web p2-medium',
    component: 'Partner Portal - UI',
    environment: 'Partner Portal / Web / Desktop Browsers',
    affectedFiles: 'fitempire-partner/src/pages/LoginPage.tsx (Lines 67-85), App.tsx',
    description: `[SEVERITY & IMPACT]
P2 - Desktop Usability Issue.
Partner gym managers and receptionists running the web portal on desktop monitors see a narrow 420px mobile mockup container with clipped tables and awkward scrollbars.

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/LoginPage.tsx (Lines 67-85)
- fitempire-partner/src/App.tsx

[TECHNICAL ROOT CAUSE]
The application layout is hardcoded inside a simulated phone frame:
maxWidth: '420px',
border: '10px solid #1E293B',
borderRadius: '36px'

[STEPS TO REPRODUCE]
1. Open https://fitempirepartner.vercel.app on a 1920x1080 display.
2. The entire web portal is squeezed into a 420px phone graphic in the center of the screen.

[EXPECTED BEHAVIOR]
On screens >= 768px, render a full-width responsive dashboard with left sidebar navigation.

[ACTUAL BEHAVIOR]
Desktop users are forced to interact through a mobile phone mockup frame.

[PROPOSED RESOLUTION]
Add media queries in index.css to remove mobile framing on screens wider than 768px.`
  },
  {
    summary: 'Phantom Shopping Cart: Missing State Persistence & Checkout Pipeline',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'ecommerce mobile store cart checkout p2-medium',
    component: 'Mobile App - Store Module',
    environment: 'Mobile App / React Native Expo',
    affectedFiles: 'fitempire-mobile/src/app/store.tsx (Lines 132-155)',
    description: `[SEVERITY & IMPACT]
P2 - Incomplete E-Commerce Feature.
Users cannot view cart items, modify quantities, enter delivery addresses, or complete store purchases.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/store.tsx (Lines 132-155)

[TECHNICAL ROOT CAUSE]
handleAddToCart() simply increments a numeric counter and shows an alert. No cart array, product IDs, or prices are stored. Clicking the cart icon displays an Alert dialog without navigating to checkout.

[STEPS TO REPRODUCE]
1. Open FitEmpire Store in mobile app.
2. Click 'Add' on any product.
3. Click the Shopping Bag icon.
4. An Alert dialog appears: "3 items in cart" with no option to checkout or purchase.

[EXPECTED BEHAVIOR]
Tapping cart should open a dedicated Cart/Checkout screen showing itemized costs, address selector, and Razorpay payment button.

[ACTUAL BEHAVIOR]
Store has only an alert dialog without cart state or checkout pipeline.

[PROPOSED RESOLUTION]
Create CartContext with AsyncStorage backing, create /cart screen, and integrate with backend orders API.`
  },
  {
    summary: 'FitEmpire TV Lacks Streaming Player Engine (Triggers Native Alert on Click)',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'streaming mobile tv video media p2-medium',
    component: 'Mobile App - TV Module',
    environment: 'Mobile App / React Native Expo',
    affectedFiles: 'fitempire-mobile/src/app/tv.tsx (Lines 96-100)',
    description: `[SEVERITY & IMPACT]
P2 - Incomplete Media Feature.
FitEmpire TV workout videos cannot be played; clicking play triggers a native Alert popup instead of video streaming.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/tv.tsx (Lines 96-100)

[TECHNICAL ROOT CAUSE]
handlePlay() only shows an Alert modal:
Alert.alert('Streaming Live Workout 📺', \`Playing "\${video.title}". Connect Bluetooth audio or Chromecast to TV.\`);
No video player component is embedded.

[STEPS TO REPRODUCE]
1. Navigate to FitEmpire TV screen.
2. Tap the large play button on the featured workout video.
3. An Alert modal pops up instead of video playback.

[EXPECTED BEHAVIOR]
Tapping play should stream the workout video using a native player with pause, seek, and fullscreen controls.

[ACTUAL BEHAVIOR]
Video player is replaced with an Alert box.

[PROPOSED RESOLUTION]
Embed expo-av Video or react-native-video component to stream MP4/HLS feeds.`
  },
  {
    summary: "Partner Settlements: 'Request Instant Payout' Action is an Unconnected No-Op Mock",
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'finance partner settlements payout no-op p2-medium',
    component: 'Partner Portal - Settlements',
    environment: 'Partner Portal / React Vite',
    affectedFiles: 'fitempire-partner/src/pages/SettlementsPage.tsx (Lines 52-55)',
    description: `[SEVERITY & IMPACT]
P2 - Financial Workflow Failure.
Gym partners clicking "Request Instant Payout" receive a confirmation toast, but no payout request is transmitted to the backend.

[AFFECTED FILES & LINES]
- fitempire-partner/src/pages/SettlementsPage.tsx (Lines 52-55)

[TECHNICAL ROOT CAUSE]
handleRequestPayout() only toggles a local boolean flag for 4 seconds:
const handleRequestPayout = () => {
  setPayoutSuccess(true);
  setTimeout(() => setPayoutSuccess(false), 4000);
};

[STEPS TO REPRODUCE]
1. Open Partner Portal -> Earnings & Payouts (/settlements).
2. Click "Request Instant Payout".
3. Green notification displays: "Payout request initiated to bank account!".
4. Check browser Network tab; zero HTTP requests were made.

[EXPECTED BEHAVIOR]
Button must send POST request to /api/v1/partners/payouts/request and deduct available balance upon success.

[ACTUAL BEHAVIOR]
No-op mock action with fake visual confirmation.

[PROPOSED RESOLUTION]
Connect button to partnerApi.requestPayout() and display real server confirmation.`
  },
  {
    summary: 'AI Workout & Calorie Tracker Ignores Server Recommendations & Resets Logged Data',
    issueType: 'Bug',
    priority: 'Medium',
    labels: 'ai mobile workout nutrition persistence p2-medium',
    component: 'Mobile App - AI Module',
    environment: 'Mobile App / React Native Expo',
    affectedFiles: 'fitempire-mobile/src/app/ai-workout.tsx (Lines 61-107)',
    description: `[SEVERITY & IMPACT]
P2 - Personalization & State Persistence Defect.
AI workout recommendations ignore user inputs, discard backend API responses in favor of static client arrays, and lose all user-logged meals when leaving the screen.

[AFFECTED FILES & LINES]
- fitempire-mobile/src/app/ai-workout.tsx (Lines 61-107)

[TECHNICAL ROOT CAUSE]
1. handleAiGenerateWorkout calls aiApi.generateWorkout() without parameters and discards the returned payload.
2. Logged meals and macros are held only in local component state without AsyncStorage or backend synchronization.

[STEPS TO REPRODUCE]
1. Open AI Workout screen and select "Nutrition" tab.
2. Add a custom meal with 500 calories.
3. Navigate to Home tab and return to AI Workout.
4. Logged meal is gone; calories revert to default 1650.

[EXPECTED BEHAVIOR]
Workouts should reflect server AI recommendations, and logged meals should persist across app sessions.

[ACTUAL BEHAVIOR]
Static client-side routines and ephemeral state reset on navigation.

[PROPOSED RESOLUTION]
1. Pass parameters to aiApi.generateWorkout({ muscleGroup, fitnessLevel }) and update state with server response.
2. Persist food log entries in AsyncStorage or POST to /api/v1/ecosystem/nutrition/logs.`
  }
];

function escapeCsvField(field) {
  if (field === null || field === undefined) return '""';
  const str = String(field);
  return '"' + str.replace(/"/g, '""') + '"';
}

const headers = ['Summary', 'Issue Type', 'Priority', 'Labels', 'Description'];
const rows = [headers.map(escapeCsvField).join(',')];

for (const item of issues) {
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
const outputPath = path.resolve(__dirname, '..', 'jira_issues_fitempire.csv');
fs.writeFileSync(outputPath, csvContent, 'utf8');

console.log(`✅ Successfully generated detailed Jira CSV at: ${outputPath}`);
console.log(`   Total issues: ${issues.length}`);
console.log(`   Columns included: ${headers.join(', ')}`);
