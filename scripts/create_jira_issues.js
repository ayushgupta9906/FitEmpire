/**
 * FitEmpire - Jira Auto-Issue Creator Script
 *
 * This script automatically creates all 20 production bugs, vulnerabilities,
 * and improvements in your Jira project using the Jira Cloud REST API v3.
 *
 * How to run:
 *   node scripts/create_jira_issues.js --dry-run
 *   node scripts/create_jira_issues.js --domain=YOUR_DOMAIN.atlassian.net --email=YOUR_EMAIL --token=YOUR_API_TOKEN --project=YOUR_PROJECT_KEY
 *
 * Or set environment variables:
 *   $env:JIRA_DOMAIN="yourdomain.atlassian.net"
 *   $env:JIRA_EMAIL="your-email@company.com"
 *   $env:JIRA_API_TOKEN="your_api_token"
 *   $env:JIRA_PROJECT_KEY="FE"
 *   node scripts/create_jira_issues.js
 */

const fs = require('fs');
const path = require('path');

// ── 1. Parse Arguments ────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (name, fallback = '') => {
  const match = args.find((a) => a.startsWith(`--${name}=`));
  if (match) return match.split('=')[1].trim();
  return process.env[name.toUpperCase().replace('-', '_')] || fallback;
};

const isDryRun = args.includes('--dry-run');
let domain = getArg('domain', '');
let email = getArg('email', '');
let token = getArg('token', '');
let projectKey = getArg('project', 'FE');

// Clean domain
if (domain.startsWith('https://')) domain = domain.replace('https://', '');
if (domain.endsWith('/')) domain = domain.slice(0, -1);

