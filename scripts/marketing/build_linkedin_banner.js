const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/ayush-g/.gemini/antigravity-ide/brain/b15058fd-8a27-4e68-bdfe-ff4b18ff9ac7/scratch/node_modules/sharp');

const REPO_ROOT = 'C:/Users/ayush-g/Desktop/FitEmpire';

// Official LinkedIn Company Page Header Standard (1584 x 396)
const linkedinBannerSvg = `
<svg width="1584" height="396" viewBox="0 0 1584 396" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070A13" />
      <stop offset="50%" stop-color="#0C1222" />
      <stop offset="100%" stop-color="#080D1A" />
    </linearGradient>

    <!-- Ambient Purple Glow behind Logo -->
    <radialGradient id="ambientGlow" cx="20%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#6C63FF" stop-opacity="0.32" />
      <stop offset="60%" stop-color="#4F46E5" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Ambient Cyan Glow on Right -->
    <radialGradient id="rightGlow" cx="85%" cy="50%" r="45%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.18" />
      <stop offset="70%" stop-color="#0C1222" stop-opacity="0" />
    </radialGradient>

    <!-- Official In-App Logo Squircle Gradient -->
    <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6C63FF" />
      <stop offset="50%" stop-color="#5548E5" />
      <stop offset="100%" stop-color="#4338CA" />
    </linearGradient>

    <!-- Logo Drop Shadow -->
    <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#4F46E5" flood-opacity="0.6"/>
    </filter>

    <!-- Subtle Glass Pill Background -->
    <linearGradient id="pillBg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(255, 255, 255, 0.07)" />
      <stop offset="100%" stop-color="rgba(255, 255, 255, 0.03)" />
    </linearGradient>
  </defs>

  <!-- 1. Background Base -->
  <rect width="1584" height="396" fill="url(#bg)" />
  <rect width="1584" height="396" fill="url(#ambientGlow)" />
  <rect width="1584" height="396" fill="url(#rightGlow)" />

  <!-- Subtle Executive Grid / Accent Line -->
  <line x1="0" y1="395" x2="1584" y2="395" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
  <line x1="0" y1="1" x2="1584" y2="1" stroke="rgba(255, 255, 255, 0.06)" stroke-width="1" />

  <!-- 2. BRAND IDENTITY (LEFT SECTION) -->
  <g transform="translate(80, 88)">
    <!-- Official In-App Squircle Logo Badge -->
    <g filter="url(#logoShadow)">
      <rect x="0" y="0" width="220" height="220" rx="60" ry="60" fill="url(#logoBg)" />
      <rect x="1.5" y="1.5" width="217" height="217" rx="58.5" ry="58.5" fill="none" stroke="rgba(255, 255, 255, 0.28)" stroke-width="3" />
      
      <!-- Exact 45-Degree High-End Fitness Dumbbell -->
      <g transform="translate(110, 110) rotate(-45)">
        <rect x="-56" y="-4.5" width="112" height="9" rx="4.5" fill="#FFFFFF" />
        <line x1="-12" y1="-3.5" x2="-12" y2="3.5" stroke="#6366F1" stroke-width="2" stroke-linecap="round" />
        <line x1="0" y1="-3.5" x2="0" y2="3.5" stroke="#6366F1" stroke-width="2" stroke-linecap="round" />
        <line x1="12" y1="-3.5" x2="12" y2="3.5" stroke="#6366F1" stroke-width="2" stroke-linecap="round" />

        <!-- Left Weight Plates -->
        <rect x="-24" y="-11" width="5.5" height="22" rx="2.5" fill="#FFFFFF" />
        <rect x="-34" y="-31" width="8" height="62" rx="4" fill="#FFFFFF" />
        <rect x="-44" y="-24" width="8" height="48" rx="4" fill="#FFFFFF" opacity="0.92" />
        <rect x="-53" y="-17" width="7" height="34" rx="3.5" fill="#FFFFFF" opacity="0.85" />

        <!-- Right Weight Plates -->
        <rect x="18.5" y="-11" width="5.5" height="22" rx="2.5" fill="#FFFFFF" />
        <rect x="26" y="-31" width="8" height="62" rx="4" fill="#FFFFFF" />
        <rect x="36" y="-24" width="8" height="48" rx="4" fill="#FFFFFF" opacity="0.92" />
        <rect x="46" y="-17" width="7" height="34" rx="3.5" fill="#FFFFFF" opacity="0.85" />
      </g>
    </g>

    <!-- Brand Typography: FitEmpire -->
    <text x="256" y="112" font-family="'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="88" font-weight="900" letter-spacing="-1.5" fill="#FFFFFF">
      FitEmpire
    </text>

    <!-- Tagline -->
    <text x="260" y="156" font-family="'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="20" font-weight="800" letter-spacing="4" fill="#38BDF8">
      RULE YOUR FITNESS
    </text>

    <text x="260" y="196" font-family="'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="15" font-weight="600" fill="#94A3B8">
      India's Next-Gen All-Access Fitness &amp; Corporate Wellness Ecosystem
    </text>
  </g>

  <!-- 3. VALUE PROPOSITION PILLS (RIGHT SECTION) -->
  <g transform="translate(1000, 100)">
    
    <!-- Top Row: Multi-Gym Access & Corporate Benefits -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="240" height="52" rx="14" fill="url(#pillBg)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" />
      <circle cx="28" cy="26" r="6" fill="#10B981" />
      <text x="44" y="32" font-family="'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="15" font-weight="700" fill="#FFFFFF">
        Multi-Gym Network
      </text>
    </g>

    <g transform="translate(256, 0)">
      <rect x="0" y="0" width="240" height="52" rx="14" fill="url(#pillBg)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" />
      <circle cx="28" cy="26" r="6" fill="#6C63FF" />
      <text x="44" y="32" font-family="'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="15" font-weight="700" fill="#FFFFFF">
        Corporate Wellness
      </text>
    </g>

    <!-- Bottom Row: AI Coach & Telehealth Care -->
    <g transform="translate(0, 68)">
      <rect x="0" y="0" width="240" height="52" rx="14" fill="url(#pillBg)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" />
      <circle cx="28" cy="26" r="6" fill="#38BDF8" />
      <text x="44" y="32" font-family="'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="15" font-weight="700" fill="#FFFFFF">
        FitCoach AI Engine
      </text>
    </g>

    <g transform="translate(256, 68)">
      <rect x="0" y="0" width="240" height="52" rx="14" fill="url(#pillBg)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" />
      <circle cx="28" cy="26" r="6" fill="#F43F5E" />
      <text x="44" y="32" font-family="'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="15" font-weight="700" fill="#FFFFFF">
        Proactive Telehealth
      </text>
    </g>

    <!-- Website & Store Footer Badge -->
    <g transform="translate(0, 142)">
      <text x="8" y="24" font-family="'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="14" font-weight="700" fill="#64748B">
        Available on iOS &amp; Android &#160;•&#160; <tspan fill="#38BDF8">fitempire.tech</tspan>
      </text>
    </g>
  </g>
</svg>
`;

async function build() {
  console.log('Rendering Professional LinkedIn Banner with official in-app FitEmpire Logo...');
  const bannerBuffer = await sharp(Buffer.from(linkedinBannerSvg)).png().toBuffer();

  const destinations = [
    `${REPO_ROOT}/fitempire-admin/public/linkedin-banner.png`,
    `${REPO_ROOT}/fitempire-admin/public/linkedin-cover.png`,
    `${REPO_ROOT}/fitempire-partner/public/linkedin-banner.png`,
    `${REPO_ROOT}/fitempire-mobile/assets/images/linkedin-banner.png`,
    `${REPO_ROOT}/fitempire-backend/src/main/resources/static/linkedin-banner.png`
  ];

  for (const file of destinations) {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, bannerBuffer);
    console.log('Saved:', file);
  }
}

build().catch(console.error);
