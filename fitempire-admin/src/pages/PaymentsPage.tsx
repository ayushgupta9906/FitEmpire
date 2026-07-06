import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, Chip,
  TextField, InputAdornment, Button, Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '@mui/material';
import { Search, Refresh } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import type { Payment } from '../api';
import dayjs from 'dayjs';

const MOCK_PAYMENTS: Payment[] = Array.from({ length: 60 }, (_, i) => ({
  id: `pay-${i + 1}`,
  userName: ['Priya Sharma', 'Rahul Verma', 'Ananya Singh', 'Karan Mehta'][i % 4],
  amount: [999, 2499, 4999, 7999, 14999][i % 5],
  netAmount: [999, 2499, 4999, 7999, 14999][i % 5] * 1.18,
  status: ['COMPLETED', 'COMPLETED', 'COMPLETED', 'FAILED', 'REFUNDED'][i % 5],
  paymentMethod: ['RAZORPAY', 'UPI', 'CARD'][i % 3],
  createdAt: new Date(Date.now() - i * 3600000 * 6).toISOString(),
}));

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  COMPLETED: { bg: 'rgba(67,215,135,0.1)', color: '#43D787' },
  FAILED: { bg: 'rgba(255,87,87,0.1)', color: '#FF5757' },
  REFUNDED: { bg: 'rgba(255,176,56,0.1)', color: '#FFB038' },
  PENDING: { bg: 'rgba(108,99,255,0.1)', color: '#6C63FF' },
};

export function PaymentsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [refundDialog, setRefundDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const filtered = MOCK_PAYMENTS.filter((p) =>
    p.userName.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search)
  );

  const totalRevenue = MOCK_PAYMENTS.filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.netAmount, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Payments</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Total Revenue:{' '}
            <strong style={{ color: '#43D787' }}>
              ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </strong>
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 2 }}>
            <TextField
              placeholder="Search by user or payment ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              size="small"
              sx={{ maxWidth: 400 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Payment ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pay) => {
                  const s = STATUS_STYLE[pay.status] || STATUS_STYLE.PENDING;
                  return (
                    <TableRow key={pay.id}>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
                          {pay.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{pay.userName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          ₹{pay.netAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={pay.paymentMethod} size="small" sx={{ background: 'rgba(108,99,255,0.1)', color: 'primary.main', fontWeight: 600, fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={pay.status}
                          size="small"
                          sx={{ background: s.bg, color: s.color, fontWeight: 700, fontSize: '0.7rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {dayjs(pay.createdAt).format('DD MMM YY, HH:mm')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {pay.status === 'COMPLETED' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            startIcon={<Refresh />}
                            onClick={() => { setSelectedPayment(pay); setRefundDialog(true); }}
                            sx={{ borderRadius: 2, fontSize: '0.7rem' }}
                          >
                            Refund
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
            sx={{ borderTop: '1px solid', borderColor: 'divider' }}
          />
        </CardContent>
      </Card>

      <Dialog open={refundDialog} onClose={() => setRefundDialog(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4, background: '#12121A', border: '1px solid rgba(108,99,255,0.2)' } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Process Refund</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Processing refund for <strong>{selectedPayment?.userName}</strong> — ₹{selectedPayment?.netAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setRefundDialog(false)} variant="outlined">Cancel</Button>
          <Button
            onClick={() => {
              setRefundDialog(false);
              enqueueSnackbar('Refund initiated (API not connected in demo)', { variant: 'success' });
            }}
            variant="contained" color="warning"
          >
            Process Refund
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
