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
  Send,
  Calendar,
  Bell,
  Settings,
  PlusCircle,
  FileText,
  PieChart,
  BarChart3,
  Dumbbell,
  CheckSquare,
  Eye,
  Trash2,
  Edit
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
}

// 1. DUMMY GYMS DATA
const ALL_GYMS = [
  { id: 'GYM-101', name: 'Gold\'s Gym Indiranagar', city: 'Bengaluru', locality: '100ft Road', tier: 'ELITE', capacity: 150, rating: 4.9, activeMembers: 340, status: 'VERIFIED' },
  { id: 'GYM-102', name: 'Cult.Fit Koramangala', city: 'Bengaluru', locality: '80ft Road, 4th Block', tier: 'PRO', capacity: 200, rating: 4.8, activeMembers: 520, status: 'VERIFIED' },
  { id: 'GYM-103', name: 'Anytime Fitness HSR Layout', city: 'Bengaluru', locality: 'Sector 2', tier: 'STANDARD', capacity: 100, rating: 4.7, activeMembers: 210, status: 'VERIFIED' },
  { id: 'GYM-104', name: 'Ozone Luxury Health Club', city: 'Delhi NCR', locality: 'Greater Kailash II', tier: 'ELITE', capacity: 250, rating: 4.9, activeMembers: 480, status: 'PENDING_KYC' },
  { id: 'GYM-105', name: 'CrossFit BlackBox Bandra', city: 'Mumbai', locality: 'Hill Road', tier: 'PRO', capacity: 80, rating: 4.9, activeMembers: 190, status: 'VERIFIED' },
  { id: 'GYM-106', name: 'Nitrrro Wellness Sanctuary', city: 'Mumbai', locality: 'Breach Candy', tier: 'ELITE', capacity: 180, rating: 4.8, activeMembers: 310, status: 'VERIFIED' },
  { id: 'GYM-107', name: 'Snap Fitness Gachibowli', city: 'Hyderabad', locality: 'Financial District', tier: 'STANDARD', capacity: 120, rating: 4.6, activeMembers: 240, status: 'VERIFIED' },
  { id: 'GYM-108', name: 'Torque Fitness & MMA Club', city: 'Pune', locality: 'Koregaon Park', tier: 'PRO', capacity: 95, rating: 4.8, activeMembers: 160, status: 'PENDING_KYC' }
];

// 2. DUMMY MEMBERS DATA
const ALL_MEMBERS = [
  { id: 'USR-701', name: 'Rahul Verma', phone: '+91 98450 12345', plan: 'FITPASS ALL-ACCESS (12M)', city: 'Bengaluru', checkins: 48, wallet: '₹1,500', status: 'ACTIVE' },
  { id: 'USR-702', name: 'Sneha Kapoor', phone: '+91 98110 54321', plan: 'FITPASS COMBO (6M)', city: 'Mumbai', checkins: 29, wallet: '₹2,200', status: 'ACTIVE' },
  { id: 'USR-703', name: 'Aman Deep Singh', phone: '+91 99201 98765', plan: 'FITPASS ALL-ACCESS (3M)', city: 'Delhi NCR', checkins: 14, wallet: '₹500', status: 'ACTIVE' },
  { id: 'USR-704', name: 'Priya Iyer', phone: '+91 98850 67890', plan: 'FITPASS LITE (1M)', city: 'Hyderabad', checkins: 8, wallet: '₹0', status: 'ACTIVE' },
  { id: 'USR-705', name: 'Vikram Singhania', phone: '+91 97123 45678', plan: 'FITPASS ALL-ACCESS (12M)', city: 'Pune', checkins: 62, wallet: '₹4,000', status: 'FROZEN (PAUSE)' }
];

