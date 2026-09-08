---

## 8. Complete REST API Contract Specifications

FitEmpire enforces strict API standardization across all endpoints using a uniform JSON response envelope:

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "timestamp": "2026-09-08T11:45:00.123Z",
    "requestId": "req_8f1b2c3d4e5f"
  }
}
```

In the event of an error, `"success": false`, `"data": null`, and the `"error"` object is populated:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "MEMBERSHIP_FROZEN",
    "message": "Check-in denied: Your pass is currently frozen until 2026-09-15.",
    "details": {
      "membershipId": "e3b0c442-98fc-1c14-9afb-4c7c2e0b57e9",
      "frozenUntil": "2026-09-15"
    }
  },
  "meta": {
    "timestamp": "2026-09-08T11:45:00.123Z",
    "requestId": "req_9a8b7c6d5e4f"
  }
}
```

---

### Core Endpoint Contracts

#### 1. `POST /v1/auth/register`
- **Description:** Registers a new retail or corporate member.
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "ayush.gupta@fitempire.in",
  "phone": "+919876543210",
  "password": "SecurePassword@2026",
  "firstName": "Ayush",
  "lastName": "Gupta",
  "corporateWorkEmail": "ayush.g@google.com" // Optional
}
```
- **Response Status:** `201 Created`
- **Response Body:**
```json
{
  "success": true,
  "data": {
    "userId": "d7a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
    "email": "ayush.gupta@fitempire.in",
    "role": "ROLE_USER",
    "isCorporateEligible": true,
    "corporateCompany": "Google India Pvt Ltd",
    "subsidyPercentage": 40.0
  },
  "error": null,
  "meta": { "timestamp": "2026-09-08T11:45:00.123Z", "requestId": "req_01" }
}
```

---

#### 2. `POST /v1/auth/login`
- **Description:** Authenticates user credentials, returns short-lived JWT, and sets secure HttpOnly cookie for Refresh Token.
- **Request Body:**
```json
{
  "email": "ayush.gupta@fitempire.in",
  "password": "SecurePassword@2026"
}
```
- **Response Status:** `200 OK`
- **Response Headers:**  
  `Set-Cookie: refreshToken=d6b2c8a1-94e3-4f2a-bc91-231490fe7b12; Path=/v1/auth; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
