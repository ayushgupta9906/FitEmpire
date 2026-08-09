import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  QrCode,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  Flame,
  Dumbbell,
} from 'lucide-react';
import { partnerApi } from '../api';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    checkedInToday: 6,
    todayEarnings: 1200,
    activePassHolders: 48,
    rating: 4.9,
  });

  const [recentCheckIns, setRecentCheckIns] = useState<Array<{
    id: string;
    name: string;
    time: string;
    tier: string;
    status: string;
  }>>([
    { id: '1', name: 'Rahul Sharma', time: '10:45 PM', tier: 'FitEmpire Gold Elite', status: 'VERIFIED' },
    { id: '2', name: 'Priya Patel', time: '10:12 PM', tier: 'FitEmpire Platinum VIP', status: 'VERIFIED' },
    { id: '3', name: 'Amit Kumar', time: '09:30 PM', tier: 'FitEmpire Pro Unlimited', status: 'VERIFIED' },
  ]);

  const [todayClasses, setTodayClasses] = useState<Array<{
    id: string;
    name: string;
    trainer: string;
    time: string;
    booked: number;
    capacity: number;
  }>>([
    { id: '1', name: 'High-Intensity HIIT', trainer: 'Marcus Ray', time: '07:00 PM', booked: 18, capacity: 20 },
    { id: '2', name: 'Power Yoga & Core', trainer: 'Sarah Chen', time: '08:15 PM', booked: 14, capacity: 15 },
  ]);

  useEffect(() => {
    // 1. Fetch live metrics from backend
    partnerApi.getDashboardStats()
      .then((res) => {
        const d = res.data?.data;
        if (d) {
          const bookings = Number(d.totalBookingsToday) || 6;
          setStats({
            checkedInToday: bookings,
            todayEarnings: bookings * 200,
            activePassHolders: Number(d.totalUsers) || 48,
            rating: 4.9,
          });
        }
      })
      .catch(() => {});

    // 2. Fetch live attendances
    partnerApi.getAttendances()
      .then((res) => {
        const list = res.data?.data;
        if (Array.isArray(list) && list.length > 0) {
          setRecentCheckIns(list.slice(0, 3).map((item: any, idx: number) => ({
            id: item.id || String(idx),
            name: item.name || 'FitEmpire Member',
            time: item.time ? new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
            tier: item.passType || 'FitEmpire All-Access Gold',
            status: 'VERIFIED',
          })));
        }
      })
      .catch(() => {});

    // 3. Listen for real-time check-in events
    const handleCheckIn = (e: any) => {
      if (e.detail) {
        setStats((prev) => ({
          ...prev,
          checkedInToday: prev.checkedInToday + 1,
          todayEarnings: prev.todayEarnings + 200,
        }));

        setRecentCheckIns((prev) => [
          {
            id: String(Date.now()),
            name: e.detail.memberName || 'FitEmpire Member',
            time: 'Just now',
            tier: e.detail.passTier || 'FitEmpire All-Access Gold',
            status: 'VERIFIED',
          },
          ...prev.slice(0, 2),
        ]);
      }
    };

    window.addEventListener('fitempire_checkin_event', handleCheckIn);
    return () => window.removeEventListener('fitempire_checkin_event', handleCheckIn);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Quick QR Scanner Banner */}
      <div
        className="glass-panel"
        style={{
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(59, 130, 246, 0.15) 100%)',
          border: '1px solid rgba(79, 70, 229, 0.4)',
          padding: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: '#4F46E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.5)',
            }}
          >
            <QrCode size={20} color="#FFF" />
          </div>
          <div>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFF', display: 'block' }}>
              Verify Member Pass
            </span>
            <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
              Instant QR camera & fast-scan simulator
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/scanner')}
          className="btn-primary"
          style={{ padding: '8px 12px', fontSize: '0.75rem' }}
        >
          <span>Open Scanner</span>
        </button>
      </div>

      {/* 2x2 Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {/* Visits Card */}
        <div className="glass-panel" style={{ padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700 }}>TODAY'S VISITS</span>
            <div style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={13} color="#38BDF8" />
            </div>
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF', display: 'block' }}>
            {stats.checkedInToday}
          </span>
          <span style={{ fontSize: '0.62rem', color: '#10B981', fontWeight: 700 }}>
            +18% vs yesterday
          </span>
        </div>

        {/* Earnings Card */}
        <div className="glass-panel" style={{ padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700 }}>EST. REVENUE</span>
            <div style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={13} color="#10B981" />
            </div>
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10B981', display: 'block' }}>
            ₹{stats.todayEarnings.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: '0.62rem', color: '#A5B4FC', fontWeight: 700 }}>
            ₹200/visit rate
          </span>
        </div>

        {/* Active Members Card */}
        <div className="glass-panel" style={{ padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700 }}>PASS HOLDERS</span>
            <div style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={13} color="#A78BFA" />
            </div>
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF', display: 'block' }}>
            {stats.activePassHolders}
          </span>
          <span style={{ fontSize: '0.62rem', color: '#38BDF8', fontWeight: 700 }}>
            Active center access
          </span>
        </div>

        {/* Rating Card */}
        <div className="glass-panel" style={{ padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700 }}>GYM RATING</span>
            <div style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={13} color="#FBBF24" />
            </div>
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FBBF24', display: 'block' }}>
            ★ {stats.rating}
          </span>
          <span style={{ fontSize: '0.62rem', color: '#94A3B8', fontWeight: 700 }}>
            Top Rated Venue
          </span>
        </div>
      </div>

      {/* Recent Check-in Feed */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '0 2px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFF' }}>
            Recent Check-ins
          </span>
          <button
            onClick={() => navigate('/attendance')}
            style={{ background: 'transparent', border: 'none', color: '#38BDF8', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
          >
            See All →
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {recentCheckIns.map((item) => (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#A5B4FC',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                  }}
                >
                  {item.name[0]}
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FFF', display: 'block' }}>
                    {item.name}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#38BDF8' }}>{item.tier}</span>
                </div>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#A5B4FC', fontWeight: 700 }}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Studio Classes */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '0 2px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFF' }}>
            Today's Studio Classes
          </span>
          <button
            onClick={() => navigate('/classes')}
            style={{ background: 'transparent', border: 'none', color: '#38BDF8', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Manage →
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {todayClasses.map((c) => (
            <div
              key={c.id}
              className="glass-panel"
              style={{
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FFF', display: 'block' }}>
                  {c.name}
                </span>
                <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>
                  Trainer: {c.trainer} • {c.time}
                </span>
              </div>
              <span className="badge-emerald" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
                {c.booked}/{c.capacity} Booked
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
