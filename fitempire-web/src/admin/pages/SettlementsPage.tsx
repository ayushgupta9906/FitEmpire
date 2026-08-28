import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress, Grid,
} from '@mui/material';
import { AccountBalanceWallet, RequestQuote, CurrencyRupee } from '../icons';
import { paymentsApi } from '../api';
import type { Payment } from '../api';

export function SettlementsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const res = await paymentsApi.getAll(0, 50);
      setPayments(res.data.data?.content || []);
    } catch (e) {
      console.warn("Failed to fetch settlements:", e);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const totalGross = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const totalNet = payments.reduce((acc, p) => acc + (p.netAmount || p.amount * 0.9 || 0), 0);
  const totalDeductions = totalGross - totalNet;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={1}>Finance & Settlements</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Track your platform earnings, commission deductions, and bank payouts.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <CurrencyRupee color="primary" />
                <Typography variant="subtitle2" fontWeight="bold">Total Gross Earnings</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">{formatCurrency(totalGross)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <RequestQuote color="error" />
                <Typography variant="subtitle2" fontWeight="bold">Total Deductions (Comm + Tax)</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="error.main">{formatCurrency(totalDeductions)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, bgcolor: 'rgba(67,215,135,0.08)', borderColor: 'rgba(67,215,135,0.3)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <AccountBalanceWallet color="success" />
                <Typography variant="subtitle2" fontWeight="bold">Net Payable</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="success.main">{formatCurrency(totalNet)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <TableCell><strong>Transaction ID</strong></TableCell>
              <TableCell><strong>User</strong></TableCell>
              <TableCell><strong>Gross Amount</strong></TableCell>
              <TableCell><strong>Method</strong></TableCell>
              <TableCell><strong>Net Payable</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No settlement records found.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.id.substring(0, 8)}...</TableCell>
                  <TableCell>{p.userName || 'Customer'}</TableCell>
                  <TableCell>{formatCurrency(p.amount)}</TableCell>
                  <TableCell><Chip label={p.paymentMethod || 'UPI'} size="small" variant="outlined" /></TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{formatCurrency(p.netAmount || p.amount * 0.9)}</TableCell>
                  <TableCell>
                    <Chip
                      label={p.status}
                      size="small"
                      color={p.status === 'COMPLETED' ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
