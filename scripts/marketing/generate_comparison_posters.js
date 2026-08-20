const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/ayush-g/.gemini/antigravity-ide/brain/b15058fd-8a27-4e68-bdfe-ff4b18ff9ac7/scratch/node_modules/sharp');

const REPO_ROOT = 'C:/Users/ayush-g/Desktop/FitEmpire';

// 1. Portrait 4:5 Rectangle 2-Column Comparison Poster (1080 x 1350)
const portraitComparisonSvg = `
<svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Dark Obsidian Canvas -->
    <linearGradient id="cBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050811" />
      <stop offset="45%" stop-color="#091122" />
      <stop offset="100%" stop-color="#03050C" />
    </linearGradient>

    <!-- Glowing Top-Center Ambient Light -->
    <radialGradient id="cTopGlow" cx="50%" cy="13%" r="52%">
      <stop offset="0%" stop-color="#6C63FF" stop-opacity="0.45" />
      <stop offset="50%" stop-color="#4F46E5" stop-opacity="0.15" />
      <stop offset="85%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Official In-App Logo Gradient -->
    <linearGradient id="cLogoBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C73FF" />
      <stop offset="50%" stop-color="#5B50EC" />
      <stop offset="100%" stop-color="#4338CA" />
    </linearGradient>

    <!-- Rich 3D Drop Shadow -->
    <filter id="cLogoShadow" x="-25%" y="-25%" width="150%" height="160%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#6366F1" flood-opacity="0.75"/>
    </filter>

    <!-- Comparison Card Styles -->
    <linearGradient id="oldPassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(244, 63, 94, 0.08)" />
      <stop offset="100%" stop-color="rgba(244, 63, 94, 0.02)" />
    </linearGradient>

    <linearGradient id="fitEmpireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(16, 185, 129, 0.12)" />
      <stop offset="100%" stop-color="rgba(108, 99, 255, 0.12)" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1350" fill="url(#cBg)" />
  <rect width="1080" height="1350" fill="url(#cTopGlow)" />
  <rect x="24" y="24" width="1032" height="1302" rx="36" fill="none" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1.5" />

  <!-- 1. Header Section -->
  <g transform="translate(540, 68)">
    <rect x="-165" y="0" width="330" height="36" rx="18" fill="rgba(108, 99, 255, 0.22)" stroke="rgba(124, 115, 255, 0.55)" stroke-width="1.2" />
    <circle cx="-135" cy="18" r="5" fill="#FCD34D" />
    <text x="-115" y="23" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="900" letter-spacing="2.5" fill="#FFFFFF">
      THE FITEMPIRE DIFFERENCE
    </text>

    <!-- Brand Identity Row -->
    <g transform="translate(0, 48)">
      <g transform="translate(-180, 0)" filter="url(#cLogoShadow)">
        <rect x="0" y="0" width="80" height="80" rx="22" fill="url(#cLogoBg)" />
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

    <!-- Main Title -->
    <text x="0" y="160" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="900" fill="#FFFFFF">
      Built Different. Built For You.
    </text>
    <text x="0" y="190" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="#94A3B8">
      Why India's next-gen fitness ecosystem gives you 100% unrestricted freedom.
    </text>
  </g>

  <!-- 2. Comparison Table Header (Traditional vs FitEmpire) -->
  <g transform="translate(68, 320)">
    <!-- Column Headers -->
    <rect x="0" y="0" width="460" height="48" rx="14" fill="rgba(244, 63, 94, 0.12)" stroke="rgba(244, 63, 94, 0.3)" stroke-width="1" />
    <text x="230" y="30" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#FDA4AF">
      ❌ Traditional Fitness Passes
    </text>

    <rect x="484" y="0" width="460" height="48" rx="14" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.45)" stroke-width="1.2" />
    <text x="714" y="30" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#6EE7B7">
      👑 The FitEmpire Standard
    </text>
  </g>

  <!-- 3. 6 Key Differentiator Comparison Rows -->
  <g transform="translate(68, 385)">
    
    <!-- Row 1: True Unlimited vs Partial Fragmented Plans -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="460" height="110" rx="18" fill="url(#oldPassGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <text x="24" y="36" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FDA4AF">Fragmented &amp; Partial Plans</text>
      <text x="24" y="62" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#94A3B8">Split into restrictive tiers (180 capped at 3/week, 360 capped at 1/day).</text>
      <text x="24" y="88" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#F43F5E">⛔ Confusing restrictions &amp; visit caps</text>

      <rect x="484" y="0" width="460" height="110" rx="18" fill="url(#fitEmpireGrad)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1.2" />
      <text x="508" y="36" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#34D399">100% Truly Unlimited Access</text>
      <text x="508" y="62" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#E2E8F0">No partial plan tiers. Complete unrestricted freedom across all partner centers.</text>
      <text x="508" y="88" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#6EE7B7">✓ Truly unlimited access on every membership</text>
    </g>

    <!-- Row 2: Facility & Multi-Gym Access -->
    <g transform="translate(0, 122)">
      <rect x="0" y="0" width="460" height="110" rx="18" fill="url(#oldPassGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <text x="24" y="36" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FDA4AF">Tier-Gated Gym Access</text>
      <text x="24" y="62" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#94A3B8">Separate pricing tiers required for premium centers vs standard gyms.</text>
      <text x="24" y="88" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#F43F5E">⛔ Inconvenient center lock-outs</text>

      <rect x="484" y="0" width="460" height="110" rx="18" fill="url(#fitEmpireGrad)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1.2" />
      <text x="508" y="36" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#34D399">10,000+ Unified Network</text>
      <text x="508" y="62" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#E2E8F0">All-access entry to premier gyms, yoga studios, MMA, CrossFit &amp; pools.</text>
      <text x="508" y="88" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#6EE7B7">✓ 1 Pass unlocks all partner fitness centers</text>
    </g>

    <!-- Row 3: Freeze & Rollovers -->
    <g transform="translate(0, 244)">
      <rect x="0" y="0" width="460" height="110" rx="18" fill="url(#oldPassGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <text x="24" y="36" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FDA4AF">Use-It-Or-Lose-It Expiry</text>
      <text x="24" y="62" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#94A3B8">Unused days expire at month-end • Paid freeze penalty fees when traveling.</text>
      <text x="24" y="88" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#F43F5E">⛔ Paid money is wasted when traveling</text>

      <rect x="484" y="0" width="460" height="110" rx="18" fill="url(#fitEmpireGrad)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1.2" />
      <text x="508" y="36" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#34D399">Free Freeze &amp; Auto Rollovers</text>
      <text x="508" y="62" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#E2E8F0">Pause your plan with 1-tap anytime. Unused days roll over automatically.</text>
      <text x="508" y="88" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#6EE7B7">✓ Zero penalty • 100% money protection</text>
    </g>

    <!-- Row 4: AI Coaching & Intelligence -->
    <g transform="translate(0, 366)">
      <rect x="0" y="0" width="460" height="110" rx="18" fill="url(#oldPassGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <text x="24" y="36" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FDA4AF">Static Pre-Made PDFs</text>
      <text x="24" y="62" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#94A3B8">Fixed generic workout templates that ignore gym machines &amp; live progress.</text>
      <text x="24" y="88" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#F43F5E">⛔ No dynamic live adaptation</text>

      <rect x="484" y="0" width="460" height="110" rx="18" fill="url(#fitEmpireGrad)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1.2" />
      <text x="508" y="36" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#34D399">FitCoach AI Dynamic Engine</text>
      <text x="508" y="62" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#E2E8F0">Adaptive AI modifies sets &amp; weights based on available equipment.</text>
      <text x="508" y="88" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#6EE7B7">✓ Progressive overload &amp; recovery tracking</text>
    </g>

    <!-- Row 5: Indian Macro Nutrition -->
    <g transform="translate(0, 488)">
      <rect x="0" y="0" width="460" height="110" rx="18" fill="url(#oldPassGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <text x="24" y="36" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FDA4AF">Generic Western Diet Plans</text>
      <text x="24" y="62" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#94A3B8">Impractical meal charts with uncurated regional ingredients.</text>
      <text x="24" y="88" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#F43F5E">⛔ Low adherence for Indian households</text>

      <rect x="484" y="0" width="460" height="110" rx="18" fill="url(#fitEmpireGrad)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1.2" />
      <text x="508" y="36" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#34D399">FitFeast Indian Nutrition</text>
      <text x="508" y="62" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#E2E8F0">Personalized macro meal plans for North/South Indian regional diets.</text>
      <text x="508" y="88" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#6EE7B7">✓ Veg, Non-Veg &amp; High-Protein custom plans</text>
    </g>

    <!-- Row 6: Telehealth & Physio Care -->
    <g transform="translate(0, 610)">
      <rect x="0" y="0" width="460" height="110" rx="18" fill="url(#oldPassGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <text x="24" y="36" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FDA4AF">Zero Integrated Healthcare</text>
      <text x="24" y="62" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#94A3B8">No doctors, injury recovery support or direct clinician access.</text>
      <text x="24" y="88" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#F43F5E">⛔ Fitness without clinical health safety</text>

      <rect x="484" y="0" width="460" height="110" rx="18" fill="url(#fitEmpireGrad)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1.2" />
      <text x="508" y="36" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#34D399">FitEmpire Care Telehealth</text>
      <text x="508" y="62" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#E2E8F0">1-on-1 consultations with verified doctors, certified dietitians &amp; physios.</text>
      <text x="508" y="88" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#6EE7B7">✓ Preventative 360° health &amp; injury care</text>
    </g>
  </g>

  <!-- 4. Footer CTA (NO WEBSITE URL) -->
  <g transform="translate(540, 1238)">
    <rect x="-240" y="-34" width="480" height="68" rx="34" fill="url(#cLogoBg)" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
    <text x="0" y="8" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" letter-spacing="2" fill="#FFFFFF">
      LAUNCHING SOON &#160;•&#160; STAY TUNED
    </text>
    <text x="0" y="60" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="700" fill="#64748B">
      Available on iOS &amp; Android &#160;•&#160; Corporate &amp; Gym Partner Inquiries Welcome
    </text>
  </g>
</svg>
`;

