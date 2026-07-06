import {
  Box, Grid, Card, CardContent, Typography, Chip,
  LinearProgress, alpha,
} from '@mui/material';
import {
  People, FitnessCenter, EventNote, AttachMoney,
  TrendingUp, Warning,
} from '@mui/icons-material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import type { DashboardStats, RevenueChartData } from '../api';

// ── Stat Card ──────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
  trend?: number;
}

function StatCard({ title, value, subtitle, icon, gradient, trend }: StatCardProps) {
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Background gradient blob */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: gradient,
          opacity: 0.12,
          filter: 'blur(30px)',
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${alpha('#6C63FF', 0.3)}`,
            }}
          >
            {icon}
          </Box>
          {trend !== undefined && (
            <Chip
              label={`${trend > 0 ? '+' : ''}${trend}%`}
              size="small"
              icon={<TrendingUp sx={{ fontSize: '14px !important' }} />}
              sx={{
                background: trend > 0 ? 'rgba(67, 215, 135, 0.15)' : 'rgba(255, 87, 87, 0.15)',
                color: trend > 0 ? '#43D787' : '#FF5757',
                border: `1px solid ${trend > 0 ? 'rgba(67,215,135,0.3)' : 'rgba(255,87,87,0.3)'}`,
                fontWeight: 700,
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.7, display: 'block', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

// ── Revenue Chart ──────────────────────────────────────────────────────────

const MOCK_REVENUE: RevenueChartData[] = [
  { date: 'Mon', revenue: 45000, bookings: 120 },
  { date: 'Tue', revenue: 52000, bookings: 145 },
  { date: 'Wed', revenue: 48000, bookings: 132 },
  { date: 'Thu', revenue: 61000, bookings: 168 },
  { date: 'Fri', revenue: 55000, bookings: 150 },
  { date: 'Sat', revenue: 78000, bookings: 210 },
  { date: 'Sun', revenue: 72000, bookings: 195 },
];

const MOCK_STATS: DashboardStats = {
  totalUsers: 24891,
  totalGyms: 342,
  totalBookingsToday: 1204,
  totalRevenueToday: 182450,
  activeMembers: 18340,
  pendingApprovals: 23,
  growthRate: 18.4,
};

const PIE_DATA = [
  { name: 'Monthly', value: 45, color: '#6C63FF' },
  { name: 'Quarterly', value: 28, color: '#FF6584' },
  { name: 'Annual', value: 19, color: '#43D787' },
  { name: 'Day Pass', value: 8, color: '#FFB038' },
];

const RECENT_ACTIVITY = [
  { id: 1, type: 'user', msg: 'New user registered — Priya Sharma', time: '2 min ago', color: '#43D787' },
  { id: 2, type: 'gym', msg: 'Iron Fitness - Andheri awaiting approval', time: '8 min ago', color: '#FFB038' },
  { id: 3, type: 'payment', msg: '₹4,999 payment from Rahul Verma', time: '15 min ago', color: '#6C63FF' },
  { id: 4, type: 'checkin', msg: '45 check-ins at PowerZone Gym today', time: '22 min ago', color: '#FF6584' },
  { id: 5, type: 'user', msg: 'New gym partner onboarded — FitStar Bandra', time: '1 hr ago', color: '#43D787' },
];

export function DashboardPage() {
  // In production, these would use real API queries:
  // const { data: stats } = useQuery(['dashboard-stats'], dashboardApi.getStats);
  const stats = MOCK_STATS;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const formatNumber = (n: number) =>
    new Intl.NumberFormat('en-IN').format(n);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Welcome back 👋
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Here's what's happening at FitEmpire today.
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Users"
            value={formatNumber(stats.totalUsers)}
            subtitle="Platform members"
            icon={<People sx={{ color: '#fff', fontSize: 24 }} />}
            gradient="linear-gradient(135deg, #6C63FF, #9C94FF)"
            trend={12.4}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Active Gyms"
            value={formatNumber(stats.totalGyms)}
            subtitle={`${stats.pendingApprovals} pending review`}
            icon={<FitnessCenter sx={{ color: '#fff', fontSize: 24 }} />}
            gradient="linear-gradient(135deg, #FF6584, #FFB038)"
            trend={8.2}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Today's Bookings"
            value={formatNumber(stats.totalBookingsToday)}
            subtitle="Check-ins + Classes"
            icon={<EventNote sx={{ color: '#fff', fontSize: 24 }} />}
            gradient="linear-gradient(135deg, #43D787, #38BFFF)"
            trend={5.7}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Today's Revenue"
            value={formatCurrency(stats.totalRevenueToday)}
            subtitle="Net after deductions"
            icon={<AttachMoney sx={{ color: '#fff', fontSize: 24 }} />}
            gradient="linear-gradient(135deg, #FFB038, #FF6584)"
            trend={stats.growthRate}
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Revenue Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ height: 360 }}>
            <CardContent sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Revenue Overview</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Last 7 days</Typography>
                </Box>
                <Chip label="This Week" size="small" sx={{ background: 'rgba(108,99,255,0.15)', color: 'primary.main', fontWeight: 600 }} />
              </Box>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={MOCK_REVENUE} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6584" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FF6584" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#A0A8C8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#A0A8C8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 12 }}
                    formatter={(v: any, name: any) => [
                      name === 'revenue' ? `₹${Number(v).toLocaleString('en-IN')}` : v,
                      name === 'revenue' ? 'Revenue' : 'Bookings',
                    ]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6C63FF" strokeWidth={2.5} fill="url(#colorRevenue)" dot={false} activeDot={{ r: 6, fill: '#6C63FF' }} />
                  <Area type="monotone" dataKey="bookings" stroke="#FF6584" strokeWidth={2.5} fill="url(#colorBookings)" dot={false} activeDot={{ r: 6, fill: '#FF6584' }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Membership Mix Pie */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: 360 }}>
            <CardContent sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Membership Mix</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>By plan type</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%" cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {PIE_DATA.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    formatter={(value) => <span style={{ color: '#A0A8C8', fontSize: 12 }}>{value}</span>}
                  />
                  <Tooltip
                    contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 12 }}
                    formatter={(v: any) => [`${v}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activity + Pending Approvals */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Recent Activity</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {RECENT_ACTIVITY.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.02)',
                      '&:hover': { background: 'rgba(108, 99, 255, 0.06)' },
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: item.color,
                        boxShadow: `0 0 8px ${item.color}`,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" sx={{ flex: 1, color: 'text.primary' }}>
                      {item.msg}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>
                      {item.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Platform Health */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Platform Health</Typography>
              {[
                { label: 'Active Membership Rate', value: 73, color: '#43D787' },
                { label: 'Booking Completion Rate', value: 91, color: '#6C63FF' },
                { label: 'Payment Success Rate', value: 97, color: '#38BFFF' },
                { label: 'Gym Approval Rate', value: 84, color: '#FFB038' },
              ].map((metric) => (
                <Box key={metric.label} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {metric.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: metric.color }}>
                      {metric.value}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={metric.value}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.06)',
                      '& .MuiLinearProgress-bar': {
                        background: metric.color,
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              ))}

              <Box sx={{ mt: 3, p: 2, borderRadius: 2, background: 'rgba(255, 183, 56, 0.08)', border: '1px solid rgba(255,183,56,0.2)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Warning sx={{ color: '#FFB038', fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFB038' }}>
                      {stats.pendingApprovals} Gyms Pending Review
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Action required — review gym applications
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
