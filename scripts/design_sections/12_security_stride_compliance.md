---

## 12. Security Architecture, STRIDE Threat Modeling & Compliance

### 12.1 STRIDE Threat Modeling Matrix

FitEmpire applies Microsoft's **STRIDE** methodology across every system interface:

| STRIDE Category | Threat Description | Attack Vector | FitEmpire Architectural Mitigation | Target Severity |
|---|---|---|---|:---:|
| **Spoofing** | Fake Razorpay webhook event spoofing payment capture. | Attacker posts raw JSON to `/v1/payments/webhook` claiming payment ID `pay_123` succeeded. | Cryptographic HMAC-SHA256 signature verification (`X-Razorpay-Signature`) using server-side webhook secret key. | **CRITICAL** |
| **Spoofing** | Corporate domain bypass for free membership passes. | User enters `scamgoogle@gmail.com` or forged HTTP headers. | Strict regex domain extraction (`@google.com`), DNS MX validation, and 6-digit email OTP verification. | **CRITICAL** |
| **Tampering** | Modifying membership pass tier inside JWT or request payload. | User tampers with JSON claims in mobile storage to change `SILVER` to `PLATINUM`. | JWT HMAC-SHA256 signature verification; backend validates tier from PostgreSQL database upon every check-in. | **HIGH** |
| **Tampering** | Client-side price tampering during order creation. | Attacker intercepts `/v1/payments/create-order` and sets `amount = 1.00`. | The client only passes `planId`. The backend calculates price, corporate discounts, and GST strictly on the server. | **CRITICAL** |
| **Repudiation** | Partner gym denies receiving a member, claiming fraudulent check-in billing. | Gym disputes month-end settlement footfall. | Immutable audit log in `attendance_records` capturing timestamp, scanner staff ID, turnstile serial, and unique nonce. | **MEDIUM** |
| **Information Disclosure** | Partner gym staff viewing revenue and member data of competing gym brands. | Staff modifies `branchId` parameter in API request. | Multi-Tenant Authorization Interceptor: Spring Security enforces `gym_id = principal.gym_id` on all database queries. | **HIGH** |
| **Denial of Service** | Botnet flooding `/v1/auth/login` with credential stuffing attacks. | 5,000 requests/sec trying breached passwords. | Cloudflare WAF + Redis Token-Bucket Rate Limiter (maximum 10 failed login attempts per minute per IP/account). | **HIGH** |
| **Elevation of Privilege** | Retail user invoking partner check-in or superadmin endpoints. | User sends valid member JWT to `/v1/admin/gyms/approve`. | Spring Security method-level annotations (`@PreAuthorize("hasRole('SUPER_ADMIN')")`) enforcing strict RBAC. | **CRITICAL** |

---

### 12.2 Role-Based Access Control (RBAC) Hierarchy

The system defines five strictly partitioned roles with inheritance:
```text
ROLE_SUPER_ADMIN
   └── ROLE_PARTNER_ADMIN
         └── ROLE_PARTNER_STAFF
               └── ROLE_TRAINER
                     └── ROLE_USER
```

- **`ROLE_USER`:** Access to personal profile, gym exploration, dynamic pass generation, class bookings, personal wallet, and order history.
- **`ROLE_TRAINER`:** Can view class attendee rosters, log class attendance, and manage trainer calendar availability.
- **`ROLE_PARTNER_STAFF`:** Optical turnstile scanner access, manual check-in override, and visitor footfall monitoring for their specific gym branch.
- **`ROLE_PARTNER_ADMIN`:** Full access to their gym brand: branch management, staff account provisioning, timetable scheduling, and bank account payout details.
- **`ROLE_SUPER_ADMIN`:** Global platform oversight: KYC verification of gym partners, platform fee configuration, corporate contract management, and system-wide telemetry.

---

### 12.3 PCI-DSS Compliance Scope Reduction (SAQ A)

Handling payment card data directly (Primary Account Numbers, CVVs, Expiry Dates) triggers extensive **PCI-DSS Level 1** compliance audits, requiring dedicated hardware security modules (HSMs) and isolated network enclaves.

**FitEmpire's Architectural Strategy: SAQ A Scope Reduction**
- Zero raw card numbers, CVVs, or bank account credentials ever touch FitEmpire servers, memory, or databases.
- The mobile app and web frontend embed **Razorpay Checkout SDK**. Credit card, debit card, NetBanking, and UPI credentials are submitted directly from the client browser/app to Razorpay's PCI-DSS Level 1 certified vault.
- FitEmpire only receives and stores opaque tokens (`razorpay_order_id`, `razorpay_payment_id`) and high-level metadata (e.g. payment method: `"upi"`, card last 4 digits: `"1234"`).
- This strategy limits FitEmpire's compliance footprint to **PCI-DSS SAQ A** (Self-Assessment Questionnaire A), minimizing audit overhead by 95%.

---

### 12.4 Indian Digital Personal Data Protection (DPDP) Act 2023 & GDPR Compliance

1. **Right to be Forgotten (Account Deletion):**
   - Implemented via soft-deletion (`users.is_deleted = true`, `users.deleted_at = NOW()`).
   - Personally Identifiable Information (PII) like `first_name`, `last_name`, `phone`, and `avatar_url` are scrubbed with cryptographic hashes (`"DELETED_USER_" + hash`) to ensure data cannot be recovered, while preserving referential integrity for historical financial ledger audits.
2. **Purpose Limitation & Data Minimization:**
   - The mobile app only requests permissions when strictly required by a specific feature:
     - Camera permission requested *only* on the Partner Scanner screen (`expo-camera`).
     - Screen brightness boost applied *only* when the QR pass modal is actively visible.
3. **Data Localization:**
   - In accordance with RBI and Indian DPDP mandates for payment data, all primary database servers, backups, and user credentials reside strictly within AWS Asia Pacific (Mumbai) region (`ap-south-1`).