// 2. Landscape 16:9 2-Column Comparison Poster (1920 x 1080)
const landscapeComparisonSvg = `
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050811" />
      <stop offset="45%" stop-color="#091122" />
      <stop offset="100%" stop-color="#03050C" />
    </linearGradient>

    <radialGradient id="lTopGlow" cx="50%" cy="10%" r="50%">
      <stop offset="0%" stop-color="#6C63FF" stop-opacity="0.45" />
      <stop offset="50%" stop-color="#4F46E5" stop-opacity="0.15" />
      <stop offset="85%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="lLogoBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C73FF" />
      <stop offset="50%" stop-color="#5B50EC" />
      <stop offset="100%" stop-color="#4338CA" />
    </linearGradient>

    <filter id="lLogoShadow" x="-25%" y="-25%" width="150%" height="160%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#6366F1" flood-opacity="0.75"/>
    </filter>

    <linearGradient id="oldPassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(244, 63, 94, 0.08)" />
      <stop offset="100%" stop-color="rgba(244, 63, 94, 0.02)" />
    </linearGradient>

    <linearGradient id="fitEmpireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(16, 185, 129, 0.14)" />
      <stop offset="100%" stop-color="rgba(108, 99, 255, 0.14)" />
    </linearGradient>
  </defs>

  <rect width="1920" height="1080" fill="url(#lBg)" />
  <rect width="1920" height="1080" fill="url(#lTopGlow)" />
  <rect x="24" y="24" width="1872" height="1032" rx="36" fill="none" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1.5" />

  <!-- 1. Header -->
  <g transform="translate(960, 65)">
    <rect x="-170" y="0" width="340" height="36" rx="18" fill="rgba(108, 99, 255, 0.22)" stroke="rgba(124, 115, 255, 0.55)" stroke-width="1.2" />
    <circle cx="-135" cy="18" r="5" fill="#FCD34D" />
    <text x="-115" y="23" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="900" letter-spacing="2.5" fill="#FFFFFF">
      THE FITEMPIRE DIFFERENCE
    </text>

    <!-- Brand Header -->
    <g transform="translate(0, 48)">
      <g transform="translate(-180, 0)" filter="url(#lLogoShadow)">
        <rect x="0" y="0" width="76" height="76" rx="20" fill="url(#lLogoBg)" />
        <rect x="1" y="1" width="74" height="74" rx="19" fill="none" stroke="rgba(255, 255, 255, 0.4)" stroke-width="1.5" />
        <g transform="translate(38, 38) rotate(-45)">
          <rect x="-20" y="-1.5" width="40" height="3" rx="1.5" fill="#FFFFFF" />
          <line x1="-5" y1="-1.5" x2="-5" y2="1.5" stroke="#6366F1" stroke-width="0.9" stroke-linecap="round" />
          <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="#6366F1" stroke-width="0.9" stroke-linecap="round" />
          <line x1="5" y1="-1.5" x2="5" y2="1.5" stroke="#6366F1" stroke-width="0.9" stroke-linecap="round" />
          <rect x="-8.5" y="-4" width="2" height="8" rx="1" fill="#FFFFFF" />
          <rect x="-12.5" y="-10.5" width="3" height="21" rx="1.5" fill="#FFFFFF" />
          <rect x="-16" y="-8" width="3" height="16" rx="1.5" fill="#FFFFFF" opacity="0.92" />
          <rect x="-19.5" y="-5.5" width="2.5" height="11" rx="1.2" fill="#FFFFFF" opacity="0.85" />
          <rect x="6.5" y="-4" width="2" height="8" rx="1" fill="#FFFFFF" />
          <rect x="9.5" y="-10.5" width="3" height="21" rx="1.5" fill="#FFFFFF" />
          <rect x="13" y="-8" width="3" height="16" rx="1.5" fill="#FFFFFF" opacity="0.92" />
          <rect x="17" y="-5.5" width="2.5" height="11" rx="1.2" fill="#FFFFFF" opacity="0.85" />
        </g>
      </g>

      <text x="-80" y="50" font-family="'Segoe UI', Roboto, sans-serif" font-size="50" font-weight="900" letter-spacing="-1.5" fill="#FFFFFF">
        FitEmpire
      </text>

      <text x="-78" y="72" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="900" letter-spacing="4" fill="#38BDF8">
        RULE YOUR FITNESS
      </text>
    </g>

    <text x="0" y="160" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="900" fill="#FFFFFF">
      Built Different. Built For You.
    </text>
  </g>

  <!-- 2. Comparison Grid: 3x2 Matrix of Differentiators -->
  <g transform="translate(100, 275)">
    <!-- Column Headers -->
    <rect x="0" y="0" width="840" height="42" rx="12" fill="rgba(244, 63, 94, 0.12)" stroke="rgba(244, 63, 94, 0.3)" stroke-width="1" />
    <text x="420" y="27" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#FDA4AF">
      ❌ Traditional Fitness Passes
    </text>

    <rect x="880" y="0" width="840" height="42" rx="12" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.45)" stroke-width="1.2" />
    <text x="1300" y="27" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#6EE7B7">
      👑 The FitEmpire Standard
    </text>

    <!-- Comparison Item 1: True Unlimited vs Fragmented Plans -->
    <g transform="translate(0, 56)">
      <rect x="0" y="0" width="840" height="88" rx="16" fill="url(#oldPassGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <text x="24" y="34" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FDA4AF">Fragmented &amp; Partial Plans</text>
      <text x="24" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#94A3B8">Split into restrictive tiers (180 capped at 3/week, 360 capped at 1/day)</text>

      <rect x="880" y="0" width="840" height="88" rx="16" fill="url(#fitEmpireGrad)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1.2" />
      <text x="904" y="34" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#34D399">100% Truly Unlimited Access</text>
      <text x="904" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#E2E8F0">No partial plan tiers. Complete unrestricted freedom across all partner centers</text>
    </g>

    <!-- Comparison Item 2: Multi-Gym Access -->
    <g transform="translate(0, 154)">
      <rect x="0" y="0" width="840" height="88" rx="16" fill="url(#oldPassGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <text x="24" y="34" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FDA4AF">Tier-Gated Gym Access</text>
      <text x="24" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#94A3B8">Separate pricing tiers required for premium centers vs standard gyms</text>

      <rect x="880" y="0" width="840" height="88" rx="16" fill="url(#fitEmpireGrad)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1.2" />
      <text x="904" y="34" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#34D399">10,000+ Unified Network</text>
      <text x="904" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#E2E8F0">All-access entry to gyms, yoga studios, MMA, CrossFit &amp; swimming pools</text>
    </g>

    <!-- Comparison Item 3: Free Freeze & Rollovers -->
    <g transform="translate(0, 252)">
      <rect x="0" y="0" width="840" height="88" rx="16" fill="url(#oldPassGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <text x="24" y="34" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FDA4AF">Use-It-Or-Lose-It Expiry</text>
      <text x="24" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#94A3B8">Unused days expire at month-end • Paid freeze penalty fees when traveling</text>

      <rect x="880" y="0" width="840" height="88" rx="16" fill="url(#fitEmpireGrad)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1.2" />
      <text x="904" y="34" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#34D399">Free Freeze &amp; Auto Rollovers</text>
      <text x="904" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#E2E8F0">1-Tap instant free plan freeze • Unused pass days automatically carry forward</text>
    </g>

    <!-- Comparison Item 4: AI Coaching & Nutrition -->
    <g transform="translate(0, 350)">
      <rect x="0" y="0" width="840" height="88" rx="16" fill="url(#oldPassGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <text x="24" y="34" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FDA4AF">Static Pre-Made PDFs</text>
      <text x="24" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#94A3B8">Fixed generic workout templates &amp; westernized meal charts with zero adaptation</text>

      <rect x="880" y="0" width="840" height="88" rx="16" fill="url(#fitEmpireGrad)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1.2" />
      <text x="904" y="34" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#34D399">FitCoach AI &amp; Indian Nutrition</text>
      <text x="904" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#E2E8F0">Dynamic real-time workout generator + customized North/South Indian macro plans</text>
    </g>

    <!-- Comparison Item 5: Telehealth Care -->
    <g transform="translate(0, 448)">
      <rect x="0" y="0" width="840" height="88" rx="16" fill="url(#oldPassGrad)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <text x="24" y="34" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FDA4AF">Zero Integrated Healthcare</text>
      <text x="24" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#94A3B8">No doctors, injury recovery physios or certified clinical nutritionist consultations</text>

      <rect x="880" y="0" width="840" height="88" rx="16" fill="url(#fitEmpireGrad)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1.2" />
      <text x="904" y="34" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#34D399">FitEmpire Care Telehealth</text>
      <text x="904" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#E2E8F0">In-app 1-on-1 consultations with verified doctors, physiotherapists &amp; dietitians</text>
    </g>
  </g>

  <!-- 3. Footer CTA -->
  <g transform="translate(960, 970)">
    <rect x="-240" y="-32" width="480" height="64" rx="32" fill="url(#lLogoBg)" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
    <text x="0" y="8" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="19" font-weight="900" letter-spacing="2" fill="#FFFFFF">
      LAUNCHING SOON &#160;•&#160; STAY TUNED
    </text>
    <text x="0" y="55" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#64748B">
      Available on iOS &amp; Android &#160;•&#160; Corporate &amp; Gym Partner Inquiries Welcome
    </text>
  </g>
</svg>
`;

