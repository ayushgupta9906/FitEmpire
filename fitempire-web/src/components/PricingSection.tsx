import React, { useState } from 'react';
import { 
  Check, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  Zap,
  Percent
} from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (plan: any) => void;
}

type Tenure = '1m' | '3m' | '6m' | '12m';

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [tenure, setTenure] = useState<Tenure>('3m');

  const getMultiplier = (t: Tenure) => {
    switch (t) {
      case '1m': return { months: 1, discount: 0, discountTag: '' };
      case '3m': return { months: 3, discount: 0.15, discountTag: 'SAVE 15%' };
      case '6m': return { months: 6, discount: 0.30, discountTag: 'SAVE 30%' };
      case '12m': return { months: 12, discount: 0.45, discountTag: 'SAVE 45% • BEST VALUE' };
    }
  };

  const currentMultiplier = getMultiplier(tenure);

  const PLANS = [
    {
      id: 'lite',
      name: 'FITPASS LITE',
      tagline: 'Access to 4,500+ standard local gyms',
      baseMonthly: 1299,
      badge: 'STARTER',
      popular: false,
      features: [
        'Access to 4,500+ local gyms in your home city',
        'Daily strength & cardio equipment access',
        'Dynamic 60-second QR check-in pass',
        'Standard customer support'
      ],
      notIncluded: [
        'Premium elite gym chains (Golds, Cult, Anytime)',
        'Personal nutritionist on WhatsApp (FITFEAST)',
        'Multi-city roaming',
        'Pass freeze guarantee'
      ]
    },
    {
      id: 'all-access',
      name: 'FITPASS ALL-ACCESS',
      tagline: 'Universal pass for all 12,000+ gyms & studios',
      baseMonthly: 1999,
      badge: 'MOST POPULAR',
      popular: true,
      features: [
        'Access to ALL 12,000+ gyms (Golds, Cult.fit, Anytime, etc.)',
        'Universal activity access: Gyms, CrossFit, Yoga, Swimming & Zumba',
        '1-Tap pass freeze: Pause subscription for up to 30 days without loss',
        'FITCOACH: AI Workout split generator & recovery tracker',
        'Multi-city roaming across 150+ cities in India',
        'Priority 24/7 customer support'
      ],
      notIncluded: [
        '1-on-1 dedicated clinical nutritionist'
      ]
    },
    {
      id: 'pro-feast',
      name: 'FITPASS COMBO (PASS + FEAST)',
      tagline: 'Complete 360° fitness, diet & online classes',
      baseMonthly: 2899,
      badge: 'COMPLETE SUITE',
      popular: false,
      features: [
        'Everything in FITPASS ALL-ACCESS included',
        'FITFEAST: Dedicated personal nutritionist on WhatsApp',
        'Custom weekly Indian diet charts (High Protein, Vegan, Keto, Jain)',
        'FITPASS-TV: 5,000+ HD on-demand workout sessions',
        'Annual full body preventive health blood workup',
        'Unlimited teleconsultations with sports physicians'
      ],
      notIncluded: []
    }
  ];

  return (
    <section id="plans" className="pricing-purple-section">
      <div className="container">
        
        {/* Section Title */}
        <div className="pricing-header-center">
          <div className="badge-pill-purple">
            <Zap size={13} className="text-purple" />
            <span>FLEXIBLE MEMBERSHIP PASSES</span>
          </div>
          <h2 className="pricing-main-title">
            Choose Your <span className="text-purple-gradient">FitEmpire Pass</span>
          </h2>
          <p className="pricing-main-sub">
            Save up to <strong>70% on gym memberships</strong> with one universal fitness pass.
          </p>

          {/* Tenure Switcher */}
          <div className="tenure-switch-strip executive-card">
            <button 
              className={`ten-pill ${tenure === '1m' ? 'active' : ''}`}
              onClick={() => setTenure('1m')}
            >
              1 Month
            </button>
            <button 
              className={`ten-pill ${tenure === '3m' ? 'active' : ''}`}
              onClick={() => setTenure('3m')}
            >
              <span>3 Months</span>
              <span className="ten-discount-badge">Save 15%</span>
            </button>
            <button 
              className={`ten-pill ${tenure === '6m' ? 'active' : ''}`}
              onClick={() => setTenure('6m')}
            >
              <span>6 Months</span>
              <span className="ten-discount-badge">Save 30%</span>
            </button>
            <button 
              className={`ten-pill ${tenure === '12m' ? 'active' : ''}`}
              onClick={() => setTenure('12m')}
            >
              <span>12 Months</span>
              <span className="ten-discount-badge hot">Save 45%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="pricing-cards-grid">
          {PLANS.map((plan) => {
            const rawMonthly = Math.round(plan.baseMonthly * (1 - currentMultiplier.discount));
            const totalCost = rawMonthly * currentMultiplier.months;

            return (
              <div 
                key={plan.id} 
                className={`plan-item-box executive-card ${plan.popular ? 'highlighted-plan' : ''}`}
              >
                {plan.popular && (
                  <div className="plan-popular-badge">
                    <Sparkles size={13} />
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div className="plan-header-area">
                  <h3 className="plan-title">{plan.name}</h3>
                  <p className="plan-tagline">{plan.tagline}</p>
                </div>

                <div className="plan-pricing-area">
                  <div className="price-digits-row">
                    <span className="curr-sym">₹</span>
                    <span className="val-digits">{rawMonthly.toLocaleString('en-IN')}</span>
                    <span className="per-mon">/ month</span>
                  </div>
                  {currentMultiplier.discount > 0 && (
                    <div className="billed-summary-text">
                      Billed as ₹{totalCost.toLocaleString('en-IN')} for {currentMultiplier.months} months
                    </div>
                  )}
                </div>

                {/* Features list */}
                <div className="plan-features-list">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="feat-row">
                      <div className="feat-check-icon">
                        <Check size={12} color="#059669" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}

                  {plan.notIncluded.map((nfeat, i) => (
                    <div key={`n-${i}`} className="feat-row disabled">
                      <span className="feat-cross-mark">✕</span>
                      <span>{nfeat}</span>
                    </div>
                  ))}
                </div>

                <button 
                  className={`w-full ${plan.popular ? 'btn-purple-primary' : 'btn-purple-secondary'}`}
                  style={{ padding: '13px', fontSize: '14px', borderRadius: '8px' }}
                  onClick={() => onSelectPlan({ ...plan, tenure, rawMonthly, totalCost })}
                >
                  <span>Select {plan.name}</span>
                  <ChevronRight size={16} />
                </button>

                <div className="plan-guarantee-footer">
                  <ShieldCheck size={13} color="#059669" />
                  <span>Instant Activation • 1-Tap Freeze Guarantee</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        .pricing-purple-section {
          padding: 70px 0;
          background: #F8FAFC;
        }
        .pricing-header-center {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 40px;
        }
        .pricing-main-title {
          font-size: 38px;
          font-weight: 900;
          color: #0F172A;
          margin: 12px 0 8px;
        }
        .pricing-main-sub {
          font-size: 16px;
          color: #64748B;
        }
        .tenure-switch-strip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px;
          background: #FFFFFF;
          border-radius: var(--radius-full);
          margin-top: 24px;
          border: 1px solid var(--purple-border);
        }
        .ten-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          background: transparent;
          border: none;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all var(--transition-smooth);
        }
        .ten-pill:hover {
          color: var(--purple-primary);
        }
        .ten-pill.active {
          background: var(--purple-gradient);
          color: #FFFFFF;
          box-shadow: var(--shadow-purple-btn);
        }
        .ten-discount-badge {
          background: #EDE9FE;
          color: var(--purple-dark);
          font-size: 10px;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 4px;
        }
        .ten-discount-badge.hot {
          background: #DCFCE7;
          color: #15803D;
        }
        .pricing-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: stretch;
        }
        .plan-item-box {
          padding: 32px;
          display: flex;
          flex-direction: column;
          position: relative;
          background: #FFFFFF;
        }
        .plan-item-box.highlighted-plan {
          border: 2px solid var(--purple-primary);
          box-shadow: 0 12px 36px rgba(124, 58, 237, 0.15);
        }
        .plan-popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--purple-gradient);
          color: #FFFFFF;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.5px;
          padding: 3px 14px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 4px 10px rgba(124, 58, 237, 0.35);
        }
        .plan-header-area {
          margin-bottom: 18px;
        }
        .plan-title {
          font-size: 20px;
          font-weight: 900;
          color: #0F172A;
        }
        .plan-tagline {
          font-size: 12.5px;
          color: #64748B;
          margin-top: 4px;
        }
        .plan-pricing-area {
          margin-bottom: 22px;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--border-light);
        }
        .price-digits-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .curr-sym {
          font-size: 22px;
          font-weight: 800;
          color: #0F172A;
        }
        .val-digits {
          font-family: var(--font-heading);
          font-size: 44px;
          font-weight: 900;
          color: #0F172A;
          line-height: 1;
        }
        .per-mon {
          font-size: 13px;
          color: #64748B;
          font-weight: 600;
        }
        .billed-summary-text {
          font-size: 12px;
          color: #059669;
          font-weight: 700;
          margin-top: 4px;
        }
        .plan-features-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
          flex: 1;
        }
        .feat-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: #334155;
          line-height: 1.45;
        }
        .feat-row.disabled {
          color: #94A3B8;
          text-decoration: line-through;
        }
        .feat-check-icon {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #DCFCE7;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .feat-cross-mark {
          color: #94A3B8;
          font-size: 11px;
          font-weight: 800;
          margin-right: 4px;
        }
        .plan-guarantee-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 11px;
          color: #64748B;
          margin-top: 10px;
        }

        @media (max-width: 1024px) {
          .pricing-cards-grid {
            grid-template-columns: 1fr;
            max-width: 480px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
};
