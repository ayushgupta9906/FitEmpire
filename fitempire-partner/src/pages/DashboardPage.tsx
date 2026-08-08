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
} from 'lucide-react';
import { partnerApi } from '../api';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    checkedInToday: 48,
    todayEarnings: 9600,
    activePassHolders: 342,
    rating: 4.9,
  });

  const [recentCheckIns, setRecentCheckIns] = useState([
    { id: '1', name: 'Rahul Sharma', time: '10:45 AM', tier: 'All-Access Gold', passId: 'FP-8892', status: 'VERIFIED' },
    { id: '2', name: 'Priya Patel', time: '10:32 AM', tier: 'FitEmpire Platinum', passId: 'FP-4310', status: 'VERIFIED' },
    { id: '3', name: 'Amit Kumar', time: '10:15 AM', tier: 'All-Access Pass', passId: 'FP-7721', status: 'VERIFIED' },
    { id: '4', name: 'Sneha Verma', time: '09:50 AM', tier: 'All-Access Gold', passId: 'FP-1209', status: 'VERIFIED' },
    { id: '5', name: 'Kavita Singh', time: '09:20 AM', tier: 'FitEmpire Platinum', passId: 'FP-9904', status: 'VERIFIED' },
  ]);

  const [todayClasses, setTodayClasses] = useState([
    { id: 'c1', name: 'High-Intensity Crossfit', trainer: 'Coach Vikram', time: '06:30 PM', booked: 18, capacity: 20 },
    { id: 'c2', name: 'Power Yoga & Core', trainer: 'Ananya Roy', time: '07:30 PM', booked: 14, capacity: 15 },
    { id: 'c3', name: 'Zumba Cardio Blast', trainer: 'Pooja Hegde', time: '08:30 PM', booked: 20, capacity: 20 },
  ]);

  useEffect(() => {
    partnerApi.getDashboardActivity()
      .then((res) => {
        const d = res.data?.data;
        if (d) {
          if (d.checkedInToday !== undefined) {
            setStats(prev => ({
              ...prev,
              checkedInToday: d.checkedInToday || prev.checkedInToday,
              todayEarnings: (d.checkedInToday || 48) * 200,
            }));
          }
          if (d.recentCheckIns && Array.isArray(d.recentCheckIns) && d.recentCheckIns.length > 0) {
            setRecentCheckIns(d.recentCheckIns);
          }
        }
      })
      .catch(() => {});

    partnerApi.getClasses()
      .then((res) => {
        const cls = res.data?.data;
        if (cls && Array.isArray(cls) && cls.length > 0) {
          setTodayClasses(cls.map((c: any) => ({
            id: c.id || String(Math.random()),
            name: c.name || c.title || 'Gym Class',
            trainer: c.trainerName || c.instructor || 'Lead Trainer',
            time: c.time || c.startTime || '06:30 PM',
            booked: c.bookedCount || 12,
            capacity: c.capacity || 20,
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      {/* Top Banner Card */}
      <div
        className="glass-panel"
        style={{
          padding: '16px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(16, 185, 129, 0.12) 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', lineHeight: 1.2 }}>
              FitEmpire Flagship
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: 3 }}>
              Bangalore • Hours: 06:00 AM – 10:00 PM
            </p>
          </div>
          <span className="badge-emerald" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
            VERIFIED
          </span>
        </div>

        <button
          onClick={() => navigate('/scanner')}
          className="btn-emerald"
          style={{ width: '100%', padding: '10px 16px', fontSize: '0.85rem', borderRadius: 12 }}
        >
          <QrCode size={16} />
          <span>Launch QR Pass Verifier</span>
        </button>
      </div>

      {/* Metrics 2x2 Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="glass-panel" style={{ padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>Checked-in Today</span>
            <Users size={14} color="#3B82F6" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF' }}>
            {stats.checkedInToday}
          </div>
          <div style={{ fontSize: '0.65rem', color: '#10B981', marginTop: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <TrendingUp size={11} />
            <span>+14% vs yesterday</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>Today's Pass Payout</span>
            <DollarSign size={14} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF' }}>
            ₹ {stats.todayEarnings.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: 2 }}>
            ₹200 per verified visit
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>Active Members</span>
            <Activity size={14} color="#8B5CF6" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF' }}>
            {stats.activePassHolders}
          </div>
          <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: 2 }}>
            In gym cluster
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>Desk Rating</span>
            <Sparkles size={14} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF' }}>
            {stats.rating} ★
          </div>
          <div style={{ fontSize: '0.65rem', color: '#F59E0B', marginTop: 2 }}>
            Top 5% in Bangalore
          </div>
        </div>
      </div>

      {/* Recent Check-Ins List */}
      <div className="glass-panel" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF' }}>
              Live Check-in Feed
            </h2>
            <p style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Today's verified member scans</p>
          </div>
          <button
            onClick={() => navigate('/attendance')}
            className="btn-secondary"
            style={{ padding: '4px 8px', fontSize: '0.72rem', borderRadius: 8 }}
          >
            <span>All</span>
            <ArrowUpRight size={12} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recentCheckIns.slice(0, 4).map((ci) => (
            <div
              key={ci.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    color: '#FFF',
                  }}
                >
                  {ci.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFF' }}>
                    {ci.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                    {ci.tier} • {ci.passId}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="badge-emerald" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>
                  {ci.status}
                </span>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: 2 }}>
                  {ci.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Fitness Classes */}
      <div className="glass-panel" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF' }}>
              Today's Classes
            </h2>
            <p style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Group workout sessions</p>
          </div>
          <button
            onClick={() => navigate('/classes')}
            className="btn-secondary"
            style={{ padding: '4px 8px', fontSize: '0.72rem', borderRadius: 8 }}
          >
            <span>Manage</span>
            <Calendar size={12} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {todayClasses.map((cls) => (
            <div
              key={cls.id}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFF' }}>
                    {cls.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: 1 }}>
                    {cls.trainer} • <span style={{ color: '#38BDF8' }}>{cls.time}</span>
                  </div>
                </div>
                <span className="badge-cyan" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
                  {cls.booked}/{cls.capacity} Booked
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
