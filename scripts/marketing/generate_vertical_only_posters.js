const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/ayush-g/.gemini/antigravity-ide/brain/b15058fd-8a27-4e68-bdfe-ff4b18ff9ac7/scratch/node_modules/sharp');

const REPO_ROOT = 'C:/Users/ayush-g/Desktop/FitEmpire';

// 1. Vertical Rectangle Poster (1080 x 1350 - 4:5 Portrait Feed)
const vertical4x5Svg = `
<svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Canvas -->
    <linearGradient id="vBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050811" />
      <stop offset="45%" stop-color="#091122" />
      <stop offset="100%" stop-color="#03050C" />
    </linearGradient>

    <!-- Top Glow -->
    <radialGradient id="vTopGlow" cx="50%" cy="12%" r="52%">
      <stop offset="0%" stop-color="#6C63FF" stop-opacity="0.45" />
      <stop offset="50%" stop-color="#4F46E5" stop-opacity="0.15" />
      <stop offset="85%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Official In-App Logo Gradient -->
    <linearGradient id="vLogoBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C73FF" />
      <stop offset="50%" stop-color="#5B50EC" />
      <stop offset="100%" stop-color="#4338CA" />
    </linearGradient>

    <!-- 3D Glow Shadow -->
    <filter id="vLogoShadow" x="-25%" y="-25%" width="150%" height="160%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#6366F1" flood-opacity="0.75"/>
    </filter>

    <!-- Glass Card Style -->
    <linearGradient id="vCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255, 255, 255, 0.08)" />
      <stop offset="100%" stop-color="rgba(255, 255, 255, 0.02)" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1350" fill="url(#vBg)" />
  <rect width="1080" height="1350" fill="url(#vTopGlow)" />
  <rect x="24" y="24" width="1032" height="1302" rx="36" fill="none" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1.5" />

  <!-- 1. Header Section -->
  <g transform="translate(540, 68)">
    <rect x="-165" y="0" width="330" height="36" rx="18" fill="rgba(108, 99, 255, 0.22)" stroke="rgba(124, 115, 255, 0.55)" stroke-width="1.2" />
    <circle cx="-135" cy="18" r="5" fill="#FCD34D" />
    <text x="-115" y="23" font-family="'Segoe UI', Roboto, -apple-system, sans-serif" font-size="12.5" font-weight="900" letter-spacing="2.5" fill="#FFFFFF">
      THE FITEMPIRE ADVANTAGE
    </text>

    <!-- Brand Row -->
    <g transform="translate(0, 48)">
      <g transform="translate(-180, 0)" filter="url(#vLogoShadow)">
        <rect x="0" y="0" width="80" height="80" rx="22" fill="url(#vLogoBg)" />
        <rect x="1" y="1" width="78" height="78" rx="21" fill="none" stroke="rgba(255, 255, 255, 0.4)" stroke-width="1.6" />
        
        <g transform="translate(40, 40) rotate(-45)">
          <rect x="-21" y="-1.6" width="42" height="3.2" rx="1.6" fill="#FFFFFF" />
          <line x1="-5" y1="-1.5" x2="-5" y2="1.5" stroke="#6366F1" stroke-width="0.9" stroke-linecap="round" />
          <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="#6366F1" stroke-width="0.9" stroke-linecap="round" />
          <line x1="5" y1="-1.5" x2="5" y2="1.5" stroke="#6366F1" stroke-width="0.9" stroke-linecap="round" />
          <rect x="-9" y="-4" width="2" height="8" rx="1" fill="#FFFFFF" />
          <rect x="-13" y="-11" width="3" height="22" rx="1.5" fill="#FFFFFF" />
          <rect x="-17" y="-8.5" width="3" height="17" rx="1.5" fill="#FFFFFF" opacity="0.92" />
          <rect x="-20.5" y="-6" width="2.5" height="12" rx="1.2" fill="#FFFFFF" opacity="0.85" />
          <rect x="7" y="-4" width="2" height="8" rx="1" fill="#FFFFFF" />
          <rect x="10" y="-11" width="3" height="22" rx="1.5" fill="#FFFFFF" />
          <rect x="14" y="-8.5" width="3" height="17" rx="1.5" fill="#FFFFFF" opacity="0.92" />
          <rect x="18" y="-6" width="2.5" height="12" rx="1.2" fill="#FFFFFF" opacity="0.85" />
        </g>
      </g>

      <text x="-80" y="52" font-family="'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="900" letter-spacing="-1.5" fill="#FFFFFF">
        FitEmpire
      </text>

      <text x="-78" y="74" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="900" letter-spacing="4" fill="#38BDF8">
        RULE YOUR FITNESS
      </text>
    </g>

    <!-- Main Value Proposition -->
    <text x="0" y="160" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="900" fill="#FFFFFF">
      Built Different. Built For You.
    </text>
    <text x="0" y="190" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="#94A3B8">
      Why India's next-gen fitness ecosystem gives you 100% unrestricted freedom.
    </text>
  </g>

  <!-- 2. Vertical Feature Differentiator Cards (6 Stacked Cards) -->
  <g transform="translate(68, 325)">
    
    <!-- 1. Dual Daily Sessions -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="944" height="110" rx="22" fill="url(#vCardGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" />
      <rect x="18" y="18" width="74" height="74" rx="18" fill="rgba(56, 189, 248, 0.18)" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.2" />
      <text x="55" y="64" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="32">⚡</text>
      <text x="110" y="44" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF">Dual Daily Workout Sessions</text>
      <text x="110" y="70" font-family="'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="500" fill="#94A3B8">Lift weights in the morning + attend evening swimming or yoga on the exact same day.</text>
      <text x="110" y="94" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#38BDF8">👑 FitEmpire: 2 Daily Sessions Included &#160;•&#160; <tspan fill="#F87171">❌ Others: Capped at 1/day (or 3/week on standard plans)</tspan></text>
    </g>

    <!-- 2. Unrestricted Multi-Gym Access -->
    <g transform="translate(0, 125)">
      <rect x="0" y="0" width="944" height="110" rx="22" fill="url(#vCardGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" />
      <rect x="18" y="18" width="74" height="74" rx="18" fill="rgba(16, 185, 129, 0.18)" stroke="rgba(16, 185, 129, 0.4)" stroke-width="1.2" />
      <text x="55" y="64" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="32">🏋️</text>
      <text x="110" y="44" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF">10,000+ Multi-Gym Freedom</text>
      <text x="110" y="70" font-family="'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="500" fill="#94A3B8">Work out at premier gyms, yoga studios, MMA, CrossFit &amp; aquatic arenas nationwide.</text>
      <text x="110" y="94" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#34D399">👑 FitEmpire: Complete Multi-Center Access &#160;•&#160; <tspan fill="#94A3B8">Seamless contactless turnstile entry</tspan></text>
    </g>

    <!-- 3. Free Freeze & Rollovers -->
    <g transform="translate(0, 250)">
      <rect x="0" y="0" width="944" height="110" rx="22" fill="url(#vCardGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" />
      <rect x="18" y="18" width="74" height="74" rx="18" fill="rgba(245, 158, 11, 0.18)" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1.2" />
      <text x="55" y="64" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="32">⏸️</text>
      <text x="110" y="44" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF">Free Freeze &amp; Automatic Credit Rollovers</text>
      <text x="110" y="70" font-family="'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="500" fill="#94A3B8">1-Tap instant free plan freeze. Unused pass days automatically carry forward.</text>
      <text x="110" y="94" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#FBBF24">👑 FitEmpire: 100% Free Freeze &amp; Rollovers &#160;•&#160; <tspan fill="#F87171">❌ Others: Strict Weekly Lapses &amp; Paid Freeze Fees</tspan></text>
    </g>

    <!-- 4. FitCoach AI Engine -->
    <g transform="translate(0, 375)">
      <rect x="0" y="0" width="944" height="110" rx="22" fill="url(#vCardGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" />
      <rect x="18" y="18" width="74" height="74" rx="18" fill="rgba(168, 85, 247, 0.18)" stroke="rgba(168, 85, 247, 0.4)" stroke-width="1.2" />
      <text x="55" y="64" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="32">🤖</text>
      <text x="110" y="44" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF">FitCoach AI Adaptive Workout Engine</text>
      <text x="110" y="70" font-family="'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="500" fill="#94A3B8">Dynamic real-time workout generator adjusts reps, weight &amp; splits to available gym gear.</text>
      <text x="110" y="94" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#C084FC">👑 FitEmpire: Live Dynamic Overload AI &#160;•&#160; <tspan fill="#F87171">❌ Others: Static Generic PDF Templates</tspan></text>
    </g>

    <!-- 5. FitFeast Indian Macro Nutrition -->
    <g transform="translate(0, 500)">
      <rect x="0" y="0" width="944" height="110" rx="22" fill="url(#vCardGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" />
      <rect x="18" y="18" width="74" height="74" rx="18" fill="rgba(244, 63, 94, 0.18)" stroke="rgba(244, 63, 94, 0.4)" stroke-width="1.2" />
      <text x="55" y="64" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="32">🥗</text>
      <text x="110" y="44" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF">FitFeast Clinical Indian Nutrition</text>
      <text x="110" y="70" font-family="'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="500" fill="#94A3B8">Personalized macro meal plans, calorie counters &amp; regional Indian diet charts.</text>
      <text x="110" y="94" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#FB7185">👑 FitEmpire: Authentic Indian Macro Splits &#160;•&#160; <tspan fill="#F87171">❌ Others: Impractical Western Meal Plans</tspan></text>
    </g>

    <!-- 6. FitEmpire Care Telehealth -->
    <g transform="translate(0, 625)">
      <rect x="0" y="0" width="944" height="110" rx="22" fill="url(#vCardGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" />
      <rect x="18" y="18" width="74" height="74" rx="18" fill="rgba(108, 99, 255, 0.18)" stroke="rgba(108, 99, 255, 0.4)" stroke-width="1.2" />
      <text x="55" y="64" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="32">🩺</text>
      <text x="110" y="44" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF">FitEmpire Care Telehealth</text>
      <text x="110" y="70" font-family="'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="500" fill="#94A3B8">In-app 1-on-1 consultations with verified doctors, certified dietitians &amp; physiotherapists.</text>
      <text x="110" y="94" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#A5B4FC">👑 FitEmpire: 360° Medical &amp; Physio Care &#160;•&#160; <tspan fill="#F87171">❌ Others: Zero Integrated Healthcare</tspan></text>
    </g>

    <!-- 7. Perks Banner Strip -->
    <g transform="translate(0, 748)">
      <rect x="0" y="0" width="944" height="66" rx="18" fill="rgba(108,99,255,0.09)" stroke="rgba(108,99,255,0.28)" stroke-width="1.2" />
      <text x="36" y="40" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#C7D2FE">⚡ 1-Sec Turnstile QR Entry &#160;|&#160; 🏢 Corporate Subsidies &#160;|&#160; 🪙 FitPoints &amp; Rewards</text>
    </g>
  </g>

  <!-- 3. Footer CTA (NO WEBSITE URL) -->
  <g transform="translate(540, 1245)">
    <rect x="-240" y="-34" width="480" height="68" rx="34" fill="url(#vLogoBg)" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
    <text x="0" y="8" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" letter-spacing="2" fill="#FFFFFF">
      LAUNCHING SOON &#160;•&#160; STAY TUNED
    </text>
    <text x="0" y="60" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="700" fill="#64748B">
      Available on iOS &amp; Android &#160;•&#160; Corporate &amp; Gym Partner Inquiries Welcome
    </text>
  </g>
</svg>
`;

