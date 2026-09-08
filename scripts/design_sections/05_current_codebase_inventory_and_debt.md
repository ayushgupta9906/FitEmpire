---

## 5. Current Codebase Inventory — As-Built vs Gaps & Technical Debt

A complete audit of the active FitEmpire repository was conducted to distinguish between what is already built and working versus critical security vulnerabilities, architectural gaps, and technical debt.

### 5.1 Subsystem Inventory

#### 1. Backend Subsystem (`fitempire-backend`)
- **Location:** `fitempire-backend/`
- **Framework:** Java 21, Spring Boot 3.2.5, Spring Security, Spring Data JPA, PostgreSQL Driver, HikariCP.
- **Key Modules & Controllers:**
  - `AuthController.java`: Handles `/v1/auth/register`, `/v1/auth/login`, JWT creation, BCrypt password hashing.
  - `GymController.java`: Endpoints for gym listings, branch discovery, and amenity filtering.
  - `MembershipController.java`: Purchase passes, fetch member active status, submit pass freeze requests.
  - `EcosystemController.java`: Corporate domain checks, corporate pass subsidies, and enterprise partnerships.
  - `PaymentController.java`: Razorpay order creation (`/v1/payments/create-order`) and client verification (`/v1/payments/verify`).
  - `SecurityConfig.java`: Security filter chain, stateless session management, role-based authorization rules.
  - `DatabaseSeeder.java`: Seeds initial admin credentials, demo gym partners, and default membership tiers.

#### 2. Mobile Subsystem (`fitempire-mobile`)
- **Location:** `fitempire-mobile/`
- **Framework:** React Native 0.74, Expo SDK 51, React Navigation, Android Studio Native Gradle build.
- **Key Screens & Components:**
  - `app/index.tsx` & `app/login.tsx`: Member authentication and onboarding flow.
  - `app/explore.tsx`: Gym directory, search filters, and interactive branch detail cards.
  - `app/membership.tsx`: Digital membership card, QR check-in modal, pass freeze trigger.
  - `app/wallet.tsx`: Digital credits, transaction history, and top-up modal.
  - `android/`: Native Android project structure, Gradle build scripts, ProGuard configuration.

#### 3. Partner Web Portal (`fitempire-partner`)
- **Location:** `fitempire-partner/`
- **Framework:** React 18, Vite, TypeScript, Lucide Icons, Tailwind CSS.
- **Key Dashboards & Modules:**
  - `DashboardPage.tsx`: Partner gym real-time KPI overview (daily footfall, capacity utilization).
  - `AttendancePage.tsx`: Turnstile check-in monitor, manual member lookup, and scanner status.
  - `TimetablePage.tsx`: Trainer scheduling, class timetable management, and slot caps.
  - `ScannerPage.tsx`: Optical camera QR barcode scanner for reception desks.

#### 4. Customer Landing Page & Admin Console (`fitempire-web`)
- **Location:** `fitempire-web/`
- **Framework:** React 18, Vite, Tailwind CSS, Lucide Icons.
- **Key Portals:**
  - Customer Marketing Landing Page (`HomePage.tsx`): SEO-friendly showcase, pricing tiers, corporate calculator.
  - Admin Backoffice Console (`AdminDashboard.tsx`): Gym partner KYC approvals, user management, financial audits.

---

### 5.2 Critical Vulnerabilities, Functional Gaps & Technical Debt Audit

The following table provides an unvarnished audit of production blockers discovered in the codebase, with exact file paths and remediation steps:

