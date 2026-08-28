import React, { useState, useEffect, useRef } from 'react';
import { 
  Dumbbell, 
  MapPin, 
  ChevronDown, 
  Menu, 
  X, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Utensils, 
  Tv, 
  ArrowRight,
  ExternalLink,
  Zap
} from 'lucide-react';

interface NavbarProps {
  onOpenAppModal: () => void;
  onOpenPartnerModal: () => void;
  onOpenCorporateModal: () => void;
  onOpenAdminModal: () => void;
}

const CITIES = [
  'Bengaluru',
  'Delhi NCR',
  'Mumbai',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad'
];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAppModal,
  onOpenPartnerModal,
  onOpenCorporateModal,
  onOpenAdminModal
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const productsDropdownRef = useRef<HTMLDivElement>(null);

  // Scroll listener for sticky elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
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
        
        {/* Brand Logo & City Picker */}
        <div className="nav-brand-section">
          <a href="#" className="brand-emblem-wrap">
            <div className="brand-logo-icon">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#FFFFFF"
                strokeWidth="2.3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                style={{ transform: 'scaleX(-1)', transformOrigin: 'center' }}
              >
                <path d="M6.5 6.5 17.5 17.5" />
                <path d="m21 21-1-1" />
                <path d="m3 3 1 1" />
                <path d="m18 22 4-4" />
                <path d="m2 6 4-4" />
                <path d="m3 10 7-7" />
                <path d="m14 21 7-7" />
                <path d="M6.5 12.5 12.5 6.5" />
                <path d="m11.5 17.5 6-6" />
              </svg>
            </div>
            <div className="brand-text-column">
              <span className="brand-name-text">
                Fit<span className="brand-accent-purple">Empire</span>
              </span>
              <span className="brand-tagline">UNIVERSAL PASS</span>
            </div>
          </a>

          {/* Elegant City Selector */}
          <div className="nav-city-picker" ref={cityDropdownRef}>
            <button 
              className={`city-select-pill ${cityDropdownOpen ? 'active' : ''}`}
              onClick={() => {
                setCityDropdownOpen(!cityDropdownOpen);
                setProductsDropdownOpen(false);
              }}
              aria-label="Select City"
            >
              <MapPin size={12} className="city-pin" />
              <span className="city-current-name">{selectedCity}</span>
              <ChevronDown size={11} className={`city-arrow ${cityDropdownOpen ? 'rotate' : ''}`} />
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

        {/* Center Navigation Links */}
        <nav className="nav-menu-links">
          
          <a href="#explore-gyms" className="nav-direct-link">
            Explore Gyms
          </a>

          {/* Products Mega Dropdown */}
          <div className="nav-dropdown-item" ref={productsDropdownRef}>
            <button 
              className={`nav-link-btn ${productsDropdownOpen ? 'active' : ''}`}
              onClick={() => {
                setProductsDropdownOpen(!productsDropdownOpen);
                setCityDropdownOpen(false);
              }}
            >
              <span>Products</span>
              <ChevronDown size={12} className={`nav-link-chevron ${productsDropdownOpen ? 'rotate' : ''}`} />
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
                      <Dumbbell size={16} />
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
                      <Sparkles size={16} />
                    </div>
                    <div className="mega-card-text">
                      <span className="mega-card-title">ARIA AI Coach</span>
                      <span className="mega-card-desc">Dynamic personalized workout routines & recovery</span>
                    </div>
                  </a>

                  <a 
                    href="#fitfeast-service" 
                    className="mega-menu-card"
                    onClick={() => setProductsDropdownOpen(false)}
                  >
                    <div className="mega-icon-box emerald">
                      <Utensils size={16} />
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
                      <Tv size={16} />
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

          <a href="#plans" className="nav-direct-link">
            Pricing
          </a>

          <a href="#corporate" className="nav-direct-link" onClick={onOpenCorporateModal}>
            Corporate
          </a>

          <a href="#apps" className="nav-direct-link">
            <span>App Demo</span>
            <span className="nav-live-dot-badge">● LIVE</span>
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="nav-right-actions">
          
          <button 
            onClick={onOpenAdminModal}
            className="btn-nav-admin"
            title="Super Admin Governance Console"
          >
            <ShieldCheck size={14} className="text-purple" />
            <span>Admin</span>
          </button>

          <a 
            href="https://fitempirepartner.vercel.app"
            target="_blank" 
            rel="noreferrer" 
            className="btn-nav-ghost"
          >
            <Building2 size={13} />
            <span>FitEmpire Partner</span>
          </a>

          <a 
            href="https://fitempiremobile.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="btn-purple-primary btn-nav-cta"
          >
            <Smartphone size={14} />
            <span>FitEmpire</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-drawer-inner">
            <a href="#explore-gyms" onClick={() => setMobileMenuOpen(false)}>Explore 12,000+ Gyms</a>
            <a href="#plans" onClick={() => setMobileMenuOpen(false)}>Membership Plans</a>
            <a href="#apps" onClick={() => setMobileMenuOpen(false)}>Live App Demo</a>
            <a href="#corporate" onClick={() => { setMobileMenuOpen(false); onOpenCorporateModal(); }}>Corporate Wellness</a>
            <a href="#partners" onClick={() => { setMobileMenuOpen(false); onOpenPartnerModal(); }}>Partner Your Gym</a>
            
            <div className="mobile-drawer-actions">
              <button className="btn-nav-admin w-full" onClick={() => { setMobileMenuOpen(false); onOpenAdminModal(); }}>
                <ShieldCheck size={15} />
                <span>Super Admin Console</span>
              </button>

              <a 
                href="https://fitempiremobile.vercel.app"
                target="_blank" 
                rel="noreferrer" 
                className="btn-purple-primary w-full"
              >
                <Smartphone size={15} />
                <span>Open FitEmpire App</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{navbarStyles}</style>
    </header>
  );
};