- **Response Body:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": {
      "id": "d7a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
      "email": "ayush.gupta@fitempire.in",
      "firstName": "Ayush",
      "role": "ROLE_USER"
    }
  },
  "error": null,
  "meta": { "timestamp": "2026-09-08T11:45:00.123Z", "requestId": "req_02" }
}
```

---

#### 3. `GET /v1/membership/qr-token`
- **Description:** Generates an ephemeral, single-use cryptographic QR payload valid for exactly 60 seconds.
- **Request Headers:** `Authorization: Bearer <accessToken>`
- **Response Status:** `200 OK`
- **Response Body:**
```json
{
  "success": true,
  "data": {
    "qrToken": "ftemp_qr_eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkOGEy...1a2b",
    "nonce": "c9e2b10a-34f7-4821-9987-a8b23c109df4",
    "validForSeconds": 60,
    "expiresAt": "2026-09-08T11:46:00.000Z",
    "member": {
      "fullName": "Ayush Gupta",
      "tier": "PLATINUM",
      "avatarUrl": "https://cdn.fitempire.in/avatars/user123.jpg"
    }
  },
  "error": null,
  "meta": { "timestamp": "2026-09-08T11:45:00.123Z", "requestId": "req_03" }
}
```

---

#### 4. `POST /v1/partner/check-in`
- **Description:** Invoked by the partner turnstile camera scanner or receptionist barcode reader.
- **Request Headers:**  
  `Authorization: Bearer <staffOrTurnstileToken>`  
  `X-Branch-Id: b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d`
- **Request Body:**
```json
{
  "qrPayload": "ftemp_qr_eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkOGEy...1a2b",
  "turnstileSerial": "TURNSTILE_GATE_01",
  "scanMethod": "OPTICAL_BARCODE_READER"
}
```
- **Response Status:** `200 OK` (Approved) or `400 Bad Request` (Rejected)
- **Response Body:**
```json
{
  "success": true,
  "data": {
    "status": "APPROVED",
    "action": "TRIGGER_GATE_RELAY_OPEN",
    "checkInId": "e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b",
    "checkedInAt": "2026-09-08T11:45:02.450Z",
    "member": {
      "id": "d7a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
      "fullName": "Ayush Gupta",
      "membershipTier": "PLATINUM",
      "visitsThisMonth": 14
    }
  },
  "error": null,
  "meta": { "timestamp": "2026-09-08T11:45:02.450Z", "requestId": "req_04" }
}
```

---

#### 5. `POST /v1/payments/create-order`
- **Description:** Calculates corporate discounts, validates tax/GST, and registers a server-side order with Razorpay.
- **Request Headers:** `Authorization: Bearer <accessToken>`
- **Request Body:**
```json
{
  "planId": "3b7c8a1e-5f9d-4c2b-aa11-89234190fe33",
  "idempotencyKey": "order_idemp_user123_plan33_20260908"
}
```
- **Response Status:** `201 Created`
- **Response Body:**
```json
{
  "success": true,
  "data": {
    "orderId": "ord_fitempire_890123",
    "razorpayOrderId": "order_NWxQ8aZbcD123",
    "currency": "INR",
    "basePrice": 9999.00,
    "corporateSubsidyDiscount": 3999.60,
    "gstAmount": 1079.89,
    "finalPayableAmount": 7079.29,
    "razorpayKeyId": "rzp_live_FitEmpireLiveKey123"
  },
  "error": null,
  "meta": { "timestamp": "2026-09-08T11:45:00.123Z", "requestId": "req_05" }
}
```

---

#### 6. `POST /v1/payments/webhook`
- **Description:** Server-to-server Razorpay asynchronous payment capture and pass fulfillment.
- **Request Headers:**  
  `X-Razorpay-Signature: 5f8b9...hmac_sha256_hex`  
  `Content-Type: application/json`
- **Request Body:**
```json
{
  "entity": "event",
  "account_id": "acc_FitEmpire123",
  "event": "payment.captured",
  "contains": ["payment"],
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_NWxQ8aZbcD999",
        "order_id": "order_NWxQ8aZbcD123",
        "amount": 707929,
        "currency": "INR",
        "status": "captured",
        "method": "upi",
        "email": "ayush.gupta@fitempire.in"
      }
    }
  }
}
```
- **Response Status:** `200 OK`
- **Response Body:**
```json
{ "status": "WEBHOOK_ACKNOWLEDGED_AND_PROCESSED" }
```

---

#### 7. `POST /v1/classes/{classId}/book`
- **Description:** Books a slot in a group class with pessimistic database row locking to prevent overbooking.
- **Request Headers:** `Authorization: Bearer <accessToken>`
- **Request Body:**
```json
{
  "scheduleId": "7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d"
}
```
- **Response Status:** `200 OK`
- **Response Body:**
```json
{
  "success": true,
  "data": {
    "bookingId": "c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f",
    "status": "CONFIRMED",
    "classTitle": "HIIT & Core Fusion",
    "trainerName": "Vikram Rathore",
    "startTime": "2026-09-09T07:00:00.000Z",
    "remainingSlotsInClass": 4
  },
  "error": null,
  "meta": { "timestamp": "2026-09-08T11:45:00.123Z", "requestId": "req_07" }
}
```

---

#### 8. `GET /v1/gyms/explore`
- **Description:** PostGIS spatial radius search returning nearest partner gyms with amenity filters.
- **Query Parameters:**  
  `lat=12.9716&lng=77.5946&radiusKm=5.0&amenities=SWIMMING_POOL,SAUNA&minRating=4.5&limit=20`
- **Response Status:** `200 OK`
- **Response Body:**
```json
{
  "success": true,
  "data": {
    "totalCount": 8,
    "gyms": [
      {
        "id": "gym_01a2b3c4",
        "name": "Gold's Gym - Koramangala Flagship",
        "distanceKm": 1.42,
        "avgRating": 4.85,
        "totalReviews": 342,
        "currentOccupancy": 48,
        "maxCapacity": 120,
        "amenities": ["SWIMMING_POOL", "STEAM_ROOM", "CAFE", "PARKING"],
        "coverImageUrl": "https://cdn.fitempire.in/gyms/golds_koramangala.jpg"
      }
    ]
  },
  "error": null,
  "meta": { "timestamp": "2026-09-08T11:45:00.123Z", "requestId": "req_08" }
}
```
