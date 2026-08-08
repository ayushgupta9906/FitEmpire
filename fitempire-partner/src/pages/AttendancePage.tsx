import React, { useState } from 'react';
import { Search, Filter, Download, CheckCircle2, Calendar, User } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [records, setRecords] = useState([
    { id: '1', name: 'Rahul Sharma', phone: '+91 98765 43210', passType: 'All-Access Gold', time: '10:45 AM', date: 'Today', status: 'VERIFIED' },
    { id: '2', name: 'Priya Patel', phone: '+91 91234 56789', passType: 'FitEmpire Platinum', time: '10:32 AM', date: 'Today', status: 'VERIFIED' },
    { id: '3', name: 'Amit Kumar', phone: '+91 99887 76655', passType: 'All-Access Pass', time: '10:15 AM', date: 'Today', status: 'VERIFIED' },
    { id: '4', name: 'Sneha Verma', phone: '+91 94567 81234', passType: 'All-Access Gold', time: '09:50 AM', date: 'Today', status: 'VERIFIED' },
    { id: '5', name: 'Kavita Singh', phone: '+91 97654 32190', passType: 'FitEmpire Platinum', time: '09:20 AM', date: 'Today', status: 'VERIFIED' },
    { id: '6', name: 'Rohan Gupta', phone: '+91 96543 21987', passType: 'All-Access Gold', time: '08:45 AM', date: 'Today', status: 'VERIFIED' },
    { id: '7', name: 'Ananya Roy', phone: '+91 95432 19876', passType: 'FitEmpire Platinum', time: '08:10 AM', date: 'Today', status: 'VERIFIED' },
    { id: '8', name: 'Deepak Joshi', phone: '+91 94321 98765', passType: 'All-Access Pass', time: '07:30 AM', date: 'Today', status: 'VERIFIED' },
  ]);

  const filtered = records.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm) ||
      r.passType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF' }}>
            Daily Member Attendance Logs
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Verified check-in timestamps, pass tier verification, and member visit history.
          </p>
        </div>

        <button className="btn-secondary">
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Search size={18} color="#64748B" />
        <input
          type="text"
          placeholder="Search by member name, phone number, or pass tier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#FFFFFF',
            fontSize: '0.9rem',
          }}
        />
      </div>

      {/* Table Card */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <th style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>MEMBER</th>
              <th style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>PHONE</th>
              <th style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>PASS TIER</th>
              <th style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>TIME</th>
              <th style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'background 0.15s ease',
                }}
              >
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: '#FFF',
                      }}
                    >
                      {item.name[0]}
                    </div>
                    <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.9rem' }}>
                      {item.name}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 20px', color: '#94A3B8', fontSize: '0.85rem' }}>
                  {item.phone}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span className="badge-purple">{item.passType}</span>
                </td>
                <td style={{ padding: '16px 20px', color: '#CBD5E1', fontSize: '0.85rem' }}>
                  {item.time} ({item.date})
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span className="badge-emerald">{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
