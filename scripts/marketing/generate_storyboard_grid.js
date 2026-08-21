const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/ayush-g/.gemini/antigravity-ide/brain/b15058fd-8a27-4e68-bdfe-ff4b18ff9ac7/scratch/node_modules/sharp');

const REPO_ROOT = 'C:/Users/ayush-g/Desktop/FitEmpire';

// 9-Panel Cinematic Video Storyboard Master Poster (1920 x 1440 - High Res 4:3 Grid)
const storyboardSvg = `
<svg width="1920" height="1440" viewBox="0 0 1920 1440" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Canvas -->
    <linearGradient id="sbBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#04060E" />
      <stop offset="50%" stop-color="#080F1E" />
      <stop offset="100%" stop-color="#020408" />
    </linearGradient>

    <!-- Ambient Glows -->
    <radialGradient id="topGlow" cx="50%" cy="10%" r="55%">
      <stop offset="0%" stop-color="#6C63FF" stop-opacity="0.45" />
      <stop offset="60%" stop-color="#4F46E5" stop-opacity="0.12" />
      <stop offset="90%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Card Backgrounds with Rich Color Tinting -->
    <linearGradient id="c1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(14, 165, 233, 0.16)" />
      <stop offset="100%" stop-color="rgba(15, 23, 42, 0.9)" />
    </linearGradient>

    <linearGradient id="c2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(244, 63, 94, 0.16)" />
      <stop offset="100%" stop-color="rgba(15, 23, 42, 0.9)" />
    </linearGradient>

    <linearGradient id="c3Grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(56, 189, 248, 0.16)" />
      <stop offset="100%" stop-color="rgba(15, 23, 42, 0.9)" />
    </linearGradient>

    <linearGradient id="c4Grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(245, 158, 11, 0.16)" />
      <stop offset="100%" stop-color="rgba(15, 23, 42, 0.9)" />
    </linearGradient>

    <linearGradient id="c5Grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(16, 185, 129, 0.18)" />
      <stop offset="100%" stop-color="rgba(15, 23, 42, 0.9)" />
    </linearGradient>

    <linearGradient id="c6Grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(251, 113, 133, 0.16)" />
      <stop offset="100%" stop-color="rgba(15, 23, 42, 0.9)" />
    </linearGradient>

    <linearGradient id="c7Grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(168, 85, 247, 0.16)" />
      <stop offset="100%" stop-color="rgba(15, 23, 42, 0.9)" />
    </linearGradient>

    <linearGradient id="c8Grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(234, 179, 8, 0.16)" />
      <stop offset="100%" stop-color="rgba(15, 23, 42, 0.9)" />
    </linearGradient>

    <linearGradient id="c9Grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(124, 115, 255, 0.22)" />
      <stop offset="100%" stop-color="rgba(15, 23, 42, 0.9)" />
    </linearGradient>

    <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C73FF" />
      <stop offset="50%" stop-color="#5B50EC" />
      <stop offset="100%" stop-color="#4338CA" />
    </linearGradient>

    <!-- Glow Filter -->
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="125%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="rgba(0,0,0,0.7)"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1440" fill="url(#sbBg)" />
  <rect width="1920" height="1440" fill="url(#topGlow)" />
  <rect x="24" y="24" width="1872" height="1392" rx="36" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1.5" />

  <!-- 1. Header Section -->
  <g transform="translate(960, 65)">
    <rect x="-220" y="0" width="440" height="34" rx="17" fill="rgba(108, 99, 255, 0.25)" stroke="rgba(124, 115, 255, 0.6)" stroke-width="1.2" />
    <circle cx="-190" cy="17" r="5" fill="#FCD34D" />
    <text x="-170" y="22" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="900" letter-spacing="3" fill="#FFFFFF">
      OFFICIAL VIDEO COMMERCIAL STORYBOARD
    </text>

    <!-- Brand Row -->
    <g transform="translate(0, 46)">
      <g transform="translate(-180, 0)">
        <rect x="0" y="0" width="70" height="70" rx="19" fill="url(#logoBg)" />
        <g transform="translate(35, 35) rotate(-45)">
          <rect x="-18" y="-1.5" width="36" height="3" rx="1.5" fill="#FFFFFF" />
          <line x1="-4" y1="-1.5" x2="-4" y2="1.5" stroke="#6366F1" stroke-width="0.8" />
          <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="#6366F1" stroke-width="0.8" />
          <line x1="4" y1="-1.5" x2="4" y2="1.5" stroke="#6366F1" stroke-width="0.8" />
          <rect x="-8" y="-3.5" width="2" height="7" rx="1" fill="#FFFFFF" />
          <rect x="-11" y="-9" width="2.5" height="18" rx="1.2" fill="#FFFFFF" />
          <rect x="-14.5" y="-7" width="2.5" height="14" rx="1.2" fill="#FFFFFF" opacity="0.9" />
          <rect x="6" y="-3.5" width="2" height="7" rx="1" fill="#FFFFFF" />
          <rect x="8.5" y="-9" width="2.5" height="18" rx="1.2" fill="#FFFFFF" />
          <rect x="12" y="-7" width="2.5" height="14" rx="1.2" fill="#FFFFFF" opacity="0.9" />
        </g>
      </g>

      <text x="-95" y="46" font-family="'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" letter-spacing="-1" fill="#FFFFFF">
        FitEmpire
      </text>

      <text x="-93" y="68" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" letter-spacing="4" fill="#38BDF8">
        RULE YOUR FITNESS
      </text>
    </g>

    <text x="0" y="148" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="800" fill="#FFFFFF">
      The 9-Shot Cinematic Commercial Sequence (0:00 – 0:30)
    </text>
    <text x="0" y="174" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#94A3B8">
      100% Truly Unlimited Access • 10,000+ Unified Centers • Dynamic AI Coach • Indian Clinical Nutrition
    </text>
  </g>

  <!-- 2. 9-PANEL STORYBOARD GRID (3 x 3 Cards) -->
  <g transform="translate(85, 275)">

    <!-- ROW 1 -->
    <!-- SHOT 1: Contactless QR Turnstile -->
    <g transform="translate(0, 0)" filter="url(#cardShadow)">
      <rect width="560" height="315" rx="20" fill="url(#c1Grad)" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.5" />
      <rect x="18" y="18" width="524" height="160" rx="14" fill="#071226" />
      
      <!-- Visual Illustration -->
      <g transform="translate(45, 38)">
        <rect x="0" y="0" width="70" height="115" rx="14" fill="#1E293B" stroke="#60A5FA" stroke-width="1.8" />
        <rect x="12" y="24" width="46" height="46" rx="6" fill="#0F172A" />
        <text x="35" y="55" text-anchor="middle" font-size="24" fill="#38BDF8">⚡</text>
        <circle cx="35" cy="95" r="7" fill="#38BDF8" />
      </g>
      <g transform="translate(160, 48)">
        <rect x="0" y="10" width="16" height="90" rx="6" fill="#475569" />
        <line x1="26" y1="55" x2="160" y2="55" stroke="#10B981" stroke-width="8" stroke-linecap="round" />
        <circle cx="165" cy="55" r="10" fill="#10B981" />
        <text x="40" y="42" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="900" fill="#34D399">0.3s UNLOCKED</text>
      </g>
      <rect x="375" y="32" width="150" height="28" rx="8" fill="rgba(16, 185, 129, 0.25)" />
      <text x="450" y="51" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#34D399">INSTANT ACCESS</text>

      <!-- Badge & Description -->
      <rect x="18" y="192" width="90" height="24" rx="6" fill="#38BDF8" />
      <text x="63" y="208" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="900" fill="#04101E">SHOT 01 (0-3s)</text>
      <text x="120" y="210" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">Contactless Turnstile Entry</text>
      <text x="18" y="244" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#CBD5E1">Macro close-up of phone scanning dynamic QR at smart turnstile.</text>
      <text x="18" y="268" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#94A3B8">Instant emerald green pulse; titanium gate glides open in slow motion.</text>
      <text x="18" y="295" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#38BDF8">🎥 Arri Alexa Mini LF • 50mm f/1.2 • Speed Ramping 60fps</text>
    </g>

    <!-- SHOT 2: Heavy Lifting & Chalk Explosion -->
    <g transform="translate(595, 0)" filter="url(#cardShadow)">
      <rect width="560" height="315" rx="20" fill="url(#c2Grad)" stroke="rgba(244, 63, 94, 0.4)" stroke-width="1.5" />
      <rect x="18" y="18" width="524" height="160" rx="14" fill="#1C0912" />
      
      <!-- Visual Illustration -->
      <g transform="translate(180, 50)">
        <circle cx="80" cy="45" r="32" fill="rgba(244, 63, 94, 0.2)" stroke="#FB7185" stroke-width="2" />
        <text x="80" y="58" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="34">🏋️‍♂️</text>
        <circle cx="160" cy="30" r="14" fill="rgba(255,255,255,0.15)" />
        <circle cx="180" cy="55" r="8" fill="rgba(255,255,255,0.25)" />
        <circle cx="140" cy="70" r="10" fill="rgba(255,255,255,0.2)" />
        <text x="210" y="60" font-family="'Segoe UI', Roboto, sans-serif" font-size="28">💥</text>
      </g>
      <rect x="375" y="32" width="150" height="28" rx="8" fill="rgba(244, 63, 94, 0.25)" />
      <text x="450" y="51" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#FDA4AF">EXPLOSIVE POWER</text>

      <rect x="18" y="192" width="90" height="24" rx="6" fill="#FB7185" />
      <text x="63" y="208" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="900" fill="#1E040A">SHOT 02 (3-7s)</text>
      <text x="120" y="210" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">Heavy Deadlift &amp; Chalk Burst</text>
      <text x="18" y="244" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#CBD5E1">Athlete executes heavy deadlift; chalk particles burst into atmospheric light.</text>
      <text x="18" y="268" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#94A3B8">Volumetric cyan rim lighting catching sweat drops &amp; extreme vascularity.</text>
      <text x="18" y="295" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#FB7185">🎥 120 FPS Ultra Slow-Mo • Volumetric God-Rays • Low Tracking</text>
    </g>

    <!-- SHOT 3: Olympic Indoor Aquatic Arena -->
    <g transform="translate(1190, 0)" filter="url(#cardShadow)">
      <rect width="560" height="315" rx="20" fill="url(#c3Grad)" stroke="rgba(14, 165, 233, 0.4)" stroke-width="1.5" />
      <rect x="18" y="18" width="524" height="160" rx="14" fill="#041B2D" />
      
      <!-- Visual Illustration -->
      <g transform="translate(180, 50)">
        <circle cx="80" cy="45" r="32" fill="rgba(56, 189, 248, 0.2)" stroke="#38BDF8" stroke-width="2" />
        <text x="80" y="58" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="34">🏊‍♂️</text>
        <path d="M 130 50 Q 155 35 180 50 T 230 50" fill="none" stroke="#38BDF8" stroke-width="4" stroke-linecap="round" />
        <path d="M 130 65 Q 155 50 180 65 T 230 65" fill="none" stroke="#7DD3FC" stroke-width="3" stroke-linecap="round" />
      </g>
      <rect x="375" y="32" width="150" height="28" rx="8" fill="rgba(14, 165, 233, 0.25)" />
      <text x="450" y="51" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#7DD3FC">ALL-ACCESS POOLS</text>

      <rect x="18" y="192" width="90" height="24" rx="6" fill="#38BDF8" />
      <text x="63" y="208" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="900" fill="#04101E">SHOT 03 (7-10s)</text>
      <text x="120" y="210" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">Olympic Aquatic Lap Swimming</text>
      <text x="18" y="244" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#CBD5E1">Athlete cutting through crystal blue water with powerful butterfly stroke.</text>
      <text x="18" y="268" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#94A3B8">Underwater caustics dancing across tiles; showing multi-sport freedom.</text>
      <text x="18" y="295" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#38BDF8">🎥 Underwater Housing • 35mm Anamorphic • Dual Daily Sessions</text>
    </g>

    <!-- ROW 2 -->
    <!-- SHOT 4: MMA Combat & Boxing -->
    <g transform="translate(0, 340)" filter="url(#cardShadow)">
      <rect width="560" height="315" rx="20" fill="url(#c4Grad)" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1.5" />
      <rect x="18" y="18" width="524" height="160" rx="14" fill="#241604" />
      
      <!-- Visual Illustration -->
      <g transform="translate(180, 50)">
        <circle cx="70" cy="45" r="32" fill="rgba(245, 158, 11, 0.2)" stroke="#FBBF24" stroke-width="2" />
        <text x="70" y="58" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="34">🥊</text>
        <circle cx="160" cy="45" r="32" fill="rgba(245, 158, 11, 0.2)" stroke="#FBBF24" stroke-width="2" />
        <text x="160" y="58" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="34">🥋</text>
      </g>
      <rect x="375" y="32" width="150" height="28" rx="8" fill="rgba(245, 158, 11, 0.25)" />
      <text x="450" y="51" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#FCD34D">MMA &amp; CROSSFIT</text>

      <rect x="18" y="192" width="90" height="24" rx="6" fill="#FBBF24" />
      <text x="63" y="208" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="900" fill="#1C1002">SHOT 04 (10-14s)</text>
      <text x="120" y="210" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">High-Intensity MMA Kick</text>
      <text x="18" y="244" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#CBD5E1">Spinning wheel kick against heavy leather bag; sweat flying on impact.</text>
      <text x="18" y="268" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#94A3B8">Camera whip-pans smoothly into serene aerial yoga silks in golden hour.</text>
      <text x="18" y="295" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#FBBF24">🎥 Bolt Cinebot High-Speed Arm • Whip-Pan Match Cut</text>
    </g>

    <!-- SHOT 5: FitCoach Dynamic AI Engine -->
    <g transform="translate(595, 340)" filter="url(#cardShadow)">
      <rect width="560" height="315" rx="20" fill="url(#c5Grad)" stroke="rgba(16, 185, 129, 0.5)" stroke-width="1.8" />
      <rect x="18" y="18" width="524" height="160" rx="14" fill="#042017" />
      
      <!-- Visual Illustration -->
      <g transform="translate(160, 48)">
        <circle cx="50" cy="45" r="32" fill="rgba(16, 185, 129, 0.25)" stroke="#34D399" stroke-width="2" />
        <text x="50" y="58" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="34">🤖</text>
        <rect x="110" y="20" width="130" height="52" rx="10" fill="#0B3024" stroke="#10B981" stroke-width="1.5" />
        <text x="175" y="42" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#6EE7B7">ADAPTIVE SETS</text>
        <text x="175" y="62" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="900" fill="#FFFFFF">+2.5kg OVERLOAD</text>
      </g>
      <rect x="360" y="32" width="165" height="28" rx="8" fill="rgba(16, 185, 129, 0.25)" />
      <text x="442" y="51" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#6EE7B7">EQUIPMENT-AWARE AI</text>

      <rect x="18" y="192" width="90" height="24" rx="6" fill="#34D399" />
      <text x="63" y="208" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="900" fill="#021C10">SHOT 05 (14-18s)</text>
      <text x="120" y="210" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">FitCoach AI Adaptive Overload</text>
      <text x="18" y="244" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#CBD5E1">Semi-transparent holographic AR UI projects around gym machines.</text>
      <text x="18" y="268" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#94A3B8">Auto-calculates sets, reps, and weights based on real-time recovery.</text>
      <text x="18" y="295" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#34D399">🎥 Sci-Fi Holographic Overlay • Progressive Overload Engine</text>
    </g>

    <!-- SHOT 6: FitFeast Indian Clinical Nutrition -->
    <g transform="translate(1190, 340)" filter="url(#cardShadow)">
      <rect width="560" height="315" rx="20" fill="url(#c6Grad)" stroke="rgba(244, 63, 94, 0.4)" stroke-width="1.5" />
      <rect x="18" y="18" width="524" height="160" rx="14" fill="#240D10" />
      
      <!-- Visual Illustration -->
      <g transform="translate(160, 48)">
        <circle cx="50" cy="45" r="32" fill="rgba(244, 63, 94, 0.25)" stroke="#FB7185" stroke-width="2" />
        <text x="50" y="58" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="34">🥗</text>
        <rect x="110" y="20" width="130" height="52" rx="10" fill="#361017" stroke="#F43F5E" stroke-width="1.5" />
        <text x="175" y="42" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#FDA4AF">INDIAN MACROS</text>
        <text x="175" y="62" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="900" fill="#FFFFFF">44g PROTEIN | 454 kcal</text>
      </g>
      <rect x="360" y="32" width="165" height="28" rx="8" fill="rgba(244, 63, 94, 0.25)" />
      <text x="442" y="51" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#FDA4AF">AUTHENTIC INDIAN DIET</text>

      <rect x="18" y="192" width="90" height="24" rx="6" fill="#FB7185" />
      <text x="63" y="208" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="900" fill="#1E040A">SHOT 06 (18-22s)</text>
      <text x="120" y="210" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">FitFeast Regional Macro Engine</text>
      <text x="18" y="244" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#CBD5E1">Top-down culinary shot: grilled paneer, sprouted moong &amp; dal bowl.</text>
      <text x="18" y="268" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#94A3B8">Interactive macro ring displays [44g Protein • 454 kcal] on tablet screen.</text>
      <text x="18" y="295" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#FB7185">🎥 4K Culinary Macro • 35mm f/1.8 • Warm Appetizing Tone</text>
    </g>

    <!-- ROW 3 -->
    <!-- SHOT 7: FitEmpire Care Telehealth -->
    <g transform="translate(0, 680)" filter="url(#cardShadow)">
      <rect width="560" height="315" rx="20" fill="url(#c7Grad)" stroke="rgba(168, 85, 247, 0.4)" stroke-width="1.5" />
      <rect x="18" y="18" width="524" height="160" rx="14" fill="#1C0E2B" />
      
      <!-- Visual Illustration -->
      <g transform="translate(180, 50)">
        <circle cx="70" cy="45" r="32" fill="rgba(168, 85, 247, 0.25)" stroke="#C084FC" stroke-width="2" />
        <text x="70" y="58" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="34">🩺</text>
        <circle cx="160" cy="45" r="32" fill="rgba(168, 85, 247, 0.25)" stroke="#C084FC" stroke-width="2" />
        <text x="160" y="58" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="34">👨‍⚕️</text>
      </g>
      <rect x="360" y="32" width="165" height="28" rx="8" fill="rgba(168, 85, 247, 0.25)" />
      <text x="442" y="51" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#E9D5FF">IN-APP CLINICAL CARE</text>

      <rect x="18" y="192" width="90" height="24" rx="6" fill="#C084FC" />
      <text x="63" y="208" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="900" fill="#1B042C">SHOT 07 (22-25s)</text>
      <text x="120" y="210" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">1-on-1 Doctor &amp; Physio Consult</text>
      <text x="18" y="244" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#CBD5E1">Athlete on video call with certified sports physiotherapist for recovery.</text>
      <text x="18" y="268" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#94A3B8">Preventative injury support and personalized mobility rehab routine.</text>
      <text x="18" y="295" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#C084FC">🎥 Telehealth Video UI • Clinical Safety • 1-on-1 Consultation</text>
    </g>

    <!-- SHOT 8: 1-Tap Free Freeze & Rollover -->
    <g transform="translate(595, 680)" filter="url(#cardShadow)">
      <rect width="560" height="315" rx="20" fill="url(#c8Grad)" stroke="rgba(234, 179, 8, 0.4)" stroke-width="1.5" />
      <rect x="18" y="18" width="524" height="160" rx="14" fill="#241B04" />
      
      <!-- Visual Illustration -->
      <g transform="translate(180, 50)">
        <circle cx="70" cy="45" r="32" fill="rgba(234, 179, 8, 0.25)" stroke="#FACC15" stroke-width="2" />
        <text x="70" y="58" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="34">⏸️</text>
        <circle cx="160" cy="45" r="32" fill="rgba(234, 179, 8, 0.25)" stroke="#FACC15" stroke-width="2" />
        <text x="160" y="58" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="34">🪙</text>
      </g>
      <rect x="360" y="32" width="165" height="28" rx="8" fill="rgba(234, 179, 8, 0.25)" />
      <text x="442" y="51" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#FDE047">ZERO MONEY LOSS</text>

      <rect x="18" y="192" width="90" height="24" rx="6" fill="#FBBF24" />
      <text x="63" y="208" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="900" fill="#1C1002">SHOT 08 (25-27s)</text>
      <text x="120" y="210" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">1-Tap Free Freeze &amp; Rollovers</text>
      <text x="18" y="244" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#CBD5E1">User taps 'Freeze Plan' during travel; unused days roll over automatically.</text>
      <text x="18" y="268" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#94A3B8">FitPoints coin rewards drop smoothly into user wallet without penalty fees.</text>
      <text x="18" y="295" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#FBBF24">🎥 Smooth UI Micro-Animation • Double-Entry Wallet Sync</text>
    </g>

    <!-- SHOT 9: Brand Climax & 3D Logo Reveal -->
    <g transform="translate(1190, 680)" filter="url(#cardShadow)">
      <rect width="560" height="315" rx="20" fill="url(#c9Grad)" stroke="rgba(124, 115, 255, 0.6)" stroke-width="1.8" />
      <rect x="18" y="18" width="524" height="160" rx="14" fill="#0F0C2C" />
      
      <!-- Visual Illustration -->
      <g transform="translate(180, 50)">
        <circle cx="70" cy="45" r="32" fill="rgba(108, 99, 255, 0.3)" stroke="#818CF8" stroke-width="2" />
        <text x="70" y="58" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="34">👑</text>
        <circle cx="160" cy="45" r="32" fill="rgba(108, 99, 255, 0.3)" stroke="#818CF8" stroke-width="2" />
        <text x="160" y="58" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="34">⚡</text>
      </g>
      <rect x="360" y="32" width="165" height="28" rx="8" fill="rgba(108, 99, 255, 0.3)" />
      <text x="442" y="51" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#C7D2FE">100% UNRESTRICTED</text>

      <rect x="18" y="192" width="90" height="24" rx="6" fill="#818CF8" />
      <text x="63" y="208" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="900" fill="#0A0724">SHOT 09 (27-30s)</text>
      <text x="120" y="210" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">3D Crown Emblem &amp; CTA Outro</text>
      <text x="18" y="244" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#CBD5E1">Athlete stands triumphant; 3D glowing chrome barbell crown materializes.</text>
      <text x="18" y="268" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" font-weight="500" fill="#94A3B8">Bold typography: 'FitEmpire • RULE YOUR FITNESS • LAUNCHING SOON'.</text>
      <text x="18" y="295" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#818CF8">🎥 3D CGI Particle Climax • Deep Obsidian Fade • Epic Audio Boom</text>
    </g>
  </g>

  <!-- 3. Bottom Banner -->
  <g transform="translate(960, 1370)">
    <rect x="-420" y="-30" width="840" height="60" rx="30" fill="url(#logoBg)" stroke="rgba(255,255,255,0.25)" stroke-width="1.2" />
    <text x="0" y="7" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="900" letter-spacing="2" fill="#FFFFFF">
      THE FITEMPIRE STANDARD &#160;•&#160; 100% TRULY UNLIMITED FITNESS FREEDOM
    </text>
  </g>
</svg>
`;

async function generate() {
  console.log('Rendering 9-in-1 Master Storyboard Grid Poster...');
  const buffer = await sharp(Buffer.from(storyboardSvg)).png().toBuffer();

  const destinations = [
    `${REPO_ROOT}/assets/marketing/fitempire-storyboard-grid.png`,
    `${REPO_ROOT}/fitempire-admin/public/fitempire-storyboard-grid.png`,
    `${REPO_ROOT}/fitempire-partner/public/fitempire-storyboard-grid.png`,
    `${REPO_ROOT}/fitempire-mobile/assets/images/fitempire-storyboard-grid.png`,
  ];

  for (const dest of destinations) {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dest, buffer);
    console.log('Saved:', dest);
  }

  console.log('9-in-1 Storyboard Grid updated with vibrant contrast!');
}

generate().catch(err => {
  console.error('Error generating storyboard grid:', err);
  process.exit(1);
});
