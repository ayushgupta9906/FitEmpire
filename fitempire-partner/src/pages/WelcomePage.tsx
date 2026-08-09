import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, ArrowRight, Sparkles } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#070B14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 10px',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Sleek Mobile Device Frame */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100vh',
          maxHeight: '880px',
          backgroundColor: '#070B14',
          borderRadius: '36px',
          border: '10px solid #1E293B',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          position: 'relative',
          backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Linear Gradient Overlay */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '24px 20px 36px',
            background: 'linear-gradient(180deg, rgba(11, 15, 25, 0.2) 0%, rgba(11, 15, 25, 0.75) 45%, rgba(11, 15, 25, 0.98) 85%, #0B0F19 100%)',
            boxSizing: 'border-box',
          }}
        >
          {/* Center Logo & Text */}
          <div style={{ alignItems: 'center', textAlign: 'center', marginBottom: 36 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                backgroundColor: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 18,
                boxShadow: '0 10px 30px rgba(79, 70, 229, 0.35)',
              }}
            >
              <div style={{ display: 'inline-flex', transform: 'scaleX(-1)' }}>
                <Dumbbell color="#4F46E5" size={36} />
              </div>
            </div>

            <h1
              style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                color: '#FFFFFF',
                marginBottom: 8,
                letterSpacing: '-0.04em',
              }}
            >
              FitEmpire
            </h1>

            <p
              style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.5,
                padding: '0 10px',
              }}
            >
              The dedicated desk platform for gym partners, pass verifiers and managers.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
            <button
              onClick={handleGetStarted}
              style={{
                backgroundColor: '#4F46E5',
                color: '#FFFFFF',
                border: 'none',
                padding: '16px 24px',
                borderRadius: 16,
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 8px 24px rgba(79, 70, 229, 0.45)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>Get Started with FitEmpire</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: 4 }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                Single–Gym Live Stats • QR Pass Scanner • Instant Entry
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
