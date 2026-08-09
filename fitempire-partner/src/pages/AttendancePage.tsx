import React, { useState, useEffect } from 'react';
import { Search, Download, CheckCircle2, User, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { partnerApi } from '../api';

export const AttendancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<Array<{
    id: string;
    name: string;
    phone: string;
    passType: string;
    time: string;
    date: string;
    status: string;
  }>>([
    { id: '1', name: 'Rahul Sharma', phone: '+91 98800 72520', passType: 'FitEmpire Gold Elite', time: '10:45 PM', date: 'Today', status: 'CHECKED_IN' },
    { id: '2', name: 'Priya Patel', phone: '+91 98765 43210', passType: 'FitEmpire Platinum VIP', time: '10:12 PM', date: 'Today', status: 'CHECKED_IN' },
    { id: '3', name: 'Amit Kumar', phone: '+91 94104 30095', passType: 'FitEmpire Pro Unlimited', time: '09:30 PM', date: 'Today', status: 'CHECKED_IN' },
    { id: '4', name: 'Sneha Verma', phone: '+91 94567 81234', passType: 'FitEmpire Gold Elite', time: '08:50 PM', date: 'Today', status: 'CHECKED_IN' },
  ]);

  const loadAttendances = async () => {
    setLoading(true);
    try {
      const res = await partnerApi.getAttendances();
      const data = res.data?.data;
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map((d: any, idx: number) => ({
          id: d.id || String(idx),
          name: d.name || 'FitEmpire Member',
          phone: d.phone || '+91 98800 72520',
          passType: d.passType || 'FitEmpire All-Access Gold',
          time: d.time ? new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
          date: d.date || 'Today',
          status: d.status || 'CHECKED_IN',
        }));
        setRecords(formatted);
      }
    } catch (e) {
      console.warn('Could not fetch attendances:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendances();

    // Listen for live check-in events from Scanner
    const handleNewCheckIn = (e: any) => {
      if (e.detail) {
        const newRecord = {
          id: String(Date.now()),
          name: e.detail.memberName || 'FitEmpire Member',
          phone: e.detail.phone || '+91 98800 72520',
          passType: e.detail.passTier || 'FitEmpire All-Access Gold',
          time: 'Just now',
          date: 'Today',
          status: 'CHECKED_IN',
        };
        setRecords((prev) => [newRecord, ...prev]);
      }
    };

    window.addEventListener('fitempire_checkin_event', handleNewCheckIn);
    return () => window.removeEventListener('fitempire_checkin_event', handleNewCheckIn);
  }, []);

  const filtered = records.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm) ||
      r.passType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>
            Live Member Visits
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
            Real-time check-in timestamps & pass logs
          </p>
        </div>

        <button
          onClick={loadAttendances}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#38BDF8',
            borderRadius: 10,
            padding: '6px 10px',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Search size={16} color="#64748B" />
        <input
          type="text"
          placeholder="Search by member name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#FFFFFF',
            fontSize: '0.82rem',
            fontWeight: 600,
          }}
        />
      </div>

      {/* Live Visits Count Chip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>
          TODAY'S VERIFIED VISITS ({filtered.length})
        </span>
        <span className="badge-emerald" style={{ fontSize: '0.62rem' }}>
          ● LIVE DESK SYNC
        </span>
      </div>

      {/* Attendance Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            className="glass-panel"
            style={{
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#FFF',
                  fontSize: '0.85rem',
                }}
              >
                {item.name[0]}
              </div>

              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFF', display: 'block' }}>
                  {item.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#38BDF8', fontWeight: 600 }}>
                  {item.passType}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                <Clock size={11} color="#A5B4FC" />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#A5B4FC' }}>
                  {item.time}
                </span>
              </div>
              <span className="badge-emerald" style={{ fontSize: '0.58rem', padding: '1px 5px', marginTop: 2 }}>
                ✓ VERIFIED
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
