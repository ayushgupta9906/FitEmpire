import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  TrendingUp, 
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

interface PartnerSectionProps {
  onOpenPartnerModal: () => void;
}

export const PartnerSection: React.FC<PartnerSectionProps> = ({ onOpenPartnerModal }) => {
  const [dailyVisits, setDailyVisits] = useState(40);
  const payoutPerVisit = 150;
  const monthlyExtraRevenue = dailyVisits * payoutPerVisit * 30;

  return (
    <section id="partners" className="partner-purple-section">
      <div className="container">
        
        {/* Section Heading */}
        <div className="partner-header-center">
          <div className="badge-pill-purple">
            <Building2 size={13} className="text-purple" />
            <span>FOR GYM OWNERS & FITNESS CENTRES</span>
          </div>
          <h2 className="partner-title">
            Monetize Off-Peak Hours & <span className="text-purple-gradient">Earn Guaranteed Weekly Payouts</span>
          </h2>
          <p className="partner-subtitle">
            Join 12,000+ fitness partners across India. Zero onboarding fees, free turnstile scanner hardware, and automated weekly bank payouts.
          </p>
        </div>

        <div className="partner-cards-grid">
          
          {/* Comparison Card */}
          <div className="partner-col-card executive-card">
            <h3 className="card-headline">Why Gyms Choose FitEmpire Over Old Aggregators</h3>

            <div className="comparison-table">
              <div className="comp-row head">
                <span>Features</span>
                <span className="text-purple font-bold">FitEmpire</span>
                <span className="text-muted">Legacy Platforms</span>
              </div>

              <div className="comp-row">
                <span>Payout Frequency</span>
                <span className="text-emerald font-bold">Guaranteed Weekly</span>
                <span className="text-muted">45-60 Days Delay</span>
              </div>

              <div className="comp-row">
                <span>Check-in Technology</span>
                <span className="text-emerald font-bold">0.2s Dynamic QR & Biometric</span>
                <span className="text-muted">Manual Paper Register</span>
              </div>

              <div className="comp-row">
                <span>Onboarding & Listing Cost</span>
                <span className="text-emerald font-bold">₹0 (100% Free)</span>
                <span className="text-muted">₹15,000+ Setup Fee</span>
              </div>

              <div className="comp-row">
                <span>Turnstile Integration</span>
                <span className="text-emerald font-bold">Free Hardware Support</span>
                <span className="text-muted">Not Supported</span>
              </div>
            </div>

            <button className="btn-purple-primary w-full" onClick={onOpenPartnerModal}>
              <Building2 size={16} />
              <span>Register Your Gym in 24 Hours</span>
            </button>
          </div>

          {/* Revenue Estimator Card */}
          <div className="partner-col-card executive-card">
            <div className="p-calc-top">
              <TrendingUp size={18} className="text-purple" />
              <strong>Gym Partner Revenue Estimator</strong>
            </div>

            <div className="revenue-highlight-box">
              <span className="rev-sub-text">Estimated Additional Monthly Revenue:</span>
              <div className="rev-amount-number">₹{monthlyExtraRevenue.toLocaleString('en-IN')}</div>
              <span className="rev-note-text">Paid weekly directly to your verified bank account</span>
            </div>

            <div className="partner-slider-block">
              <div className="slider-label-row">
                <span>Expected FitEmpire Members / Day:</span>
                <strong className="text-purple">{dailyVisits} Check-ins / day</strong>
              </div>
              <input 
                type="range"
                min="10"
                max="150"
                step="5"
                value={dailyVisits}
                onChange={(e) => setDailyVisits(Number(e.target.value))}
                className="purple-range-slider"
              />
            </div>

            <div className="trust-bullets-column">
              <div className="t-b-item">
                <CheckCircle2 size={14} color="#059669" />
                <span>Zero Lock-in Contract: Cancel anytime with 7 days notice</span>
              </div>
              <div className="t-b-item">
                <CheckCircle2 size={14} color="#059669" />
                <span>Automated weekly GST tax invoicing and reception analytics</span>
              </div>
            </div>

            <button className="btn-outline-dark w-full" onClick={onOpenPartnerModal}>
              <span>Talk to Partner Onboarding Manager</span>
              <ChevronRight size={16} />
            </button>
          </div>

        </div>

      </div>

      <style>{`
        .partner-purple-section {
          padding: 70px 0;
          background: #F8FAFC;
        }
        .partner-header-center {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 40px;
        }
        .partner-title {
          font-size: 38px;
          font-weight: 900;
          color: #0F172A;
          margin: 12px 0 8px;
        }
        .partner-subtitle {
          font-size: 16px;
          color: #64748B;
          max-width: 780px;
        }
        .partner-cards-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 30px;
          align-items: stretch;
        }
        .partner-col-card {
          padding: 36px;
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
        }
        .card-headline {
          font-size: 20px;
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 20px;
        }
        .comparison-table {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
          flex: 1;
        }
        .comp-row {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          align-items: center;
          background: #F8FAFC;
          border: 1px solid var(--border-light);
        }
        .comp-row.head {
          background: var(--purple-light);
          border-color: var(--purple-border);
          font-weight: 800;
        }
        .font-bold { font-weight: 700; }
        .text-emerald { color: #059669; }
        .text-muted { color: #64748B; }
        .p-calc-top {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          color: #0F172A;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-light);
        }
        .revenue-highlight-box {
          background: var(--purple-light);
          border: 1.5px solid var(--purple-border);
          padding: 20px;
          border-radius: var(--radius-md);
          text-align: center;
          margin-bottom: 20px;
        }
        .rev-sub-text {
          font-size: 12.5px;
          color: #64748B;
          display: block;
        }
        .rev-amount-number {
          font-family: var(--font-heading);
          font-size: 40px;
          font-weight: 900;
          color: var(--purple-primary);
          line-height: 1.1;
          margin: 4px 0;
        }
        .rev-note-text {
          font-size: 11px;
          color: #334155;
        }
        .partner-slider-block {
          margin-bottom: 20px;
        }
        .trust-bullets-column {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .t-b-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #334155;
        }

        @media (max-width: 960px) {
          .partner-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
