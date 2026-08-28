import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EcosystemHubSection } from './components/EcosystemHubSection';
import { AppShowcase } from './components/AppShowcase';
import { EcosystemSuite } from './components/EcosystemSuite';
import { GymExplorer } from './components/GymExplorer';
import { PricingSection } from './components/PricingSection';
import { CorporateSection } from './components/CorporateSection';
import { PartnerSection } from './components/PartnerSection';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { AdminApp } from './admin/AdminApp';
import { AdminDashboard } from './components/AdminDashboard';
import { 
  AppDownloadModal, 
  BookingModal, 
  CheckoutModal, 
  PartnerModal, 
  CorporateModal,
  AdminModal 
} from './components/Modals';

export default function App() {
  // Check if admin route is requested via URL (?view=admin or /admin or #admin)
  const [isAdminView, setIsAdminView] = useState(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      const adminPaths = [
        '/admin', '/login', '/dashboard', '/users', '/classes', '/gyms',
        '/memberships', '/payments', '/analytics', '/bookings', 
        '/notifications', '/settings', '/onboarding', '/verification', '/settlements'
      ];
      return search.includes('view=admin') || hash === '#admin' || adminPaths.some(p => pathname.startsWith(p));
    }
    return false;
  });

  // Modal states
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedGym, setSelectedGym] = useState<any | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [corporateModalOpen, setCorporateModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const search = window.location.search;
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      const adminPaths = [
        '/admin', '/login', '/dashboard', '/users', '/classes', '/gyms',
        '/memberships', '/payments', '/analytics', '/bookings', 
        '/notifications', '/settings', '/onboarding', '/verification', '/settlements'
      ];
      setIsAdminView(search.includes('view=admin') || hash === '#admin' || adminPaths.some(p => pathname.startsWith(p)));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openAdminView = () => {
    setIsAdminView(true);
    window.history.pushState(null, '', '?view=admin');
  };

  const closeAdminView = () => {
    setIsAdminView(false);
    window.history.pushState(null, '', '/');
  };

  const handleSearchSubmit = (query: string, category: string) => {
    console.log('Search submit:', query, category);
  };

  const handleBookGym = (gym: any) => {
    setSelectedGym(gym);
    setBookingModalOpen(true);
  };

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setCheckoutModalOpen(true);
  };

  // If Admin View is active, render the full Super Admin Dashboard (from fitempire-admin)
  if (isAdminView) {
    return <AdminApp onBackToWebsite={closeAdminView} />;
  }

  return (
    <div className="app-layout">
      {/* Navigation */}
      <Navbar 
        onOpenAppModal={() => setAppModalOpen(true)}
        onOpenPartnerModal={() => setPartnerModalOpen(true)}
        onOpenCorporateModal={() => setCorporateModalOpen(true)}
        onOpenAdminModal={openAdminView}
      />

      {/* Main Content Sections */}
      <main>
        <HeroSection 
          onSearchSubmit={handleSearchSubmit}
          onOpenAppModal={() => setAppModalOpen(true)}
          onOpenPlansModal={() => {
            const el = document.getElementById('plans');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 4 Ecosystem Pillars: Member App, Partner App, Admin Console, Showcase */}
        <EcosystemHubSection 
          onOpenAppModal={() => setAppModalOpen(true)}
          onOpenPartnerModal={() => setPartnerModalOpen(true)}
          onOpenAdminModal={openAdminView}
        />

        <AppShowcase 
          onOpenAppModal={() => setAppModalOpen(true)}
        />

        <EcosystemSuite 
          onOpenPlansModal={() => {
            const el = document.getElementById('plans');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenCorporateModal={() => setCorporateModalOpen(true)}
        />

        <GymExplorer 
          onBookGym={handleBookGym}
        />

        <PricingSection 
          onSelectPlan={handleSelectPlan}
        />

        <CorporateSection 
          onOpenCorporateModal={() => setCorporateModalOpen(true)}
        />

        <PartnerSection 
          onOpenPartnerModal={() => setPartnerModalOpen(true)}
        />

        <Testimonials />

        <FAQ />
      </main>

      {/* Footer */}
      <Footer 
        onOpenAppModal={() => setAppModalOpen(true)}
        onOpenPartnerModal={() => setPartnerModalOpen(true)}
      />

      {/* Interactive Modals */}
      <AppDownloadModal 
        isOpen={appModalOpen} 
        onClose={() => setAppModalOpen(false)} 
      />

      <BookingModal 
        gym={selectedGym}
        isOpen={bookingModalOpen} 
        onClose={() => setBookingModalOpen(false)} 
      />

      <CheckoutModal 
        plan={selectedPlan}
        isOpen={checkoutModalOpen} 
        onClose={() => setCheckoutModalOpen(false)} 
      />

      <PartnerModal 
        isOpen={partnerModalOpen} 
        onClose={() => setPartnerModalOpen(false)} 
      />

      <CorporateModal 
        isOpen={corporateModalOpen} 
        onClose={() => setCorporateModalOpen(false)} 
      />

      <AdminModal 
        isOpen={adminModalOpen} 
        onClose={() => setAdminModalOpen(false)} 
      />
    </div>
  );
}
