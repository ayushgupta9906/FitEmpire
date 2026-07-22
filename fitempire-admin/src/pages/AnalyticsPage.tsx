import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, Grid, CardContent, CircularProgress } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { analyticsApi } from '../api';
import type { AnalyticsOverview, TopGym, CityData } from '../api';

export function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [topGyms, setTopGyms] = useState<TopGym[]>([]);
  const [topCities, setTopCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [overviewRes, gymsRes, citiesRes] = await Promise.allSettled([
        analyticsApi.getOverview(),
        analyticsApi.getTopGyms(),
        analyticsApi.getTopCities(),
      ]);

      if (overviewRes.status === 'fulfilled' && overviewRes.value.data?.data) {
        setOverview(overviewRes.value.data.data);
      }
      if (gymsRes.status === 'fulfilled' && gymsRes.value.data?.data) {
        setTopGyms(gymsRes.value.data.data);
      }
      if (citiesRes.status === 'fulfilled' && citiesRes.value.data?.data) {
        setTopCities(citiesRes.value.data.data);
      }
    } catch (e) {
      console.warn("Failed to load analytics:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Analytics Overview</Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>TOTAL REVENUE</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: '#6C63FF' }}>
                {formatCurrency(overview?.totalRevenue || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>TOTAL BOOKINGS</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: '#43D787' }}>
                {(overview?.totalBookings || 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>CONVERSION RATE</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: '#FFB038' }}>
                {overview?.conversionRate || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>AVG ORDER VALUE</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: '#FF6584' }}>
                {formatCurrency(overview?.avgOrderValue || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Top Gyms by Bookings</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Most active gym partners</Typography>
              <ResponsiveContainer width="100%" height={320} style={{ marginTop: 20 }}>
                <BarChart data={topGyms}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="gymName" stroke="#A0A8C8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#A0A8C8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 12 }} />
                  <Bar dataKey="totalBookings" fill="#6C63FF" radius={[6, 6, 0, 0]} name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>City Breakdown</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Users & Gyms distribution</Typography>
              <ResponsiveContainer width="100%" height={320} style={{ marginTop: 20 }}>
                <BarChart data={topCities} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" stroke="#A0A8C8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="city" stroke="#A0A8C8" fontSize={12} tickLine={false} axisLine={false} width={70} />
                  <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 12 }} />
                  <Bar dataKey="users" fill="#43D787" radius={[0, 4, 4, 0]} name="Users" />
                  <Bar dataKey="gyms" fill="#FFB038" radius={[0, 4, 4, 0]} name="Gyms" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
