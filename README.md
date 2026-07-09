# 🏋️‍♂️ FitEmpire - Next-Gen Premium Fitness Ecosystem

FitEmpire is India's next-generation premium fitness membership platform. It allows users to discover gyms, buy memberships, book workout classes, check-in using QR codes, earn rewards, get AI-powered fitness recommendations, and manage their entire fitness journey from a single unified application.

This repository is a **production-ready full-stack monorepo** consisting of a Spring Boot backend API, a React Native mobile application, a React/Vite admin management dashboard, and a side-by-side interactive showcase console.

---

## 🏗️ System Architecture & Monorepo Structure

The project is structured as a monorepo containing the following components:

```
FitEmpire/
├── fitempire-backend/     # Java Spring Boot 3 API Server
├── fitempire-mobile/      # React Native Expo Mobile Application (Web, iOS, Android)
├── fitempire-admin/       # React / Vite Admin Dashboard
├── fitempire-showcase/    # HTML Side-by-side Showcase Console
└── start-all.bat          # Double-click script to run all services locally
```

---

## 🛠️ Technology Stack

### 1. Backend API (`fitempire-backend`)
*   **Core:** Java 21, Spring Boot 3.2.5, Spring MVC
*   **Security:** Spring Security (Stateless JWT Authentication), CORS Filters
*   **Database & ORM:** PostgreSQL (hosted on **Neon Database** serverless Postgres), JPA / Hibernate
*   **Third-party APIs:** **Twilio SMS Gateway** (OTP sending via phone numbers and Messaging Services)
*   **Documentation:** Springdoc OpenAPI / Swagger UI
*   **Build Tool:** Maven

### 2. Mobile App (`fitempire-mobile`)
*   **Core:** React Native, **Expo SDK 57** (managed workflow)
*   **Navigation:** Expo Router (File-based routing)
*   **Networking:** Axios (with interceptors for auth tokens and dynamic base URLs)
*   **State & Storage:** React Context, React Native Async Storage
*   **Branding & UI:** Custom vector layouts, Lucide icons, and responsive desktop browser device wrappers

### 3. Admin Dashboard (`fitempire-admin`)
*   **Core:** React 19, Vite 8, TypeScript
*   **Design System:** Material UI (MUI v9) styled with a premium dark theme
*   **State Management:** Redux Toolkit (RTK)
*   **Charts & Visualizations:** Recharts (responsive analytics panels)

### 4. Interactive Showcase Console (`fitempire-showcase`)
*   **Core:** HTML5, CSS3, Google Fonts (Outfit)
*   **Mechanics:** Uses embedded interactive `<iframe>` wrappers simulating an iPhone 15 Pro mockup (left) and a desktop browser mockup (right) side-by-side for live showcases and demonstrations.

---

## 💻 Local Development Setup

To run the entire FitEmpire ecosystem locally on your computer, follow these simple steps:

### Prerequisites
Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [Java JDK 21](https://www.oracle.com/java/technologies/downloads/)
*   [Maven](https://maven.apache.org/download.cgi)

---

### Step 1: Configure Environment Variables
1. Open the [`.env`](file:///c:/Users/ayush-g/Desktop/FitEmpire/.env) file at the root of the workspace directory.
2. Ensure the Neon database credentials are correctly defined:
   ```env
   DB_HOST=your-neon-hostname.aws.neon.tech
   DB_USER=your_db_username
   DB_PASSWORD=your_neon_password
   SPRING_DATASOURCE_URL=jdbc:postgresql://your-neon-hostname.aws.neon.tech:5432/neondb?sslmode=require
   ```
3. Configure your **Twilio credentials** to send real SMS OTPs:
   ```env
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_FROM_NUMBER=your_twilio_phone_number
   ```
   *(Note: Because this is a Twilio Trial account, make sure recipient phone numbers are registered in your Twilio Console's **Verified Caller IDs** list).*

---

### Step 2: Start All Services
1. Double-click the **`start-all.bat`** file located in the project root directory.
2. The script will automatically:
   * Terminate any active processes running on target ports (`8080`, `3000`, `3001`, `8081`).
   * Boot the backend Maven server (`http://localhost:8080`).
   * Launch the React/Vite Admin Console (`http://localhost:3000`).
   * Run the Expo Mobile development server (`http://localhost:8081`).
3. If testing in the browser, open your web browser to **`http://localhost:8081`** to run the mobile app locally.

---

## 🚀 Cloud Deployment Pipelines

The production environment of FitEmpire is deployed across two cloud infrastructures:

### 1. Backend Deployments (Hugging Face Spaces)
The backend Java API is hosted on a Hugging Face Space using a Docker container deployment model.
*   **Git Remote:** `https://huggingface.co/spaces/ayush150152/fitempire-api`
*   **Production API URL:** `https://ayush150152-fitempire-api.hf.space/api/v1`
*   **Secrets Config:** Environment variables like `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER` are managed securely within the Hugging Face space secrets panel.

### 2. Frontend Deployments (Netlify)
The frontend web pages are compiled into static assets and deployed to Netlify via automated git-push builds:
*   **Admin Dashboard:** Deployed at [https://fitempire.netlify.app](https://fitempire.netlify.app)
*   **Mobile App (Web Version):** Deployed at [https://firmempireapp.netlify.app](https://firmempireapp.netlify.app)
*   **Showcase Landing Page:** Deployed at [https://firmempireapp-showcase.netlify.app](https://firmempireapp-showcase.netlify.app)

---

## 📞 API Endpoints Reference

The backend API exposes standard REST routes. Main endpoints include:

| Method | Endpoint | Description | Payload Schema |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new customer | `{ firstName, email, phone, password }` |
| `POST` | `/api/v1/auth/login` | Email/password login | `{ email, password }` |
| `POST` | `/api/v1/auth/otp/send` | Request a login OTP | `{ phone }` |
| `POST` | `/api/v1/auth/otp/verify` | Verify OTP and login | `{ phone, otp }` |
| `GET` | `/api/v1/users/profile/me` | Fetch active user profile | Requires Bearer token header |