// 3. RECENT CHECKINS FEED
const RECENT_CHECKINS = [
  { id: 'CHK-901', member: 'Rahul Verma', gym: 'Gold\'s Gym Indiranagar', time: 'Just now', latency: '0.18s', city: 'Bengaluru' },
  { id: 'CHK-902', member: 'Sneha Kapoor', gym: 'Cult.Fit Bandra', time: '2 mins ago', latency: '0.21s', city: 'Mumbai' },
  { id: 'CHK-903', member: 'Aman Deep Singh', gym: 'Ozone Club GK II', time: '5 mins ago', latency: '0.19s', city: 'Delhi NCR' },
  { id: 'CHK-904', member: 'Priya Iyer', gym: 'Snap Fitness Gachibowli', time: '8 mins ago', latency: '0.24s', city: 'Hyderabad' },
  { id: 'CHK-905', member: 'Karthik Rao', gym: 'Torque MMA Pune', time: '12 mins ago', latency: '0.20s', city: 'Pune' }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToWebsite }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [adminEmail, setAdminEmail] = useState('admin@fitempire.in');
  const [adminPassword, setAdminPassword] = useState('Admin@FitEmpire2024!');
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'gyms' | 'verification' | 'onboarding' | 'members' | 'bookings' | 'classes' | 'settlements' | 'payments' | 'analytics' | 'notifications' | 'settings'
  >('dashboard');

  const [gyms, setGyms] = useState(ALL_GYMS);
  const [searchFilter, setSearchFilter] = useState('');
  const [notificationMsg, setNotificationMsg] = useState('');
  const [notificationSent, setNotificationSent] = useState(false);
  const [settlementSuccess, setSettlementSuccess] = useState(false);

  // New Gym Form
  const [newGymName, setNewGymName] = useState('');
  const [newGymCity, setNewGymCity] = useState('Bengaluru');
  const [newGymLocality, setNewGymLocality] = useState('');
  const [newGymCapacity, setNewGymCapacity] = useState('100');
  const [newGymTier, setNewGymTier] = useState('PRO');
  const [onboardSuccess, setOnboardSuccess] = useState(false);

  const handleApproveGym = (id: string) => {
    setGyms(prev => prev.map(g => g.id === id ? { ...g, status: 'VERIFIED' } : g));
  };

  const handleRejectGym = (id: string) => {
    setGyms(prev => prev.filter(g => g.id !== id));
  };

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGymName || !newGymLocality) return;

    const createdGym = {
      id: `GYM-${Math.floor(100 + Math.random() * 900)}`,
      name: newGymName,
      city: newGymCity,
      locality: newGymLocality,
      tier: newGymTier,
      capacity: Number(newGymCapacity),
      rating: 4.9,
      activeMembers: 0,
      status: 'VERIFIED'
    };

    setGyms(prev => [createdGym, ...prev]);
    setOnboardSuccess(true);
    setNewGymName('');
    setNewGymLocality('');
    setTimeout(() => setOnboardSuccess(false), 3500);
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationMsg) return;
    setNotificationSent(true);
    setTimeout(() => {
      setNotificationSent(false);
      setNotificationMsg('');
    }, 3000);
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
              <ShieldCheck size={28} color="#FFF" />
            </div>
            <h2>FitEmpire Super Admin Console</h2>
            <p>Enter enterprise credentials to access platform governance and finances.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }} className="admin-login-form">
            <div className="form-group">
              <label>Admin Email</label>
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
              <span>Login to Super Admin</span>
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

  // Filtered Gyms
  const filteredGyms = gyms.filter(g => 
    g.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
    g.city.toLowerCase().includes(searchFilter.toLowerCase()) ||
    g.locality.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="admin-layout-root">
      
      {/* LEFT ADMIN SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand-box">
          <div className="brand-logo-icon">
            <ShieldCheck size={20} color="#FFF" />
          </div>
          <div className="sidebar-brand-text">
            <strong>FitEmpire</strong>
            <span>ENTERPRISE ADMIN</span>
          </div>
        </div>

        <div className="sidebar-menu-list">
          <div className="menu-category-label">PLATFORM GOVERNANCE</div>
          
          <button 
            className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Activity size={16} />
            <span>Dashboard Overview</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeTab === 'gyms' ? 'active' : ''}`}
            onClick={() => setActiveTab('gyms')}
          >
            <Building2 size={16} />
            <span>Partner Gyms (12,450)</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeTab === 'verification' ? 'active' : ''}`}
            onClick={() => setActiveTab('verification')}
          >
            <CheckSquare size={16} />
            <span>Gym KYC Approvals</span>
            <span className="sidebar-badge">{gyms.filter(g => g.status === 'PENDING_KYC').length}</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeTab === 'onboarding' ? 'active' : ''}`}
            onClick={() => setActiveTab('onboarding')}
          >
            <PlusCircle size={16} />
            <span>Onboard New Gym</span>
          </button>

          <div className="menu-category-label">MEMBERS & OPERATIONS</div>

          <button 
            className={`sidebar-nav-item ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            <Users size={16} />
            <span>Subscribers & Passes</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Clock size={16} />
            <span>Turnstile Check-ins</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeTab === 'classes' ? 'active' : ''}`}
            onClick={() => setActiveTab('classes')}
          >
            <Calendar size={16} />
            <span>Class Scheduler</span>
          </button>

          <div className="menu-category-label">FINANCE & BILLING</div>

          <button 
            className={`sidebar-nav-item ${activeTab === 'settlements' ? 'active' : ''}`}
            onClick={() => setActiveTab('settlements')}
          >
            <DollarSign size={16} />
            <span>Weekly Settlements</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <CreditCard size={16} />
            <span>Razorpay Payments</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={16} />
            <span>Analytics & BI</span>
          </button>

          <div className="menu-category-label">SYSTEM</div>

          <button 
            className={`sidebar-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={16} />
            <span>Push Broadcasts</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={16} />
            <span>Settings & API Keys</span>
          </button>
        </div>

        <div className="sidebar-footer-box">
          <button onClick={onBackToWebsite} className="btn-exit-to-web">
            <ArrowLeft size={15} />
            <span>Back to fitempire.tech</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="admin-main-viewport">
        
        {/* Top App Header */}
        <header className="admin-viewport-header">
          <div className="viewport-header-left">
            <span className="current-section-tag">{activeTab.toUpperCase()}</span>
            <h1 className="viewport-page-title">
              {activeTab === 'dashboard' && 'Executive Platform Overview'}
              {activeTab === 'gyms' && '12,450+ Partner Gyms Directory'}
              {activeTab === 'verification' && 'Partner KYC Verification Queue'}
              {activeTab === 'onboarding' && 'Onboard New Partner Gym'}
              {activeTab === 'members' && 'Subscriber Passes & Member Management'}
              {activeTab === 'bookings' && 'Real-time Turnstile Check-in Stream'}
              {activeTab === 'classes' && 'Workout & Fitness Class Scheduler'}
              {activeTab === 'settlements' && 'Automated Weekly Bank Settlements (Razorpay Route)'}
              {activeTab === 'payments' && 'Transaction Ledger & GST Invoices'}
              {activeTab === 'analytics' && 'Platform Revenue & City-Wise Analytics'}
              {activeTab === 'notifications' && 'System Push Broadcast Center'}
              {activeTab === 'settings' && 'Platform Configuration & API Credentials'}
            </h1>
          </div>

          <div className="viewport-header-right">
            <div className="live-status-pill">
              <span className="pulsing-green-dot"></span>
              <span>API PROD-READY</span>
            </div>
            <div className="user-profile-badge">
              <div className="avatar-letter">A</div>
              <div>
                <strong>Ayush Gupta</strong>
                <span>Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="admin-tab-body">
            
            {/* 4 Metric Cards */}
            <div className="metric-cards-grid">
              <div className="kpi-box executive-card">
                <div className="kpi-top-row">
                  <span>TOTAL VERIFIED GYMS</span>
                  <div className="icon-pill purple"><Building2 size={16} /></div>
                </div>
                <div className="kpi-big-num">12,450</div>
                <span className="kpi-trend text-emerald">↑ +180 onboarded this week</span>
              </div>

              <div className="kpi-box executive-card">
                <div className="kpi-top-row">
                  <span>ACTIVE SUBSCRIBERS</span>
                  <div className="icon-pill indigo"><Users size={16} /></div>
                </div>
                <div className="kpi-big-num">142,850</div>
                <span className="kpi-trend text-emerald">↑ +14.2% MoM growth</span>
              </div>

              <div className="kpi-box executive-card">
                <div className="kpi-top-row">
                  <span>MONTHLY PASS GMV</span>
                  <div className="icon-pill emerald"><DollarSign size={16} /></div>
                </div>
                <div className="kpi-big-num">₹4.82 Cr</div>
                <span className="kpi-trend text-purple font-bold">₹1.24 Cr payout reserve</span>
              </div>

              <div className="kpi-box executive-card">
                <div className="kpi-top-row">
                  <span>CHECK-INS TODAY</span>
                  <div className="icon-pill amber"><Zap size={16} /></div>
                </div>
                <div className="kpi-big-num">38,940</div>
                <span className="kpi-trend text-emerald">0.2s turnstile latency</span>
              </div>
            </div>

            {/* Two Column Grid: Real-time Check-ins + Quick Payout */}
            <div className="dashboard-grid-2col">
              
              <div className="admin-card-panel executive-card">
                <div className="panel-title-bar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={17} className="text-purple" />
                    <strong>Live Turnstile QR Check-in Stream</strong>
                  </div>
                  <span className="live-pill">● REALTIME 0.2s</span>
                </div>

                <div className="checkin-feed-container">
                  {RECENT_CHECKINS.map((chk) => (
                    <div key={chk.id} className="chk-feed-item">
                      <div className="chk-avatar">{chk.member.charAt(0)}</div>
                      <div className="chk-content">
                        <strong>{chk.member}</strong>
                        <span>{chk.gym} • {chk.city}</span>
                      </div>
                      <div className="chk-meta">
                        <span className="chk-pill-verified">VALIDATED ({chk.latency})</span>
                        <span className="chk-time-stamp">{chk.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-card-panel executive-card">
                <div className="panel-title-bar">
                  <strong>Weekly Payout Dispatch (Razorpay Route)</strong>
                </div>

                <div className="payout-summary-card">
                  <div className="p-row">
                    <span>Eligible Verified Gyms:</span>
                    <strong>12,450 Gyms</strong>
                  </div>
                  <div className="p-row">
                    <span>Total Check-ins Billed:</span>
                    <strong>264,800 Check-ins</strong>
                  </div>
                  <div className="p-row total">
                    <span>Total Weekly Payout:</span>
                    <strong className="text-purple" style={{ fontSize: '18px' }}>₹1,24,65,000</strong>
                  </div>
                </div>

                {settlementSuccess ? (
                  <div className="alert-success-box">
                    <CheckCircle2 size={16} color="#059669" />
                    <span>₹1.24 Cr settlement batch successfully dispatched!</span>
                  </div>
                ) : (
                  <button className="btn-purple-primary w-full" onClick={handleReleaseSettlements}>
                    <Send size={15} />
                    <span>Authorize & Disburse Weekly Settlements</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: GYMS MANAGEMENT */}
        {activeTab === 'gyms' && (
          <div className="admin-tab-body">
            <div className="table-search-bar executive-card">
              <div className="search-field-wrap">
                <Search size={16} color="#94A3B8" />
                <input 
                  type="text" 
                  placeholder="Search gym by name, city, or locality..." 
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </div>
              <button className="btn-purple-primary" onClick={() => setActiveTab('onboarding')}>
                <PlusCircle size={15} />
                <span>Add Partner Gym</span>
              </button>
            </div>

            <div className="admin-table-card executive-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Gym Name</th>
                    <th>City / Locality</th>
                    <th>Tier</th>
                    <th>Capacity</th>
                    <th>Rating</th>
                    <th>Active Members</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGyms.map((gym) => (
                    <tr key={gym.id}>
                      <td>
                        <strong>{gym.name}</strong>
                        <span className="sub-id">{gym.id}</span>
                      </td>
                      <td>
                        <span>{gym.city}</span>
                        <span className="sub-loc">{gym.locality}</span>
                      </td>
                      <td>
                        <span className={`tier-badge ${gym.tier.toLowerCase()}`}>{gym.tier}</span>
                      </td>
                      <td>{gym.capacity} / hr</td>
                      <td>★ {gym.rating}</td>
                      <td><strong>{gym.activeMembers}</strong> Members</td>
                      <td>
                        <span className={`status-pill ${gym.status === 'VERIFIED' ? 'approved' : 'pending'}`}>
                          {gym.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: KYC VERIFICATION */}
        {activeTab === 'verification' && (
          <div className="admin-tab-body">
            <div className="admin-table-card executive-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Gym Application</th>
                    <th>City</th>
                    <th>Locality</th>
                    <th>Capacity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gyms.filter(g => g.status === 'PENDING_KYC').length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                        🎉 All gym partner applications have been verified and approved!
                      </td>
                    </tr>
                  ) : (
                    gyms.filter(g => g.status === 'PENDING_KYC').map((gym) => (
                      <tr key={gym.id}>
                        <td>
                          <strong>{gym.name}</strong>
                          <span className="sub-id">{gym.id}</span>
                        </td>
                        <td>{gym.city}</td>
                        <td>{gym.locality}</td>
                        <td>{gym.capacity} Members / hr</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn-approve-sm" onClick={() => handleApproveGym(gym.id)}>
                              <Check size={14} />
                              <span>Approve & Issue Scanner</span>
                            </button>
                            <button className="btn-reject-sm" onClick={() => handleRejectGym(gym.id)}>
                              <XCircle size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ONBOARDING NEW GYM WIZARD */}
        {activeTab === 'onboarding' && (
          <div className="admin-tab-body">
            <div className="admin-card-panel executive-card" style={{ maxWidth: '680px' }}>
              <div className="panel-title-bar">
                <strong>Register & Onboard New Fitness Centre</strong>
              </div>

              {onboardSuccess && (
                <div className="alert-success-box" style={{ marginBottom: '18px' }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span>Gym successfully registered, turnstile credentials generated, and added to the Pan-India network!</span>
                </div>
              )}

              <form onSubmit={handleOnboardSubmit} className="onboarding-form">
                <div className="form-row">
                  <label>Fitness Centre Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Gold's Gym Whitefield" 
                    value={newGymName}
                    onChange={(e) => setNewGymName(e.target.value)}
                    required
                    className="admin-input-light"
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-row">
                    <label>City</label>
                    <select 
                      value={newGymCity} 
                      onChange={(e) => setNewGymCity(e.target.value)}
                      className="admin-input-light"
                    >
                      {['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-row">
                    <label>Locality / Address</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ITPL Main Road" 
                      value={newGymLocality}
                      onChange={(e) => setNewGymLocality(e.target.value)}
                      required
                      className="admin-input-light"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-row">
                    <label>Hourly Peak Capacity</label>
                    <input 
                      type="number" 
                      value={newGymCapacity}
                      onChange={(e) => setNewGymCapacity(e.target.value)}
                      className="admin-input-light"
                    />
                  </div>
                  <div className="form-row">
                    <label>Tier</label>
                    <select 
                      value={newGymTier} 
                      onChange={(e) => setNewGymTier(e.target.value)}
                      className="admin-input-light"
                    >
                      <option value="ELITE">ELITE (₹180/visit)</option>
                      <option value="PRO">PRO (₹150/visit)</option>
                      <option value="STANDARD">STANDARD (₹110/visit)</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-purple-primary w-full" style={{ padding: '12px', marginTop: '10px' }}>
                  <PlusCircle size={16} />
                  <span>Register Gym & Issue Turnstile Hardware</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: MEMBERS & PASSES */}
        {activeTab === 'members' && (
          <div className="admin-tab-body">
            <div className="admin-table-card executive-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Subscriber</th>
                    <th>Phone</th>
                    <th>Membership Plan</th>
                    <th>City</th>
                    <th>Total Check-ins</th>
                    <th>Wallet Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ALL_MEMBERS.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <strong>{m.name}</strong>
                        <span className="sub-id">{m.id}</span>
                      </td>
                      <td>{m.phone}</td>
                      <td>
                        <strong className="text-purple">{m.plan}</strong>
                      </td>
                      <td>{m.city}</td>
                      <td><strong>{m.checkins}</strong> Workouts</td>
                      <td>{m.wallet}</td>
                      <td>
                        <span className={`status-pill ${m.status === 'ACTIVE' ? 'approved' : 'pending'}`}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: TURNSTILE CHECK-INS */}
        {activeTab === 'bookings' && (
          <div className="admin-tab-body">
            <div className="admin-table-card executive-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Event ID</th>
                    <th>Member Name</th>
                    <th>Gym Centre</th>
                    <th>City</th>
                    <th>Turnstile Latency</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_CHECKINS.map((chk) => (
                    <tr key={chk.id}>
                      <td><code>{chk.id}</code></td>
                      <td><strong>{chk.member}</strong></td>
                      <td>{chk.gym}</td>
                      <td>{chk.city}</td>
                      <td><span className="status-pill approved">{chk.latency} QR SUCCESS</span></td>
                      <td>{chk.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: CLASS SCHEDULER */}
        {activeTab === 'classes' && (
          <div className="admin-tab-body">
            <div className="metric-cards-grid">
              <div className="kpi-box executive-card">
                <span>SCHEDULED TODAY</span>
                <div className="kpi-big-num">1,480</div>
                <span className="kpi-trend text-emerald">CrossFit, Yoga, Zumba, HIIT</span>
              </div>
              <div className="kpi-box executive-card">
                <span>AVERAGE ATTENDANCE</span>
                <div className="kpi-big-num">91.4%</div>
                <span className="kpi-trend text-emerald">Slot capacity utilization</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: WEEKLY SETTLEMENTS */}
        {activeTab === 'settlements' && (
          <div className="admin-tab-body">
            <div className="admin-card-panel executive-card">
              <div className="panel-title-bar">
                <strong>Razorpay Route Automated Bank Settlement Logs</strong>
                <button className="btn-outline-dark" onClick={handleReleaseSettlements}>
                  <RefreshCw size={14} />
                  <span>Sync Bank Gateway</span>
                </button>
              </div>

              <div className="settlement-cards-grid">
                <div className="settle-card">
                  <span className="set-date">21 Aug 2026 - 27 Aug 2026</span>
                  <span className="set-amt text-purple font-bold">₹1,24,65,000</span>
                  <span className="status-pill pending">PENDING APPROVAL</span>
                  <button className="btn-purple-primary w-full" style={{ marginTop: '10px' }} onClick={handleReleaseSettlements}>
                    Release ₹1.24 Cr
                  </button>
                </div>
                <div className="settle-card">
                  <span className="set-date">14 Aug 2026 - 20 Aug 2026</span>
                  <span className="set-amt text-emerald font-bold">₹1,18,40,000</span>
                  <span className="status-pill approved">SETTLED (12,270 GYMS)</span>
                  <span className="set-utr">UTR: RAZ-9948123-IN</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="admin-tab-body">
            <div className="admin-card-panel executive-card">
              <div className="panel-title-bar">
                <strong>Razorpay Payment Gateway Invoices</strong>
              </div>
              <div className="p-row" style={{ padding: '12px 0', borderBottom: '1px solid #E2E8F0' }}>
                <span>Total Collections (August 2026):</span>
                <strong className="text-emerald" style={{ fontSize: '18px' }}>₹4,82,40,000</strong>
              </div>
              <div className="p-row" style={{ padding: '12px 0', borderBottom: '1px solid #E2E8F0' }}>
                <span>GST Tax Collected (18%):</span>
                <strong>₹73,58,644</strong>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: ANALYTICS & BI */}
        {activeTab === 'analytics' && (
          <div className="admin-tab-body">
            <div className="metric-cards-grid">
              <div className="kpi-box executive-card">
                <span>TOP CITY BY WORKOUTS</span>
                <div className="kpi-big-num">Bengaluru</div>
                <span className="kpi-trend text-purple">38% total volume</span>
              </div>
              <div className="kpi-box executive-card">
                <span>MOST POPULAR ACTIVITY</span>
                <div className="kpi-big-num">CrossFit & HIIT</div>
                <span className="kpi-trend text-indigo">44% member preference</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: PUSH NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="admin-tab-body">
            <div className="admin-card-panel executive-card" style={{ maxWidth: '640px' }}>
              <div className="panel-title-bar">
                <strong>Send System Push Broadcast</strong>
              </div>

              {notificationSent && (
                <div className="alert-success-box" style={{ marginBottom: '14px' }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span>Push notification sent to 142,850 active member apps & 12,450 turnstile scanners!</span>
                </div>
              )}

              <form onSubmit={handleSendNotification} className="onboarding-form">
                <div className="form-row">
                  <label>Notification Message</label>
                  <textarea 
                    rows={4} 
                    placeholder="e.g. Flash 48-Hour Sale: Get 45% OFF on 12-Month FitPass All-Access!"
                    value={notificationMsg}
                    onChange={(e) => setNotificationMsg(e.target.value)}
                    required
                    className="admin-input-light"
                  />
                </div>

                <button type="submit" className="btn-purple-primary w-full" style={{ padding: '12px' }}>
                  <Send size={15} />
                  <span>Broadcast to 142,850 Subscribers</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 12: SETTINGS & APIS */}
        {activeTab === 'settings' && (
          <div className="admin-tab-body">
            <div className="admin-card-panel executive-card" style={{ maxWidth: '640px' }}>
              <div className="panel-title-bar">
                <strong>API Keys & Production Webhooks</strong>
              </div>
              <div className="form-row">
                <label>Razorpay Key ID</label>
                <input type="text" value="rzp_live_FitEmpireCore2026" readOnly className="admin-input-light" />
              </div>
              <div className="form-row">
                <label>Turnstile Dynamic QR Secret</label>
                <input type="password" value="************************" readOnly className="admin-input-light" />
              </div>
            </div>
          </div>
        )}

      </main>

      <style>{adminStyles}</style>
    </div>
  );
};

const adminStyles = `
  .admin-layout-root {
    display: flex;
    min-height: 100vh;
    background: #F8FAFC;
    color: #0F172A;
  }
  .admin-sidebar {
    width: 260px;
    background: #0F172A;
    color: #F8FAFC;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    border-right: 1px solid #1E293B;
  }
  .sidebar-brand-box {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
    border-bottom: 1px solid #1E293B;
  }
  .sidebar-brand-text {
    display: flex;
    flex-direction: column;
  }
  .sidebar-brand-text strong {
    font-size: 16px;
    font-family: var(--font-heading);
    letter-spacing: -0.3px;
  }
  .sidebar-brand-text span {
    font-size: 8.5px;
    font-weight: 800;
    color: #94A3B8;
    letter-spacing: 0.8px;
  }
  .sidebar-menu-list {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 16px 12px;
    flex: 1;
    overflow-y: auto;
  }
  .menu-category-label {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.8px;
    color: #64748B;
    margin: 14px 8px 6px;
  }
  .sidebar-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    background: transparent;
    border: none;
    color: #94A3B8;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
    transition: all var(--transition-smooth);
    width: 100%;
  }
  .sidebar-nav-item:hover {
    background: #1E293B;
    color: #FFFFFF;
  }
  .sidebar-nav-item.active {
    background: var(--purple-gradient);
    color: #FFFFFF;
    font-weight: 700;
  }
  .sidebar-badge {
    margin-left: auto;
    background: #EF4444;
    color: #FFFFFF;
    font-size: 9.5px;
    font-weight: 800;
    padding: 1px 6px;
    border-radius: var(--radius-full);
  }
  .sidebar-footer-box {
    padding: 16px;
    border-top: 1px solid #1E293B;
  }
  .btn-exit-to-web {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 14px;
    background: #1E293B;
    border: 1px solid #334155;
    border-radius: var(--radius-sm);
    color: #A78BFA;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    width: 100%;
    transition: all var(--transition-smooth);
  }
  .btn-exit-to-web:hover {
    background: var(--purple-gradient);
    color: #FFFFFF;
    border-color: transparent;
  }

  /* Main Viewport */
  .admin-main-viewport {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .admin-viewport-header {
    height: 70px;
    background: #FFFFFF;
    border-bottom: 1px solid var(--border-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
  }
  .current-section-tag {
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.8px;
    color: var(--purple-primary);
  }
  .viewport-page-title {
    font-size: 18px;
    font-weight: 900;
    color: #0F172A;
    margin: 2px 0 0;
  }
  .viewport-header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .live-status-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10.5px;
    font-weight: 800;
    color: #059669;
    background: #DCFCE7;
    padding: 4px 10px;
    border-radius: var(--radius-full);
  }
  .pulsing-green-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #059669;
  }
  .user-profile-badge {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .avatar-letter {
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
  .user-profile-badge div {
    display: flex;
    flex-direction: column;
  }
  .user-profile-badge strong { font-size: 12px; color: #0F172A; }
  .user-profile-badge span { font-size: 10px; color: #64748B; }

  /* Body */
  .admin-tab-body {
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .metric-cards-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }
  .kpi-box {
    padding: 20px;
    background: #FFFFFF;
  }
  .kpi-top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10.5px;
    font-weight: 800;
    color: #64748B;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }
  .icon-pill {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon-pill.purple { background: var(--purple-light); color: var(--purple-primary); }
  .icon-pill.indigo { background: #EEF2FF; color: #4F46E5; }
  .icon-pill.emerald { background: #DCFCE7; color: #059669; }
  .icon-pill.amber { background: #FEF3C7; color: #D97706; }
  .kpi-big-num {
    font-size: 26px;
    font-weight: 900;
    font-family: var(--font-heading);
    color: #0F172A;
    line-height: 1.1;
    margin-bottom: 4px;
  }
  .kpi-trend {
    font-size: 11px;
    font-weight: 600;
  }

  /* 2 Col */
  .dashboard-grid-2col {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 20px;
  }
  .admin-card-panel {
    background: #FFFFFF;
    padding: 22px;
  }
  .panel-title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-light);
    margin-bottom: 16px;
  }
  .checkin-feed-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .chk-feed-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    background: #F8FAFC;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-light);
  }
  .chk-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--purple-light);
    color: var(--purple-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 12px;
  }
  .chk-content {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .chk-content strong { font-size: 12.5px; color: #0F172A; }
  .chk-content span { font-size: 11px; color: #64748B; }
  .chk-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .chk-pill-verified {
    font-size: 8.5px;
    font-weight: 800;
    color: #059669;
    background: #DCFCE7;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .chk-time-stamp {
    font-size: 10px;
    color: #94A3B8;
  }
  .payout-summary-card {
    background: var(--purple-light);
    border: 1px solid var(--purple-border);
    padding: 14px;
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }
  .p-row {
    display: flex;
    justify-content: space-between;
    font-size: 12.5px;
    color: #334155;
  }
  .p-row.total {
    border-top: 1px solid var(--purple-border);
    padding-top: 8px;
    color: #0F172A;
  }
  .alert-success-box {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: #DCFCE7;
    border: 1px solid #10B981;
    color: #059669;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 700;
  }

  /* Tables */
  .table-search-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 18px;
    background: #FFFFFF;
  }
  .search-field-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #F8FAFC;
    border: 1px solid var(--border-light);
    padding: 6px 12px;
    border-radius: var(--radius-sm);
    width: 320px;
  }
  .search-field-wrap input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 12.5px;
    width: 100%;
  }
  .admin-table-card {
    background: #FFFFFF;
    padding: 0;
    overflow-x: auto;
  }
  .admin-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    text-align: left;
  }
  .admin-table th {
    background: #F8FAFC;
    padding: 12px 16px;
    font-size: 10.5px;
    font-weight: 800;
    color: #64748B;
    border-bottom: 1px solid var(--border-light);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .admin-table td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-light);
    color: #334155;
  }
  .sub-id { font-size: 10px; color: #94A3B8; font-family: monospace; display: block; }
  .sub-loc { font-size: 11px; color: #64748B; display: block; }
  .tier-badge {
    font-size: 9.5px;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .tier-badge.elite { background: #FEF3C7; color: #B45309; }
  .tier-badge.pro { background: var(--purple-light); color: var(--purple-primary); }
  .tier-badge.standard { background: #F1F5F9; color: #475569; }
  .status-pill {
    font-size: 9.5px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: var(--radius-full);
  }
  .status-pill.approved { background: #DCFCE7; color: #059669; }
  .status-pill.pending { background: #FEF3C7; color: #B45309; }
  .btn-approve-sm {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: #DCFCE7;
    border: 1px solid #10B981;
    color: #059669;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
  }
  .btn-reject-sm {
    padding: 4px 6px;
    background: #FEE2E2;
    border: 1px solid #EF4444;
    color: #DC2626;
    border-radius: 4px;
    cursor: pointer;
  }

  /* Form */
  .onboarding-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .form-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .form-row label {
    font-size: 12px;
    font-weight: 700;
    color: #334155;
  }
  .form-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .admin-input-light {
    width: 100%;
    background: #F8FAFC;
    border: 1px solid var(--border-light);
    padding: 9px 12px;
    border-radius: var(--radius-sm);
    font-size: 13px;
    color: #0F172A;
    outline: none;
  }
  .admin-input-light:focus {
    border-color: var(--purple-primary);
  }

  /* Settlements */
  .settlement-cards-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-top: 14px;
  }
  .settle-card {
    background: #F8FAFC;
    border: 1px solid var(--border-light);
    padding: 16px;
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .set-date { font-size: 12px; font-weight: 700; color: #0F172A; }
  .set-amt { font-size: 20px; font-family: var(--font-heading); }
  .set-utr { font-size: 10.5px; color: #64748B; font-family: monospace; }

  @media (max-width: 960px) {
    .admin-layout-root { flex-direction: column; }
    .admin-sidebar { width: 100%; }
    .metric-cards-grid { grid-template-columns: 1fr 1fr; }
    .dashboard-grid-2col { grid-template-columns: 1fr; }
  }
`;