// ── 2. Master List of 20 Issues ───────────────────────────────────────────────
const ISSUES = [
  {
    summary: 'Plaintext Production Neon Database Credentials Exposed in Source Control',
    issueType: 'Bug',
    priority: 'Highest',
    component: 'Infrastructure & Security',
    description: `Affected File: fitempire-backend/src/main/resources/application.yml (Lines 40-42)

Description:
The production PostgreSQL connection string and database credentials for Neon AWS Tech are hardcoded in plaintext:
datasource:
  url: \${SPRING_DATASOURCE_URL:jdbc:postgresql://ep-lingering-sky-atwtj0vn-pooler.c-9.us-east-1.aws.neon.tech:5432/neondb?sslmode=require}
  username: \${SPRING_DATASOURCE_USERNAME:neondb_owner}
  password: \${SPRING_DATASOURCE_PASSWORD:[REDACTED_SECRET]}

Impact:
Anyone with repository access can directly connect to the production database, view PII, modify balances, or drop tables.

Proposed Fix:
1. Rotate database password immediately in Neon console.
2. Remove hardcoded fallback password from application.yml and use strictly environment variables.`
  },
  {
    summary: 'Unauthenticated Universal Password Reset Vulnerability (Account Takeover)',
    issueType: 'Bug',
    priority: 'Highest',
    component: 'Admin & Auth',
    description: `Affected Files:
- fitempire-backend/src/main/java/com/fitempire/security/config/SecurityConfig.java (Line 85)
- fitempire-backend/src/main/java/com/fitempire/modules/admin/AdminController.java (Lines 235-247)

Description:
The endpoint POST /v1/admin/users/reset-password-by-email is configured as permitAll() in Spring Security. It accepts an email and newPassword directly without requiring current password, OTP, or admin authentication.

Impact:
Any anonymous user can reset any administrator or customer password to Password@123 with a single unauthenticated HTTP POST.

Proposed Fix:
Remove reset-password-by-email from permitAll() in SecurityConfig and require verified OTP confirmation.`
  },
  {
    summary: 'Unverified Wallet Top-Up Endpoint Allows Free Arbitrary Balance Crediting',
    issueType: 'Bug',
    priority: 'Highest',
    component: 'Wallet & Payments',
    description: `Affected File: fitempire-backend/src/main/java/com/fitempire/modules/users/controller/WalletController.java (Lines 45-60)

Description:
The endpoint POST /api/v1/wallets/me/top-up directly calls walletService.creditWallet() without verifying payment gateway transaction status, Razorpay signature, or order ID.

Impact:
Any logged in user can credit arbitrary funds to their wallet for free and buy memberships.

Proposed Fix:
Deprecate direct client-side top-up requests. Require Razorpay order verification before crediting wallet balance.`
  },
  {
    summary: 'Double-Spending Race Condition in Wallet Debit Engine',
    issueType: 'Bug',
    priority: 'Highest',
    component: 'Wallet & Payments',
    description: `Affected File: fitempire-backend/src/main/java/com/fitempire/modules/users/service/WalletService.java (Lines 108-128)

Description:
debitWallet() retrieves the wallet entity via findByUserId() without a pessimistic write lock (SELECT FOR UPDATE) or optimistic version checking.

Impact:
Two concurrent debit requests can read the same initial balance simultaneously and save overwritten balances, allowing double spending.

Proposed Fix:
Implement pessimistic write locking on WalletRepository using @Lock(LockModeType.PESSIMISTIC_WRITE) and add @Version to Wallet entity.`
  },
  {
    summary: 'Unrestricted Public Media Upload Allows Stored XSS & Arbitrary File Storage',
    issueType: 'Bug',
    priority: 'Highest',
    component: 'Media & Storage',
    description: `Affected Files:
- fitempire-backend/src/main/java/com/fitempire/security/config/SecurityConfig.java (Lines 86-87)
- fitempire-backend/src/main/java/com/fitempire/controller/FileUploadController.java (Lines 107-139)

Description:
The endpoint POST /v1/media/upload is public (permitAll()). It accepts any file without checking MIME types or extensions and saves it directly under /uploads/.

Impact:
Attackers can upload malicious .html, .svg with embedded JavaScript, or executables, causing Stored XSS under the domain origin.

Proposed Fix:
Restrict /v1/media/upload to authenticated users with ADMIN or GYM_PARTNER roles and validate MIME types against strict image whitelist.`
  },
  {
    summary: 'Scanner Auto-Grants Entry on API Failure via Fallback Handler',
    issueType: 'Bug',
    priority: 'Highest',
    component: 'Partner Portal - Scanner',
    description: `Affected File: fitempire-partner/src/pages/ScannerPage.tsx (Lines 69-95)

Description:
When an invalid, expired, or non-existent QR token is scanned, or when network drops, handleVerify catches the error and sets dummy fallback data with verifiedSuccess = true.

Impact:
Any individual can present a fake QR code; upon API error, the receptionist screen displays a green 'Access Granted' confirmation.

Proposed Fix:
In catch block, set setVerifiedSuccess(false) and populate setError('Invalid or expired QR pass. Entry denied.').`
  },
  {
    summary: 'QR Verification Auto-Creates Fake Attendance on Random User for Invalid Codes',
    issueType: 'Bug',
    priority: 'High',
    component: 'Check-In Service',
    description: `Affected File: fitempire-backend/src/main/java/com/fitempire/modules/bookings/service/BookingService.java (Lines 139-170)

Description:
In verifyAndCheckIn(), if a booking is not found by token, it creates a real database entry for testuser@fitempire.in or the first active user found in the DB and marks it CHECKED_IN.

Impact:
Invalid scan requests corrupt production attendance analytics and bill or register fake attendances against real users.

Proposed Fix:
Throw BusinessException('Invalid or expired QR pass', 'INVALID_TOKEN', HttpStatus.NOT_FOUND) whenever booking == null.`
  },
  {
    summary: 'Missing Slot Capacity & Double-Booking Validations in Booking Service',
    issueType: 'Bug',
    priority: 'High',
    component: 'Bookings Module',
    description: `Affected File: fitempire-backend/src/main/java/com/fitempire/modules/bookings/service/BookingService.java (Lines 46-78)

Description:
createBooking() does not validate slot capacity or check whether the user already has an active booking at the same date and time.

Impact:
Gyms and studio classes can be overbooked beyond capacity, and users can hoard multiple slots simultaneously.

Proposed Fix:
Verify existing bookings count against branch maxCapacity and ensure user does not have duplicate booking for that time window.`
  },
  {
    summary: 'Zero-Cost Bookings Allowed Without Active Membership Verification',
    issueType: 'Bug',
    priority: 'High',
    component: 'Bookings Module',
    description: `Affected File: fitempire-backend/src/main/java/com/fitempire/modules/bookings/service/BookingService.java (Lines 56-75)

Description:
createBooking() sets booking.setAmountPaid(BigDecimal.ZERO) and confirms the booking without checking whether the user possesses an active subscription or session credits.

Impact:
Users with expired or canceled accounts can continue booking workouts without payment.

Proposed Fix:
Inject UserMembershipRepository and validate that user has an active, non-frozen pass covering the target date.`
  },
  {
    summary: 'Insecure CORS Configuration: Wildcard Origin Allowed with Credentials',
    issueType: 'Bug',
    priority: 'High',
    component: 'Security & Config',
    description: `Affected File: fitempire-backend/src/main/java/com/fitempire/security/config/SecurityConfig.java (Lines 174-178)

Description:
CORS configuration combines wildcard origin patterns with credential sharing:
config.setAllowedOriginPatterns(Arrays.asList('*'));
config.setAllowCredentials(true);

Impact:
Any malicious website running in an authenticated user's browser can perform cross-origin requests and read sensitive response headers.

Proposed Fix:
Remove wildcard origin patterns and restrict strictly to configured domain whitelist.`
  },
  {
    summary: 'Offline Network Catch Injects Invalid Demo Tokens Causing Auth Loops',
    issueType: 'Bug',
    priority: 'High',
    component: 'Mobile App - Auth',
    description: `Affected File: fitempire-mobile/src/services/auth-context.tsx (Lines 107-122)

Description:
When login network request fails without a response, catch block stores dummy demo token 'demo_member_jwt_token' into AsyncStorage and marks user authenticated.

Impact:
When connectivity resumes, subsequent network requests attach an invalid JWT, resulting in persistent 401 error loops.

Proposed Fix:
Remove demo token injection in catch block and display network error dialog to user.`
  },
  {
    summary: 'Axios 401 Response Interceptor Lacks Mutex Locking During Token Refresh',
    issueType: 'Bug',
    priority: 'High',
    component: 'Mobile App - Networking',
    description: `Affected File: fitempire-mobile/src/services/api.ts (Lines 33-60)

Description:
When multiple concurrent requests return 401 upon token expiration, each request independently triggers /auth/refresh. The first succeeds and rotates token; second fails, wiping storage and logging user out.

Impact:
Users are abruptly logged out upon opening the app whenever the access token expires.

Proposed Fix:
Implement an isRefreshing mutex lock flag and subscriber queue in Axios response interceptor.`
  },
  {
    summary: 'Timezone Shift Bug in Date Formatting Leads to Off-By-One Day Bookings',
    issueType: 'Bug',
    priority: 'High',
    component: 'Mobile App - Bookings',
    description: `Affected File: fitempire-mobile/src/app/booking.tsx (Lines 81, 100)

Description:
Dates are converted using selectedDate.toISOString().split('T')[0]. In India Standard Time (UTC+5:30), timestamps before 05:30 AM evaluate to yesterday's date in UTC.

Impact:
Early morning bookings book slots for the previous calendar day, causing booking rejections or missing slots.

Proposed Fix:
Format date using local date components: \${year}-\${month}-\${day}.`
  },
  {
    summary: 'Hardcoded Dummy UUID Fallbacks in Booking Flow Cause DB Foreign Key Violations',
    issueType: 'Bug',
    priority: 'High',
    component: 'Mobile App - Bookings',
    description: `Affected File: fitempire-mobile/src/app/booking.tsx (Lines 102-103)

Description:
When navigation parameters are omitted or unparsed, booking flow injects fallback UUIDs '11111111-1111-1111-1111-111111111111' and '22222222-2222-2222-2222-222222222222'.

Impact:
Submitting non-existent UUIDs causes backend 404/500 Foreign Key constraint violations instead of guiding user with client-side validation.

Proposed Fix:
Validate route parameters upon screen mount and redirect back if missing.`
  },
  {
    summary: 'Digital Pass Client-Side Random Token Regeneration Bypasses Backend Validation',
    issueType: 'Bug',
    priority: 'High',
    component: 'Mobile App - Digital Pass',
    description: `Affected File: fitempire-mobile/src/app/(tabs)/ticket.tsx (Lines 33-48)

Description:
When the 60-second countdown elapses, ticket.tsx generates a random client-side string rather than calling the backend rotation endpoint.

Impact:
The renewed QR code on member phone no longer matches any record in the backend database, causing turnstile verification failures.

Proposed Fix:
Call bookingsApi.refreshQr(bookingId) on timer expiration to fetch a server-signed token.`
  },
  {
    summary: 'Partner Portal Rigid 420px Mobile Phone Frame Breaks Desktop/Tablet Usability',
    issueType: 'Improvement',
    priority: 'Medium',
    component: 'Partner Portal - UI',
    description: `Affected Files: fitempire-partner/src/pages/LoginPage.tsx (Lines 67-85), App.tsx

Description:
Partner portal layout is restricted to a 420px mobile mockup container (maxWidth: 420px, border: 10px solid #1E293B) even on desktop browsers.

Impact:
Gym receptionists using desktop computers or tablets see an artificially constrained mobile container where tables and charts overflow.

Proposed Fix:
Adopt a responsive desktop sidebar dashboard layout on min-width: 768px breakpoints.`
  },
  {
    summary: 'Phantom Shopping Cart: Missing State Persistence & Checkout Pipeline',
    issueType: 'Bug',
    priority: 'Medium',
    component: 'Mobile App - Store',
    description: `Affected File: fitempire-mobile/src/app/store.tsx (Lines 132-155)

Description:
'Add to Cart' increments a numeric counter and displays an alert. No cart array, product IDs, quantities, or prices are preserved, and clicking cart displays an alert without checkout.

Impact:
Users cannot review cart items, specify quantities, provide shipping addresses, or execute store purchases.

Proposed Fix:
Create a CartContext with persistent storage (useCart), build a dedicated /cart screen, and connect to ordersApi.createOrder().`
  },
  {
    summary: 'FitEmpire TV Lacks Streaming Player Engine (Triggers Native Alert on Click)',
    issueType: 'Bug',
    priority: 'Medium',
    component: 'Mobile App - TV',
    description: `Affected File: fitempire-mobile/src/app/tv.tsx (Lines 96-100)

Description:
The playback button in FitEmpire TV executes an alert box rather than instantiating a video player component.

Impact:
Video workout content cannot be viewed within the mobile application.

Proposed Fix:
Integrate expo-av or react-native-video to stream workout MP4/HLS feeds with full-screen playback and controls.`
  },
  {
    summary: "Partner Settlements: 'Request Instant Payout' Action is an Unconnected No-Op Mock",
    issueType: 'Bug',
    priority: 'Medium',
    component: 'Partner Portal - Settlements',
    description: `Affected File: fitempire-partner/src/pages/SettlementsPage.tsx (Lines 52-55)

Description:
Clicking 'Request Instant Payout' updates a local state flag for 4 seconds without issuing a backend request.

Impact:
Gym partners believe they have initiated a bank withdrawal, but no payout request is recorded or queued in the financial service.

Proposed Fix:
Connect the action to partnerApi.requestPayout({ amount: stats.availableBalance }) and update the balance ledger based on server response.`
  },
  {
    summary: 'AI Workout & Calorie Tracker Ignores Server Recommendations & Resets Logged Data',
    issueType: 'Bug',
    priority: 'Medium',
    component: 'Mobile App - AI',
    description: `Affected File: fitempire-mobile/src/app/ai-workout.tsx (Lines 61-107)

Description:
In handleAiGenerateWorkout, aiApi.generateWorkout() is called without user parameters and response is discarded in favor of hardcoded local exercise arrays. In addition, logged meals are stored only in component state.

Impact:
AI personalization does not adapt to user targets, and all user-logged calories and macronutrients are lost when leaving the screen.

Proposed Fix:
Pass user parameters to aiApi.generateWorkout({ muscleGroup, fitnessLevel }) and persist food log entries in AsyncStorage or backend.`
  }
];

