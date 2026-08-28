import React, { useState } from 'react';
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
import { 
  AppDownloadModal, 
  BookingModal, 
  CheckoutModal, 
  PartnerModal, 
  CorporateModal,
  AdminModal 
} from './components/Modals';

export default function App() {
  // Modal states
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedGym, setSelectedGym] = useState<any | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [corporateModalOpen, setCorporateModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

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

  return (
    <div className="app-layout">
      {/* Navigation */}
      <Navbar 
        onOpenAppModal={() => setAppModalOpen(true)}
        onOpenPartnerModal={() => setPartnerModalOpen(true)}
        onOpenCorporateModal={() => setCorporateModalOpen(true)}
        onOpenAdminModal={() => setAdminModalOpen(true)}
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
          onOpenAdminModal={() => setAdminModalOpen(true)}
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