| Issue ID | File Path & Line Numbers | Vulnerability / Gap Description | Operational & Financial Risk | Remediation Plan | Severity |
|---|---|---|---|---|:---:|
| **SEC-001** | `fitempire-backend/.../EcosystemController.java`<br>`Lines 99–109` | **Corporate Subsidy Bypass:** Naive substring check `email.contains("google")` grants 100% free passes (₹7,999 value) to any user registering with `fakegoogle@gmail.com` or `google-scam@yahoo.com`. | **Massive Revenue Leakage:** Anyone can generate free memberships indefinitely by including corporate names in public email addresses. | Replace with strict domain extraction (`@google.com`), database corporate partner validation, and mandatory 6-digit email OTP verification. | **CRITICAL (P0)** |
| **SEC-002** | `fitempire-backend/.../DatabaseSeeder.java`<br>`Line 112` | **Hardcoded Admin Credential Overwrite:** On every backend restart, the seeder resets the production superadmin password to `AdminPassword@123`. | **Complete System Takeover:** Attackers can brute-force the default admin account whenever a rolling deployment or pod restart occurs. | Wrap admin seeding strictly in `if (userRepository.findByEmail(adminEmail).isEmpty())` block and disable seeder in production via `@Profile("!prod")`. | **CRITICAL (P0)** |
| **PAY-001** | `fitempire-backend/.../PaymentController.java` | **Missing Razorpay Webhook Endpoint:** Only client-side `/verify` exists. If a user's mobile battery dies or network disconnects mid-payment after Razorpay deducts money, the order never fulfills. | **Customer Churn & Chargebacks:** Members are charged money by their bank, but their FitEmpire membership pass is not activated. | Implement `/v1/payments/webhook` verifying `X-Razorpay-Signature` HMAC-SHA256 and process fulfillment idempotently. | **HIGH (P1)** |
| **MOB-001** | `fitempire-mobile/.../app/membership.tsx`<br>`Lines 142–158` | **Phantom UI Success in Catch Block:** When the pass freeze API fails due to network outage, an `Alert.alert("Success", "Pass frozen")` is triggered inside the `catch` block. | **User Confusion & Service Denial:** Users believe their pass is frozen, but backend billing and expiry continue running. | Move success dialog strictly inside HTTP 200 `try` block; show error message and retry prompt in `catch` block. | **HIGH (P1)** |
| **BLD-001** | `fitempire-mobile/android/app/proguard-rules.pro` | **Missing ProGuard Rules for Razorpay SDK:** Native Android release builds crash with `ClassNotFoundException` due to R8 minification stripping Razorpay reflection classes. | **App Store Release Failure:** Production release APK/AAB crashes instantly on payment checkout. | Add `-keep class com.razorpay.** { *; }` and `-dontwarn com.razorpay.**` to `proguard-rules.pro`. | **HIGH (P1)** |
| **RT-001** | `fitempire-partner/.../AttendancePage.tsx` | **Client-Local Turnstile State:** Check-in events are stored in React component local state (`useState`). Refreshing the browser or opening multiple desk terminals wipes the screen and desynchronizes desk staff. | **Double-Entry & Security Blindspots:** Multiple turnstiles at the same gym cannot see each other's live scan events. | Connect partner frontend to STOMP WebSocket broker (`/topic/turnstile/{branchId}`) backed by Redis Pub/Sub. | **MEDIUM (P2)** |
| **SEC-003** | `fitempire-backend/.../SecurityConfig.java` | **Hardcoded Localhost CORS Origins:** `SecurityConfig` permits `http://localhost:3000` and `http://localhost:5173`. | **Cross-Site Request Forgery (CSRF):** Production web domains cannot communicate cleanly without ad-hoc wildcard hacks. | Externalize allowed origins to environment variable `ALLOWED_CORS_ORIGINS` with strict domain regex matching. | **MEDIUM (P2)** |
| **FIN-001** | `fitempire-backend/.../WalletService.java` | **Floating-Point Arithmetic in Wallet:** Wallet balance is represented using `Double` instead of `BigDecimal`. | **Micro-Rounding Financial Errors:** Accumulated IEEE-754 precision loss creates reconciliation discrepancies in quarterly financial audits. | Refactor all money and credit fields to `BigDecimal` with `RoundingMode.HALF_EVEN` (Banker's Rounding). | **MEDIUM (P2)** |
