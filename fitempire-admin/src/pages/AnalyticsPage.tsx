import { Box, Typography, Card, Grid, CardContent } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';

const CITY_DATA = [
  { city: 'Mumbai', users: 6840, gyms: 89, revenue: 2450000 },
  { city: 'Delhi', users: 5210, gyms: 72, revenue: 1890000 },
  { city: 'Bengaluru', users: 4950, gyms: 68, revenue: 1780000 },
  { city: 'Hyderabad', users: 2890, gyms: 41, revenue: 980000 },
  { city: 'Chennai', users: 2340, gyms: 32, revenue: 820000 },
  { city: 'Pune', users: 1980, gyms: 28, revenue: 690000 },
];

const MONTHLY_GROWTH = [
  { month: 'Jan', users: 12000, gyms: 220, revenue: 8500000 },
  { month: 'Feb', users: 13500, gyms: 245, revenue: 9200000 },
  { month: 'Mar', users: 15800, gyms: 268, revenue: 11000000 },
  { month: 'Apr', users: 17200, gyms: 290, revenue: 12400000 },
  { month: 'May', users: 19800, gyms: 315, revenue: 14800000 },
  { month: 'Jun', users: 22400, gyms: 330, revenue: 16900000 },
  { month: 'Jul', users: 24891, gyms: 342, revenue: 18200000 },
];

export function AnalyticsPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Analytics</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Platform Growth</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Monthly users, gyms & revenue (last 7 months)</Typography>
              <ResponsiveContainer width="100%" height={320} style={{ marginTop: 20 }}>
                <LineChart data={MONTHLY_GROWTH}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#A0A8C8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#A0A8C8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#A0A8C8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000000).toFixed(1)}M`} />
                  <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 12 }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="users" stroke="#6C63FF" strokeWidth={2.5} dot={false} name="Users" />
                  <Line yAxisId="left" type="monotone" dataKey="gyms" stroke="#43D787" strokeWidth={2.5} dot={false} name="Gyms" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#FFB038" strokeWidth={2.5} dot={false} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Revenue by City</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Top 6 cities</Typography>
              <ResponsiveContainer width="100%" height={320} style={{ marginTop: 20 }}>
                <BarChart data={CITY_DATA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" stroke="#A0A8C8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
                  <YAxis type="category" dataKey="city" stroke="#A0A8C8" fontSize={12} tickLine={false} axisLine={false} width={70} />
                  <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 12 }} formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="url(#barGrad)" radius={[0, 4, 4, 0]}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6C63FF" />
                        <stop offset="100%" stopColor="#FF6584" />
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