async function generate() {
  console.log('Rendering Truly Unlimited 2-Column Comparison Posters...');

  const portraitBuffer = await sharp(Buffer.from(portraitComparisonSvg)).png().toBuffer();
  const landscapeBuffer = await sharp(Buffer.from(landscapeComparisonSvg)).png().toBuffer();

  const destinations = [
    // Root marketing asset directory
    { file: `${REPO_ROOT}/assets/marketing/fitempire-difference-portrait.png`, data: portraitBuffer },
    { file: `${REPO_ROOT}/assets/marketing/fitempire-difference-landscape.png`, data: landscapeBuffer },

    // App & Service public folders
    { file: `${REPO_ROOT}/fitempire-admin/public/fitempire-difference-portrait.png`, data: portraitBuffer },
    { file: `${REPO_ROOT}/fitempire-admin/public/fitempire-difference-landscape.png`, data: landscapeBuffer },
    { file: `${REPO_ROOT}/fitempire-partner/public/fitempire-difference-portrait.png`, data: portraitBuffer },
    { file: `${REPO_ROOT}/fitempire-partner/public/fitempire-difference-landscape.png`, data: landscapeBuffer },
    { file: `${REPO_ROOT}/fitempire-mobile/assets/images/fitempire-difference-portrait.png`, data: portraitBuffer },
    { file: `${REPO_ROOT}/fitempire-mobile/assets/images/fitempire-difference-landscape.png`, data: landscapeBuffer },
    { file: `${REPO_ROOT}/fitempire-backend/src/main/resources/static/fitempire-difference-portrait.png`, data: portraitBuffer },
    { file: `${REPO_ROOT}/fitempire-backend/src/main/resources/static/fitempire-difference-landscape.png`, data: landscapeBuffer },
  ];

  for (const item of destinations) {
    const dir = path.dirname(item.file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(item.file, item.data);
    console.log('Saved:', item.file);
  }

  console.log('Truly Unlimited 2-Column comparison posters updated successfully!');
}

generate().catch(err => {
  console.error('Error generating comparison posters:', err);
  process.exit(1);
});
