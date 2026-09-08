const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../SYSTEM_DESIGN.md');

// Helper to write file stream
const stream = fs.createWriteStream(targetPath, { flags: 'w', encoding: 'utf8' });

function write(str) {
  stream.write(str + '\n');
}

console.log('Generating Master System Design v3.5...');

// SECTION 1
write(`# FitEmpire — Master System Design & Architecture Specification (FAANG Enterprise Grade)
**Document Version:** 3.5.0-ENTERPRISE  
**Classification:** Internal Technical Architecture Specification & Engineering Blueprint  
**Primary Author / Architect:** FitEmpire Core Systems Architecture Team  
**Status:** Approved & Living Production Specification  
**Target Scale:** 1,000,000+ Active Users | 500+ Partner Gyms | 72,000 Daily Turnstile Check-Ins  

---

## Executive Architectural Summary

FitEmpire is an omni-channel fitness aggregation, gym management ERP, and enterprise corporate wellness platform. It bridges three interdependent customer segments:
1. **Retail B2C Consumers:** Seeking frictionless, flexible, multi-gym access across India's tier-1 and tier-2 metros through a single digital membership pass.
2. **B2B Partner Gyms & Fitness Studios:** Demanding reliable turnstile access control, class scheduling, automated billing, and churn reduction tooling.
3. **B2B2C Corporate Enterprises:** Demanding subsidized, verified employee wellness benefits with real-time tax compliance and utilization analytics.

This document serves as the definitive engineering manual for FitEmpire. It covers everything from foundational computer science and networking principles (designed for junior engineers) to distributed concurrency controls, mathematical capacity planning, production PostgreSQL DDL, software design patterns, STRIDE threat models, and high-availability multi-region topologies (designed for staff/principal engineers).

---

## Table of Contents
1. [Executive Summary & System Vision](#1-executive-summary--system-vision)
2. [Beginner-to-Advanced Architectural Primer (Educational Foundation)](#2-beginner-to-advanced-architectural-primer-educational-foundation)
3. [Quantitative Capacity Estimations & Scale Modeling (Back-of-the-Envelope Math)](#3-quantitative-capacity-estimations--scale-modeling-back-of-the-envelope-math)
4. [Technology Stack Selection & Competitive Justification ("What We Used, Why, & Why It Beats the Alternatives")](#4-technology-stack-selection--competitive-justification-what-we-used-why--why-it-beats-the-alternatives)
5. [Current Codebase Inventory — As-Built vs Gaps & Technical Debt](#5-current-codebase-inventory--as-built-vs-gaps--technical-debt)
6. [High-Level & Low-Level System Architecture (HLD & LLD)](#6-high-level--low-level-system-architecture-hld--lld)
7. [Exhaustive Relational Database Schema & Complete DDL (PostgreSQL 16)](#7-exhaustive-relational-database-schema--complete-ddl-postgresql-16)
8. [Complete REST API Contract Specifications](#8-complete-rest-api-contract-specifications)
9. [Core Business Workflows & Sequence Diagrams](#9-core-business-workflows--sequence-diagrams)
10. [Production Implementation Code Snippets for Core Business Logic](#10-production-implementation-code-snippets-for-core-business-logic)
11. [Concurrency Control, Race Conditions & Distributed Locking](#11-concurrency-control-race-conditions--distributed-locking)
12. [Security Architecture, STRIDE Threat Modeling & Compliance](#12-security-architecture-stride-threat-modeling--compliance)
13. [High Availability (HA), Fault Tolerance & Disaster Recovery (HA/DR)](#13-high-availability-ha-fault-tolerance--disaster-recovery-hadr)
14. [Observability, Metrics, Logging & SRE Operations (SLIs/SLOs)](#14-observability-metrics-logging--sre-operations-slisslos)
15. [Department-by-Department Engineering Blueprint, Org Structure & Hiring Plan](#15-department-by-department-engineering-blueprint-org-structure--hiring-plan)
16. [Prioritized 4-Phase Execution Roadmap](#16-prioritized-4-phase-execution-roadmap)

---

## 1. Executive Summary & System Vision

### 1.1 The Business Model & Market Disruption
Traditional gym memberships in emerging markets suffer from high friction: high annual upfront fees (₹20,000–₹60,000), rigid single-location contracts, predatory auto-renewals, and fragmented paper-based gym management. FitEmpire disrupts this model through a three-sided marketplace:
- **Universal Fitness Pass (B2C):** A dynamic tier-based pass (Silver, Gold, Platinum) giving members universal entry to hundreds of partner gyms, swimming pools, CrossFit boxes, and MMA dojos across multiple cities.
- **Gym Operating System (B2B SaaS):** Providing boutique gym owners with hardware-integrated optical turnstile scanners, trainer scheduling, automated payout reconciliation, and digital attendance logs.
- **Enterprise Corporate Wellness (B2B2C):** Enabling Fortune 500 companies (Google, Microsoft, Infosys) to co-fund or fully sponsor employee fitness plans with automated work email domain verification and usage-based billing.

### 1.2 Core Architectural Principles
To sustain high peak throughput during morning rush hours without compromising financial correctness, FitEmpire adheres to five non-negotiable architectural tenets:
1. **Financial Immutability & Double-Entry Ledger:** Money and membership entitlements must never be updated with arbitrary arithmetic in place. Every credit, debit, pass freeze, or corporate subsidy must produce an immutable ledger entry.
2. **Sub-100ms Turnstile Check-In Latency:** Physical optical barrier gates and partner desk scanners must authenticate dynamic QR passes in under 100 milliseconds to avoid queue buildup during peak gym arrival hours (06:00–09:00 AM).
3. **Stateless Compute Layer:** All Spring Boot application nodes must remain strictly stateless. Session state, transient tokens, and short-lived nonces reside exclusively in Redis; persistent domain state resides in PostgreSQL. Any node can be killed or spun up instantly.
4. **Single-Use Cryptographic Nonces:** Static QR codes and screenshots invite fraud. All check-in codes are ephemeral cryptographic tokens with 60-second TTLs and single-use atomic consumption guarantees.
5. **Zero-Trust Security & Minimal Blast Radius:** Every endpoint validates input syntax and semantic permissions. Sensitive administrative actions require multi-factor authorization. Partner gym scanners are scoped strictly to their own branch identifiers.

---

## 2. Beginner-to-Advanced Architectural Primer (Educational Foundation)

To ensure alignment across junior engineers, interns, and senior leads, this section deconstructs the core computer science and distributed systems principles governing FitEmpire.

### 2.1 The End-to-End Request-Response Lifecycle
When a user taps **"Check In"** on the FitEmpire Mobile App, the request traverses multiple physical and software layers before persisting data:

\`\`\`mermaid
flowchart TD
    A[Mobile Client: React Native / Android] -->|1. HTTPS POST /v1/partner/check-in| B[Cloudflare Edge / WAF]
    B -->|2. DDoS Filter & TLS Termination| C[AWS Application Load Balancer]
    C -->|3. Reverse Proxy via VPC Peering| D[Nginx Ingress Controller]
    D -->|4. HTTP/2 Internal Route| E[Spring Boot 3.2.5 Backend Instance]
    
    subgraph Spring Boot Container
        E -->|5. Security Interception| F[DelegatingFilterProxy / JwtAuthFilter]
        F -->|6. Validated Principal Context| G[DispatcherServlet]
        G -->|7. Controller Mapping| H[AttendanceController]
        H -->|8. Business Domain Logic| I[CheckInService]
        I -->|9. Atomic Token Validation| J[(Redis 7 Cache Cluster)]
        I -->|10. Entity Persistence & Ledger| K[AttendanceRepository]
        K -->|11. Connection Pool Acquisition| L[HikariCP Pool: 20 conns]
    end

    L -->|12. Parameterized SQL INSERT| M[(PostgreSQL 16 Primary DB)]
    M -->|13. WAL fsync & Row Write| L
    I -->|14. STOMP Event Broadcast| N[WebSocket Broker: /topic/turnstile]
    N -->|15. Real-Time UI Update| O[Partner Desk Desktop Web App]
\`\`\`

#### Step-by-Step Breakdown:
1. **Client DNS & TLS Handshake:** The mobile client queries Route 53 DNS for \`api.fitempire.com\`, resolving to Cloudflare Anycast IP addresses. An SSL/TLS 1.3 handshake negotiates cipher suites in 1 RTT (Round Trip Time).
2. **Cloudflare WAF:** Inspects incoming IP headers, enforces DDoS rate limiting, blocks known bot user-agents, and terminates edge TLS before forwarding traffic across AWS Direct Connect.
3. **AWS Application Load Balancer (ALB):** Distributes incoming traffic evenly across healthy Kubernetes worker nodes using a round-robin algorithm with target group health checks (\`GET /actuator/health\`).
4. **Spring Security Filter Chain:** 
   - \`CorsFilter\`: Rejects unauthorized web origins.
   - \`JwtAuthenticationFilter\`: Extracts \`Authorization: Bearer <token>\` from headers, cryptographically validates the HMAC-SHA256 signature using the server secret key, verifies expiration (\`exp\`), and populates the \`SecurityContextHolder\` with a \`UserPrincipal\`.
5. **DispatcherServlet & HandlerMapping:** Inspects the URI path \`/v1/partner/check-in\` and delegates request parsing to \`AttendanceController.java\`.
6. **Domain Service Execution & Transaction Boundary:** \`CheckInService.java\` is annotated with \`@Transactional(isolation = Isolation.READ_COMMITTED)\`. If any exception occurs (e.g. expired pass, duplicate scan), the entire transaction rolls back cleanly.
7. **Connection Pool & Relational Write:** HikariCP borrows an active TCP socket from its pool, sends the parameterized SQL statement to PostgreSQL 16, waits for the Write-Ahead Log (WAL) to flush to disk (\`fsync\`), and releases the connection back to the pool.

---

### 2.2 Client-Server Decoupling: REST vs GraphQL vs WebSockets

| Protocol | Transport | When FitEmpire Uses It | When FitEmpire Explicitly Rejects It |
|---|---|---|---|
| **REST (HTTP/JSON)** | HTTP/1.1 & HTTP/2 | Standard CRUD APIs (User profile, gym exploration, billing, pass freeze). Highly cacheable at edge CDNs via HTTP \`ETag\` and \`Cache-Control\` headers. | Real-time bi-directional messaging where low latency (<50ms) is required. |
| **STOMP over WebSocket** | Persistent Full-Duplex TCP | Turnstile desk live monitor. When a member scans their QR code at a turnstile barrier, the partner desk dashboard instantly updates without refreshing. | Generic catalog browsing or static file downloads (wastes persistent server socket memory). |
| **GraphQL** | Single-endpoint HTTP POST | *Rejected for FitEmpire.* While flexible for frontend queries, it introduces complex query-depth vulnerability risks (DDoS via recursive nesting), breaks standard HTTP caching, and complicates database query optimization. |
| **gRPC (HTTP/2 Protocol Buffers)** | Binary Framed TCP | Internal service-to-service communication between backend microservices and future async worker daemons. | Direct mobile client communication (requires heavy client runtime libraries and poor browser support). |

---

### 2.3 State Management & Authentication: JWTs vs Session Cookies

FitEmpire employs a **Hybrid Dual-Token Authentication Architecture**:
1. **Access Token (Short-Lived):** 
   - Format: Signed JSON Web Token (JWT), HMAC-SHA256.
   - Lifespan: **15 Minutes**.
   - Storage: Stored strictly in React Native / browser application memory (never in localStorage where XSS attacks can extract it).
   - Contents: Non-sensitive claims (\`userId\`, \`email\`, \`role\`, \`corporateDomain\`).
2. **Refresh Token (Long-Lived):**
   - Format: High-entropy cryptographically random UUIDv4 stored hashed in the \`refresh_tokens\` table.
   - Lifespan: **7 Days**.
   - Storage: Mobile clients store it inside the OS hardware secure keystore (Android Keystore / iOS Keychain via \`expo-secure-store\`). Web clients receive it as an **HttpOnly, Secure, SameSite=Strict** cookie, making it inaccessible to malicious JavaScript.
   - Automatic Token Rotation: Every time a refresh token is used, it is revoked and replaced with a new token. If an expired or already-revoked refresh token is presented, the system flags a breach and invalidates all active sessions for that user account.

---

### 2.4 Database Mechanics: Relational (ACID) vs NoSQL (BASE) & Connection Pooling Math

#### Why PostgreSQL 16 Beats NoSQL for FitEmpire:
Fitness memberships are financial contracts. If a member with 1 remaining class booking double-clicks the "Book Class" button simultaneously on two devices, a NoSQL eventual-consistency database (like MongoDB or DynamoDB) risks booking both classes, causing studio overcapacity. PostgreSQL guarantees strict **ACID** properties:
- **Atomicity:** The booking record creation and member wallet/credit deduction succeed together or fail together.
- **Consistency:** Database schema constraints (e.g. \`CHECK (remaining_slots >= 0)\`) prevent invalid state from ever entering the disk.
- **Isolation:** Transaction isolation levels prevent simultaneous transactions from reading intermediate, uncommitted states.
- **Durability:** Once committed, transactions are written to the Write-Ahead Log (WAL) on non-volatile SSD storage before acknowledging success.

#### The Mathematics of HikariCP Connection Pool Sizing:
A common beginner mistake is allocating 200–500 database connections. In reality, each PostgreSQL connection spawns an operating system process consuming ~10 MB of RAM. Excessive connections cause severe CPU thrashing due to OS context switching.

The formula dictated by PostgreSQL core architects and HikariCP maintainers is:
\`\`\`text
Pool Size = (CPU Cores * 2) + Effective Spindle Count (Disk IO Channels)
\`\`\`
For an AWS RDS \`db.m6g.xlarge\` instance (4 vCPUs, SSD EBS storage with 1 spindle channel):
\`\`\`text
Pool Size = (4 * 2) + 1 = 9 connections (Optimal per backend pod)
\`\`\`
With 3 backend application pods running, the total database connection footprint is \`3 * 10 = 30 connections\`, running with near-zero queue wait times and negligible context switching overhead.

---

### 2.5 Caching Deep-Dive: Strategies & Failure Modes

#### Cache-Aside Pattern (Implemented in FitEmpire):
1. Client requests gym details: \`GET /v1/gyms/{gymId}\`.
2. Backend checks Redis: \`GET gym:cache:{gymId}\`.
3. If Cache Hit: Return cached JSON immediately (~2ms).
4. If Cache Miss: Query PostgreSQL (~25ms), write result to Redis with a 1-hour TTL: \`SETEX gym:cache:{gymId} 3600 <data>\`, then return to client.

#### Caching Failure Modes & Engineering Defenses:
- **Cache Penetration:** Malicious users request non-existent IDs (\`GET /v1/gyms/ffffffff-ffff-ffff-ffff-ffffffffffff\`) forcing expensive database queries.  
  *Defense:* FitEmpire caches empty results with a short TTL (60s) and validates UUID format via regex before hitting the DB.
- **Cache Breakdown / Stampede:** A high-traffic key (e.g. Bangalore Gold's Gym timetable) expires, causing 500 concurrent requests to hit the database simultaneously.  
  *Defense:* FitEmpire utilizes distributed mutex locking via Redis (\`SET key value NX PX 5000\`) so only one thread recomputes the cache while others wait.
- **Cache Avalanche:** Thousands of keys are set with the exact same expiration time (e.g. at midnight), expiring simultaneously.  
  *Defense:* FitEmpire adds random jitter (\`TTL = 3600 + rand(-300, 300)\`) to spread out eviction times.

---

## 3. Quantitative Capacity Estimations & Scale Modeling (Back-of-the-Envelope Math)

Engineering decisions must be backed by rigorous mathematics. Below is the capacity model for FitEmpire at scale:

### 3.1 Core Metric Assumptions
- **Total Registered User Base:** 1,000,000 users.
- **Daily Active Users (DAU):** 6% of total user base = **60,000 DAU**.
- **Partner Gym Locations:** 500 active partner facilities across 10 metro cities.
- **Average Visits per Active Member:** 1.2 check-ins per day = **72,000 check-ins / day**.
- **Peak Operating Hours:** Morning rush (06:00 AM – 09:00 AM) and Evening rush (05:30 PM – 08:30 PM). 80% of daily visits occur in these two 3-hour windows (6 hours total).

---

### 3.2 Traffic & Throughput Math (QPS Modeling)

#### Turnstile Check-In QPS:
- Total check-ins during peak 6 hours: \`72,000 * 0.80 = 57,600 visits\`.
- Total peak seconds: \`6 hours * 3,600 seconds = 21,600 seconds\`.
- **Average Peak Check-In QPS:** \`57,600 / 21,600 = 2.67 QPS\`.
- Applying a **15x Burst Multiplier** (accounting for simultaneous 07:00 AM batch class arrivals and office commute turnstile rushes):
\`\`\`text
Peak Turnstile Check-In QPS = 2.67 * 15 ≈ 40 to 45 QPS
\`\`\`

#### Read & Discovery Traffic (Gym Browsing, Search, Class Timetables):
- Each active user performs an average of 10 read requests per day (opening app, viewing map, checking timetable, loading profile).
- Total daily reads: \`60,000 DAU * 10 = 600,000 reads / day\`.
- Peak read window (12 hours): \`600,000 / (12 * 3,600) = 13.88 QPS average\`.
- Applying an **8x Peak Factor**:
\`\`\`text
Peak Read QPS = 13.88 * 8 ≈ 111 QPS
\`\`\`

#### Combined Total System QPS:
- Read QPS: ~111 QPS.
- Write / Mutate QPS (Check-ins, bookings, payments): ~45 QPS.
- Total Peak Traffic: **~156 QPS** (Well within capacity of 2-3 standard Spring Boot pods and 1 modern PostgreSQL replica).

---

### 3.3 Database Storage Calculations (5-Year Forecast)

| Table Entity | Rows / Year | Row Size (Bytes) | 1-Year Storage | 5-Year Storage |
|---|---|---|---|---|
| \`users\` | 200,000 | 1,024 (1 KB) | 0.20 GB | 1.00 GB |
| \`attendance_records\` | 26,280,000 | 500 B | 13.14 GB | 65.70 GB |
| \`class_bookings\` | 7,300,000 | 400 B | 2.92 GB | 14.60 GB |
| \`orders\` & \`order_items\` | 2,400,000 | 1,500 B | 3.60 GB | 18.00 GB |
| \`wallet_ledger\` | 10,000,000 | 350 B | 3.50 GB | 17.50 GB |
| \`audit_logs\` & Telemetry | 40,000,000 | 300 B | 12.00 GB | 60.00 GB |
| **Subtotal Raw Data** | - | - | **35.36 GB** | **176.80 GB** |
| **Index Overhead (35%)**| - | - | **12.38 GB** | **61.88 GB** |
| **Grand Total Storage** | - | - | **47.74 GB** | **238.68 GB** |

**Storage Architecture Decision:**  
A 5-year storage projection of ~239 GB is remarkably compact and easily managed on an AWS RDS EBS gp3 volume. Sharding is neither necessary nor recommended at this stage. Instead, **Table Partitioning by Range (Monthly)** on the \`attendance_records\` and \`audit_logs\` tables ensures query performance remains blazing fast without table scan degradation.

---

### 3.4 In-Memory Cache Sizing (Redis 7)

Redis holds ephemeral, high-throughput session and security state:
1. **Dynamic QR Check-In Nonces:**
   - 45 check-ins/sec with 60-second TTL = 2,700 active keys at any given moment.
   - Key-value size: \`uuid + json metadata\` = 512 bytes.
   - Memory = \`2,700 * 512 bytes ≈ 1.38 MB\`.
2. **Active Member Entitlement Cache (DAU Pass Status):**
   - 60,000 DAU * 1.2 KB (membership tier, freeze status, wallet balance, active booking IDs) = **72.00 MB**.
3. **Gym Geo-Index & Facility Details:**
   - 500 gyms * 50 KB (location, pictures, timetable, amenities) = **25.00 MB**.
4. **API Rate Limiting Sliding Windows:**
   - 100,000 unique IP/user buckets * 64 bytes = **6.40 MB**.

\`\`\`text
Total Redis Active Working Set = 1.38 MB + 72.00 MB + 25.00 MB + 6.40 MB ≈ 104.78 MB
\`\`\`
Applying a **4x safety buffer** for Redis internal hash table pointers, replication backlogs, and memory fragmentation:
\`\`\`text
Recommended Redis Capacity = 104.78 MB * 4 ≈ 419 MB
\`\`\`
An AWS ElastiCache \`cache.t4g.medium\` (3.09 GB RAM) provides over **7x headroom**, ensuring zero eviction pressure and single-digit millisecond latency.

---

### 3.5 Network Ingress / Egress Bandwidth Budget

- **Peak Ingress:** 156 QPS * 2 KB avg request payload = \`312 KB/sec = 2.5 Mbps\`.
- **Peak Egress:** 156 QPS * 15 KB avg JSON response payload = \`2.34 MB/sec = 18.72 Mbps\`.
- **Monthly Bandwidth Transfer:**
\`\`\`text
Average 8 Mbps continuous egress * 3,600 * 24 * 30 days ≈ 2.59 TB / month
\`\`\`
Static assets (gym images, branding logos, trainer photos) are offloaded to Cloudflare CDN backed by AWS S3, reducing backend server egress by over 85%.

---
`);

console.log('Appended Sections 1, 2, 3.');
