import React from 'react';
import { Dumbbell, Smartphone, Heart, Zap } from 'lucide-react';

interface FooterProps {
  onOpenAppModal: () => void;
  onOpenPartnerModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAppModal, onOpenPartnerModal }) => {
  return (
    <footer className="footer-executive">
      <div className="container">
        
        {/* Main Grid */}
        <div className="footer-cols-grid">
          
          {/* Brand Col */}
          <div className="f-column brand-info">
            <div className="f-brand-logo">
              <div className="f-icon-box">
                <Zap size={18} color="#FFF" fill="#FFF" />
              </div>
              <span className="f-brand-title">Fit<span className="text-purple-gradient">Empire</span></span>
            </div>
            <p className="f-tagline">
              India’s largest network of 12,000+ verified gyms, CrossFit boxes, and boutique fitness studios. One membership pass for complete freedom.
            </p>
            <div className="f-app-cta-box">
              <button className="btn-store-download" onClick={onOpenAppModal}>
                <Smartphone size={15} />
                <span>Get App for iOS & Android</span>
              </button>
            </div>
          </div>

          {/* Products Col */}
          <div className="f-column">
            <h4 className="f-heading">Products</h4>
            <a href="#fitpass-service">Empire Universal Pass</a>
            <a href="#fitcoach-service">ARIA AI Fitness Coach</a>
            <a href="#fitfeast-service">Empire Feast (Nutrition)</a>
            <a href="#fitpasstv-service">Empire TV (Virtual Classes)</a>
            <a href="#corporate">Corporate Wellness</a>
          </div>

          {/* Cities Col */}
          <div className="f-column">
            <h4 className="f-heading">Top Cities</h4>
            <a href="#explore-gyms">Gyms in Bengaluru</a>
            <a href="#explore-gyms">Gyms in Delhi NCR</a>
            <a href="#explore-gyms">Gyms in Mumbai</a>
            <a href="#explore-gyms">Gyms in Hyderabad</a>
            <a href="#explore-gyms">Gyms in Pune</a>
            <a href="#explore-gyms">Gyms in Chennai</a>
          </div>

          {/* Partners Col */}
          <div className="f-column">
            <h4 className="f-heading">Partners & Support</h4>
            <button className="f-purple-link-btn" onClick={onOpenPartnerModal}>
              Partner Your Gym (Free)
            </button>
            <a href="http://localhost:3001" target="_blank" rel="noreferrer">
              Partner Reception Portal
            </a>
            <a href="http://localhost:8081" target="_blank" rel="noreferrer">
              Member Web Login
            </a>
            <a href="#faq">Help & FAQs</a>
            <a href="mailto:support@fitempire.tech">support@fitempire.tech</a>
          </div>

        </div>

        {/* SEO Summary Paragraph */}
        <div className="footer-seo-paragraph">
          <h5>Extensive Pan-India Fitness Network</h5>
          <p>
            The days of searching "gyms near me" or "fitness centres near me" are over. With FitEmpire, you can choose from the best gyms and studios in your local area and work out at multiple convenient locations. Access strength workouts, CrossFit, zumba, MMA, kickboxing, swimming, pilates, and yoga with 2,25,000+ monthly workout sessions at 12,000+ partner locations across India.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-row">
          <div>
            © 2026 FitEmpire Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="f-legal-group">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Security & Compliance</a>
          </div>
        </div>

      </div>

      <style>{`
        .footer-executive {
          background: #0B0F19;
          color: #E2E8F0;
          padding: 60px 0 24px;
          border-top: 1px solid #1E293B;
        }
        .footer-cols-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .f-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .f-brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .f-icon-box {
          width: 32px;
          height: 32px;
          background: var(--purple-gradient);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .f-brand-title {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 900;
          color: #FFFFFF;
        }
        .f-tagline {
          font-size: 13px;
          color: #94A3B8;
          line-height: 1.6;
          margin-bottom: 12px;
        }
        .btn-store-download {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: #1E293B;
          border: 1px solid #334155;
          color: #FFFFFF;
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-smooth);
        }
        .btn-store-download:hover {
          background: var(--purple-gradient);
          border-color: transparent;
        }
        .f-heading {
          font-size: 13.5px;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .f-column a {
          font-size: 13px;
          color: #94A3B8;
          transition: color var(--transition-smooth);
        }
        .f-column a:hover {
          color: #FFFFFF;
        }
        .f-purple-link-btn {
          background: none;
          border: none;
          padding: 0;
          text-align: left;
          font-size: 13px;
          color: #A78BFA;
          font-weight: 700;
          cursor: pointer;
        }
        .f-purple-link-btn:hover {
          color: #FFFFFF;
        }
        .footer-seo-paragraph {
          padding: 24px 0;
          border-top: 1px solid #1E293B;
          border-bottom: 1px solid #1E293B;
          margin-bottom: 24px;
        }
        .footer-seo-paragraph h5 {
          font-size: 13px;
          font-weight: 700;
          color: #CBD5E1;
          margin-bottom: 6px;
        }
        .footer-seo-paragraph p {
          font-size: 11.5px;
          color: #64748B;
          line-height: 1.65;
        }
        .footer-bottom-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #64748B;
          flex-wrap: wrap;
          gap: 10px;
        }
        .f-legal-group {
          display: flex;
          gap: 16px;
        }
        .f-legal-group a {
          color: #64748B;
        }
        .f-legal-group a:hover {
          color: #FFFFFF;
        }

        @media (max-width: 960px) {
          .footer-cols-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 600px) {
          .footer-cols-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
};
