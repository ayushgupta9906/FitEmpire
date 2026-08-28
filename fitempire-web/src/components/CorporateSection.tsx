import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  Calculator,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface CorporateSectionProps {
  onOpenCorporateModal: () => void;
}

export const CorporateSection: React.FC<CorporateSectionProps> = ({ onOpenCorporateModal }) => {
  const [employeeCount, setEmployeeCount] = useState(200);

  const estimatedSavings = Math.round(employeeCount * 12500);
  const corporateCostPerEmployee = employeeCount > 500 ? 799 : 999;

  return (
    <section id="corporate" className="corporate-purple-section">
      <div className="container">
        
        <div className="corporate-main-box executive-card">
          <div className="corp-info-left">
            <div className="badge-pill-purple">
              <Building2 size={13} className="text-purple" />
              <span>FITEMPIRE CORPORATE WELLNESS</span>
            </div>
            
            <h2 className="corp-title">
              Empower Your Workforce with <br />
              <span className="text-purple-gradient">India’s Premier Corporate Wellness Pass</span>
            </h2>

            <p className="corp-paragraph">
              Equip your remote, hybrid, and in-office teams with universal access to 12,000+ fitness centres nationwide. Reduce healthcare insurance claims, boost retention, and build an energetic company culture.
            </p>

            <div className="corp-features-list">
              <div className="c-feat-row">
                <CheckCircle2 size={16} color="#059669" />
                <span>Pan-India multi-city gym & studio access for distributed teams</span>
              </div>
              <div className="c-feat-row">
                <CheckCircle2 size={16} color="#059669" />
                <span>100% Tax Deductible under corporate employee wellness budget</span>
              </div>
              <div className="c-feat-row">
                <CheckCircle2 size={16} color="#059669" />
                <span>Centralized HR Dashboard with real-time employee engagement metrics</span>
              </div>
            </div>

            <button className="btn-purple-primary" onClick={onOpenCorporateModal}>
              <Building2 size={16} />
              <span>Request Corporate Proposal & Pitch Deck</span>
            </button>
          </div>

          <div className="corp-calc-right">
            <div className="calculator-box executive-card">
              <div className="calc-header-row">
                <Calculator size={18} className="text-purple" />
                <strong>Corporate Wellness Cost & ROI Simulator</strong>
              </div>

              <div className="calc-slider-group">
                <div className="slider-label-row">
                  <span>Number of Employees:</span>
                  <strong className="text-purple">{employeeCount} Employees</strong>
                </div>
                <input 
                  type="range"
                  min="20"
                  max="2000"
                  step="10"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(Number(e.target.value))}
                  className="purple-range-slider"
                />
              </div>

              <div className="roi-metrics-grid">
                <div className="roi-card">
                  <span className="roi-value text-emerald">₹{estimatedSavings.toLocaleString('en-IN')}</span>
                  <span className="roi-label">Est. Annual Productivity Gain</span>
                </div>
                <div className="roi-card">
                  <span className="roi-value text-purple">₹{corporateCostPerEmployee}/mo</span>
                  <span className="roi-label">Subsidized Cost / Employee</span>
                </div>
              </div>

              <button className="btn-outline-dark w-full" onClick={onOpenCorporateModal}>
                <span>Download Sample Pitch Deck</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .corporate-purple-section {
          padding: 70px 0;
          background: #FFFFFF;
        }
        .corporate-main-box {
          padding: 48px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: center;
          background: linear-gradient(180deg, #FAF8FF 0%, #FFFFFF 100%);
          border: 1.5px solid var(--purple-border);
        }
        .corp-title {
          font-size: 34px;
          font-weight: 900;
          color: #0F172A;
          line-height: 1.2;
          margin: 14px 0 16px;
        }
        .corp-paragraph {
          font-size: 15px;
          color: #475569;
          line-height: 1.65;
          margin-bottom: 24px;
        }
        .corp-features-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 30px;
        }
        .c-feat-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #334155;
          font-weight: 600;
        }
        .calculator-box {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 24px;
          box-shadow: var(--shadow-subtle);
        }
        .calc-header-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          color: #0F172A;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-light);
        }
        .calc-slider-group {
          margin-bottom: 20px;
        }
        .slider-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #334155;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .purple-range-slider {
          width: 100%;
          accent-color: var(--purple-primary);
          cursor: pointer;
        }
        .roi-metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }
        .roi-card {
          background: #F8FAFC;
          border: 1px solid var(--border-light);
          padding: 12px;
          border-radius: var(--radius-sm);
          text-align: center;
        }
        .roi-value {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 900;
          display: block;
        }
        .roi-value.text-emerald { color: #059669; }
        .roi-label {
          font-size: 10.5px;
          color: #64748B;
          margin-top: 2px;
          display: block;
        }

        @media (max-width: 960px) {
          .corporate-main-box {
            grid-template-columns: 1fr;
            padding: 28px;
          }
        }
      `}</style>
    </section>
  );
};
