import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Chip, Avatar, CircularProgress
} from '@mui/material';
import { Search, CardMembership } from '../icons';
import { useQuery } from '@tanstack/react-query';
import { membershipsApi } from '../api';
import dayjs from 'dayjs';

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  ACTIVE: { bg: 'rgba(67,215,135,0.1)', color: '#43D787', border: 'rgba(67,215,135,0.3)' },
  EXPIRED: { bg: 'rgba(0,0,0,0.05)', color: '#888', border: 'rgba(0,0,0,0.1)' },
  CANCELLED: { bg: 'rgba(255,87,87,0.1)', color: '#FF5757', border: 'rgba(255,87,87,0.3)' },
};

export function MembershipsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: membershipsRes, isLoading, isError } = useQuery({
    queryKey: ['memberships', page, rowsPerPage],
    queryFn: () => membershipsApi.getAll(page, rowsPerPage).then((res) => res.data.data),
    keepPreviousData: true,
  });

  const memberships = membershipsRes?.content || [];
  const totalElements = membershipsRes?.totalElements || 0;

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Active Memberships & Subscriptions</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Real-time subscriber records across gyms and plans
          </Typography>
        </Box>
        <Chip
          label={`${totalElements.toLocaleString('en-IN')} Total Memberships`}
          sx={{ background: 'rgba(108,99,255,0.15)', color: 'primary.main', fontWeight: 800, p: 1 }}
        />
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search member or plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 340 }}
            />
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography color="error">Failed to load memberships from backend API.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Member</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Gym Outlet</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Plan Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Expiry Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {memberships.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">No membership records found.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    memberships.map((m) => {
                      const style = STATUS_COLORS[m.status] || STATUS_COLORS.ACTIVE;
                      return (
                        <TableRow key={m.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700 }}>
                                <CardMembership />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                  {m.userName || 'Member'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  ID: {m.id ? m.id.substring(0, 8) : '—'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{m.gymName || 'FitEmpire Gym'}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={m.planName || 'Monthly Pass'} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={m.status}
                              size="small"
                              sx={{
                                bgcolor: style.bg,
                                color: style.color,
                                border: `1px solid ${style.border}`,
                                fontWeight: 700,
                                fontSize: '0.75rem',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {m.startDate ? dayjs(m.startDate).format('DD MMM YYYY') : '—'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {m.endDate ? dayjs(m.endDate).format('DD MMM YYYY') : '—'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
