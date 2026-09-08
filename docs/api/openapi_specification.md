# FitEmpire OpenAPI 3.0 Contract Reference

## Base URLs
- **Staging**: `https://api-staging.fitempire.tech/api/v1`
- **Production**: `https://api.fitempire.tech/api/v1`

## Authentication Scheme
All protected endpoints require an HTTP Authorization header:
```
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

## Core Endpoints
| Method | Path | Summary | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/v1/auth/login` | Authenticate user via email/password | Anonymous |
| `POST` | `/v1/auth/register` | Register new fitness member | Anonymous |
| `GET` | `/v1/gyms/explore` | Discover partner gyms and branches | Public |
| `POST` | `/v1/bookings` | Create slot reservation | Authenticated |
| `POST` | `/v1/bookings/verify-qr` | Check in member via digital pass | Partner / Staff |
| `GET` | `/v1/wallets/me` | Retrieve user digital wallet ledger | Authenticated |
