import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { AccountBalanceWallet, RequestQuote, CurrencyRupee } from '@mui/icons-material';
import api from '../api/axios';

export function SettlementsPage() {
  const [settlements, setSettlements] = useState<any[]>([]);

  useEffect(() => {
    // In a real scenario, this fetches from GET /api/v1/finance/settlements/gym/{gymId}
    setSettlements([
      { id: '1', date: '2023-10-01', gross: 50000, commission: 5000, tax: 900, net: 44100, status: 'COMPLETED', ref: 'BNK123456789' },
      { id: '2', date: '2023-10-08', gross: 60000, commission: 6000, tax: 1080, net: 52920, status: 'PROCESSING', ref: 'PENDING' }
    ]);
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={1}>Finance & Settlements</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Track your weekly platform earnings, commission deductions, and bank payouts.
      </Typography>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3 }}>
          <CardContent>
            <div className="flex items-center space-x-3 mb-2 text-slate-500">
              <CurrencyRupee color="primary" />
              <Typography variant="subtitle2" fontWeight="bold">Total Gross Earnings</Typography>
            </div>
            <Typography variant="h4" fontWeight="bold">₹1,10,000</Typography>
          </CardContent>
        </Card>
        <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3 }}>
          <CardContent>
            <div className="flex items-center space-x-3 mb-2 text-slate-500">
              <RequestQuote color="error" />
              <Typography variant="subtitle2" fontWeight="bold">Total Deductions (Comm + Tax)</Typography>
            </div>
            <Typography variant="h4" fontWeight="bold">₹12,980</Typography>
          </CardContent>
        </Card>
        <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, bgcolor: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <CardContent>
            <div className="flex items-center space-x-3 mb-2 text-green-700">
              <AccountBalanceWallet />
              <Typography variant="subtitle2" fontWeight="bold">Net Paid to Bank</Typography>
            </div>
            <Typography variant="h4" fontWeight="bold" color="success.main">₹97,020</Typography>
          </CardContent>
        </Card>
      </div>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell><strong>Settlement Date</strong></TableCell>
              <TableCell><strong>Gross Revenue</strong></TableCell>
              <TableCell><strong>Commission</strong></TableCell>
              <TableCell><strong>GST</strong></TableCell>
              <TableCell><strong>Net Payable</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Bank Ref</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {settlements.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>₹{row.gross.toLocaleString()}</TableCell>
                <TableCell sx={{ color: 'error.main' }}>-₹{row.commission.toLocaleString()}</TableCell>
                <TableCell sx={{ color: 'error.main' }}>-₹{row.tax.toLocaleString()}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>₹{row.net.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} 
                    size="small" 
                    color={row.status === 'COMPLETED' ? 'success' : 'warning'} 
                  />
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', color: '#64748b' }}>{row.ref}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
