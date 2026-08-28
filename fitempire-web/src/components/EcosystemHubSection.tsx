import React, { useState } from 'react';
import { 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  ArrowRight, 
  ExternalLink,
  Zap,
  Lock,
  Layers,
  Activity,
  CheckCircle2
} from 'lucide-react';

interface EcosystemHubProps {
  onOpenAppModal: () => void;
  onOpenPartnerModal: () => void;
  onOpenAdminModal: () => void;
}

const APPS = [
  {
    id: 'main-app',
    category: 'CONSUMER APPLICATION',
    name: '1. FitEmpire Member Pass App',
    tagline: 'Universal Gym Pass, 60s Dynamic QR & AI Coach',
    desc: 'The member app providing universal turnstile access across 12,000+ partner gyms, custom ARIA workout splits, and 1-tap pass freeze.',
    icon: Smartphone,
    color: '#7C3AED',
    badge: 'MEMBER PASS',
    badgeClass: 'purple',
    actionText: 'Open Member App',
    actionUrl: 'https://firmempireapp.netlify.app',
    isModal: false,
    stats: ['12,000+ Gyms', '60s Dynamic QR', 'ARIA AI Coach', '1-Tap Freeze']
  },
  {
    id: 'partner-app',
    category: 'GYM RECEPTION PORTAL',
    name: '2. Partner Reception Scanner App',
    tagline: '0.2s Turnstile Scanner & Weekly Payout Hub',
    desc: 'The receptionist and gym manager gateway. Scan member QR codes in under 0.2s, track daily footfall, and review automated weekly bank payouts.',
    icon: Building2,
    color: '#6366F1',
    badge: 'PARTNER GATEWAY',
    badgeClass: 'indigo',
    actionText: 'Open Partner Portal',
    actionUrl: 'https://fitempirepartner.netlify.app',
    isModal: false,
    stats: ['0.2s Turnstile Scan', 'Weekly Bank Payout', '100% Tax GST Invoicing', 'Zero Lock-in']
  },
  {
    id: 'admin-app',
    category: 'ENTERPRISE GOVERNANCE',
    name: '3. FitEmpire Super Admin Console',
    tagline: 'Platform Intelligence, Gym Approvals & Finance',
    desc: 'The central administration console for platform governance. Approve partner gym listings, monitor member growth, and disburse weekly payouts.',
    icon: ShieldCheck,
    color: '#0F172A',
    badge: 'ADMIN CONSOLE',
    badgeClass: 'dark',
    actionText: 'Launch Admin Console',
    actionUrl: 'https://fitempireadmin.netlify.app',
    isModal: false,
    stats: ['Gym Approvals', 'Settlement Payouts', 'User Management', 'Real-time BI']
  },
  {
    id: 'showcase-app',
    category: 'INTERACTIVE SANDBOX',
    name: '4. Live Interactive App Showcase',
    tagline: 'Try Member & Partner Apps Directly in Browser',
    desc: 'Experience full interactive simulations of both the Member App and Partner Reception Scanner with live turnstile triggers directly on this site.',
    icon: Sparkles,
    color: '#D97706',
    badge: 'LIVE SIMULATOR',
    badgeClass: 'amber',
    actionText: 'Launch Simulator',
    actionUrl: '#apps',
    isModal: false,
    stats: ['Live Dynamic QR Timer', 'Simulate Turnstile Entry', 'Workout Slot Booking', 'No Install Needed']
  }
];

