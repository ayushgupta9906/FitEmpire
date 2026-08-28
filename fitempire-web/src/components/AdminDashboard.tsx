import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  DollarSign, 
  Search, 
  Filter, 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  Zap, 
  Clock, 
  MapPin, 
  Check, 
  ChevronRight, 
  Activity, 
  Lock, 
  LogOut,
  Sliders,
  Send
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
}

interface PendingGym {
  id: string;
  name: string;
  city: string;
  locality: string;
  owner: string;
  phone: string;
  capacity: number;
  appliedDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const INITIAL_PENDING_GYMS: PendingGym[] = [
  {
    id: 'GYM-9821',
    name: 'Iron Core Fitness & CrossFit',
    city: 'Bengaluru',
    locality: 'HSR Layout, Sector 4',
    owner: 'Arjun Nambiar',
    phone: '+91 98450 11234',
    capacity: 120,
    appliedDate: '28 Aug 2026, 02:30 PM',
    status: 'PENDING'
  },
  {
    id: 'GYM-9822',
    name: 'Ozone Luxury Health Club',
    city: 'Delhi NCR',
    locality: 'Greater Kailash II, New Delhi',
    owner: 'Sandeep Khurana',
    phone: '+91 98110 55432',
    capacity: 250,
    appliedDate: '28 Aug 2026, 01:15 PM',
    status: 'PENDING'
  },
  {
    id: 'GYM-9823',
    name: 'Cult Strength & Reformer Pilates',
    city: 'Mumbai',
    locality: 'Bandra West, Hill Road',
    owner: 'Pooja Hegde',
    phone: '+91 99201 88765',
    capacity: 90,
    appliedDate: '27 Aug 2026, 06:45 PM',
    status: 'APPROVED'
  },
  {
    id: 'GYM-9824',
    name: 'Anytime Fitness 24/7',
    city: 'Hyderabad',
    locality: 'Gachibowli, Financial District',
    owner: 'Vikram Reddy',
    phone: '+91 98850 44321',
    capacity: 180,
    appliedDate: '27 Aug 2026, 04:10 PM',
    status: 'APPROVED'
  }
];

const RECENT_CHECKINS = [
  { id: 'CHK-801', member: 'Rahul Verma', gym: 'Gold\'s Gym Koramangala', time: '1 min ago', status: 'GRANTED', city: 'Bengaluru' },
  { id: 'CHK-802', member: 'Sneha Kapoor', gym: 'Cult.Fit Bandra', time: '3 mins ago', status: 'GRANTED', city: 'Mumbai' },
  { id: 'CHK-803', member: 'Aman Deep Singh', gym: 'Ozone Club GK II', time: '5 mins ago', status: 'GRANTED', city: 'Delhi NCR' },
  { id: 'CHK-804', member: 'Priya Iyer', gym: 'Anytime Fitness Gachibowli', time: '7 mins ago', status: 'GRANTED', city: 'Hyderabad' },
  { id: 'CHK-805', member: 'Karthik Rao', gym: 'Torque CrossFit Pune', time: '11 mins ago', status: 'GRANTED', city: 'Pune' }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToWebsite }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [adminEmail, setAdminEmail] = useState('admin@fitempire.in');
  const [adminPassword, setAdminPassword] = useState('Admin@FitEmpire2024!');
  const [activeTab, setActiveTab] = useState<'overview' | 'gyms' | 'settlements' | 'members'>('overview');
  const [gymsList, setGymsList] = useState<PendingGym[]>(INITIAL_PENDING_GYMS);
  const [settlementSuccess, setSettlementSuccess] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const handleApproveGym = (id: string) => {
    setGymsList(prev => prev.map(g => g.id === id ? { ...g, status: 'APPROVED' } : g));
  };

  const handleRejectGym = (id: string) => {
    setGymsList(prev => prev.map(g => g.id === id ? { ...g, status: 'REJECTED' } : g));
  };

  const handleReleaseSettlements = () => {
    setSettlementSuccess(true);
    setTimeout(() => setSettlementSuccess(false), 4000);
  };

