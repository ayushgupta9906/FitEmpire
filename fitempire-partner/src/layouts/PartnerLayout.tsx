import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
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
  Calendar,
  CheckCircle2,
  X,
  ArrowRight,
} from 'lucide-react';

export interface CheckInEventData {
  memberName: string;
  phone?: string;
  passTier?: string;
  gymName?: string;
  time?: string;
  bookingId?: string;
}

export const PartnerLayout: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentTime, setCurrentTime] = useState('09:41');
  const [activeCheckInAlert, setActiveCheckInAlert] = useState<CheckInEventData | null>(null);
  const [unreadVisitsCount, setUnreadVisitsCount] = useState<number>(3);

  // Auth guard — redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
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

  // Global Check-In Event Listener
  useEffect(() => {
    const handleCheckInEvent = (e: any) => {
      if (e.detail) {
        setActiveCheckInAlert(e.detail);
        setUnreadVisitsCount((c) => c + 1);
      }
    };

    window.addEventListener('fitempire_checkin_event', handleCheckInEvent);
    return () => window.removeEventListener('fitempire_checkin_event', handleCheckInEvent);
  }, []);

  const tabs = [
    { label: 'Desk', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Visits', path: '/attendance', icon: Users, badge: unreadVisitsCount },
    { label: 'Scanner', path: '/scanner', icon: QrCode, isProminent: true },
    { label: 'Classes', path: '/classes', icon: Calendar },
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
        padding: '16px 8px',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Phone Device Frame (Matching Member App Theme & Bezel) */}
      <div
        style={{
          width: '100%',
          maxWidth: 410,
          height: 840,
          borderRadius: 40,
          border: '10px solid #1E293B',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 40px rgba(79, 70, 229, 0.25)',
          overflow: 'hidden',
          backgroundColor: '#0B0F19',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Top Status Bar */}
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
              width: 110,
              height: 22,
              borderRadius: 20,
              backgroundColor: '#000000',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            <span style={{ fontSize: '0.62rem', color: '#A5B4FC', fontWeight: 800 }}>
              FitEmpire Live
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#FFF' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#38BDF8' }}>5G</span>
            <Wifi size={12} color="#FFF" />
            <Battery size={14} color="#FFF" />
          </div>
        </div>

        {/* In-App Header */}
        <header
          style={{
            height: 54,
            backgroundColor: 'rgba(11, 15, 25, 0.95)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
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
                backgroundColor: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(79, 70, 229, 0.4)',
              }}
            >
              <div style={{ display: 'inline-flex', transform: 'scaleX(-1)' }}>
                <Dumbbell color="#FFFFFF" size={16} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF' }}>
                  FitEmpire Partner
                </span>
                <span className="badge-cyan" style={{ fontSize: '0.55rem', padding: '1px 5px' }}>
                  PARTNER
                </span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span>{user?.gymName || 'Strike Force MMA Desk'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => navigate('/scanner')}
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                border: 'none',
                color: '#FFF',
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)',
              }}
            >
              <QrCode size={13} />
              <span>Scan QR</span>
            </button>

            <button
              onClick={logout}
              title="Logout"
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <LogOut size={13} />
            </button>
          </div>
        </header>

        {/* Global Live Check-in Popup Alert */}
        {activeCheckInAlert && (
          <div
            className="animate-popin"
            style={{
              position: 'absolute',
              top: 50,
              left: 12,
              right: 12,
              zIndex: 100,
              backgroundColor: '#0F172A',
              border: '2px solid #10B981',
              borderRadius: 18,
              padding: '14px 16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 25px rgba(16, 185, 129, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircle2 size={18} color="#10B981" />
                </div>
                <div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#10B981' }}>
                    Member QR Check-in Approved!
                  </span>
                  <span style={{ display: 'block', fontSize: '0.68rem', color: '#94A3B8' }}>
                    Synced with FitEmpire DB & Admin Console
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveCheckInAlert(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 12,
                padding: '8px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFF', display: 'block' }}>
                  {activeCheckInAlert.memberName}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 600 }}>
                  {activeCheckInAlert.passTier || 'FitEmpire All-Access Gold'}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#A5B4FC', fontWeight: 700 }}>
                {activeCheckInAlert.time || 'Just now'}
              </span>
            </div>

            <button
              onClick={() => {
                setActiveCheckInAlert(null);
                navigate('/attendance');
              }}
              style={{
                backgroundColor: '#10B981',
                color: '#000',
                border: 'none',
                borderRadius: 10,
                padding: '8px 12px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <span>View Attendance Log</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 14px 75px',
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </main>

        {/* Bottom Tab Bar */}
        <nav
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 64,
            backgroundColor: 'rgba(11, 15, 25, 0.98)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '0 4px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 40,
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;

            if (tab.isProminent) {
              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textDecoration: 'none',
                    marginTop: -16,
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 18px rgba(79, 70, 229, 0.6)',
                      border: '3px solid #0B0F19',
                    }}
                  >
                    <Icon color="#FFFFFF" size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      color: isActive ? '#38BDF8' : '#94A3B8',
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
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textDecoration: 'none',
                  position: 'relative',
                  padding: '6px 8px',
                  borderRadius: 10,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <Icon
                    size={19}
                    color={isActive ? '#38BDF8' : '#64748B'}
                    style={{
                      filter: isActive ? 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  />
                  {tab.badge && tab.badge > 0 && !isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -4,
                        right: -8,
                        backgroundColor: '#EF4444',
                        color: '#FFF',
                        fontSize: '0.55rem',
                        fontWeight: 800,
                        borderRadius: 10,
                        padding: '1px 4px',
                        minWidth: 14,
                        textAlign: 'center',
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? '#38BDF8' : '#64748B',
                    marginTop: 3,
                  }}
                >
                  {tab.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