export const EcosystemHubSection: React.FC<EcosystemHubProps> = ({ 
  onOpenAppModal, 
  onOpenPartnerModal,
  onOpenAdminModal 
}) => {
  return (
    <section id="ecosystem-apps" className="ecosystem-hub-section">
      <div className="container">
        
        {/* Header */}
        <div className="hub-header-center">
          <div className="badge-pill-purple">
            <Layers size={13} className="text-purple" />
            <span>THE COMPLETE FITEMPIRE ECOSYSTEM</span>
          </div>
          <h2 className="hub-title">
            One Core Platform. <span className="text-purple-gradient">4 Powerful Ecosystem Portals.</span>
          </h2>
          <p className="hub-subtitle">
            From the consumer mobile pass to gym reception turnstile scanners and the central super admin console — all unified under <strong>fitempire.tech</strong>.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="hub-cards-grid">
          {APPS.map((app) => {
            const Icon = app.icon;

            return (
              <div key={app.id} className="hub-app-card executive-card">
                
                <div className="hub-card-header">
                  <div className={`hub-icon-wrap ${app.badgeClass}`}>
                    <Icon size={22} />
                  </div>
                  <span className={`hub-badge-pill ${app.badgeClass}`}>
                    {app.badge}
                  </span>
                </div>

                <div className="hub-card-body">
                  <span className="hub-category-label">{app.category}</span>
                  <h3 className="hub-app-name">{app.name}</h3>
                  <p className="hub-app-tagline">{app.tagline}</p>
                  <p className="hub-app-desc">{app.desc}</p>

                  <div className="hub-stats-grid">
                    {app.stats.map((stat, i) => (
                      <div key={i} className="hub-stat-item">
                        <CheckCircle2 size={13} color="#059669" />
                        <span>{stat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hub-card-footer">
                  {app.id === 'showcase-app' ? (
                    <a href={app.actionUrl} className="btn-purple-primary w-full">
                      <Sparkles size={15} />
                      <span>{app.actionText}</span>
                      <ArrowRight size={14} />
                    </a>
                  ) : app.id === 'admin-app' ? (
                    <button onClick={onOpenAdminModal} className="btn-outline-dark w-full">
                      <ShieldCheck size={15} />
                      <span>{app.actionText}</span>
                      <ArrowRight size={14} />
                    </button>
                  ) : (
                    <a 
                      href={app.actionUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className={app.id === 'main-app' ? 'btn-purple-primary w-full' : 'btn-purple-secondary w-full'}
                    >
                      <Icon size={15} />
                      <span>{app.actionText}</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        .ecosystem-hub-section {
          padding: 80px 0 60px;
          background: #FFFFFF;
        }
        .hub-header-center {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 48px;
        }
        .hub-title {
          font-size: 38px;
          font-weight: 900;
          color: #0F172A;
          margin: 12px 0 8px;
          line-height: 1.2;
        }
        .hub-subtitle {
          font-size: 16px;
          color: #64748B;
          max-width: 820px;
        }
        .hub-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px;
        }
        .hub-app-card {
          padding: 32px;
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          transition: all var(--transition-smooth);
        }
        .hub-app-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(124, 58, 237, 0.12);
        }
        .hub-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }
        .hub-icon-wrap {
          width: 46px;
          height: 46px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hub-icon-wrap.purple { background: var(--purple-light); color: var(--purple-primary); }
        .hub-icon-wrap.indigo { background: #EEF2FF; color: #4F46E5; }
        .hub-icon-wrap.dark { background: #0F172A; color: #FFFFFF; }
        .hub-icon-wrap.amber { background: #FEF3C7; color: #D97706; }

        .hub-badge-pill {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.5px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }
        .hub-badge-pill.purple { background: var(--purple-light); color: var(--purple-primary); border: 1px solid var(--purple-border); }
        .hub-badge-pill.indigo { background: #EEF2FF; color: #4F46E5; border: 1px solid #C7D2FE; }
        .hub-badge-pill.dark { background: #0F172A; color: #FFFFFF; }
        .hub-badge-pill.amber { background: #FEF3C7; color: #B45309; border: 1px solid #FDE68A; }

        .hub-card-body {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .hub-category-label {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #94A3B8;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .hub-app-name {
          font-size: 20px;
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 4px;
        }
        .hub-app-tagline {
          font-size: 13px;
          font-weight: 700;
          color: var(--purple-primary);
          margin-bottom: 10px;
        }
        .hub-app-desc {
          font-size: 13.5px;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 18px;
        }
        .hub-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 24px;
          background: #F8FAFC;
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-light);
        }
        .hub-stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: #334155;
          font-weight: 600;
        }
        .hub-card-footer {
          margin-top: auto;
        }

        @media (max-width: 960px) {
          .hub-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