// 2. Full 9:16 Vertical Story / Mobile Poster (1080 x 1920)
const vertical9x16Svg = `
<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050811" />
      <stop offset="45%" stop-color="#091122" />
      <stop offset="100%" stop-color="#03050C" />
    </linearGradient>

    <radialGradient id="sTopGlow" cx="50%" cy="12%" r="52%">
      <stop offset="0%" stop-color="#6C63FF" stop-opacity="0.5" />
      <stop offset="50%" stop-color="#4F46E5" stop-opacity="0.18" />
      <stop offset="85%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="sLogoBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C73FF" />
      <stop offset="50%" stop-color="#5B50EC" />
      <stop offset="100%" stop-color="#4338CA" />
    </linearGradient>

    <filter id="sLogoShadow" x="-25%" y="-25%" width="150%" height="160%">
      <feDropShadow dx="0" dy="20" stdDeviation="28" flood-color="#6366F1" flood-opacity="0.8"/>
    </filter>

    <linearGradient id="sCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255, 255, 255, 0.08)" />
      <stop offset="100%" stop-color="rgba(255, 255, 255, 0.02)" />
    </linearGradient>
  </defs>

  <rect width="1080" height="1920" fill="url(#sBg)" />
  <rect width="1080" height="1920" fill="url(#sTopGlow)" />
  <rect x="28" y="28" width="1024" height="1864" rx="42" fill="none" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1.5" />

  <!-- Header -->
  <g transform="translate(540, 110)">
    <rect x="-175" y="0" width="350" height="42" rx="21" fill="rgba(108, 99, 255, 0.22)" stroke="rgba(124, 115, 255, 0.55)" stroke-width="1.2" />
    <circle cx="-140" cy="21" r="5" fill="#FCD34D" />
    <text x="-120" y="27" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="900" letter-spacing="3" fill="#FFFFFF">
      THE FITEMPIRE ADVANTAGE
    </text>

    <!-- Brand Header -->
    <g transform="translate(0, 110)">
      <g transform="translate(-100, -55)" filter="url(#sLogoShadow)">
        <rect x="0" y="0" width="200" height="200" rx="55" ry="55" fill="url(#sLogoBg)" />
        <rect x="1.5" y="1.5" width="197" height="197" rx="53.5" ry="53.5" fill="none" stroke="rgba(255, 255, 255, 0.4)" stroke-width="2.5" />
        <g transform="translate(100, 100) rotate(-45)">
          <rect x="-52" y="-4" width="104" height="8" rx="4" fill="#FFFFFF" />
          <line x1="-12" y1="-3.5" x2="-12" y2="3.5" stroke="#6366F1" stroke-width="2" stroke-linecap="round" />
          <line x1="0" y1="-3.5" x2="0" y2="3.5" stroke="#6366F1" stroke-width="2" stroke-linecap="round" />
          <line x1="12" y1="-3.5" x2="12" y2="3.5" stroke="#6366F1" stroke-width="2" stroke-linecap="round" />
          <rect x="-23" y="-10" width="5" height="20" rx="2" fill="#FFFFFF" />
          <rect x="-32" y="-29" width="8" height="58" rx="4" fill="#FFFFFF" />
          <rect x="-42" y="-23" width="8" height="46" rx="4" fill="#FFFFFF" opacity="0.92" />
          <rect x="-51" y="-16" width="7" height="32" rx="3.5" fill="#FFFFFF" opacity="0.85" />
          <rect x="18" y="-10" width="5" height="20" rx="2" fill="#FFFFFF" />
          <rect x="24" y="-29" width="8" height="58" rx="4" fill="#FFFFFF" />
          <rect x="34" y="-23" width="8" height="46" rx="4" fill="#FFFFFF" opacity="0.92" />
          <rect x="44" y="-16" width="7" height="32" rx="3.5" fill="#FFFFFF" opacity="0.85" />
        </g>
      </g>

      <text x="0" y="235" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="74" font-weight="900" letter-spacing="-2" fill="#FFFFFF">
        FitEmpire
      </text>

      <text x="0" y="278" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="900" letter-spacing="6" fill="#38BDF8">
        RULE YOUR FITNESS
      </text>
    </g>

    <!-- Subtitle -->
    <text x="0" y="470" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="40" font-weight="900" fill="#FFFFFF">
      Built Different. Built For You.
    </text>
    <text x="0" y="515" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="500" fill="#94A3B8">
      Why India's next-gen fitness ecosystem gives you 100% unrestricted freedom.
    </text>
  </g>

  <!-- 6 Large Stacked Cards -->
  <g transform="translate(68, 690)">
    
    <!-- 1 -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="944" height="135" rx="24" fill="url(#sCardGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" />
      <rect x="22" y="24" width="86" height="86" rx="20" fill="rgba(56, 189, 248, 0.18)" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.2" />
      <text x="65" y="76" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="38">⚡</text>
      <text x="126" y="52" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#FFFFFF">Dual Daily Workout Sessions</text>
      <text x="126" y="82" font-family="'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="500" fill="#94A3B8">Lift weights in the morning + attend swimming or yoga on the exact same day.</text>
      <text x="126" y="112" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#38BDF8">👑 FitEmpire: 2 Daily Sessions Included &#160;•&#160; <tspan fill="#F87171">❌ Others: Capped at 1/day (or 3/week on standard plans)</tspan></text>
    </g>

    <!-- 2 -->
    <g transform="translate(0, 155)">
      <rect x="0" y="0" width="944" height="135" rx="24" fill="url(#sCardGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" />
      <rect x="22" y="24" width="86" height="86" rx="20" fill="rgba(16, 185, 129, 0.18)" stroke="rgba(16, 185, 129, 0.4)" stroke-width="1.2" />
      <text x="65" y="76" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="38">🏋️</text>
      <text x="126" y="52" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#FFFFFF">10,000+ Multi-Gym Network</text>
      <text x="126" y="82" font-family="'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="500" fill="#94A3B8">Work out at premier gyms, yoga studios, MMA, CrossFit &amp; aquatic arenas nationwide.</text>
      <text x="126" y="112" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#34D399">👑 FitEmpire: Complete Multi-Center Access &#160;•&#160; <tspan fill="#94A3B8">Seamless contactless turnstile entry</tspan></text>
    </g>

    <!-- 3 -->
    <g transform="translate(0, 310)">
      <rect x="0" y="0" width="944" height="135" rx="24" fill="url(#sCardGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" />
      <rect x="22" y="24" width="86" height="86" rx="20" fill="rgba(245, 158, 11, 0.18)" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1.2" />
      <text x="65" y="76" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="38">⏸️</text>
      <text x="126" y="52" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#FFFFFF">Free Freeze &amp; Automatic Credit Rollovers</text>
      <text x="126" y="82" font-family="'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="500" fill="#94A3B8">1-Tap instant free plan freeze. Unused pass days automatically carry forward.</text>
      <text x="126" y="112" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#FBBF24">👑 FitEmpire: 100% Free Freeze &amp; Rollovers &#160;•&#160; <tspan fill="#F87171">❌ Others: Strict Weekly Lapses &amp; Paid Freeze Fees</tspan></text>
    </g>

    <!-- 4 -->
    <g transform="translate(0, 465)">
      <rect x="0" y="0" width="944" height="135" rx="24" fill="url(#sCardGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" />
      <rect x="22" y="24" width="86" height="86" rx="20" fill="rgba(168, 85, 247, 0.18)" stroke="rgba(168, 85, 247, 0.4)" stroke-width="1.2" />
      <text x="65" y="76" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="38">🤖</text>
      <text x="126" y="52" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#FFFFFF">FitCoach AI Adaptive Workout Engine</text>
      <text x="126" y="82" font-family="'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="500" fill="#94A3B8">Dynamic real-time workout generator adjusts reps, weight &amp; splits to available gym gear.</text>
      <text x="126" y="112" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#C084FC">👑 FitEmpire: Live Dynamic Overload AI &#160;•&#160; <tspan fill="#F87171">❌ Others: Static Generic PDF Templates</tspan></text>
    </g>

    <!-- 5 -->
    <g transform="translate(0, 620)">
      <rect x="0" y="0" width="944" height="135" rx="24" fill="url(#sCardGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" />
      <rect x="22" y="24" width="86" height="86" rx="20" fill="rgba(244, 63, 94, 0.18)" stroke="rgba(244, 63, 94, 0.4)" stroke-width="1.2" />
      <text x="65" y="76" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="38">🥗</text>
      <text x="126" y="52" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#FFFFFF">FitFeast Clinical Indian Nutrition</text>
      <text x="126" y="82" font-family="'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="500" fill="#94A3B8">Personalized macro meal plans, calorie counters &amp; regional Indian diet charts.</text>
      <text x="126" y="112" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#FB7185">👑 FitEmpire: Authentic Indian Macro Splits &#160;•&#160; <tspan fill="#F87171">❌ Others: Impractical Western Meal Plans</tspan></text>
    </g>

    <!-- 6 -->
    <g transform="translate(0, 775)">
      <rect x="0" y="0" width="944" height="135" rx="24" fill="url(#sCardGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" />
      <rect x="22" y="24" width="86" height="86" rx="20" fill="rgba(108, 99, 255, 0.18)" stroke="rgba(108, 99, 255, 0.4)" stroke-width="1.2" />
      <text x="65" y="76" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="38">🩺</text>
      <text x="126" y="52" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#FFFFFF">FitEmpire Care Telehealth</text>
      <text x="126" y="82" font-family="'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="500" fill="#94A3B8">In-app 1-on-1 consultations with verified doctors, certified dietitians &amp; physiotherapists.</text>
      <text x="126" y="112" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#A5B4FC">👑 FitEmpire: 360° Medical &amp; Physio Care &#160;•&#160; <tspan fill="#F87171">❌ Others: Zero Integrated Healthcare</tspan></text>
    </g>

    <!-- 7. Perks -->
    <g transform="translate(0, 930)">
      <rect x="0" y="0" width="944" height="80" rx="20" fill="rgba(108,99,255,0.09)" stroke="rgba(108,99,255,0.28)" stroke-width="1.2" />
      <text x="40" y="48" font-family="'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="700" fill="#C7D2FE">⚡ 1-Sec Turnstile QR Entry &#160;|&#160; 🏢 Corporate Subsidies &#160;|&#160; 🪙 FitPoints &amp; Rewards</text>
    </g>
  </g>

  <!-- CTA Button -->
  <g transform="translate(540, 1780)">
    <rect x="-260" y="-36" width="520" height="72" rx="36" fill="url(#sLogoBg)" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
    <text x="0" y="8" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="21" font-weight="900" letter-spacing="2" fill="#FFFFFF">
      LAUNCHING SOON &#160;•&#160; STAY TUNED
    </text>
    <text x="0" y="65" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="700" fill="#64748B">
      Available on iOS &amp; Android &#160;•&#160; Corporate &amp; Gym Partner Inquiries
    </text>
  </g>
</svg>
`;

