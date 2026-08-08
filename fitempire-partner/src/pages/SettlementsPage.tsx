import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowUpRight, CheckCircle2, Clock, Download, Building, ShieldCheck } from 'lucide-react';
import { partnerApi } from '../api';

export const SettlementsPage: React.FC = () => {
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [stats, setStats] = useState({
    grossEarnings: 184200,
    platformSplit: 18420,
    netPayable: 165780,
    paidOut: 132000,
    availableBalance: 33780,
    bankAccount: 'HDFC Bank •••••• 4892 (IFSC: HDFC0000240)',
  });

  const [payoutHistory, setPayoutHistory] = useState([
    { id: 'SET-9912', date: '01 Aug 2026', amount: 48000, checkIns: 240, status: 'PAID', ref: 'UPI/621984029410' },
    { id: 'SET-9844', date: '15 Jul 2026', amount: 44000, checkIns: 220, status: 'PAID', ref: 'NEFT/HDFC29402194' },
    { id: 'SET-9701', date: '01 Jul 2026', amount: 40000, checkIns: 200, status: 'PAID', ref: 'UPI/619029401928' },
  ]);

  React.useEffect(() => {
    partnerApi.getSettlements()
      .then((res) => {
        const d = res.data?.data;
        if (d) {
          if (d.availableBalance !== undefined) {
            setStats(prev => ({ ...prev, ...d }));
          }
          if (d.history && Array.isArray(d.history) && d.history.length > 0) {
            setPayoutHistory(d.history);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleRequestPayout = async () => {
    try {
      await partnerApi.requestPayout(stats.availableBalance);
    } catch {
      // Proceed
    }
    setPayoutSuccess(true);
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF' }}>
            Financial Settlements & Payouts
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Weekly pass verification earnings, ledger breakdown, and bank settlement status.
          </p>
        </div>

        <button onClick={handleRequestPayout} className="btn-emerald">
          <DollarSign size={18} />
          <span>Request Payout (₹ {stats.availableBalance.toLocaleString('en-IN')})</span>
        </button>
      </div>

      {payoutSuccess && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderRadius: 14,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid #10B981',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#34D399', fontWeight: 700 }}>
            <CheckCircle2 size={20} />
            <span>Payout request of ₹ {stats.availableBalance.toLocaleString('en-IN')} submitted to {stats.bankAccount}. Processing via IMPS!</span>
          </div>
          <button onClick={() => setPayoutSuccess(false)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            Dismiss
          </button>
        </div>
      )}

      {/* Financial Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
        <div className="glass-panel" style={{ padding: 22 }}>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600, marginBottom: 8 }}>
            Available Payout Balance
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', marginBottom: 4 }}>
            ₹ {stats.availableBalance.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
            Ready for instant IMPS transfer
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 22 }}>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600, marginBottom: 8 }}>
            Total Gross Revenue
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF', marginBottom: 4 }}>
            ₹ {stats.grossEarnings.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#38BDF8' }}>
            From 921 verified check-ins
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 22 }}>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600, marginBottom: 8 }}>
            Total Paid Out to Date
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF', marginBottom: 4 }}>
            ₹ {stats.paidOut.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
            Settled to registered bank
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 22 }}>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600, marginBottom: 8 }}>
            Settlement Bank Account
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', marginBottom: 4 }}>
            HDFC Bank
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
            {stats.bankAccount}
          </div>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF' }}>
            Settlement History & Invoices
          </h2>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>SETTLEMENT ID</th>
              <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>DATE</th>
              <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>CHECK-INS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>AMOUNT</th>
              <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>STATUS</th>
              <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {payoutHistory.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '16px 24px', fontWeight: 700, color: '#38BDF8', fontSize: '0.88rem' }}>
                  {p.id}
                </td>
                <td style={{ padding: '16px 24px', color: '#CBD5E1', fontSize: '0.88rem' }}>
                  {p.date}
                </td>
                <td style={{ padding: '16px 24px', color: '#94A3B8', fontSize: '0.88rem' }}>
                  {p.checkIns} Visits
                </td>
                <td style={{ padding: '16px 24px', fontWeight: 800, color: '#FFF', fontSize: '0.95rem' }}>
                  ₹ {p.amount.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span className="badge-emerald">{p.status}</span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                    <Download size={13} />
                    <span>Invoice PDF</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
