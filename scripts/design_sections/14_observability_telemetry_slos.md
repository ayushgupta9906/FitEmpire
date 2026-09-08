---

## 14. Observability, Metrics, Logging & SRE Operations (SLIs/SLOs)

### 14.1 Service Level Objectives (SLOs) & Error Budgets

FitEmpire establishes unambiguous SLOs tracked over a rolling 30-day window:

| User Flow / Boundary | Service Level Indicator (SLI) | Target SLO | 30-Day Error Budget | SRE Alert Threshold |
|---|---|---|---|---|
| **Turnstile Barrier Opening** | Check-in endpoint response latency (`POST /v1/partner/check-in`) | **p95 < 80ms<br/>p99 < 150ms** | 0.05% requests >150ms | Alert if p95 > 120ms for 2 consecutive minutes |
| **System Availability** | Ratio of HTTP 2xx/3xx/4xx vs 5xx responses across all API traffic | **99.95% Availability** | 21.6 minutes downtime / month | Alert if 5xx error rate > 0.1% over 5-minute window |
| **Payment Webhook Processing** | Percentage of Razorpay captured webhooks fulfilled within 10 seconds | **99.99% Reliability** | 0.01% unfulfilled webhooks | Alert if any webhook retry fails more than 3 times |
| **Gym Search Latency** | Spatial search API response time (`GET /v1/gyms/explore`) | **p95 < 120ms** | 0.1% queries >300ms | Alert if p95 > 250ms for 5 minutes |

---

### 14.2 The Four Golden Signals (SRE Framework)

FitEmpire instrumented the Google SRE Four Golden Signals using Spring Boot Actuator, Micrometer, and Prometheus:
1. **Latency:** `http_server_requests_seconds{uri="/v1/partner/check-in"}` histogram measuring duration buckets (25ms, 50ms, 100ms, 250ms, 500ms).
2. **Traffic:** Total Requests Per Second (RPS) broken down by route: `rate(http_server_requests_seconds_count[1m])`.
3. **Errors:** HTTP 5xx responses: `rate(http_server_requests_seconds_count{status=~"5.."}[1m])`.
4. **Saturation:**
   - HikariCP Connection Pool: Active vs Max connections (`hikaricp_connections_active / hikaricp_connections_max`).
   - JVM Memory & Garbage Collection: Heap utilization (`jvm_memory_used_bytes{area="heap"}`) and GC pause durations (`jvm_gc_pause_seconds`).
   - Redis Memory: `redis_memory_used_bytes / redis_memory_max_bytes`.

---

### 14.3 Prometheus Alerting Rules (PromQL)

The following production alerts are deployed via Prometheus Alertmanager:

```yaml
groups:
  - name: fitempire_production_alerts
    rules:
      - alert: TurnstileLatencySpike
        expr: histogram_quantile(0.99, sum(rate(http_server_requests_seconds_bucket{uri="/v1/partner/check-in"}[2m])) by (le)) > 0.200
        for: 2m
        labels:
          severity: critical
          team: core-backend
        annotations:
          summary: "Turnstile check-in p99 latency exceeded 200ms for 2 minutes!"
          description: "Physical queue buildup occurring at partner gym optical turnstiles."

      - alert: HikariConnectionPoolExhaustion
        expr: (hikaricp_connections_active / hikaricp_connections_max) > 0.85
        for: 1m
        labels:
          severity: critical
          team: database-sre
        annotations:
          summary: "PostgreSQL HikariCP connection pool is 85%+ saturated!"
          description: "Potential database connection leak or slow-query lock contention."

      - alert: RazorpayWebhookDropRateHigh
        expr: rate(payments_webhook_failures_total[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
          team: payments
        annotations:
          summary: "Razorpay payment webhooks failing or dropping!"
          description: "Members are being charged without membership pass provisioning."
```

---

### 14.4 Structured JSON Logging & Distributed Tracing (MDC)

Standard unstructured text logs are forbidden in production. All log entries are emitted in structured JSON format via Logback, injecting diagnostic context via SLF4J **Mapped Diagnostic Context (MDC)**:

```json
{
  "@timestamp": "2026-09-08T11:45:02.450Z",
  "log.level": "INFO",
  "message": "Turnstile check-in approved for member",
  "service.name": "fitempire-backend",
  "trace.id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span.id": "00f067aa0ba902b7",
  "context": {
    "userId": "d7a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
    "branchId": "b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "turnstileSerial": "TURNSTILE_GATE_01",
    "membershipTier": "PLATINUM",
    "latencyMs": 32.4
  }
}
```
Logs are shipped via AWS CloudWatch FluentBit to an ElasticSearch/OpenSearch cluster, indexed in real-time, and queryable in Kibana dashboards.
