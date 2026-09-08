---

## 13. High Availability (HA), Fault Tolerance & Disaster Recovery (HA/DR)

### 13.1 Circuit Breakers & Resilience (Resilience4j)

Downstream third-party integrations (payment gateways, SMS providers, email delivery) can experience degradation or catastrophic outages. Without circuit breakers, slow third-party calls exhaust thread pools, cascading into a total FitEmpire system crash.

FitEmpire integrates **Resilience4j** across all external outbound HTTP calls:

```yaml
resilience4j:
  circuitbreaker:
    instances:
      razorpayService:
        sliding-window-type: COUNT_BASED
        sliding-window-size: 20
        failure-rate-threshold: 50.0 # Open circuit if 50% of last 20 calls fail
        slow-call-rate-threshold: 70.0
        slow-call-duration-threshold: 3000ms
        wait-duration-in-open-state: 15000ms
        permitted-number-of-calls-in-half-open-state: 5
      emailNotificationService:
        sliding-window-size: 10
        failure-rate-threshold: 60.0
        wait-duration-in-open-state: 30000ms
```

- **Open State Behavior:** When Razorpay or AWS SES experiences an outage, the circuit opens immediately. Calls to that service fail fast (~1ms) without blocking threads, triggering a fallback response (e.g. queue email for retry in SQS).
- **Half-Open Probe:** After 15 seconds, 5 probe requests test downstream health. If successful, the circuit closes and normal traffic resumes automatically.

---

### 13.2 High Availability (HA) Topology & Multi-AZ Infrastructure

```text
AWS ap-south-1 (Mumbai Region)
├── Availability Zone 1 (ap-south-1a)
│   ├── Kubernetes Worker Node 1 (Spring Boot Pod 1)
│   ├── Redis Cluster Master Node 1
│   └── PostgreSQL RDS Primary (Read / Write)
├── Availability Zone 2 (ap-south-1b)
│   ├── Kubernetes Worker Node 2 (Spring Boot Pod 2)
│   ├── Redis Cluster Master Node 2
│   └── PostgreSQL RDS Synchronous Standby (Auto-Failover Target)
└── Availability Zone 3 (ap-south-1c)
    ├── Kubernetes Worker Node 3 (Spring Boot Pod 3)
    ├── Redis Cluster Replica Node
    └── PostgreSQL Read Replica (Analytics & Reporting)
```

#### Recovery Targets:
- **Recovery Point Objective (RPO):** **0 seconds** for financial transactions (synchronous block-level replication to AZ2 standby); <1 minute for reporting replica.
- **Recovery Time Objective (RTO):**
  - Compute Pod Failure: **<5 seconds** (Kubernetes restarts pod or redirects traffic to healthy pods).
  - Redis Master Failure: **<10 seconds** (Redis Sentinel / Cluster elects new master).
  - PostgreSQL Primary Failure: **<60 seconds** (AWS RDS automatically flips DNS CNAME to the synchronous standby in AZ2).

---

### 13.3 Offline Turnstile Fallback Mode (15-Minute Network Outage Defense)

#### The Problem:
If a partner gym loses broadband internet connectivity, or AWS experiences a temporary networking partition, optical turnstiles must not lock members out of the gym, creating physical safety hazards and crowd disturbances.

#### The Architectural Solution:
1. **Local Turnstile Edge Cache:** Every partner desk client / turnstile Raspberry Pi maintains a local SQLite database holding the active member whitelist for that specific branch.
2. **Local Cryptographic Verification:** Since the dynamic QR code is a signed JWT containing the user ID, branch ID, and expiration timestamp, the turnstile scanner can verify the JWT signature using a pre-provisioned public key **completely offline**.
3. **Store-and-Forward Attendance Queue:** Approved offline check-in events are written to a local queue. Once internet connectivity is restored, the client flushes the queued records to `POST /v1/partner/check-in/batch-sync`.
