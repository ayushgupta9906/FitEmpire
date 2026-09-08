---

## 6. High-Level & Low-Level System Architecture (HLD & LLD)

### 6.1 Enterprise Distributed Architecture Diagram (C4 Container Level)

The following diagram illustrates the distributed architecture of FitEmpire, highlighting trust boundaries, caching tiers, database replication, and real-time messaging:

```mermaid
graph TB
    subgraph Client Layer
        Mobile[FitEmpire Mobile App<br/>React Native / Android Studio]
        WebClient[Customer Web App<br/>React 18 / Vite]
        PartnerDesk[Partner Turnstile Desk<br/>React 18 / Vite]
        AdminConsole[SuperAdmin Backoffice<br/>React 18 / Vite]
    end

    subgraph Edge & Security Perimeter
        CF[Cloudflare CDN & WAF<br/>DDoS Mitigation & Edge SSL]
        ALB[AWS Application Load Balancer<br/>Layer 7 Path Routing & TLS Offload]
    end

    subgraph Compute Tier - Amazon EKS / Kubernetes
        Ingress[Nginx Ingress Controller]
        Pod1[Spring Boot Pod 1<br/>Java 21 / Virtual Threads]
        Pod2[Spring Boot Pod 2<br/>Java 21 / Virtual Threads]
        Pod3[Spring Boot Pod 3<br/>Java 21 / Virtual Threads]
    end

    subgraph In-Memory & Messaging Tier
        RedisCluster[(Redis 7 Cluster<br/>Session Store, QR Nonces, Cache)]
        WSServer[WebSocket STOMP Broker<br/>Live Turnstile Sync Engine]
    end

    subgraph Data & Storage Tier
        PostgresPrimary[(PostgreSQL 16 Primary<br/>ACID Financial Ledger & PostGIS)]
        PostgresReplica[(PostgreSQL 16 Read Replica<br/>Read Queries & Analytics)]
        S3Bucket[AWS S3 Bucket<br/>Gym Images, KYC PDFs, Logos]
    end

    subgraph External Enterprise Gateways
        Razorpay[Razorpay Payment Gateway<br/>UPI, Cards, Webhooks]
        SES[AWS SES / Twilio<br/>Email OTP & SMS Notifications]
        HRMS[Enterprise HRMS Portals<br/>Workday / BambooHR SSO]
    end

    %% Client traffic
    Mobile -->|HTTPS REST| CF
    WebClient -->|HTTPS REST| CF
    AdminConsole -->|HTTPS REST| CF
    PartnerDesk -->|HTTPS REST & WSS| CF
    
    CF --> ALB
    ALB --> Ingress
    Ingress --> Pod1 & Pod2 & Pod3

    %% Spring Boot interactions
    Pod1 & Pod2 & Pod3 <-->|Atomic Nonces & Rate Limits| RedisCluster
    Pod1 & Pod2 & Pod3 -->|Write & Critical Transactions| PostgresPrimary
    Pod1 & Pod2 & Pod3 -->|Read Queries & Catalog| PostgresReplica
    PostgresPrimary -.->|Streaming Replication| PostgresReplica
    Pod1 & Pod2 & Pod3 <-->|STOMP Over WebSocket| WSServer
    WSServer <-->|Pub/Sub Bus| RedisCluster

    %% External APIs
    Pod1 & Pod2 & Pod3 <-->|Order Creation & Webhook HMAC| Razorpay
    Pod1 & Pod2 & Pod3 -->|Async Email/SMS| SES
    Pod1 & Pod2 & Pod3 <-->|Corporate SSO & Domain Sync| HRMS
    WebClient & Mobile -->|Static Assets CDN| S3Bucket
```

---

### 6.2 Core Software Design Patterns Applied in FitEmpire

To ensure maintainability, testability, and adherence to SOLID principles, the backend codebase implements the following Gang of Four (GoF) design patterns:

#### 1. Factory Pattern (`PaymentProviderFactory`)
- **Problem:** FitEmpire currently integrates Razorpay for the Indian market, but international expansion (UAE, Singapore) requires Stripe, while integration tests require a Mock Payment Provider.
- **Implementation:** An interface `PaymentProvider` exposes `createOrder()`, `verifyWebhook()`, and `refund()`. The `PaymentProviderFactory` instantiates the appropriate provider at runtime based on merchant region or configuration profile (`razorpay`, `stripe`, `mock`).

#### 2. Strategy Pattern (`MembershipPricingStrategy`)
- **Problem:** Membership pass pricing is dynamic. Retail users pay full price; corporate users receive company-subsidized rates (e.g. Google employees get 40% co-pay); college students receive 20% discounts; referrals apply instant credits.
- **Implementation:** A `PricingStrategy` interface defines `calculatePrice(User user, MembershipPlan plan)`. Concrete strategies (`RetailPricingStrategy`, `CorporateSubsidizedPricingStrategy`, `StudentPromoPricingStrategy`) are dynamically resolved at checkout without polluting controllers with nested `if-else` branches.

#### 3. Observer / Event-Driven Pattern (`Spring ApplicationEventPublisher`)
- **Problem:** When a member scans their turnstile pass, multiple secondary actions must occur: log attendance, push a live STOMP alert to the front desk, fire a push notification ("Welcome to Gold's Gym!"), and recalculate monthly streak badges. Executing all of this synchronously inside the check-in HTTP thread increases latency.
- **Implementation:** `CheckInService` completes the database check-in, then publishes a lightweight `TurnstileCheckInSuccessEvent`. Asynchronous event listeners (`@Async @EventListener`) handle push notifications, badge updates, and partner desk WebSocket broadcasts in background worker threads.

#### 4. Repository Pattern (`Spring Data JPA`)
- **Problem:** Direct SQL string concatenation in services introduces SQL injection risks, tight coupling to PostgreSQL dialects, and tedious object mapping.
- **Implementation:** Repositories extend `JpaRepository<T, ID>` and `JpaSpecificationExecutor<T>`, encapsulating database interactions behind clean Java interfaces.

#### 5. Interceptor / Decorator Pattern (`JwtAuthenticationFilter` & `TenantContextFilter`)
- **Problem:** Every HTTP request requires authentication, user context extraction, and multi-tenant scoping (ensuring gym staff cannot view records belonging to rival gyms).
- **Implementation:** A custom filter intercepts every request before reaching controllers, extracts the JWT claims, verifies the gym partner ID, and binds it to a `ThreadLocal` `SecurityContextHolder`. Controllers access the authenticated principal seamlessly via `@AuthenticationPrincipal UserPrincipal user`.
