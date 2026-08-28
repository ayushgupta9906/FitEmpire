import React, { useState } from 'react';
import { 
  Dumbbell, 
  MapPin, 
  Search, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Tv, 
  Utensils, 
  Smartphone,
  ChevronRight,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface HeroSectionProps {
  onSearchSubmit: (query: string, category: string) => void;
  onOpenAppModal: () => void;
  onOpenPlansModal: () => void;
}

const ECOSYSTEM_PILLARS = [
  {
    id: 'fitpass',
    name: 'Empire Universal Pass',
    title: 'FITPASS',
    desc: 'Access 12,000+ Premium Gyms, CrossFit, Swimming & Studios across 150+ Indian cities.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop',
    tag: '12,000+ GYMS',
    color: '#7C3AED'
  },
  {
    id: 'fitcoach',
    name: 'ARIA AI Coach',
    title: 'FITCOACH',
    desc: 'Adaptive A.I. workout coach tailor-fitting circuits, rep counts & fatigue recovery.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop',
    tag: 'AI WORKOUT ENGINE',
    color: '#6366F1'
  },
  {
    id: 'fitfeast',
    name: 'Empire Feast (Diet)',
    title: 'FITFEAST',
    desc: 'Dedicated clinical nutritionists on WhatsApp with custom Indian macro meal charts.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop',
    tag: 'CERTIFIED DIETITIANS',
    color: '#059669'
  },
  {
    id: 'fitpasstv',
    name: 'Empire TV (Live)',
    title: 'FITPASS-TV',
    desc: 'On-demand HD virtual studio classes streamed with international fitness trainers.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop',
    tag: '5,000+ SESSIONS',
    color: '#D97706'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onSearchSubmit, 
  onOpenAppModal, 
  onOpenPlansModal 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const el = document.getElementById('explore-gyms');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-executive-section">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="hero-blob blob-1"></div>
      <div className="hero-blob blob-2"></div>

      <div className="container hero-inner">
        
        {/* Top Trust Badge */}
        <div className="hero-badge-wrap">
          <div className="badge-pill-purple">
            <Zap size={14} className="text-purple" fill="#7C3AED" />
            <span>INDIA'S PREMIER FITNESS ECOSYSTEM • 12,000+ VERIFIED PARTNER GYMS</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="hero-main-title">
          One Flexible Pass for <br />
          <span className="text-purple-gradient">Every Gym, Studio & Workout</span> Across India
        </h1>

        <p className="hero-main-desc">
          Lift heavy at <strong>Gold’s Gym</strong>, crush HIIT at <strong>Cult.Fit</strong>, swim at premier clubs, or master Reformer Pilates. Experience complete freedom with <strong>instant 60s dynamic QR entry</strong>, 1-tap pass freeze, and personalized AI coaching.
        </p>

        {/* Locality Search Bar */}
        <form onSubmit={handleSearch} className="hero-search-form executive-card">
          <div className="search-field">
            <MapPin size={18} className="search-icon text-purple" />
            <input 
              type="text" 
              placeholder="Search gyms in Koramangala, Indiranagar, Bandra, Connaught Place..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <button type="submit" className="btn-purple-primary btn-search-cta">
            <Search size={16} />
            <span>Find Gyms Near Me</span>
          </button>
        </form>

        {/* Fast Action Trust Bullets */}
        <div className="hero-trust-bullets">
          <div className="t-bullet">
            <CheckCircle2 size={15} color="#7C3AED" />
            <span>Zero Lock-in Contract</span>
          </div>
          <div className="t-bullet">
            <CheckCircle2 size={15} color="#7C3AED" />
            <span>1-Tap 30-Day Pass Freeze</span>
          </div>
          <div className="t-bullet">
            <CheckCircle2 size={15} color="#7C3AED" />
            <span>Multi-City Roaming in 150+ Cities</span>
          </div>
          <div className="t-bullet">
            <CheckCircle2 size={15} color="#7C3AED" />
            <span>Save up to 70% vs Single Gyms</span>
          </div>
        </div>

        {/* 4 Premium Product Pillars Cards */}
        <div className="hero-four-pillars-grid">
          {ECOSYSTEM_PILLARS.map((pillar) => (
            <a 
              key={pillar.id} 
              href={`#${pillar.id}-service`} 
              className="pillar-card executive-card"
            >
              <div className="pillar-image-wrap">
                <img src={pillar.image} alt={pillar.name} className="p-img" />
                <span className="pillar-badge-tag" style={{ borderLeft: `3px solid ${pillar.color}` }}>
                  {pillar.tag}
                </span>
              </div>
              <div className="pillar-meta">
                <h3 className="pillar-name">{pillar.name}</h3>
                <p className="pillar-desc">{pillar.desc}</p>
                <div className="pillar-arrow-link">
                  <span>Explore Feature</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>

      <style>{`
        .hero-executive-section {
          position: relative;
          padding: 60px 0 50px;
          background: linear-gradient(180deg, #FDFBFF 0%, #FFFFFF 100%);
          overflow: hidden;
        }
        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          pointer-events: none;
          z-index: 0;
        }
        .blob-1 {
          top: -40px;
          left: 10%;
          width: 380px;
          height: 380px;
          background: #DDD6FE;
        }
        .blob-2 {
          top: 100px;
          right: 5%;
          width: 420px;
          height: 420px;
          background: #EDE9FE;
        }
        .hero-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .hero-badge-wrap {
          margin-bottom: 20px;
        }
        .hero-main-title {
          font-size: 52px;
          font-weight: 900;
          color: #0F172A;
          line-height: 1.15;
          letter-spacing: -1.5px;
          max-width: 960px;
          margin-bottom: 20px;
        }
        .hero-main-desc {
          font-size: 17px;
          color: #475569;
          line-height: 1.65;
          max-width: 820px;
          margin-bottom: 32px;
        }
        .hero-main-desc strong {
          color: #0F172A;
          font-weight: 700;
        }
        .hero-search-form {
          width: 100%;
          max-width: 720px;
          display: flex;
          align-items: center;
          padding: 8px 8px 8px 18px;
          gap: 12px;
          margin-bottom: 24px;
          background: #FFFFFF;
          border: 1.5px solid var(--purple-border);
          box-shadow: 0 10px 25px rgba(124, 58, 237, 0.08);
          border-radius: var(--radius-full);
        }
        .search-field {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }
        .search-input {
          border: none;
          outline: none;
          font-size: 14px;
          color: #0F172A;
          width: 100%;
          font-family: inherit;
        }
        .btn-search-cta {
          border-radius: var(--radius-full);
          padding: 12px 24px;
          font-size: 14px;
          white-space: nowrap;
        }
        .hero-trust-bullets {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 50px;
        }
        .t-bullet {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
        }
        .hero-four-pillars-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
          width: 100%;
          text-align: left;
        }
        .pillar-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-md);
          background: #FFFFFF;
          transition: all var(--transition-smooth);
        }
        .pillar-image-wrap {
          height: 170px;
          position: relative;
          overflow: hidden;
        }
        .p-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .pillar-card:hover .p-img {
          transform: scale(1.06);
        }
        .pillar-badge-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(6px);
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.3px;
        }
        .pillar-meta {
          padding: 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .pillar-name {
          font-size: 17px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 6px;
        }
        .pillar-desc {
          font-size: 12.5px;
          color: #64748B;
          line-height: 1.5;
          margin-bottom: 14px;
          flex: 1;
        }
        .pillar-arrow-link {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 700;
          color: var(--purple-primary);
          transition: transform var(--transition-smooth);
        }
        .pillar-card:hover .pillar-arrow-link {
          transform: translateX(4px);
        }

        @media (max-width: 1024px) {
          .hero-main-title {
            font-size: 38px;
          }
          .hero-four-pillars-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .hero-main-title {
            font-size: 30px;
          }
          .hero-search-form {
            flex-direction: column;
            border-radius: var(--radius-md);
            padding: 12px;
          }
          .btn-search-cta {
            width: 100%;
            border-radius: var(--radius-sm);
          }
          .hero-four-pillars-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