  // 1. LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card executive-card">
          <div className="login-logo-header">
            <div className="brand-logo-icon">
              <ShieldCheck size={24} color="#FFF" />
            </div>
            <h2>FitEmpire Super Admin</h2>
            <p>Enter your enterprise credentials to access the governance console.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }} className="admin-login-form">
            <div className="form-group">
              <label>Admin Email Address</label>
              <input 
                type="email" 
                value={adminEmail} 
                onChange={(e) => setAdminEmail(e.target.value)} 
                required 
                className="admin-input"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={adminPassword} 
                onChange={(e) => setAdminPassword(e.target.value)} 
                required 
                className="admin-input"
              />
            </div>

            <button type="submit" className="btn-purple-primary w-full" style={{ padding: '12px', marginTop: '10px' }}>
              <Lock size={16} />
              <span>Login to Super Admin Console</span>
            </button>
          </form>

          <button onClick={onBackToWebsite} className="btn-back-link">
            <ArrowLeft size={14} />
            <span>Return to Main Website (fitempire.tech)</span>
          </button>
        </div>

        <style>{adminStyles}</style>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN DASHBOARD
  const filteredGyms = gymsList.filter(g => 
    g.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
    g.city.toLowerCase().includes(searchFilter.toLowerCase()) ||
    g.locality.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="admin-dashboard-root">
      
      {/* Top Admin Header Bar */}
      <header className="admin-header-bar">
        <div className="admin-header-left">
          <button onClick={onBackToWebsite} className="btn-header-back" title="Go to Website">
            <ArrowLeft size={16} />
            <span>Main Website</span>
          </button>
          <div className="header-divider"></div>
          <div className="admin-brand-badge">
            <ShieldCheck size={18} className="text-purple" />
            <strong>FitEmpire Super Admin</strong>
            <span className="live-pill">● LIVE PRODUCTION</span>
          </div>
        </div>

        <div className="admin-header-right">
          <div className="admin-user-pill">
            <span className="admin-avatar">A</span>
            <div className="admin-user-details">
              <strong className="admin-user-name">Ayush Gupta (Super Admin)</strong>
              <span className="admin-user-email">admin@fitempire.in</span>
            </div>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="btn-logout" title="Sign Out">
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="admin-body-container">
        
        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button 
            className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Activity size={16} />
            <span>Platform Overview</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'gyms' ? 'active' : ''}`}
            onClick={() => setActiveTab('gyms')}
          >
            <Building2 size={16} />
            <span>Gym KYC & Approvals</span>
            <span className="tab-counter-badge">{gymsList.filter(g => g.status === 'PENDING').length}</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'settlements' ? 'active' : ''}`}
            onClick={() => setActiveTab('settlements')}
          >
            <DollarSign size={16} />
            <span>Financial Settlements</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            <Users size={16} />
            <span>Member Subscriptions</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="tab-pane-content">
            
            {/* KPI Metric Cards */}
            <div className="admin-kpis-grid">
              <div className="kpi-card executive-card">
                <div className="kpi-top">
                  <span className="kpi-title">TOTAL PARTNER GYMS</span>
                  <div className="kpi-icon-wrap purple"><Building2 size={18} /></div>
                </div>
                <div className="kpi-number">12,450</div>
                <div className="kpi-footer text-emerald">
                  <span>+180 gyms onboarded this week</span>
                </div>
              </div>

              <div className="kpi-card executive-card">
                <div className="kpi-top">
                  <span className="kpi-title">ACTIVE MONTHLY MEMBERS</span>
                  <div className="kpi-icon-wrap indigo"><Users size={18} /></div>
                </div>
                <div className="kpi-number">142,850</div>
                <div className="kpi-footer text-emerald">
                  <span>+14.2% month-over-month growth</span>
                </div>
              </div>

              <div className="kpi-card executive-card">
                <div className="kpi-top">
                  <span className="kpi-title">MONTHLY PASS GMV</span>
                  <div className="kpi-icon-wrap emerald"><DollarSign size={18} /></div>
                </div>
                <div className="kpi-number">₹4.82 Cr</div>
                <div className="kpi-footer text-emerald">
                  <span>₹1.24 Cr reserved for gym payouts</span>
                </div>
              </div>

              <div className="kpi-card executive-card">
                <div className="kpi-top">
                  <span className="kpi-title">DAILY CHECK-INS TODAY</span>
                  <div className="kpi-icon-wrap amber"><Zap size={18} /></div>
                </div>
                <div className="kpi-number">38,940</div>
                <div className="kpi-footer text-emerald">
                  <span>99.98% turnstile scanner success</span>
                </div>
              </div>
            </div>

            {/* Live Check-in Stream & Quick Verification */}
            <div className="admin-overview-columns">
              
              {/* Left: Live Check-in Feed */}
              <div className="admin-sub-card executive-card">
                <div className="card-sub-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={18} className="text-purple" />
                    <strong>Live Member Turnstile Check-in Feed</strong>
                  </div>
                  <span className="live-tag">● REALTIME STREAM</span>
                </div>

                <div className="checkins-feed-list">
                  {RECENT_CHECKINS.map((chk) => (
                    <div key={chk.id} className="chk-row">
                      <div className="chk-avatar-box">{chk.member.charAt(0)}</div>
                      <div className="chk-info">
                        <strong className="chk-name">{chk.member}</strong>
                        <span className="chk-gym">{chk.gym} • {chk.city}</span>
                      </div>
                      <div className="chk-time-status">
                        <span className="chk-status-pill">0.2s QR VALIDATED</span>
                        <span className="chk-time">{chk.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Quick Action Widget */}
              <div className="admin-sub-card executive-card">
                <div className="card-sub-header">
                  <strong>Weekly Settlement Dispatch</strong>
                </div>
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
                  Next automated Razorpay Route payout cycle for 12,450 verified gym partners is ready for execution.
                </p>

                <div className="payout-summary-box">
                  <div className="p-sum-row">
                    <span>Total Eligible Partners:</span>
                    <strong>12,450 Gyms</strong>
                  </div>
                  <div className="p-sum-row">
                    <span>Total Check-ins Billed:</span>
                    <strong>264,800 Visits</strong>
                  </div>
                  <div className="p-sum-row total">
                    <span>Total Settlement Amount:</span>
                    <span className="text-purple font-bold" style={{ fontSize: '18px' }}>₹1,24,65,000</span>
                  </div>
                </div>

                {settlementSuccess ? (
                  <div className="alert-success-box">
                    <CheckCircle2 size={18} color="#059669" />
                    <span>Settlement batch dispatched successfully to 12,450 bank accounts!</span>
                  </div>
                ) : (
                  <button className="btn-purple-primary w-full" onClick={handleReleaseSettlements}>
                    <Send size={15} />
                    <span>Authorize & Disburse Weekly Payouts (₹1.24 Cr)</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: GYM KYC & APPROVALS */}
        {activeTab === 'gyms' && (
          <div className="tab-pane-content">
            <div className="table-controls-bar executive-card">
              <div className="search-input-wrap">
                <Search size={15} color="#94A3B8" />
                <input 
                  type="text" 
                  placeholder="Filter by gym name, city, or locality..." 
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="table-search-box"
                />
              </div>
              <div className="filter-stats-text">
                Showing <strong>{filteredGyms.length}</strong> Gym Applications
              </div>
            </div>

            <div className="admin-table-wrapper executive-card">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Gym Details</th>
                    <th>City / Location</th>
                    <th>Owner / Contact</th>
                    <th>Peak Capacity</th>
                    <th>Application Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGyms.map((gym) => (
                    <tr key={gym.id}>
                      <td>
                        <strong className="gym-table-name">{gym.name}</strong>
                        <span className="gym-table-id">{gym.id}</span>
                      </td>
                      <td>
                        <span className="gym-table-city">{gym.city}</span>
                        <span className="gym-table-loc">{gym.locality}</span>
                      </td>
                      <td>
                        <span className="gym-owner-name">{gym.owner}</span>
                        <span className="gym-owner-phone">{gym.phone}</span>
                      </td>
                      <td>
                        <span className="gym-capacity-pill">{gym.capacity} Members / hr</span>
                      </td>
                      <td>{gym.appliedDate}</td>
                      <td>
                        <span className={`status-badge ${gym.status.toLowerCase()}`}>
                          {gym.status}
                        </span>
                      </td>
                      <td>
                        {gym.status === 'PENDING' ? (
                          <div className="action-buttons-group">
                            <button 
                              className="btn-action-approve"
                              onClick={() => handleApproveGym(gym.id)}
                              title="Approve Listing"
                            >
                              <Check size={14} />
                              <span>Approve</span>
                            </button>
                            <button 
                              className="btn-action-reject"
                              onClick={() => handleRejectGym(gym.id)}
                              title="Reject Listing"
                            >
                              <XCircle size={14} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted-text">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SETTLEMENTS */}
        {activeTab === 'settlements' && (
          <div className="tab-pane-content">
            <div className="admin-sub-card executive-card">
              <div className="card-sub-header">
                <strong>Automated Weekly Gym Partner Settlements (Razorpay Route)</strong>
                <button className="btn-outline-dark" onClick={handleReleaseSettlements}>
                  <RefreshCw size={14} />
                  <span>Sync Bank Accounts</span>
                </button>
              </div>

              <div className="settlement-history-grid">
                <div className="s-hist-card">
                  <span className="s-date">21 Aug 2026 - 27 Aug 2026</span>
                  <span className="s-amount text-purple font-bold">₹1,24,65,000</span>
                  <span className="s-badge pending">PENDING APPROVAL</span>
                  <button className="btn-purple-primary w-full" style={{ marginTop: '12px' }} onClick={handleReleaseSettlements}>
                    Release Payouts
                  </button>
                </div>
                <div className="s-hist-card">
                  <span className="s-date">14 Aug 2026 - 20 Aug 2026</span>
                  <span className="s-amount text-emerald font-bold">₹1,18,40,000</span>
                  <span className="s-badge completed">SETTLED (12,270 Gyms)</span>
                  <span className="s-tx-id">UTR: RAZ-9948123-IN</span>
                </div>
                <div className="s-hist-card">
                  <span className="s-date">07 Aug 2026 - 13 Aug 2026</span>
                  <span className="s-amount text-emerald font-bold">₹1,12,90,000</span>
                  <span className="s-badge completed">SETTLED (12,110 Gyms)</span>
                  <span className="s-tx-id">UTR: RAZ-9884192-IN</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MEMBER SUBSCRIPTIONS */}
        {activeTab === 'members' && (
          <div className="tab-pane-content">
            <div className="admin-kpis-grid" style={{ marginBottom: '24px' }}>
              <div className="kpi-card executive-card">
                <span className="kpi-title">FITPASS ALL-ACCESS</span>
                <div className="kpi-number">94,200</div>
                <span className="kpi-footer text-purple">66% of total subscriber base</span>
              </div>
              <div className="kpi-card executive-card">
                <span className="kpi-title">FITPASS COMBO (DIET)</span>
                <div className="kpi-number">32,450</div>
                <span className="kpi-footer text-emerald">23% subscriber share</span>
              </div>
              <div className="kpi-card executive-card">
                <span className="kpi-title">ACTIVE PASS FREEZES</span>
                <div className="kpi-number">3,890</div>
                <span className="kpi-footer">Members on travel pause</span>
              </div>
              <div className="kpi-card executive-card">
                <span className="kpi-title">ARIA AI WORKOUT PLANS</span>
                <div className="kpi-number">128,400</div>
                <span className="kpi-footer text-indigo">Generated this month</span>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{adminStyles}</style>
    </div>
  );
};

const adminStyles = `
  .admin-login-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0B0F19;
    padding: 24px;
  }
  .admin-login-card {
    width: 100%;
    max-width: 440px;
    background: #1E293B;
    border: 1px solid #334155;
    border-radius: var(--radius-lg);
    padding: 36px;
  }
  .login-logo-header {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
  }
  .login-logo-header h2 {
    font-size: 22px;
    font-weight: 900;
    color: #FFFFFF;
    margin: 12px 0 4px;
  }
  .login-logo-header p {
    font-size: 13px;
    color: #94A3B8;
  }
  .admin-login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .form-group label {
    font-size: 12px;
    font-weight: 700;
    color: #CBD5E1;
  }
  .admin-input {
    width: 100%;
    background: #0F172A;
    border: 1px solid #334155;
    padding: 10px 14px;
    border-radius: var(--radius-sm);
    color: #FFFFFF;
    font-size: 14px;
    outline: none;
  }
  .admin-input:focus {
    border-color: var(--purple-primary);
  }
  .btn-back-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: none;
    border: none;
    color: #A78BFA;
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    width: 100%;
  }

  /* Admin Header */
  .admin-dashboard-root {
    min-height: 100vh;
    background: #F8FAFC;
  }
  .admin-header-bar {
    height: 64px;
    background: #FFFFFF;
    border-bottom: 1px solid var(--border-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .admin-header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .btn-header-back {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #F1F5F9;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-sm);
    color: #334155;
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    transition: all var(--transition-smooth);
  }
  .btn-header-back:hover {
    background: var(--purple-light);
    color: var(--purple-primary);
  }
  .header-divider {
    width: 1px;
    height: 24px;
    background: var(--border-light);
  }
  .admin-brand-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #0F172A;
  }
  .live-pill {
    font-size: 9.5px;
    font-weight: 800;
    color: #059669;
    background: #DCFCE7;
    padding: 2px 8px;
    border-radius: var(--radius-full);
  }
  .admin-header-right {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .admin-user-pill {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .admin-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--purple-gradient);
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 13px;
  }
  .admin-user-details {
    display: flex;
    flex-direction: column;
  }
  .admin-user-name {
    font-size: 12.5px;
    color: #0F172A;
  }
  .admin-user-email {
    font-size: 10.5px;
    color: #64748B;
  }
  .btn-logout {
    background: #F1F5F9;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748B;
    cursor: pointer;
  }

  /* Admin Body */
  .admin-body-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 28px 24px;
  }
  .admin-nav-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    border-bottom: 1px solid var(--border-light);
    padding-bottom: 12px;
  }
  .admin-tab-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 16px;
    border-radius: var(--radius-sm);
    background: transparent;
    border: none;
    color: #64748B;
    font-size: 13.5px;
    font-weight: 700;
    cursor: pointer;
    transition: all var(--transition-smooth);
  }
  .admin-tab-btn:hover {
    color: #0F172A;
    background: #F1F5F9;
  }
  .admin-tab-btn.active {
    background: var(--purple-light);
    color: var(--purple-primary);
  }
  .tab-counter-badge {
    background: #EF4444;
    color: #FFFFFF;
    font-size: 10px;
    font-weight: 800;
    padding: 1px 6px;
    border-radius: var(--radius-full);
  }

  /* KPI Grid */
  .admin-kpis-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 28px;
  }
  .kpi-card {
    padding: 22px;
    background: #FFFFFF;
  }
  .kpi-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .kpi-title {
    font-size: 11px;
    font-weight: 800;
    color: #64748B;
    letter-spacing: 0.5px;
  }
  .kpi-icon-wrap {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .kpi-icon-wrap.purple { background: var(--purple-light); color: var(--purple-primary); }
  .kpi-icon-wrap.indigo { background: #EEF2FF; color: #4F46E5; }
  .kpi-icon-wrap.emerald { background: #DCFCE7; color: #059669; }
  .kpi-icon-wrap.amber { background: #FEF3C7; color: #D97706; }
  .kpi-number {
    font-family: var(--font-heading);
    font-size: 28px;
    font-weight: 900;
    color: #0F172A;
    line-height: 1.1;
    margin-bottom: 6px;
  }
  .kpi-footer {
    font-size: 11.5px;
    font-weight: 600;
    color: #64748B;
  }
  .text-emerald { color: #059669; }

  /* Columns */
  .admin-overview-columns {
    display: grid;
    grid-template-columns: 1.3fr 0.7fr;
    gap: 24px;
  }
  .admin-sub-card {
    padding: 24px;
    background: #FFFFFF;
  }
  .card-sub-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-light);
  }
  .live-tag {
    font-size: 9.5px;
    font-weight: 800;
    color: #059669;
    background: #DCFCE7;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .checkins-feed-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .chk-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    background: #F8FAFC;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-light);
  }
  .chk-avatar-box {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--purple-light);
    color: var(--purple-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 12px;
  }
  .chk-info {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .chk-name {
    font-size: 13px;
    color: #0F172A;
  }
  .chk-gym {
    font-size: 11.5px;
    color: #64748B;
  }
  .chk-time-status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .chk-status-pill {
    font-size: 9px;
    font-weight: 800;
    color: #059669;
    background: #DCFCE7;
    padding: 2px 6px;
    border-radius: 4px;
    margin-bottom: 2px;
  }
  .chk-time {
    font-size: 10.5px;
    color: #94A3B8;
  }
  .payout-summary-box {
    background: var(--purple-light);
    border: 1px solid var(--purple-border);
    padding: 14px;
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 18px;
  }
  .p-sum-row {
    display: flex;
    justify-content: space-between;
    font-size: 12.5px;
    color: #334155;
  }
  .p-sum-row.total {
    border-top: 1px solid var(--purple-border);
    padding-top: 8px;
  }
  .alert-success-box {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: #DCFCE7;
    border: 1px solid #10B981;
    color: #059669;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 700;
  }

  /* Tables */
  .table-controls-bar {
    padding: 14px 18px;
    background: #FFFFFF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .search-input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #F8FAFC;
    border: 1px solid var(--border-light);
    padding: 7px 12px;
    border-radius: var(--radius-sm);
    width: 320px;
  }
  .table-search-box {
    border: none;
    background: transparent;
    outline: none;
    font-size: 12.5px;
    width: 100%;
  }
  .filter-stats-text {
    font-size: 12.5px;
    color: #64748B;
  }
  .admin-table-wrapper {
    background: #FFFFFF;
    padding: 0;
    overflow-x: auto;
  }
  .admin-data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    text-align: left;
  }
  .admin-data-table th {
    background: #F8FAFC;
    padding: 12px 18px;
    font-size: 11px;
    font-weight: 800;
    color: #64748B;
    border-bottom: 1px solid var(--border-light);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .admin-data-table td {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border-light);
    color: #334155;
  }
  .gym-table-name {
    font-size: 13.5px;
    color: #0F172A;
    display: block;
  }
  .gym-table-id {
    font-size: 10px;
    color: #94A3B8;
    font-family: monospace;
  }
  .gym-table-city {
    font-weight: 700;
    color: #0F172A;
    display: block;
  }
  .gym-table-loc {
    font-size: 11.5px;
    color: #64748B;
  }
  .gym-owner-name {
    font-weight: 600;
    color: #0F172A;
    display: block;
  }
  .gym-owner-phone {
    font-size: 11.5px;
    color: #64748B;
  }
  .gym-capacity-pill {
    background: #F1F5F9;
    padding: 3px 8px;
    border-radius: var(--radius-full);
    font-size: 11.5px;
    font-weight: 600;
  }
  .status-badge {
    font-size: 10px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: var(--radius-full);
  }
  .status-badge.pending { background: #FEF3C7; color: #B45309; }
  .status-badge.approved { background: #DCFCE7; color: #059669; }
  .status-badge.rejected { background: #FEE2E2; color: #DC2626; }
  .action-buttons-group {
    display: flex;
    gap: 6px;
  }
  .btn-action-approve {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px 10px;
    background: #DCFCE7;
    border: 1px solid #10B981;
    color: #059669;
    font-size: 11px;
    font-weight: 800;
    border-radius: var(--radius-sm);
    cursor: pointer;
  }
  .btn-action-reject {
    padding: 5px 8px;
    background: #FEE2E2;
    border: 1px solid #EF4444;
    color: #DC2626;
    border-radius: var(--radius-sm);
    cursor: pointer;
  }
  .text-muted-text {
    font-size: 11px;
    color: #94A3B8;
  }

  /* Settlement Grid */
  .settlement-history-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 16px;
  }
  .s-hist-card {
    background: #F8FAFC;
    border: 1px solid var(--border-light);
    padding: 18px;
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .s-date {
    font-size: 12px;
    font-weight: 700;
    color: #0F172A;
  }
  .s-amount {
    font-size: 22px;
    font-weight: 900;
    font-family: var(--font-heading);
  }
  .s-badge {
    font-size: 9.5px;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 4px;
    width: fit-content;
  }
  .s-badge.pending { background: #FEF3C7; color: #B45309; }
  .s-badge.completed { background: #DCFCE7; color: #059669; }
  .s-tx-id {
    font-size: 10.5px;
    color: #64748B;
    font-family: monospace;
  }

  @media (max-width: 960px) {
    .admin-kpis-grid { grid-template-columns: 1fr 1fr; }
    .admin-overview-columns { grid-template-columns: 1fr; }
    .settlement-history-grid { grid-template-columns: 1fr; }
  }
`;