async function generate() {
  console.log('Rendering Pure Vertical Rectangle Posters with exact tiering copy...');

  const vertical4x5Buffer = await sharp(Buffer.from(vertical4x5Svg)).png().toBuffer();
  const vertical9x16Buffer = await sharp(Buffer.from(vertical9x16Svg)).png().toBuffer();

  const destinations = [
    // 4:5 Vertical Feed Poster (1080 x 1350)
    { file: `${REPO_ROOT}/fitempire-admin/public/fitempire-vertical-advantage.png`, data: vertical4x5Buffer },
    { file: `${REPO_ROOT}/fitempire-partner/public/fitempire-vertical-advantage.png`, data: vertical4x5Buffer },
    { file: `${REPO_ROOT}/fitempire-mobile/assets/images/fitempire-vertical-advantage.png`, data: vertical4x5Buffer },
    { file: `${REPO_ROOT}/fitempire-backend/src/main/resources/static/fitempire-vertical-advantage.png`, data: vertical4x5Buffer },

    // 9:16 Full Story / Mobile Poster (1080 x 1920)
    { file: `${REPO_ROOT}/fitempire-admin/public/fitempire-vertical-story.png`, data: vertical9x16Buffer },
    { file: `${REPO_ROOT}/fitempire-partner/public/fitempire-vertical-story.png`, data: vertical9x16Buffer },
    { file: `${REPO_ROOT}/fitempire-mobile/assets/images/fitempire-vertical-story.png`, data: vertical9x16Buffer },
    { file: `${REPO_ROOT}/fitempire-backend/src/main/resources/static/fitempire-vertical-story.png`, data: vertical9x16Buffer },
  ];

  for (const item of destinations) {
    const dir = path.dirname(item.file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(item.file, item.data);
    console.log('Saved:', item.file);
  }

  console.log('All pure vertical rectangle posters updated successfully!');
}

generate().catch(err => {
  console.error('Error generating vertical posters:', err);
  process.exit(1);
});
