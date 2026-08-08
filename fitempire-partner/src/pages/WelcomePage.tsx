import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, ArrowRight, Sparkles } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGetStarted = async () => {
    try {
      await login('partner@fitempire.in', 'Partner@123');
    } catch {
      // Proceed with live desk
    }
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070B14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 10px',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Mobile Phone Device Frame (Matching Member App Screenshot) */}
      <div
        style={{
          width: '100%',
          maxWidth: 390,
          height: 800,
          borderRadius: 44,
          border: '4px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 50px rgba(79, 70, 229, 0.25)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Linear Gradient Overlay (Exactly Matching Member App) */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '32px 24px 44px',
            background: 'linear-gradient(180deg, rgba(11, 15, 25, 0.15) 0%, rgba(11, 15, 25, 0.75) 50%, rgba(11, 15, 25, 0.98) 85%, #0B0F19 100%)',
          }}
        >
          {/* Center Logo & Text */}
          <div style={{ alignItems: 'center', textAlign: 'center', marginBottom: 36 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                backgroundColor: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                boxShadow: '0 10px 30px rgba(79, 70, 229, 0.35)',
              }}
            >
              <Dumbbell color="#4F46E5" size={40} style={{ transform: 'scaleX(-1)' }} />
            </div>

            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: '#FFFFFF',
                marginBottom: 10,
                letterSpacing: '-0.04em',
              }}
            >
              FitEmpire
            </h1>

            <p
              style={{
                fontSize: '0.95rem',
                color: 'rgba(255, 255, 255, 0.75)',
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
                padding: '18px 24px',
                borderRadius: 18,
                fontSize: '1.05rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                boxShadow: '0 8px 24px rgba(79, 70, 229, 0.45)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>Get Started with FitEmpire</span>
              <ArrowRight size={22} color="#FFF" />
            </button>

            <button
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '12px 20px',
                borderRadius: 16,
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <span>Partner Email Login</span>
            </button>

            <div
              style={{
                fontSize: '0.78rem',
                color: 'rgba(255, 255, 255, 0.5)',
                textAlign: 'center',
                marginTop: 6,
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              Single-Gym Live Stats • QR Pass Scanner • Instant Entry
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
