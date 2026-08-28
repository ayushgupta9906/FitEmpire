import React, { useState } from 'react';
import { 
  Dumbbell, 
  Sparkles, 
  Utensils, 
  Tv, 
  ChevronRight, 
  ShieldCheck, 
  ArrowRight,
  Activity,
  CheckCircle2,
  Zap,
  Star
} from 'lucide-react';

interface EcosystemSuiteProps {
  onOpenPlansModal: () => void;
  onOpenCorporateModal: () => void;
}

const SUITE_SLIDES = [
  {
    id: 'fitpass-service',
    productName: 'FITPASS',
    bg: 'linear-gradient(135deg, #1E1035 0%, #130E26 100%)',
    accentColor: '#A78BFA',
    icon: Dumbbell,
    title: 'One Membership to India’s Largest Fitness Network',
    description: 'Access 12,000+ premium gyms & fitness studios across 150+ major cities of India with 2,25,000+ monthly workout sessions. Strength training, CrossFit, swimming, yoga, and martial arts with zero lock-in.',
    btnText: 'Explore Partner Gyms',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop'
  },
  {
    id: 'fitcoach-service',
    productName: 'FITCOACH',
    bg: 'linear-gradient(135deg, #181838 0%, #0F122B 100%)',
    accentColor: '#818CF8',
    icon: Sparkles,
    title: 'Experience the Most Advanced A.I. Fitness Coach',
    description: 'Meet ARIA – Your personal A.I. fitness coach who customises workout splits, calculates daily muscle recovery strain, and optimizes rep tempos according to your exact fitness goals.',
    btnText: 'Try ARIA AI Coach',
    img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop'
  },
  {
    id: 'fitfeast-service',
    productName: 'FITFEAST',
    bg: 'linear-gradient(135deg, #0A261D 0%, #061914 100%)',
    accentColor: '#34D399',
    icon: Utensils,
    title: 'Connect with Your Personal Clinical Nutritionist',
    description: 'Get personalised Indian diet plans based on your eating habits & lifestyle. Receive daily 1-on-1 diet assistance and macro tracking directly via WhatsApp or phone consultation.',
    btnText: 'Consult Nutritionist',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop'
  },
  {
    id: 'fitpasstv-service',
    productName: 'FITPASS TV',
    bg: 'linear-gradient(135deg, #1C1917 0%, #0C0A09 100%)',
    accentColor: '#FBBF24',
    icon: Tv,
    title: 'Virtual Workouts with Global Celebrity Trainers',
    description: 'Turn your living room into a world-class boutique fitness studio with 5,000+ on-demand HD virtual workout sessions. High-energy HIIT, Pilates, Zumba, Dance, and Core conditioning.',
    btnText: 'Stream Live TV',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop'
  }
];

