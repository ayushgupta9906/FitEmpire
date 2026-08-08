import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  QrCode,
  Users,
  DollarSign,
  Settings,
  LogOut,
  Dumbbell,
  Wifi,
  Battery,
  Sparkles,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';

export const PartnerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { label: 'Desk', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Visits', path: '/attendance', icon: Users },
    { label: 'Scanner', path: '/scanner', icon: QrCode, isProminent: true },
    { label: 'Payouts', path: '/settlements', icon: DollarSign },
    { label: 'Gym', path: '/profile', icon: Settings },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070B14',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 10px',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Phone Device Frame (Matching Welcome Screen Bezel) */}
      <div
        style={{
          width: '100%',
          maxWidth: 390,
          height: 800,
          borderRadius: 44,
          border: '4px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 50px rgba(79, 70, 229, 0.25)',
          overflow: 'hidden',
          backgroundColor: '#0B0F19',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Top Status Bar (Time, Dynamic Island, 5G, Battery) */}
        <div
          style={{
            height: 38,
            backgroundColor: '#0B0F19',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            zIndex: 50,
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', letterSpacing: '-0.02em' }}>
            {currentTime}
          </span>

          {/* Dynamic Island Pill */}
          <div
            style={{
              width: 104,
              height: 20,
              borderRadius: 20,
              backgroundColor: '#000000',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981' }} />
            <span style={{ fontSize: '0.58rem', color: '#94A3B8', fontWeight: 700 }}>
              Live Desk
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#FFF' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>5G</span>
            <Wifi size={12} color="#FFF" />
            <Battery size={14} color="#FFF" />
          </div>
        </div>

        {/* In-App Navigation Bar */}
        <header
          style={{
            height: 56,
            backgroundColor: 'rgba(13, 20, 36, 0.96)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 14px',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 40,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(79, 70, 229, 0.35)',
                }}
              >
                <Dumbbell color="#4F46E5" size={16} style={{ transform: 'scaleX(-1)' }} />
              </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFF' }}>
                  FitEmpire Partner
                </span>
                <span className="badge-cyan" style={{ fontSize: '0.58rem', padding: '1px 5px' }}>
                  LIVE
                </span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span>Koramangala Desk</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => navigate('/scanner')}
              style={{
                background: 'rgba(59, 130, 246, 0.18)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                color: '#38BDF8',
                borderRadius: 8,
                padding: '4px 8px',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <QrCode size={12} />
              <span>Scan</span>
            </button>

            <button
              onClick={logout}
              title="Logout"
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <LogOut size={12} />
            </button>
          </div>
        </header>

        {/* Scrollable Page Body (Styled specifically for the 390px mobile frame) */}
        <main
          style={{
            flex: 1,
            padding: '12px 12px 76px',
            backgroundColor: '#070B14',
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          <Outlet />
        </main>

        {/* Fixed Mobile Bottom Tab Bar */}
        <nav
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 64,
            backgroundColor: 'rgba(11, 15, 25, 0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '0 4px',
            zIndex: 40,
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = location.pathname === tab.path || (tab.path === '/dashboard' && location.pathname === '/');

            if (tab.isProminent) {
              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: -20,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 16px rgba(59, 130, 246, 0.5)',
                      border: '3px solid #0B0F19',
                      color: '#FFF',
                      transform: active ? 'scale(1.08)' : 'scale(1)',
                      transition: 'transform 0.15s ease',
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      color: active ? '#38BDF8' : '#94A3B8',
                      marginTop: 2,
                    }}
                  >
                    {tab.label}
                  </span>
                </NavLink>
              );
            }

            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  padding: '4px 8px',
                  borderRadius: 10,
                  color: active ? '#38BDF8' : '#64748B',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={18} color={active ? '#38BDF8' : '#64748B'} />
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {tab.label}
                </span>
                {active && (
                  <span
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: '50%',
                      backgroundColor: '#38BDF8',
                    }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
