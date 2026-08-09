import React, { useState } from 'react';
import { DollarSign, ArrowUpRight, CheckCircle2, Clock, Building, ShieldCheck } from 'lucide-react';

export const SettlementsPage: React.FC = () => {
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [stats, setStats] = useState({
    availableBalance: 33780,
    grossEarnings: 184200,
    paidOut: 150420,
    bankAccount: 'HDFC Bank •••••• 4892',
  });

  const [payoutHistory] = useState([
    { id: 'SET-9912', date: '01 Aug 2026', amount: 48000, checkIns: 240, status: 'PAID' },
    { id: 'SET-9844', date: '15 Jul 2026', amount: 44000, checkIns: 220, status: 'PAID' },
    { id: 'SET-9701', date: '01 Jul 2026', amount: 40000, checkIns: 200, status: 'PAID' },
  ]);

  const handleRequestPayout = () => {
    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>
          Earnings & Payouts
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
          Weekly member visit revenue settlements
        </p>
      </div>

      {/* Available Balance Glowing Card */}
      <div
        className="glass-panel"
        style={{
          padding: 16,
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.15) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
        }}
      >
        <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: 4 }}>
          AVAILABLE BALANCE (READY FOR PAYOUT)
        </span>
        <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10B981', display: 'block', letterSpacing: '-0.02em' }}>
          ₹{stats.availableBalance.toLocaleString('en-IN')}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '10px 0 14px' }}>
          <Building size={13} color="#A5B4FC" />
          <span style={{ fontSize: '0.72rem', color: '#A5B4FC', fontWeight: 600 }}>
            {stats.bankAccount}
          </span>
        </div>

        <button
          onClick={handleRequestPayout}
          className="btn-emerald"
          style={{ width: '100%', padding: '10px', fontSize: '0.82rem' }}
        >
          <DollarSign size={15} />
          <span>Request Instant Payout</span>
        </button>

        {payoutSuccess && (
          <div
            className="animate-popin"
            style={{
              marginTop: 10,
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10B981',
              borderRadius: 10,
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#10B981',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            <CheckCircle2 size={16} />
            <span>Payout request initiated to bank account!</span>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="glass-panel" style={{ padding: 12 }}>
          <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 700 }}>TOTAL EARNED</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', display: 'block', marginTop: 2 }}>
            ₹{stats.grossEarnings.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="glass-panel" style={{ padding: 12 }}>
          <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 700 }}>TOTAL SETTLED</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38BDF8', display: 'block', marginTop: 2 }}>
            ₹{stats.paidOut.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Payout History */}
      <div>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFF', display: 'block', marginBottom: 8 }}>
          Recent Payout Statements
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {payoutHistory.map((p) => (
            <div
              key={p.id}
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
                  ₹{p.amount.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>
                  {p.date} • {p.checkIns} Visits
                </span>
              </div>
              <span className="badge-emerald" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>
                ✓ {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
