import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  QrCode, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Dumbbell, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Scan, 
  Building2, 
  Zap,
  Sparkles,
  Send
} from 'lucide-react';

interface AppShowcaseProps {
  onOpenAppModal: () => void;
}

export const AppShowcase: React.FC<AppShowcaseProps> = ({ onOpenAppModal }) => {
  const [activeApp, setActiveApp] = useState<'member' | 'partner'>('member');
  const [memberScreen, setMemberScreen] = useState<'ticket' | 'explore' | 'ai' | 'freeze'>('ticket');
  const [qrTimer, setQrTimer] = useState(58);
  const [scanVerified, setScanVerified] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [linkSent, setLinkSent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setQrTimer((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length >= 10) {
      setLinkSent(true);
      setTimeout(() => setLinkSent(false), 4000);
    }
  };

  const handleSimulateScan = () => {
    setScanVerified(true);
    setTimeout(() => setScanVerified(false), 3000);
  };

  return (
    <section id="apps" className="app-showcase-purple-section">
      <div className="container">
        
        {/* Main Card */}
        <div className="app-showcase-main-card executive-card">
          
          {/* Left Column */}
          <div className="app-info-col">
            <div className="badge-pill-purple">
              <Sparkles size={13} className="text-purple" />
              <span>INTERACTIVE DUAL-APP ECOSYSTEM</span>
            </div>

            <h2 className="app-showcase-title">
              Experience the Future of Fitness with <br />
              <span className="text-purple-gradient">FitEmpire Mobile</span>
            </h2>

            <p className="app-showcase-desc">
              Whether you are a member entering Gold’s Gym with an encrypted 60-second dynamic QR pass, or a gym manager verifying turnstile check-ins in 0.2 seconds — our technology powers frictionless fitness.
            </p>

            {/* SMS Link Form */}
            <form onSubmit={handleSendLink} className="sms-purple-form">
              <div className="sms-input-group">
                <input 
                  type="tel" 
                  placeholder="Enter 10-digit Mobile (+91)" 
                  value={mobileNumber} 
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="sms-field"
                  required
                />
                <button type="submit" className="btn-purple-primary btn-send-sms">
                  <Send size={14} />
                  <span>{linkSent ? '✓ Sent SMS!' : 'Send App Link'}</span>
                </button>
              </div>
            </form>

            {/* Official Store Buttons & QR */}
            <div className="store-buttons-and-qr">
              <div className="store-btns-col">
                <button className="btn-store-badge" onClick={onOpenAppModal}>
                  <Smartphone size={22} className="text-purple" />
                  <div className="badge-txt">
                    <span className="b-sub">Download on the</span>
                    <strong className="b-main">App Store (iOS)</strong>
                  </div>
                </button>

                <button className="btn-store-badge" onClick={onOpenAppModal}>
                  <Smartphone size={22} className="text-purple" />
                  <div className="badge-txt">
                    <span className="b-sub">GET IT ON</span>
                    <strong className="b-main">Google Play Store</strong>
                  </div>
                </button>
              </div>

              <div className="qr-scan-card">
                <div className="qr-img-box">
                  <QrCode size={84} color="#0F172A" />
                </div>
                <span className="qr-label">Scan with Phone</span>
              </div>
            </div>

            {/* App Toggle Tabs */}
            <div className="app-mode-switch">
              <button 
                className={`switch-tab ${activeApp === 'member' ? 'active' : ''}`}
                onClick={() => setActiveApp('member')}
              >
                1. Member App Simulator
              </button>
              <button 
                className={`switch-tab ${activeApp === 'partner' ? 'active' : ''}`}
                onClick={() => setActiveApp('partner')}
              >
                2. Partner Scanner Simulator
              </button>
            </div>
          </div>

          {/* Right Column: Phone Mockup */}
          <div className="app-phone-col">
            <div className="phone-bezel">
              
              <div className="phone-top-notch">
                <div className="camera-dot"></div>
                <div className="speaker-bar"></div>
              </div>

              <div className="phone-screen">
                {activeApp === 'member' ? (
                  <div className="member-screen-content">
                    
                    {/* Header */}
                    <div className="phone-header-row">
                      <div>
                        <div className="user-greeting">Hi Rahul Sharma 👋</div>
                        <div className="pass-status-sub">Empire All-Access Member</div>
                      </div>
                      <span className="live-status-pill">● ACTIVE</span>
                    </div>

                    {/* Navigation Pills inside Phone */}
                    <div className="phone-sub-nav">
                      <button 
                        className={`p-nav-pill ${memberScreen === 'ticket' ? 'active' : ''}`}
                        onClick={() => setMemberScreen('ticket')}
                      >
                        60s QR
                      </button>
                      <button 
                        className={`p-nav-pill ${memberScreen === 'explore' ? 'active' : ''}`}
                        onClick={() => setMemberScreen('explore')}
                      >
                        Gyms
                      </button>
                      <button 
                        className={`p-nav-pill ${memberScreen === 'ai' ? 'active' : ''}`}
                        onClick={() => setMemberScreen('ai')}
                      >
                        AI ARIA
                      </button>
                      <button 
                        className={`p-nav-pill ${memberScreen === 'freeze' ? 'active' : ''}`}
                        onClick={() => setMemberScreen('freeze')}
                      >
                        Freeze
                      </button>
                    </div>

                    {/* View 1: 60s QR Ticket */}
                    {memberScreen === 'ticket' && (
                      <div className="phone-card-content">
                        <div className="ticket-gym-info">
                          <span className="t-gym-name">Gold's Gym • Koramangala</span>
                          <span className="t-badge-universal">Universal Gym Pass</span>
                        </div>

                        <div className="ticket-qr-center">
                          <QrCode size={110} color="#0F172A" />
                          <div className="dynamic-timer-row">
                            <RefreshCw size={12} className="spinning-timer" />
                            <span>Auto-refreshes in {qrTimer}s</span>
                          </div>
                        </div>

                        <div className="ticket-bottom-details">
                          <div className="t-det-item">
                            <span>Dynamic Code</span>
                            <strong>EMP-8842</strong>
                          </div>
                          <div className="t-det-item">
                            <span>Reserved Slot</span>
                            <strong>07:00 AM</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* View 2: Gym Explorer */}
                    {memberScreen === 'explore' && (
                      <div className="phone-card-content">
                        <div className="phone-gym-row">
                          <div>
                            <strong>Cult.Fit Elite Indiranagar</strong>
                            <div className="p-g-sub">CrossFit • 1.2 km away</div>
                          </div>
                          <span className="p-rating">4.9 ★</span>
                        </div>
                        <div className="phone-gym-row">
                          <div>
                            <strong>Anytime Fitness HSR</strong>
                            <div className="p-g-sub">24/7 Access • 2.1 km away</div>
                          </div>
                          <span className="p-rating">4.8 ★</span>
                        </div>
                        <div className="phone-gym-row">
                          <div>
                            <strong>Prana Yoga Studio</strong>
                            <div className="p-g-sub">Reformer Pilates • 3.4 km</div>
                          </div>
                          <span className="p-rating">5.0 ★</span>
                        </div>
                      </div>
                    )}

                    {/* View 3: AI ARIA */}
                    {memberScreen === 'ai' && (
                      <div className="phone-card-content">
                        <div className="aria-card-title">
                          <Sparkles size={14} color="#7C3AED" />
                          <span>ARIA Daily Routine • Chest & Arms</span>
                        </div>
                        <div className="aria-exercise-item">1. Incline Dumbbell Press (4 × 10)</div>
                        <div className="aria-exercise-item">2. Weighted Chest Dips (3 × 12)</div>
                        <div className="aria-exercise-item">3. Cable Flyes & Tricep Pushdown (4 × 15)</div>
                      </div>
                    )}

                    {/* View 4: Freeze */}
                    {memberScreen === 'freeze' && (
                      <div className="phone-card-content text-center">
                        <ShieldCheck size={32} color="#059669" />
                        <h4 style={{ fontSize: 14, margin: '8px 0 4px', color: '#0F172A' }}>1-Tap Pass Freeze</h4>
                        <p style={{ fontSize: 11, color: '#64748B', marginBottom: 12 }}>
                          Traveling or sick? Pause your validity for up to 30 days with zero penalty.
                        </p>
                        <button className="btn-purple-primary" style={{ padding: '8px 16px', fontSize: 11 }}>
                          Freeze Pass for 7 Days
                        </button>
                      </div>
                    )}

                    {/* Bottom link */}
                    <div className="phone-bottom-cta">
                      <a href="http://localhost:8081" target="_blank" rel="noreferrer" className="phone-open-link">
                        <span>Launch Full Mobile Web App</span>
                        <ArrowRight size={12} />
                      </a>
                    </div>

                  </div>
                ) : (
                  <div className="partner-screen-content">
                    <div className="phone-header-row">
                      <div>
                        <div className="user-greeting">Gold's Gym Turnstile</div>
                        <div className="pass-status-sub">Reception Gate #1</div>
                      </div>
                      <span className="live-status-pill bg-indigo">GATE ONLINE</span>
                    </div>

                    <div className="partner-scanner-viewport">
                      <div className="scanner-target-reticle">
                        <Scan size={36} className="text-purple" />
                        <span>Ready to scan member QR</span>
                        {scanVerified && (
                          <div className="access-granted-popup">
                            <CheckCircle2 size={16} color="#059669" />
                            <span>ACCESS GRANTED • TURNSTILE OPEN</span>
                          </div>
                        )}
                      </div>

                      <button className="btn-purple-primary w-full" onClick={handleSimulateScan}>
                        <Zap size={14} />
                        <span>Simulate Member QR Scan</span>
                      </button>
                    </div>

                    <div className="partner-metrics-grid">
                      <div className="p-m-box">
                        <strong>142</strong>
                        <span>Today's Check-ins</span>
                      </div>
                      <div className="p-m-box">
                        <strong>₹21,300</strong>
                        <span>Weekly Payout</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>

      <style>{`
        .app-showcase-purple-section {
          padding: 60px 0;
          background: #FFFFFF;
        }
        .app-showcase-main-card {
          background: linear-gradient(180deg, #FAF8FF 0%, #FFFFFF 100%);
          border: 1.5px solid var(--purple-border);
          border-radius: var(--radius-xl);
          padding: 50px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: center;
        }
        .app-showcase-title {
          font-size: 38px;
          font-weight: 900;
          color: #0F172A;
          line-height: 1.2;
          margin: 14px 0 16px;
        }
        .app-showcase-desc {
          font-size: 15.5px;
          color: #475569;
          line-height: 1.65;
          margin-bottom: 26px;
        }
        .sms-purple-form {
          margin-bottom: 26px;
          max-width: 460px;
        }
        .sms-input-group {
          display: flex;
          gap: 8px;
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          padding: 6px;
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-subtle);
        }
        .sms-field {
          flex: 1;
          border: none;
          outline: none;
          padding: 8px 12px;
          font-size: 13.5px;
          color: #0F172A;
          font-family: inherit;
        }
        .btn-send-sms {
          padding: 8px 18px;
          font-size: 13px;
        }
        .store-buttons-and-qr {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }
        .store-btns-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .btn-store-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 18px;
          background: #FFFFFF;
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-smooth);
        }
        .btn-store-badge:hover {
          border-color: var(--purple-primary);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
          transform: translateY(-2px);
        }
        .badge-txt {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .b-sub {
          font-size: 9px;
          color: var(--text-muted);
          font-weight: 700;
        }
        .b-main {
          font-size: 13px;
          color: #0F172A;
          font-weight: 800;
        }
        .qr-scan-card {
          background: #FFFFFF;
          border: 1px solid var(--purple-border);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          box-shadow: var(--shadow-subtle);
        }
        .qr-label {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--purple-dark);
        }
        .app-mode-switch {
          display: flex;
          gap: 10px;
        }
        .switch-tab {
          padding: 8px 16px;
          background: #F1F5F9;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          font-size: 12.5px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all var(--transition-smooth);
        }
        .switch-tab.active {
          background: var(--purple-gradient);
          color: #FFFFFF;
          border-color: transparent;
        }

        /* Phone Bezel */
        .app-phone-col {
          display: flex;
          justify-content: center;
        }
        .phone-bezel {
          width: 300px;
          height: 560px;
          background: #0B0F19;
          border: 8px solid #1E293B;
          border-radius: 40px;
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .phone-top-notch {
          height: 24px;
          background: #0B0F19;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .camera-dot {
          width: 8px;
          height: 8px;
          background: #1E293B;
          border-radius: 50%;
        }
        .speaker-bar {
          width: 40px;
          height: 4px;
          background: #1E293B;
          border-radius: 2px;
        }
        .phone-screen {
          flex: 1;
          background: #F8FAFC;
          padding: 12px;
          display: flex;
          flex-direction: column;
        }
        .phone-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .user-greeting {
          font-size: 12px;
          font-weight: 800;
          color: #0F172A;
        }
        .pass-status-sub {
          font-size: 9.5px;
          color: #64748B;
        }
        .live-status-pill {
          background: #DCFCE7;
          color: #15803D;
          font-size: 9px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .live-status-pill.bg-indigo {
          background: #EDE9FE;
          color: #6D28D9;
        }
        .phone-sub-nav {
          display: flex;
          gap: 4px;
          margin-bottom: 10px;
        }
        .p-nav-pill {
          flex: 1;
          padding: 4px 0;
          background: #E2E8F0;
          border: none;
          border-radius: 4px;
          font-size: 9.5px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
        }
        .p-nav-pill.active {
          background: #7C3AED;
          color: #FFFFFF;
        }
        .phone-card-content {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 12px;
          box-shadow: var(--shadow-subtle);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ticket-gym-info {
          text-align: center;
        }
        .t-gym-name {
          font-size: 12px;
          font-weight: 800;
          color: #0F172A;
          display: block;
        }
        .t-badge-universal {
          font-size: 9px;
          font-weight: 700;
          color: var(--purple-primary);
        }
        .ticket-qr-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          margin: 6px 0;
        }
        .dynamic-timer-row {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 9.5px;
          font-weight: 700;
          color: var(--purple-primary);
        }
        .spinning-timer {
          animation: spin 3s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .ticket-bottom-details {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #64748B;
          border-top: 1px dashed var(--border-light);
          padding-top: 6px;
        }
        .t-det-item {
          display: flex;
          flex-direction: column;
        }
        .t-det-item strong {
          color: #0F172A;
        }
        .phone-gym-row {
          display: flex;
          justify-content: space-between;
          font-size: 10.5px;
        }
        .p-g-sub {
          font-size: 8.5px;
          color: #64748B;
        }
        .p-rating {
          font-weight: 800;
          color: #D97706;
          font-size: 10.5px;
        }
        .aria-card-title {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10.5px;
          font-weight: 800;
          color: var(--purple-primary);
        }
        .aria-exercise-item {
          font-size: 9.5px;
          color: #334155;
          padding: 4px 6px;
          background: #F8FAFC;
          border-radius: 4px;
        }
        .phone-bottom-cta {
          margin-top: auto;
          text-align: center;
          padding-top: 8px;
        }
        .phone-open-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 700;
          color: var(--purple-primary);
        }

        /* Partner UI */
        .partner-scanner-viewport {
          background: #FFFFFF;
          border-radius: 8px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .scanner-target-reticle {
          width: 140px;
          height: 130px;
          border: 2px dashed var(--purple-primary);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 9px;
          color: #64748B;
          position: relative;
        }
        .access-granted-popup {
          position: absolute;
          background: #DCFCE7;
          color: #15803D;
          font-size: 8.5px;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
          text-align: center;
        }
        .partner-metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 10px;
        }
        .p-m-box {
          background: #FFFFFF;
          padding: 8px;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          text-align: center;
          border: 1px solid var(--border-light);
        }
        .p-m-box strong {
          font-size: 13px;
          color: #0F172A;
        }
        .p-m-box span {
          font-size: 8.5px;
          color: #64748B;
        }

        @media (max-width: 960px) {
          .app-showcase-main-card {
            grid-template-columns: 1fr;
            padding: 28px;
          }
          .store-buttons-and-qr {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  );
};