const navbarStyles = `
  .top-navbar-root {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border-light);
    transition: all var(--transition-smooth);
  }
  .top-navbar-root.is-scrolled {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
    border-bottom-color: rgba(226, 232, 240, 0.8);
  }

  .nav-layout {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    gap: 16px;
  }

  /* Brand Section */
  .nav-brand-section {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .brand-emblem-wrap {
    display: flex;
    align-items: center;
    gap: 9px;
    text-decoration: none;
  }
  .brand-logo-icon {
    width: 32px;
    height: 32px;
    background: var(--purple-gradient);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 10px rgba(124, 58, 237, 0.35);
    flex-shrink: 0;
    border: 1px solid rgba(255, 255, 255, 0.25);
  }
  .brand-text-column {
    display: flex;
    flex-direction: column;
  }
  .brand-name-text {
    font-family: var(--font-heading);
    font-size: 19px;
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
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.8px;
    color: var(--purple-primary);
    margin-top: 2px;
  }

  /* City Selector */
  .nav-city-picker {
    position: relative;
  }
  .city-select-pill {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    background: #F1F5F9;
    border: 1px solid #E2E8F0;
    border-radius: var(--radius-full);
    color: #334155;
    font-size: 12px;
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
  }
  .city-dropdown-panel {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 270px;
    background: #FFFFFF;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 12px;
    z-index: 1100;
    animation: dropFadeIn 0.15s ease-out;
  }
  .dropdown-panel-title {
    font-size: 10px;
    font-weight: 800;
    color: #94A3B8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    padding-left: 2px;
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
    padding: 5px 8px;
    background: #F8FAFC;
    border: 1px solid transparent;
    border-radius: 6px;
    font-size: 11.5px;
    font-weight: 600;
    color: #334155;
    cursor: pointer;
    transition: all var(--transition-smooth);
  }
  .city-item-btn:hover, .city-item-btn.selected {
    background: var(--purple-light);
    color: var(--purple-primary);
    font-weight: 700;
  }
  .active-dot {
    width: 5px;
    height: 5px;
    background: var(--purple-primary);
    border-radius: 50%;
  }

  /* Center Nav Links */
  .nav-menu-links {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .nav-dropdown-item {
    position: relative;
  }
  .nav-link-btn, .nav-direct-link {
    display: flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    font-size: 13px;
    font-weight: 600;
    color: #334155;
    padding: 6px 11px;
    border-radius: 6px;
    cursor: pointer;
    text-decoration: none;
    transition: all var(--transition-smooth);
  }
  .nav-link-btn:hover, .nav-link-btn.active, .nav-direct-link:hover {
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
  .nav-live-dot-badge {
    background: #DCFCE7;
    color: #059669;
    font-size: 9px;
    font-weight: 800;
    padding: 1px 5px;
    border-radius: 4px;
    letter-spacing: 0.3px;
  }

  /* Mega Menu */
  .products-mega-menu {
    position: absolute;
    top: calc(100% + 10px);
    left: -40px;
    width: 380px;
    background: #FFFFFF;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 10px;
    z-index: 1100;
    animation: dropFadeIn 0.15s ease-out;
  }
  @keyframes dropFadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .mega-menu-grid {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .mega-menu-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 10px;
    border-radius: 6px;
    text-decoration: none;
    transition: background var(--transition-smooth);
  }
  .mega-menu-card:hover {
    background: var(--purple-light);
  }
  .mega-icon-box {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .mega-icon-box.purple { background: #F3E8FF; color: #7C3AED; }
  .mega-icon-box.indigo { background: #EEF2FF; color: #4F46E5; }
  .mega-icon-box.emerald { background: #ECFDF5; color: #059669; }
  .mega-icon-box.amber { background: #FFFBEB; color: #D97706; }
  .mega-card-text {
    display: flex;
    flex-direction: column;
  }
  .mega-card-title {
    font-size: 13px;
    font-weight: 700;
    color: #0F172A;
  }
  .mega-card-desc {
    font-size: 11px;
    color: #64748B;
  }

  /* Right Actions */
  .nav-right-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .btn-nav-admin {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 6px;
    color: #0F172A;
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    transition: all var(--transition-smooth);
  }
  .btn-nav-admin:hover {
    background: #0F172A;
    color: #FFFFFF;
    border-color: #0F172A;
  }
  .btn-nav-ghost {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 11px;
    background: transparent;
    border: 1px solid var(--border-light);
    border-radius: 6px;
    color: #475569;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
    transition: all var(--transition-smooth);
  }
  .btn-nav-ghost:hover {
    background: var(--purple-light);
    color: var(--purple-primary);
    border-color: var(--purple-border);
  }
  .btn-nav-cta {
    padding: 6px 14px;
    font-size: 12.5px;
    border-radius: 6px;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .mobile-hamburger-btn {
    display: none;
    background: none;
    border: none;
    padding: 6px;
    color: #0F172A;
    cursor: pointer;
  }

  /* Mobile Drawer */
  .mobile-nav-drawer {
    display: none;
    background: #FFFFFF;
    border-top: 1px solid var(--border-light);
    padding: 16px 20px 24px;
  }
  .mobile-drawer-inner {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .mobile-drawer-inner a {
    font-size: 14px;
    font-weight: 700;
    color: #0F172A;
    text-decoration: none;
    padding: 6px 0;
    border-bottom: 1px solid #F1F5F9;
  }
  .mobile-drawer-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }

  @media (max-width: 990px) {
    .nav-menu-links { display: none; }
    .btn-nav-ghost { display: none; }
    .mobile-hamburger-btn { display: block; }
    .mobile-nav-drawer { display: block; }
  }
`;
