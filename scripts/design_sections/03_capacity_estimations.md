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
- Total check-ins during peak 6 hours: `72,000 * 0.80 = 57,600 visits`.
- Total peak seconds: `6 hours * 3,600 seconds = 21,600 seconds`.
- **Average Peak Check-In QPS:** `57,600 / 21,600 = 2.67 QPS`.
- Applying a **15x Burst Multiplier** (accounting for simultaneous 07:00 AM batch class arrivals and office commute turnstile rushes):
```text
Peak Turnstile Check-In QPS = 2.67 * 15 ≈ 40 to 45 QPS
```

#### Read & Discovery Traffic (Gym Browsing, Search, Class Timetables):
- Each active user performs an average of 10 read requests per day (opening app, viewing map, checking timetable, loading profile).
- Total daily reads: `60,000 DAU * 10 = 600,000 reads / day`.
- Peak read window (12 hours): `600,000 / (12 * 3,600) = 13.88 QPS average`.
- Applying an **8x Peak Factor**:
```text
Peak Read QPS = 13.88 * 8 ≈ 111 QPS
```

#### Combined Total System QPS:
- Read QPS: ~111 QPS.
- Write / Mutate QPS (Check-ins, bookings, payments): ~45 QPS.
- Total Peak Traffic: **~156 QPS** (Well within capacity of 2-3 standard Spring Boot pods and 1 modern PostgreSQL replica).

---

### 3.3 Database Storage Calculations (5-Year Forecast)

| Table Entity | Rows / Year | Row Size (Bytes) | 1-Year Storage | 5-Year Storage |
|---|---|---|---|---|
| `users` | 200,000 | 1,024 (1 KB) | 0.20 GB | 1.00 GB |
| `attendance_records` | 26,280,000 | 500 B | 13.14 GB | 65.70 GB |
| `class_bookings` | 7,300,000 | 400 B | 2.92 GB | 14.60 GB |
| `orders` & `order_items` | 2,400,000 | 1,500 B | 3.60 GB | 18.00 GB |
| `wallet_ledger` | 10,000,000 | 350 B | 3.50 GB | 17.50 GB |
| `audit_logs` & Telemetry | 40,000,000 | 300 B | 12.00 GB | 60.00 GB |
| **Subtotal Raw Data** | - | - | **35.36 GB** | **176.80 GB** |
| **Index Overhead (35%)**| - | - | **12.38 GB** | **61.88 GB** |
| **Grand Total Storage** | - | - | **47.74 GB** | **238.68 GB** |

**Storage Architecture Decision:**  
A 5-year storage projection of ~239 GB is remarkably compact and easily managed on an AWS RDS EBS gp3 volume. Sharding is neither necessary nor recommended at this stage. Instead, **Table Partitioning by Range (Monthly)** on the `attendance_records` and `audit_logs` tables ensures query performance remains blazing fast without table scan degradation.

---

### 3.4 In-Memory Cache Sizing (Redis 7)

Redis holds ephemeral, high-throughput session and security state:
1. **Dynamic QR Check-In Nonces:**
   - 45 check-ins/sec with 60-second TTL = 2,700 active keys at any given moment.
   - Key-value size: `uuid + json metadata` = 512 bytes.
   - Memory = `2,700 * 512 bytes ≈ 1.38 MB`.
2. **Active Member Entitlement Cache (DAU Pass Status):**
   - 60,000 DAU * 1.2 KB (membership tier, freeze status, wallet balance, active booking IDs) = **72.00 MB**.
3. **Gym Geo-Index & Facility Details:**
   - 500 gyms * 50 KB (location, pictures, timetable, amenities) = **25.00 MB**.
4. **API Rate Limiting Sliding Windows:**
   - 100,000 unique IP/user buckets * 64 bytes = **6.40 MB**.

```text
Total Redis Active Working Set = 1.38 MB + 72.00 MB + 25.00 MB + 6.40 MB ≈ 104.78 MB
```
Applying a **4x safety buffer** for Redis internal hash table pointers, replication backlogs, and memory fragmentation:
```text
Recommended Redis Capacity = 104.78 MB * 4 ≈ 419 MB
```
An AWS ElastiCache `cache.t4g.medium` (3.09 GB RAM) provides over **7x headroom**, ensuring zero eviction pressure and single-digit millisecond latency.

---

### 3.5 Network Ingress / Egress Bandwidth Budget

- **Peak Ingress:** 156 QPS * 2 KB avg request payload = `312 KB/sec = 2.5 Mbps`.
- **Peak Egress:** 156 QPS * 15 KB avg JSON response payload = `2.34 MB/sec = 18.72 Mbps`.
- **Monthly Bandwidth Transfer:**
```text
Average 8 Mbps continuous egress * 3,600 * 24 * 30 days ≈ 2.59 TB / month
```
Static assets (gym images, branding logos, trainer photos) are offloaded to Cloudflare CDN backed by AWS S3, reducing backend server egress by over 85%.