export const EcosystemSuite: React.FC<EcosystemSuiteProps> = ({ onOpenPlansModal }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className="ecosystem-purple-suite">
      
      {/* Slide Navigation Tabs */}
      <div className="container">
        <div className="suite-header-center">
          <div className="badge-pill-purple">
            <Zap size={13} className="text-purple" />
            <span>360° COMPLETE WELLNESS SUITE</span>
          </div>
          <h2 className="suite-main-h2">
            Everything You Need to <span className="text-purple-gradient">Transform Your Body & Mind</span>
          </h2>
        </div>

        <div className="suite-tabs-row">
          {SUITE_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              className={`suite-tab-button ${activeSlide === idx ? 'active' : ''}`}
              onClick={() => setActiveSlide(idx)}
            >
              <span className="tab-idx">0{idx + 1}</span>
              <span className="tab-pname">{slide.productName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Slide Banner */}
      {SUITE_SLIDES.map((slide, idx) => {
        if (idx !== activeSlide) return null;
        const Icon = slide.icon;

        return (
          <div 
            key={slide.id} 
            id={slide.id}
            className="suite-dynamic-banner" 
            style={{ background: slide.bg }}
          >
            <div className="container suite-grid-inner">
              
              {/* Left Text */}
              <div className="suite-left-text">
                <div className="suite-badge-pill" style={{ color: slide.accentColor, borderColor: slide.accentColor }}>
                  <Icon size={18} />
                  <span>{slide.productName} ECOSYSTEM</span>
                </div>

                <h3 className="suite-slide-title">{slide.title}</h3>
                <p className="suite-slide-desc">{slide.description}</p>

                <button className="btn-outline-white" onClick={onOpenPlansModal}>
                  <span>{slide.btnText}</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Right Image */}
              <div className="suite-right-image">
                <img src={slide.img} alt={slide.productName} className="suite-banner-img" />
              </div>

            </div>
          </div>
        );
      })}

      {/* Community Banner */}
      <div className="community-purple-banner">
        <div className="container comm-inner">
          <h3 className="comm-title">Join India’s #1 Fitness Community</h3>
          <p className="comm-sub">
            Experience <strong>#YourFitnessYourWay</strong> with 11 million+ verified workout sessions across India.
          </p>
          <button className="btn-purple-primary btn-comm-explore" onClick={onOpenPlansModal}>
            <span>Explore All-Access Passes</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Media Coverage Strip */}
      <div className="media-executive-strip">
        <div className="container">
          <span className="media-exec-heading">FEATURED ACROSS PREMIER NATIONAL MEDIA</span>
          <div className="media-exec-grid">
            <div className="m-pill">Times of India 40 Under 40</div>
            <div className="m-pill">The Economic Times</div>
            <div className="m-pill">YourStory</div>
            <div className="m-pill">Inc42</div>
            <div className="m-pill">Financial Express</div>
            <div className="m-pill">BusinessWorld</div>
            <div className="m-pill">MoneyControl</div>
          </div>
        </div>
      </div>

      {/* Trust & Ratings Strip */}
      <div className="ratings-purple-banner">
        <div className="container ratings-inner-flex">
          <div>
            <h4 className="ratings-h4">Top-Rated Fitness Pass in India</h4>
            <p className="ratings-p">Trusted by millions of athletes, working professionals, and gym owners.</p>
          </div>

          <div className="ratings-stats-flex">
            <div className="r-stat">
              <span className="r-num">4.8 ★</span>
              <span className="r-lbl">50,000+ App Reviews</span>
            </div>
            <div className="r-stat">
              <span className="r-num">11M+</span>
              <span className="r-lbl">Workouts Completed</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ecosystem-purple-suite {
          padding-top: 40px;
          background: #FFFFFF;
        }
        .suite-header-center {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
        }
        .suite-main-h2 {
          font-size: 38px;
          font-weight: 900;
          color: #0F172A;
          margin-top: 10px;
        }
        .suite-tabs-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        .suite-tab-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          background: #F8FAFC;
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-sm);
          font-size: 13.5px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all var(--transition-smooth);
        }
        .suite-tab-button:hover {
          border-color: var(--purple-border);
          color: var(--purple-primary);
        }
        .suite-tab-button.active {
          background: var(--purple-gradient);
          color: #FFFFFF;
          border-color: transparent;
          box-shadow: var(--shadow-purple-btn);
        }
        .tab-idx {
          font-size: 11px;
          opacity: 0.8;
        }
        .suite-dynamic-banner {
          padding: 60px 0;
          color: #FFFFFF;
          transition: all var(--transition-smooth);
        }
        .suite-grid-inner {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: center;
        }
        .suite-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.1);
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.5px;
          border: 1px solid;
          margin-bottom: 16px;
        }
        .suite-slide-title {
          font-size: 34px;
          font-weight: 900;
          color: #FFFFFF;
          line-height: 1.2;
          margin-bottom: 14px;
        }
        .suite-slide-desc {
          font-size: 15.5px;
          color: #E2E8F0;
          line-height: 1.65;
          margin-bottom: 26px;
        }
        .suite-banner-img {
          width: 100%;
          max-height: 380px;
          object-fit: cover;
          border-radius: var(--radius-md);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .community-purple-banner {
          background: #0B0F19;
          color: #FFFFFF;
          padding: 60px 0;
          text-align: center;
        }
        .comm-title {
          font-size: 34px;
          font-weight: 900;
          color: #FFFFFF;
          margin-bottom: 10px;
        }
        .comm-sub {
          font-size: 16px;
          color: #94A3B8;
          max-width: 620px;
          margin: 0 auto 24px;
        }
        .btn-comm-explore {
          padding: 13px 32px;
          font-size: 15px;
        }
        .media-executive-strip {
          background: #0F172A;
          padding: 36px 0;
          border-top: 1px solid #1E293B;
          border-bottom: 1px solid #1E293B;
          text-align: center;
        }
        .media-exec-heading {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #64748B;
          margin-bottom: 20px;
          display: block;
        }
        .media-exec-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .m-pill {
          background: #1E293B;
          border: 1px solid #334155;
          padding: 6px 16px;
          border-radius: var(--radius-sm);
          color: #E2E8F0;
          font-size: 12.5px;
          font-weight: 700;
        }
        .ratings-purple-banner {
          background: var(--purple-gradient);
          color: #FFFFFF;
          padding: 36px 0;
        }
        .ratings-inner-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }
        .ratings-h4 {
          font-size: 26px;
          font-weight: 900;
          color: #FFFFFF;
          margin-bottom: 2px;
        }
        .ratings-p {
          font-size: 14px;
          color: #EDE9FE;
        }
        .ratings-stats-flex {
          display: flex;
          gap: 40px;
        }
        .r-stat {
          display: flex;
          flex-direction: column;
        }
        .r-num {
          font-size: 38px;
          font-weight: 900;
          line-height: 1;
        }
        .r-lbl {
          font-size: 12px;
          font-weight: 700;
          color: #EDE9FE;
          margin-top: 3px;
        }

        @media (max-width: 900px) {
          .suite-grid-inner {
            grid-template-columns: 1fr;
          }
          .ratings-inner-flex {
            flex-direction: column;
            text-align: center;
          }
          .ratings-stats-flex {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};
