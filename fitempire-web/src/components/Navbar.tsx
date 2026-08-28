import React, { useState, useEffect, useRef } from 'react';
import { 
  Dumbbell, 
  MapPin, 
  ChevronDown, 
  Smartphone, 
  Building2, 
  Menu, 
  X, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  Activity,
  Utensils,
  Tv,
  Users,
  Compass
} from 'lucide-react';

interface NavbarProps {
  onOpenAppModal: () => void;
  onOpenPartnerModal: () => void;
  onOpenCorporateModal: () => void;
}

export const CITIES = [
  'Bengaluru',
  'Delhi NCR',
  'Mumbai',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Chandigarh',
  'Jaipur',
  'Lucknow',
  'Indore'
];

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAppModal, 
  onOpenPartnerModal,
  onOpenCorporateModal 
}) => {
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const productsDropdownRef = useRef<HTMLDivElement>(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setCityDropdownOpen(false);
      }
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(event.target as Node)) {
        setProductsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`top-navbar-root ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container nav-layout">
        
        {/* Brand Logo */}
        <div className="nav-brand-section">
          <a href="#" className="brand-emblem-wrap">
            <div className="brand-logo-icon">
              <Zap size={18} color="#FFFFFF" fill="#FFFFFF" />
            </div>
            <div className="brand-text-column">
              <div className="brand-name-text">
                Fit<span className="brand-accent-purple">Empire</span>
              </div>
              <span className="brand-tagline">FITNESS ECOSYSTEM</span>
            </div>
          </a>

          {/* Compact Elegant City Selector */}
          <div className="nav-city-picker" ref={cityDropdownRef}>
            <button 
              className={`city-select-pill ${cityDropdownOpen ? 'active' : ''}`}
              onClick={() => {
                setCityDropdownOpen(!cityDropdownOpen);
                setProductsDropdownOpen(false);
              }}
              aria-label="Select City"
            >
              <MapPin size={13} className="city-pin" />
              <span className="city-current-name">{selectedCity}</span>
              <ChevronDown size={12} className={`city-arrow ${cityDropdownOpen ? 'rotate' : ''}`} />
            </button>

            {cityDropdownOpen && (
              <div className="city-dropdown-panel shadow-elevation">
                <div className="dropdown-panel-title">Select Your City</div>
                <div className="city-buttons-grid">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      className={`city-item-btn ${city === selectedCity ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedCity(city);
                        setCityDropdownOpen(false);
                      }}
                    >
                      <span>{city}</span>
                      {city === selectedCity && <div className="active-dot" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links with Mega Dropdown for Products */}
        <nav className="nav-menu-links">
          
          {/* Products Dropdown */}
          <div className="nav-dropdown-item" ref={productsDropdownRef}>
            <button 
              className={`nav-link-btn ${productsDropdownOpen ? 'active' : ''}`}
              onClick={() => {
                setProductsDropdownOpen(!productsDropdownOpen);
                setCityDropdownOpen(false);
              }}
            >
              <span>Products</span>
              <ChevronDown size={13} className={`nav-link-chevron ${productsDropdownOpen ? 'rotate' : ''}`} />
            </button>

            {productsDropdownOpen && (
              <div className="products-mega-menu shadow-elevation">
                <div className="mega-menu-grid">
                  
                  <a 
                    href="#fitpass-service" 
                    className="mega-menu-card"
                    onClick={() => setProductsDropdownOpen(false)}
                  >
                    <div className="mega-icon-box purple">
                      <Dumbbell size={18} />
                    </div>
                    <div className="mega-card-text">
                      <span className="mega-card-title">Empire Pass</span>
                      <span className="mega-card-desc">12,000+ Gyms, CrossFit, Swimming & Studios</span>
                    </div>
                  </a>

                  <a 
                    href="#fitcoach-service" 
                    className="mega-menu-card"
                    onClick={() => setProductsDropdownOpen(false)}
                  >
                    <div className="mega-icon-box indigo">
                      <Sparkles size={18} />
                    </div>
                    <div className="mega-card-text">
                      <span className="mega-card-title">ARIA AI Coach</span>
                      <span className="mega-card-desc">Dynamic personalized workout routines & tracking</span>
                    </div>
                  </a>

                  <a 
                    href="#fitfeast-service" 
                    className="mega-menu-card"
                    onClick={() => setProductsDropdownOpen(false)}
                  >
                    <div className="mega-icon-box emerald">
                      <Utensils size={18} />
                    </div>
                    <div className="mega-card-text">
                      <span className="mega-card-title">Empire Feast</span>
                      <span className="mega-card-desc">Certified clinical nutritionists & macro diet charts</span>
                    </div>
                  </a>

                  <a 
                    href="#fitpasstv-service" 
                    className="mega-menu-card"
                    onClick={() => setProductsDropdownOpen(false)}
                  >
                    <div className="mega-icon-box amber">
                      <Tv size={18} />
                    </div>
                    <div className="mega-card-text">
                      <span className="mega-card-title">Empire Live TV</span>
                      <span className="mega-card-desc">5,000+ virtual classes with global trainers</span>
                    </div>
                  </a>

                </div>
              </div>
            )}
          </div>

          <a href="#explore-gyms" className="nav-direct-link">Explore Gyms</a>
          <a href="#apps" className="nav-direct-link">
            <span>App Demo</span>
            <span className="nav-mini-badge">LIVE QR</span>
          </a>
          <a href="#plans" className="nav-direct-link">Pricing</a>
          <a href="#corporate" className="nav-direct-link" onClick={onOpenCorporateModal}>Corporate</a>
          <a href="#partners" className="nav-direct-link" onClick={onOpenPartnerModal}>For Gyms</a>
        </nav>

        {/* Right CTA Area */}
        <div className="nav-right-actions">
          <a 
            href="http://localhost:3001" 
            target="_blank" 
            rel="noreferrer" 
            className="btn-partner-ghost"
          >
            <Building2 size={14} />
            <span>Partner Portal</span>
          </a>

          <button 
            className="btn-purple-primary btn-get-pass-nav"
            onClick={onOpenAppModal}
          >
            <Smartphone size={14} />
            <span>Get FitEmpire</span>
          </button>

          <button 
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-panel">
          <div className="container mobile-panel-inner">
            
            <div className="mobile-links-section">
              <span className="mobile-section-heading">PRODUCTS & ECOSYSTEM</span>
              <a href="#fitpass-service" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <Dumbbell size={16} className="text-purple" />
                <span>Empire Universal Pass</span>
              </a>
              <a href="#fitcoach-service" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <Sparkles size={16} className="text-purple" />
                <span>ARIA AI Fitness Coach</span>
              </a>
              <a href="#fitfeast-service" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <Utensils size={16} className="text-purple" />
                <span>Personal Nutritionist (Feast)</span>
              </a>
              <a href="#fitpasstv-service" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <Tv size={16} className="text-purple" />
                <span>Empire Live TV Classes</span>
              </a>
            </div>

            <div className="mobile-links-section">
              <span className="mobile-section-heading">EXPLORE & MEMBERSHIP</span>
              <a href="#explore-gyms" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <Compass size={16} className="text-purple" />
                <span>Explore 12,000+ Gyms</span>
              </a>
              <a href="#apps" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <Smartphone size={16} className="text-purple" />
                <span>Live App Simulator</span>
              </a>
              <a href="#plans" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <Zap size={16} className="text-purple" />
                <span>Membership Passes & Pricing</span>
              </a>
              <a href="#corporate" className="mobile-nav-item" onClick={() => { setMobileMenuOpen(false); onOpenCorporateModal(); }}>
                <Users size={16} className="text-purple" />
                <span>Corporate Wellness</span>
              </a>
              <a href="#partners" className="mobile-nav-item" onClick={() => { setMobileMenuOpen(false); onOpenPartnerModal(); }}>
                <Building2 size={16} className="text-purple" />
                <span>Partner Your Gym (Free)</span>
              </a>
            </div>

            <div className="mobile-action-box">
              <button className="btn-purple-primary w-full" onClick={() => { setMobileMenuOpen(false); onOpenAppModal(); }}>
                <Smartphone size={15} />
                <span>Open FitEmpire App</span>
              </button>
            </div>

          </div>
        </div>
      )}

      <style>{`
        .top-navbar-root {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          z-index: 1000;
          transition: all 0.25s ease-in-out;
        }
        .top-navbar-root.is-scrolled {
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
          border-bottom-color: rgba(226, 232, 240, 1);
        }
        .nav-layout {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 68px;
          gap: 20px;
        }

        /* Brand section */
        .nav-brand-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .brand-emblem-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .brand-logo-icon {
          width: 34px;
          height: 34px;
          background: var(--purple-gradient);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
          flex-shrink: 0;
        }
        .brand-text-column {
          display: flex;
          flex-direction: column;
        }
        .brand-name-text {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 900;
          letter-spacing: -0.4px;
          color: #0F172A;
          line-height: 1;
        }
        .brand-accent-purple {
          background: var(--purple-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .brand-tagline {
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #64748B;
          margin-top: 2px;
        }

        /* City Selector Pill */
        .nav-city-picker {
          position: relative;
        }
        .city-select-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 11px;
          background: #F8FAFC;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          color: #334155;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-smooth);
        }
        .city-select-pill:hover, .city-select-pill.active {
          background: var(--purple-light);
          border-color: var(--purple-border);
          color: var(--purple-primary);
        }
        .city-pin {
          color: var(--purple-primary);
        }
        .city-arrow {
          color: #64748B;
          transition: transform var(--transition-smooth);
        }
        .city-arrow.rotate {
          transform: rotate(180deg);
          color: var(--purple-primary);
        }
        .city-dropdown-panel {
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          width: 280px;
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 14px;
          z-index: 1100;
          animation: dropFadeIn 0.2s ease-out;
        }
        .dropdown-panel-title {
          font-size: 11px;
          font-weight: 800;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          padding-left: 4px;
        }
        .city-buttons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
        }
        .city-item-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          background: #F8FAFC;
          border: 1px solid transparent;
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all var(--transition-smooth);
        }
        .city-item-btn:hover {
          background: var(--purple-light);
          color: var(--purple-primary);
        }
        .city-item-btn.selected {
          background: var(--purple-light);
          color: var(--purple-primary);
          border-color: var(--purple-border);
          font-weight: 700;
        }
        .active-dot {
          width: 6px;
          height: 6px;
          background: var(--purple-primary);
          border-radius: 50%;
        }

        /* Nav Menu Links */
        .nav-menu-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .nav-dropdown-item {
          position: relative;
        }
        .nav-link-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          font-size: 13.5px;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-smooth);
        }
        .nav-link-btn:hover, .nav-link-btn.active {
          color: var(--purple-primary);
          background: var(--purple-light);
        }
        .nav-link-chevron {
          color: #94A3B8;
          transition: transform var(--transition-smooth);
        }
        .nav-link-chevron.rotate {
          transform: rotate(180deg);
          color: var(--purple-primary);
        }
        .nav-direct-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 700;
          color: #334155;
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-smooth);
        }
        .nav-direct-link:hover {
          color: var(--purple-primary);
          background: var(--purple-light);
        }
        .nav-mini-badge {
          background: #DCFCE7;
          color: #15803D;
          font-size: 8.5px;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: 4px;
          letter-spacing: 0.3px;
        }

        /* Mega Menu for Products */
        .products-mega-menu {
          position: absolute;
          top: calc(100% + 12px);
          left: -40px;
          width: 440px;
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 14px;
          z-index: 1100;
          animation: dropFadeIn 0.2s ease-out;
        }
        @keyframes dropFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mega-menu-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 6px;
        }
        .mega-menu-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          background: #FFFFFF;
          transition: all var(--transition-smooth);
        }
        .mega-menu-card:hover {
          background: #F8FAFC;
        }
        .mega-icon-box {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .mega-icon-box.purple { background: var(--purple-light); color: var(--purple-primary); }
        .mega-icon-box.indigo { background: #EEF2FF; color: #4F46E5; }
        .mega-icon-box.emerald { background: #ECFDF5; color: #059669; }
        .mega-icon-box.amber { background: #FFFBEB; color: #D97706; }
        .mega-card-text {
          display: flex;
          flex-direction: column;
        }
        .mega-card-title {
          font-size: 13.5px;
          font-weight: 800;
          color: #0F172A;
        }
        .mega-card-desc {
          font-size: 11.5px;
          color: #64748B;
          line-height: 1.4;
          margin-top: 1px;
        }

        /* Right Actions */
        .nav-right-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .btn-partner-ghost {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: #F8FAFC;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          color: #334155;
          font-size: 12.5px;
          font-weight: 700;
          transition: all var(--transition-smooth);
        }
        .btn-partner-ghost:hover {
          background: var(--purple-light);
          border-color: var(--purple-border);
          color: var(--purple-primary);
        }
        .btn-get-pass-nav {
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 800;
          border-radius: var(--radius-sm);
        }
        .mobile-hamburger-btn {
          display: none;
          background: #F8FAFC;
          border: 1px solid var(--border-light);
          padding: 6px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          color: #0F172A;
        }

        /* Mobile Drawer */
        .mobile-nav-panel {
          background: #FFFFFF;
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
          padding: 20px 0;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
        }
        .mobile-panel-inner {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .mobile-links-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mobile-section-heading {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #94A3B8;
          margin-bottom: 4px;
        }
        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          background: #F8FAFC;
          border-radius: var(--radius-sm);
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
        }
        .mobile-action-box {
          padding-top: 8px;
        }

        .shadow-elevation {
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05);
        }

        @media (max-width: 1140px) {
          .nav-menu-links, .btn-partner-ghost {
            display: none;
          }
          .mobile-hamburger-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </header>
  );
};