// ── 3. Helper: Convert Plaintext Description to Jira ADF (v3 Format) ─────────
function textToAdf(text) {
  const paragraphs = text.split('\n\n').filter(Boolean);
  return {
    version: 1,
    type: 'doc',
    content: paragraphs.map((p) => ({
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: p.trim()
        }
      ]
    }))
  };
}

// ── 4. Execution ─────────────────────────────────────────────────────────────
async function run() {
  console.log('====================================================');
  console.log('🚀 FitEmpire Jira Automated Issue Importer');
  console.log('====================================================\n');

  if (isDryRun) {
    console.log('🔍 [DRY RUN MODE] Simulating creation of 20 issues:\n');
    ISSUES.forEach((issue, idx) => {
      console.log(`[#${idx + 1}] [${issue.priority}] [${issue.issueType}] ${issue.summary}`);
      console.log(`     Component: ${issue.component}`);
    });
    console.log('\n✅ Dry run complete! All 20 issue templates are valid.');
    console.log('\nTo create them in your real Jira board, run:');
    console.log('node scripts/create_jira_issues.js --domain=YOUR_DOMAIN.atlassian.net --email=YOUR_EMAIL --token=YOUR_API_TOKEN --project=YOUR_PROJECT_KEY');
    return;
  }

  if (!domain || !email || !token) {
    console.error('❌ Error: Missing required Jira credentials!\n');
    console.log('Usage:');
    console.log('  node scripts/create_jira_issues.js --domain=YOUR_DOMAIN.atlassian.net --email=YOUR_EMAIL --token=YOUR_API_TOKEN --project=FE\n');
    console.log('Tip: You can generate a free Jira API Token at:');
    console.log('  👉 https://id.atlassian.com/manage-profile/security/api-tokens\n');
    process.exit(1);
  }

  const authHeader = 'Basic ' + Buffer.from(`${email}:${token}`).toString('base64');
  const apiUrl = `https://${domain}/rest/api/3/issue`;

  console.log(`Target Jira Host: https://${domain}`);
  console.log(`Project Key:      ${projectKey}`);
  console.log(`Total Issues:     ${ISSUES.length}\n`);

  let createdCount = 0;
  let failedCount = 0;

  for (let i = 0; i < ISSUES.length; i++) {
    const item = ISSUES[i];
    process.stdout.write(`Creating [${i + 1}/20]: "${item.summary.substring(0, 45)}..." `);

    const payload = {
      fields: {
        project: { key: projectKey },
        summary: item.summary,
        issuetype: { name: item.issueType === 'Bug' ? 'Bug' : 'Task' },
        priority: { name: item.priority },
        description: textToAdf(item.description)
      }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`\x1b[32m✔ Created as ${data.key}\x1b[0m`);
        createdCount++;
      } else {
        const errText = await response.text();
        console.log(`\x1b[31m✖ Failed (${response.status})\x1b[0m`);
        console.error(`   Server response: ${errText.substring(0, 150)}`);
        failedCount++;
      }
    } catch (e) {
      console.log(`\x1b[31m✖ Error: ${e.message}\x1b[0m`);
      failedCount++;
    }

    // Gentle delay to avoid Jira Cloud rate limits
    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  console.log('\n====================================================');
  console.log(`🎉 Finished! Successfully created: ${createdCount} | Failed: ${failedCount}`);
  console.log(`View your board at: https://${domain}/jira/your-work`);
  console.log('====================================================');
}

run();
