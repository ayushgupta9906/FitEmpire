# 📱 FitEmpire - Complete App Architecture & Android Studio Development Guide

Welcome to the master technical blueprint for the **FitEmpire Mobile Application**. 

Whether you are opening the existing project in **Android Studio** or rewriting/extending native Android components using **Kotlin / Java**, this guide documents **every single screen, business logic flow, data model, and API endpoint** in the entire FitEmpire platform.

---

## 📑 Table of Contents
1. [Platform Overview & Core Concept](#1-platform-overview--core-concept)
2. [Developing in Android Studio (The Two Approaches)](#2-developing-in-android-studio-the-two-approaches)
   - [Approach A: Open & Run the Current App in Android Studio (Prebuild)](#approach-a-open--run-current-project-in-android-studio)
   - [Approach B: Pure Native Android Development (Kotlin/Java)](#approach-b-pure-native-android-development-from-scratch)
3. [Complete Screen-by-Screen Breakdown & UX Flows](#3-complete-screen-by-screen-breakdown--ux-flows)
   - [1. Authentication & Onboarding](#1-authentication--onboarding)
   - [2. Home Dashboard](#2-home-dashboard)
   - [3. Explore & Gym Discovery](#3-explore--gym-discovery)
   - [4. Gym Detail & Slot Selection](#4-gym-detail--slot-selection)
   - [5. Classes & Studio Sessions](#5-classes--studio-sessions)
   - [6. Digital Entry Ticket & QR Check-in](#6-digital-entry-ticket--qr-check-in)
   - [7. Wallet & FitCoins](#7-wallet--fitcoins)
   - [8. User Profile & Health Metrics](#8-user-profile--health-metrics)
   - [9. Memberships & Freeze/Unfreeze Pass](#9-memberships--freezeunfreeze-pass)
   - [10. My Bookings Management](#10-my-bookings-management)
   - [11. Additional Ecosystem Modules (AI, Store, TV, HRA, Corporate)](#11-additional-ecosystem-modules)
4. [Complete Backend REST API Reference](#4-complete-backend-rest-api-reference)
5. [Native Kotlin Implementation Blueprint (Retrofit & Models)](#5-native-kotlin-implementation-blueprint)
6. [Generating Signed APKs in Android Studio](#6-generating-signed-apks-in-android-studio)

---

## 1. Platform Overview & Core Concept

**FitEmpire** is a dual-sided, pan-India fitness marketplace and all-access gym membership network (inspired by the Cult.fit and Fitpass models).

### Key Value Propositions
* **All-Access Gym Pass:** A single subscription unlocks 12,000+ partnered gyms, CrossFit boxes, MMA arenas, badminton courts, and swimming pools across India.
* **Pay-As-You-Go Credits:** Users who do not want monthly subscriptions can buy flexible 10-credit bundles valid for 90 days.
* **Seamless QR Turnstile Check-In:** Users scan a gym's QR or display their dynamic 60-second in-app entry pass at the turnstile to gain access.
* **Integrated Wellness Ecosystem:**
  * **FitFeast:** Nutrition tracking & custom diet consultations.
  * **FitCoach / ARIA:** AI workout generator based on user muscle targets and fitness levels.
  * **FitEmpire TV:** On-demand HD follow-along workout videos.
  * **FitEmpire Store:** Supplements, apparel, and gym accessories.
  * **Corporate Wellness:** Special employee subsidies for partnered corporations.

### Live Production Endpoints
* **Backend API Base URL:** `https://ayush150152-fitempire-api.hf.space/api/v1`
* **Mobile Web App:** `https://fitempiremobile.vercel.app`
* **Partner Portal:** `https://fitempirepartner.vercel.app`
* **Main Landing Site:** `https://fitempire.tech`

---

## 2. Developing in Android Studio (The Two Approaches)

### Approach A: Open & Run Current Project in Android Studio
The current mobile app in `fitempire-mobile/` is built with React Native. You do **not** need Expo CLI or web tools to run it — Expo generates a standard native Android Studio project using `expo prebuild`.

#### Step-by-Step Instructions:

1. **Open PowerShell/Terminal** and navigate to `fitempire-mobile`:
   ```bash
   cd fitempire-mobile
   ```

2. **Generate the Native Android Project Folder**:
   ```bash
   npx expo prebuild --platform android
   ```
   *This command automatically creates the `fitempire-mobile/android/` directory containing native `build.gradle`, `settings.gradle`, `AndroidManifest.xml`, and native Java/Kotlin wrappers.*

3. **Open in Android Studio**:
   - Launch **Android Studio**.
   - Click **Open** (or `File -> Open`).
   - Browse to: `c:\Users\ayush-g\Desktop\FitEmpire\fitempire-mobile\android`.
   - Click **OK**.

4. **Gradle Sync**:
   - Android Studio will immediately begin downloading dependencies and syncing Gradle.
   - If prompted for Android SDK or Build-Tools, click **Install missing platform(s) and sync project**.

5. **Run the App**:
   - Start an Android Emulator in Android Studio (Device Manager -> Play) OR connect a physical Android phone via USB (with USB Debugging turned ON).
   - In a terminal inside `fitempire-mobile/`, start the Metro bundler:
     ```bash
     npm start
     ```
   - In Android Studio, click the green **Run 'app'** button (Shift + F10).
   - The app will compile natively and install directly onto your device.

---

### Approach B: Pure Native Android Development from Scratch
If you want to build a completely native Android application in Android Studio using **Kotlin**, **Jetpack Compose** or **XML Layouts**, and **Retrofit**, this document provides every single contract you need.

#### Recommended Native Tech Stack:
* **Language:** Kotlin 2.0+
* **UI Toolkit:** Jetpack Compose (recommended) or XML with Material Components 3
* **Architecture:** MVVM + Clean Architecture (Repository Pattern)
* **Networking:** Retrofit 2 + OkHttp 4 (with Logging Interceptor)
* **Image Loading:** Coil (`io.coil-kt:coil-compose`)
* **Local Storage:** Android Jetpack DataStore / EncryptedSharedPreferences (for JWT Tokens)
* **QR Scanner:** CameraX + Google ML Kit Barcode Scanning
* **Dependency Injection:** Hilt / Dagger

---

## 3. Complete Screen-by-Screen Breakdown & UX Flows

### 1. Authentication & Onboarding
* **File:** `fitempire-mobile/src/app/login.tsx` & `index.tsx`
* **Flows:**
  1. **Phone OTP Flow (Primary):**
     - User inputs 10-digit Indian phone number (`+91`).
     - App calls `POST /auth/otp/send` with `{ "phone": "9876543210", "purpose": "LOGIN" }`.
     - App navigates to 6-digit OTP verification screen.
     - User enters OTP; app calls `POST /auth/otp/verify`.
     - Response returns `{ "accessToken": "...", "refreshToken": "...", "user": { ... } }`.
  2. **Email & Password Flow (Secondary):**
     - User toggles to email login.
     - Calls `POST /auth/login` with `{ "email": "...", "password": "..." }`.
  3. **Token Management:**
     - Save `accessToken` and `refreshToken` securely in local storage.
     - All subsequent requests append header: `Authorization: Bearer <accessToken>`.
     - When an API call returns `401 Unauthorized`, interceptor calls `POST /auth/refresh` with header `X-Refresh-Token: <refreshToken>` to retrieve a fresh token.

---

### 2. Home Dashboard
* **File:** `fitempire-mobile/src/app/(tabs)/index.tsx`
* **UI Components:**
  1. **Top Header:** Greeting with user's first name, active membership tier pill, notification bell, and FitCoins balance.
  2. **Quick Action Carousel:**
     - **Scan QR Code:** Jumps directly to turnstile QR scanner.
     - **Book Session:** Quick jump to Explore/Classes.
     - **Upgrade Pass:** Opens Membership pricing screen.
  3. **Nearby Gyms & Studios:**
     - Horizontally scrolling cards fetched from `GET /gyms` or `GET /gyms/nearby`.
     - Displays cover photo, gym name, verified badge, rating (e.g. 4.9 ★), and distance in km.
  4. **FitEmpire TV (Virtual Workouts):**
     - Video carousel fetched from `GET /ecosystem/tv/videos`.
     - Displays thumbnail, workout title, trainer, and duration.
  5. **Recommended Nutrition & Gear:**
     - E-commerce showcase fetched from `GET /ecosystem/store/products`.
     - Displays product image, title, and price in INR.
  6. **Daily Streaks & Motivation:**
     - Visual workout streak counter (e.g., 5-day streak 🔥).

---

### 3. Explore & Gym Discovery
* **File:** `fitempire-mobile/src/app/(tabs)/explore.tsx`
* **Features:**
  1. **Location Bar:** Shows current locality (e.g. "Sector 168, Noida") with a drop-down to change city/sector.
  2. **Search Input:** Real-time query search matching gym name or address.
  3. **Sport Categories Tabs:**
     - Badminton, Gym / Weights, Swimming, Football Turf, Box Cricket, MMA / Boxing, Yoga, Basketball, Table Tennis.
  4. **Filter Row:** Rating filter (★ 4.0+), Open Now, Verified Gyms only.
  5. **Venue Card Details:**
     - High-res cover image.
     - Verified Gym checkmark.
     - Gym name & locality address.
     - Distance from user (e.g. "1.4 km").
     - Favorite bookmark heart toggle.
     - Tapping opens **Gym Detail Screen**.

---

### 4. Gym Detail & Slot Selection
* **File:** `fitempire-mobile/src/app/gym-detail.tsx`
* **Features:**
  - Full-width image gallery carousel.
  - Gym name, address, working hours (e.g. "06:00 AM - 10:30 PM").
  - **Amenities Pills:** Air Conditioning, Clean Showers, Lockers, Free WiFi, Steam Bath, Parking.
  - **Trainers Section:** Certified coaches at this facility.
  - **Action Button:** "Book Workout Slot" -> routes to `booking.tsx`.

---

### 5. Classes & Studio Sessions
* **File:** `fitempire-mobile/src/app/(tabs)/classes.tsx`
* **Features:**
  - **Horizontal Date Strip:** Select today or upcoming 6 days.
  - **Category Pills:** All, Zumba, HIIT, Power Yoga, Strength, CrossFit.
  - **Class Cards:**
    - Time slot (e.g. "07:00 AM - 08:00 AM").
    - Class name & intensity badge.
    - Trainer name and photo.
    - Available spots counter (e.g. "4 spots left").
    - Host gym name.
    - "Book Slot" button: Submits `POST /bookings` with `bookingType: "CLASS"`.

---

### 6. Digital Entry Ticket & QR Check-in
* **Files:** `fitempire-mobile/src/app/(tabs)/ticket.tsx` & `qr-checkin.tsx`
* **Modes:**
  1. **My Entry Pass (Show QR):**
     - Renders dynamic QR Code containing unique user session token.
     - 60-second countdown timer auto-refreshes the token to prevent screenshot sharing.
     - Displays booked venue name, date, and user ID.
     - Gym front-desk scanner scans this QR to check member in.
  2. **Scan Venue QR (Scan Turnstile):**
     - Uses device camera to scan the QR printed on the gym's turnstile or front desk.
     - App sends scanned payload to backend: verifies membership validity.
     - Unlocks turnstile with green confirmation animation: *"Turnstile Unlocked! 🟢 Welcome to Iron Culture Gym. +50 FitCoins added to your wallet."*

---

### 7. Wallet & FitCoins
* **File:** `fitempire-mobile/src/app/(tabs)/wallet.tsx`
* **Features:**
  1. **Wallet Balance Card:** Displays current INR balance (e.g. `₹500.00`).
  2. **FitCoins Reward Card:** Displays gamified coins earned from workouts.
  3. **Top-Up Modal:**
     - Quick amount chips (`+₹500`, `+₹1000`, `+₹2000`).
     - Calls `POST /wallets/me/top-up` with selected amount.
  4. **Passbook / Transaction Ledger:**
     - Fetched via `GET /wallets/me/transactions`.
     - Displays list with Green `+` for credits (Top-ups, refunds, rewards) and Red `-` for debits (session bookings, store purchases).

---

### 8. User Profile & Health Metrics
* **File:** `fitempire-mobile/src/app/(tabs)/profile.tsx`
* **Features:**
  1. **User Identity:** Avatar (initials badge or custom uploaded photo), Full Name, Phone/Email, Member ID.
  2. **Biometric Health Metrics:**
     - **Height:** Displayed in Feet/Inches (e.g. `5'9"`).
     - **Weight:** Displayed in kg (e.g. `78.5 kg`).
     - **BMI:** Automatically calculated: `Weight (kg) / (Height (m))^2`.
  3. **Active Membership Status:**
     - Shows current plan (e.g. "FitEmpire 360", "Off-Peak Pass", or "No Active Plan").
     - Expiry date display.
     - 1-tap "Manage Membership" shortcut.
  4. **Account Menu Items:**
     - **My Bookings:** View history of sessions.
     - **Gift a Pass:** Send workout credits to friends.
     - **Health Risk Assessment (HRA):** Complete health questionnaire.
     - **Corporate Benefits:** Check company email eligibility.
     - **FitEmpire Store Orders:** Track supplement orders.
     - **Settings & Notifications:** Push notification preferences.
     - **Log Out:** Clears JWT tokens and redirects to login screen.

---

### 9. Memberships & Freeze/Unfreeze Pass
* **File:** `fitempire-mobile/src/app/membership.tsx`
* **Features:**
  1. **Active Pass Status:** Shows currently active pass, days remaining, and freeze status.
  2. **1-Tap Pause / Freeze Protection:**
     - Allows users traveling or taking a break to pause their pass.
     - Calls `POST /memberships/{id}/freeze` / `unfreeze`.
     - Days frozen are rolled over to the user's expiration date.
  3. **Plans Catalog:**
     - **Empire Flexi-Credits:** 10 sessions @ ₹499 (Pay-as-you-go, 90-day validity).
     - **Happy Hours Off-Peak Pass:** Unlimited 11AM - 4:30PM @ ₹599/mo.
     - **FitEmpire 90:** 3-month pass @ ₹2,699.
     - **FitEmpire 180:** 6-month pass @ ₹4,799.
     - **FitEmpire 360:** Annual unlimited pass @ ₹7,999 (Includes AI Coach, FitFeast, and 5 buddy passes).
     - **Duo Buddy Pass:** 2 accounts @ ₹1,599/mo.
  4. **Purchase Action:** Calls `POST /payments/order` with `planId` to activate membership.

---

### 10. My Bookings Management
* **File:** `fitempire-mobile/src/app/my-bookings.tsx`
* **Features:**
  1. **Metrics Summary:** Total Bookings, Confirmed, Cancelled counts computed from real backend data.
  2. **Upcoming Booking Card:** Highlights next scheduled workout with venue address, time, and 1-tap entry QR button.
  3. **Empty State:** If user has no bookings, displays an illustrative empty state with an "Explore Gyms" call to action.
  4. **Cancellation Flow:** Prompts confirmation dialog and calls `POST /bookings/{id}/cancel` to release slot.

---

### 11. Additional Ecosystem Modules
* **AI Workout Coach (`ai-workout.tsx`):**
  - User selects target goal (Weight Loss, Muscle Hypertrophy, Endurance, Mobility).
  - Selects workout duration and available equipment.
  - Calls `POST /ai/recommendations/workout` to generate full rep-and-set workout routines.
* **FitEmpire Store (`store.tsx`):**
  - Supplements (Whey, Creatine, BCAAs), Gym Equipment, Apparel.
  - Fetched from `GET /ecosystem/store/products`.
* **FitEmpire TV (`tv.tsx`):**
  - HD follow-along workouts categorized by Yoga, HIIT, Dance Cardio, and Strength.
  - Fetched from `GET /ecosystem/tv/videos`.
* **Corporate Wellness (`corporate.tsx`):**
  - Employee verification via corporate email (`POST /ecosystem/corporate/verify`).
* **Health Risk Assessment (`onboarding-hra.tsx`):**
  - 10-step lifestyle questionnaire calculating metabolic risk score and personalized workout recommendations.

---

## 4. Complete Backend REST API Reference

**Base URL:** `https://ayush150152-fitempire-api.hf.space/api/v1`

All authenticated endpoints require header:
```http
Authorization: Bearer <jwt_access_token>
Content-Type: application/json
```

### 1. Authentication (`/auth`)
| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/auth/login` | Email & password login | `{"email":"...","password":"..."}` |
| `POST` | `/auth/register` | User account creation | `{"firstName":"...","email":"...","password":"..."}` |
| `POST` | `/auth/otp/send` | Send 6-digit SMS OTP | `{"phone":"9876543210","purpose":"LOGIN"}` |
| `POST` | `/auth/otp/verify` | Verify SMS OTP | `{"phone":"9876543210","otp":"123456","purpose":"LOGIN"}` |
| `POST` | `/auth/refresh` | Refresh expired JWT | *Requires `X-Refresh-Token` header* |
| `POST` | `/auth/forgot-password`| Request reset OTP | `{"email":"..."}` |
| `POST` | `/auth/reset-password` | Set new password with OTP | `{"email":"...","otp":"...","newPassword":"..."}` |

### 2. User Profile (`/users`)
| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/users/profile/me` | Get current logged-in user | None |
| `PUT` | `/users/profile/me` | Update bio, height, weight | `{"heightCm":175,"weightKg":75.5,"fitnessGoal":"FAT_LOSS"}` |
| `POST` | `/users/profile/avatar` | Upload profile photo | `multipart/form-data` (file) |

### 3. Gyms & Venues (`/gyms`)
| Method | Endpoint | Query Parameters | Description |
|---|---|---|---|
| `GET` | `/gyms` | `page=0&size=20&query=...&city=...` | Search and filter active gyms |
| `GET` | `/gyms/nearby` | `latitude=28.5&longitude=77.3&radius=10` | Fetch gyms sorted by proximity |
| `GET` | `/gyms/{id}` | None | Full details, photos, amenities of gym |
| `GET` | `/gyms/{id}/branches` | None | Branch locations for multi-center gyms |
| `GET` | `/gyms/featured` | None | Featured / premium gyms |

### 4. Classes & Schedules (`/classes`)
| Method | Endpoint | Query Parameters | Description |
|---|---|---|---|
| `GET` | `/classes/schedules/branch/{branchId}` | `date=YYYY-MM-DD` | List available group class schedules |
| `POST` | `/bookings` | None | Book a slot (`bookingType: "CLASS"`) |

### 5. Bookings (`/bookings`)
| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/bookings` | Create gym or class booking | `{"gymId":"...","branchId":"...","bookingType":"GYM_ACCESS","bookingDate":"2026-09-04"}` |
| `GET` | `/bookings/my` | User's booking history | Query: `page=0&size=20` |
| `POST` | `/bookings/{id}/cancel` | Cancel booking reservation | Query: `reason=...` |
| `GET` | `/bookings/{id}/qr` | Retrieve dynamic check-in token | Query: `userId=...` |

### 6. Memberships (`/memberships`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/memberships/plans` | Fetch all public membership plans |
| `GET` | `/memberships/plans/{id}` | Plan details by ID |
| `GET` | `/memberships/my` | All user's purchased memberships |
| `GET` | `/memberships/my/active` | Current active membership pass |
| `POST` | `/memberships/{id}/freeze` | Pause membership validity |
| `POST` | `/memberships/{id}/unfreeze` | Resume paused membership |

### 7. Payments (`/payments`)
| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/payments/order` | Create order for membership purchase | `{"planId":"...","walletAmount":0,"discount":0}` |
| `POST` | `/payments/verify` | Verify Razorpay payment signature | `{"paymentId":"...","razorpayOrderId":"...","razorpayPaymentId":"...","razorpaySignature":"..."}` |
| `GET` | `/payments/my` | Payment invoices & history | None |

### 8. Wallet (`/wallets`)
| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/wallets/me` | Fetch wallet balance & reward coins | None |
| `GET` | `/wallets/me/transactions` | Wallet transaction ledger | Query: `page=0&size=20` |
| `POST` | `/wallets/me/top-up` | Top-up wallet funds | `{"amount":500,"paymentMethod":"UPI"}` |

### 9. Ecosystem (`/ecosystem`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/ecosystem/store/products` | E-commerce supplements, accessories |
| `GET` | `/ecosystem/tv/videos` | Workout video tutorials & classes |
| `POST` | `/ecosystem/corporate/verify` | Verify corporate work email |

### 10. AI Recommendation Engine (`/ai`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/ai/recommendations` | Get active workout/diet recommendation |
| `POST` | `/ai/recommendations/workout` | Generate custom workout routine |
| `POST` | `/ai/recommendations/nutrition` | Generate macro & meal suggestions |

---

## 5. Native Kotlin Implementation Blueprint

If you are developing in **Android Studio** with pure Kotlin, here are ready-to-use boilerplate templates:

### 1. Retrofit API Client (`ApiClient.kt`)
```kotlin
package com.fitempire.network

import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    private const val BASE_URL = "https://ayush150152-fitempire-api.hf.space/api/v1/"
    
    var authToken: String? = null

    private val authInterceptor = Interceptor { chain ->
        val original = chain.request()
        val builder = original.newBuilder()
            .header("Content-Type", "application/json")
            .header("Accept", "application/json")
        
        authToken?.let { token ->
            builder.header("Authorization", "Bearer $token")
        }
        
        chain.proceed(builder.build())
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(authInterceptor)
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        })
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(15, TimeUnit.SECONDS)
        .build()

    val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    val apiService: FitEmpireApiService = retrofit.create(FitEmpireApiService::class.java)
}
```

### 2. Retrofit API Interface (`FitEmpireApiService.kt`)
```kotlin
package com.fitempire.network

import com.fitempire.models.*
import retrofit2.Response
import retrofit2.http.*

interface FitEmpireApiService {

    // Auth
    @POST("auth/otp/send")
    suspend fun sendOtp(@Body request: OtpRequest): Response<ApiResponse<String>>

    @POST("auth/otp/verify")
    suspend fun verifyOtp(@Body request: OtpVerifyRequest): Response<ApiResponse<AuthResponse>>

    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<ApiResponse<AuthResponse>>

    // User Profile
    @GET("users/profile/me")
    suspend fun getProfile(): Response<ApiResponse<UserProfile>>

    // Gyms
    @GET("gyms")
    suspend fun getGyms(
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20,
        @Query("query") query: String? = null,
        @Query("city") city: String? = null
    ): Response<ApiResponse<PageResponse<GymItem>>>

    @GET("gyms/{id}")
    suspend fun getGymDetail(@Path("id") gymId: String): Response<ApiResponse<GymDetail>>

    // Bookings
    @POST("bookings")
    suspend fun createBooking(@Body request: CreateBookingRequest): Response<ApiResponse<BookingRecord>>

    @GET("bookings/my")
    suspend fun getMyBookings(
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20
    ): Response<ApiResponse<PageResponse<BookingRecord>>>

    @POST("bookings/{id}/cancel")
    suspend fun cancelBooking(
        @Path("id") bookingId: String,
        @Query("reason") reason: String = "User cancelled"
    ): Response<ApiResponse<Void>>

    // Memberships
    @GET("memberships/plans")
    suspend fun getMembershipPlans(): Response<ApiResponse<List<MembershipPlan>>>

    @GET("memberships/my/active")
    suspend fun getActiveMembership(): Response<ApiResponse<ActiveMembership?>>

    // Wallet
    @GET("wallets/me")
    suspend fun getWalletInfo(): Response<ApiResponse<WalletInfo>>

    @POST("wallets/me/top-up")
    suspend fun topUpWallet(@Body request: TopUpRequest): Response<ApiResponse<WalletTransaction>>

    // Ecosystem
    @GET("ecosystem/store/products")
    suspend fun getStoreProducts(): Response<ApiResponse<List<StoreProduct>>>

    @GET("ecosystem/tv/videos")
    suspend fun getVideoClasses(): Response<ApiResponse<List<VideoClass>>>
}
```

### 3. Core Data Models (`Models.kt`)
```kotlin
package com.fitempire.models

data class ApiResponse<T>(
    val success: Boolean,
    val message: String?,
    val data: T?
)

data class PageResponse<T>(
    val content: List<T>,
    val totalElements: Long,
    val totalPages: Int,
    val number: Int
)

data class AuthResponse(
    val accessToken: String,
    val refreshToken: String,
    val user: UserProfile
)

data class UserProfile(
    val id: String,
    val firstName: String,
    val lastName: String?,
    val phone: String?,
    val email: String?,
    val avatarUrl: String?,
    val heightCm: Double?,
    val weightKg: Double?,
    val fitnessGoal: String?,
    val createdAt: String?
)

data class GymItem(
    val id: String,
    val name: String,
    val category: String?,
    val coverImageUrl: String?,
    val avgRating: Double?,
    val branches: List<GymBranch>?
)

data class GymBranch(
    val id: String,
    val addressLine1: String?,
    val city: String?,
    val state: String?,
    val pincode: String?,
    val distanceKm: Double?
)

data class BookingRecord(
    val id: String,
    val gymId: String,
    val gymName: String?,
    val branchName: String?,
    val bookingType: String,
    val bookingDate: String,
    val startTime: String?,
    val status: String
)

data class MembershipPlan(
    val id: String,
    val name: String,
    val price: Double,
    val durationDays: Int,
    val description: String?,
    val features: List<String>?
)

data class ActiveMembership(
    val id: String,
    val planName: String,
    val startDate: String,
    val endDate: String,
    val status: String
)

data class WalletInfo(
    val balance: Double,
    val rewardPoints: Int
)
```

---

## 6. Generating Signed APKs in Android Studio

When your app is ready for testing or publishing, follow these steps in **Android Studio**:

### 1. Generate a Debug APK (For Quick Testing on Your Phone)
1. In Android Studio, go to the top menu: **Build -> Build Bundle(s) / APK(s) -> Build APK(s)**.
2. Wait for Gradle to finish compiling.
3. A notification will appear at the bottom right: *"APK(s) generated successfully for 1 module"*.
4. Click **locate**.
5. You will find `app-debug.apk` ready to install on any Android phone!

### 2. Generate a Release APK (For Play Store or Distribution)
1. Go to **Build -> Generate Signed Bundle / APK...**
2. Choose **APK** (or **Android App Bundle** if uploading to Google Play Console).
3. Click **Next**.
4. **Key store path:** Click **Create new...**
   - Choose a path on your PC (e.g., `c:\Users\ayush-g\fitempire-keystore.jks`).
   - Enter a password, Key alias (e.g., `fitempire`), and your name/organization.
5. Select **release** build variant.
6. Check **V1 (Jar Signature)** and **V2 (Full APK Signature)**.
7. Click **Finish**.
8. Android Studio compiles the optimized release APK:
   `app/release/app-release.apk`.

---

## 🚀 Quick Launch Summary

| Task | Command / Action |
|---|---|
| **Run Current App Locally** | `cd fitempire-mobile && npm start` |
| **Generate Android Project** | `cd fitempire-mobile && npx expo prebuild --platform android` |
| **Open in Android Studio** | Open folder `fitempire-mobile/android` in Android Studio |
| **Build APK via EAS Cloud** | `cd fitempire-mobile && npx eas-cli build --platform android --profile preview` |
| **Backend Swagger Docs** | `https://ayush150152-fitempire-api.hf.space/swagger-ui/index.html` |
| **Live Production User App** | [https://fitempiremobile.vercel.app](https://fitempiremobile.vercel.app) |
