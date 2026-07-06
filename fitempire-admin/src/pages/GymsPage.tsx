import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Chip, IconButton, Button, Avatar, Rating, Dialog,
  DialogTitle, DialogContent, DialogActions, Tabs, Tab, Menu, MenuItem,
} from '@mui/material';
import { Search, CheckCircle, Cancel, MoreVert, FitnessCenter } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import type { Gym } from '../api';
import dayjs from 'dayjs';

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  ACTIVE: { bg: 'rgba(67,215,135,0.1)', color: '#43D787', border: 'rgba(67,215,135,0.3)' },
  PENDING_REVIEW: { bg: 'rgba(255,176,56,0.1)', color: '#FFB038', border: 'rgba(255,176,56,0.3)' },
  SUSPENDED: { bg: 'rgba(255,87,87,0.1)', color: '#FF5757', border: 'rgba(255,87,87,0.3)' },
  REJECTED: { bg: 'rgba(255,87,87,0.08)', color: '#FF5757', border: 'rgba(255,87,87,0.2)' },
};

const MOCK_GYMS: Gym[] = Array.from({ length: 40 }, (_, i) => ({
  id: `gym-${i + 1}`,
  name: ['PowerZone Fitness', 'Iron Paradise', 'Gold\'s Gym', 'Cult.Fit', 'FitStar', 'BodyFit', 'GainStation', 'FitHouse'][i % 8] + ` - ${['Andheri', 'Bandra', 'Worli', 'Juhu', 'Thane', 'Pune'][i % 6]}`,
  slug: `gym-${i + 1}`,
  status: ['ACTIVE', 'PENDING_REVIEW', 'ACTIVE', 'ACTIVE', 'SUSPENDED', 'PENDING_REVIEW'][i % 6],
  avgRating: 3.5 + (i % 15) / 10,
  totalReviews: 12 + i * 7,
  totalMembers: 100 + i * 23,
  ownerName: ['Vikram Shah', 'Neha Mehta', 'Suresh Patel', 'Pooja Gupta'][i % 4],
  createdAt: new Date(Date.now() - i * 86400000 * 5).toISOString(),
}));

export function GymsPage() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const statusFilters = ['ALL', 'ACTIVE', 'PENDING_REVIEW', 'SUSPENDED'];

  const filtered = MOCK_GYMS.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase())
      || g.ownerName.toLowerCase().includes(search.toLowerCase());
    const selectedStatus = statusFilters[tab];
    const matchesTab = selectedStatus === 'ALL' || g.status === selectedStatus;
    return matchesSearch && matchesTab;
  });

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleApprove = (gym: Gym) => {
    setAnchorEl(null);
    enqueueSnackbar(`${gym.name} approved! (API not connected in demo)`, { variant: 'success' });
  };

  const handleReject = () => {
    if (!selectedGym) return;
    setRejectDialog(false);
    enqueueSnackbar(`${selectedGym.name} rejected. (API not connected in demo)`, { variant: 'warning' });
    setRejectReason('');
  };

  const pendingCount = MOCK_GYMS.filter((g) => g.status === 'PENDING_REVIEW').length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Gyms</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Manage gym registrations and approvals
          </Typography>
        </Box>
        {pendingCount > 0 && (
          <Chip
            label={`${pendingCount} Pending Review`}
            icon={<FitnessCenter sx={{ fontSize: '16px !important' }} />}
            sx={{ background: 'rgba(255,176,56,0.15)', color: '#FFB038', border: '1px solid rgba(255,176,56,0.3)', fontWeight: 700 }}
          />
        )}
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3 }}>
            <Tabs value={tab} onChange={(_, v) => { setTab(v); setPage(0); }}>
              {statusFilters.map((s) => (
                <Tab key={s} label={s.replace('_', ' ')} sx={{ fontWeight: 600, fontSize: '0.8rem' }} />
              ))}
            </Tabs>
          </Box>

          {/* Search */}
          <Box sx={{ p: 3, pb: 2 }}>
            <TextField
              placeholder="Search gyms or owners..."
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

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Gym Name</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Members</TableCell>
                  <TableCell>Registered</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((gym) => {
                  const statusStyle = STATUS_COLORS[gym.status] || STATUS_COLORS.ACTIVE;
                  return (
                    <TableRow key={gym.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 36, height: 36,
                              background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                              fontSize: '0.85rem', fontWeight: 700,
                            }}
                          >
                            {gym.name[0]}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600, maxWidth: 200 }}>
                            {gym.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                          {gym.ownerName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={gym.status.replace('_', ' ')}
                          size="small"
                          sx={{
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            border: `1px solid ${statusStyle.border}`,
                            fontWeight: 700, fontSize: '0.7rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Rating value={gym.avgRating} precision={0.5} size="small" readOnly />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            ({gym.totalReviews})
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {gym.totalMembers.toLocaleString('en-IN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {dayjs(gym.createdAt).format('DD MMM YY')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          {gym.status === 'PENDING_REVIEW' && (
                            <>
                              <Button
                                size="small"
                                variant="outlined"
                                color="success"
                                startIcon={<CheckCircle />}
                                onClick={() => handleApprove(gym)}
                                sx={{ borderRadius: 2, fontSize: '0.7rem' }}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<Cancel />}
                                onClick={() => { setSelectedGym(gym); setRejectDialog(true); }}
                                sx={{ borderRadius: 2, fontSize: '0.7rem' }}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          <IconButton
                            size="small"
                            onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedGym(gym); }}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Box>
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

      {/* Reject Dialog */}
      <Dialog open={rejectDialog} onClose={() => setRejectDialog(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4, background: '#12121A', border: '1px solid rgba(108,99,255,0.2)' } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Reject Gym Registration</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Rejecting: <strong>{selectedGym?.name}</strong>
          </Typography>
          <TextField
            label="Rejection Reason"
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setRejectDialog(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleReject} variant="contained" color="error" disabled={!rejectReason.trim()}>
            Reject Gym
          </Button>
        </DialogActions>
      </Dialog>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => setAnchorEl(null)}>View Details</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Suspend Gym</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>View Members</MenuItem>
      </Menu>
    </Box>
  );
}
