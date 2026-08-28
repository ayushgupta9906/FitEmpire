import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Chip, IconButton, Button, Avatar, Dialog,
  DialogTitle, DialogContent, DialogActions, Tabs, Tab, Menu, MenuItem, CircularProgress
} from '@mui/material';
import { Search, CheckCircle, Cancel, MoreVert, FitnessCenter } from '../icons';
import { useSnackbar } from 'notistack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gymsApi } from '../api';
import type { Gym } from '../api';
import dayjs from 'dayjs';

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  ACTIVE: { bg: 'rgba(67,215,135,0.1)', color: '#43D787', border: 'rgba(67,215,135,0.3)' },
  PENDING_REVIEW: { bg: 'rgba(255,176,56,0.1)', color: '#FFB038', border: 'rgba(255,176,56,0.3)' },
  SUSPENDED: { bg: 'rgba(255,87,87,0.1)', color: '#FF5757', border: 'rgba(255,87,87,0.3)' },
  REJECTED: { bg: 'rgba(255,87,87,0.08)', color: '#FF5757', border: 'rgba(255,87,87,0.2)' },
};

export function GymsPage() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const statusFilters = ['ALL', 'ACTIVE', 'PENDING_REVIEW', 'SUSPENDED'];
  const currentStatusParam = statusFilters[tab] === 'ALL' ? undefined : statusFilters[tab];

  const { data: gymsRes, isLoading, isError } = useQuery({
    queryKey: ['gyms', page, rowsPerPage, currentStatusParam],
    queryFn: () => gymsApi.getAll(page, rowsPerPage, currentStatusParam).then((res) => res.data.data),
    keepPreviousData: true,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => gymsApi.approve(id),
    onSuccess: () => {
      enqueueSnackbar('Gym approved and activated successfully', { variant: 'success' });
      queryClient.invalidateQueries(['gyms']);
    },
    onError: (err: any) => {
      enqueueSnackbar(err.response?.data?.message || 'Failed to approve gym', { variant: 'error' });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => gymsApi.reject(id, reason),
    onSuccess: () => {
      enqueueSnackbar('Gym application rejected', { variant: 'info' });
      queryClient.invalidateQueries(['gyms']);
      setRejectDialog(false);
      setRejectReason('');
    },
    onError: (err: any) => {
      enqueueSnackbar(err.response?.data?.message || 'Failed to reject gym', { variant: 'error' });
    },
  });

  const gyms = gymsRes?.content || [];
  const totalElements = gymsRes?.totalElements || 0;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, gym: Gym) => {
    setAnchorEl(event.currentTarget);
    setSelectedGym(gym);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleApprove = () => {
    if (!selectedGym) return;
    approveMutation.mutate(selectedGym.id);
    handleMenuClose();
  };

  const handleRejectConfirm = () => {
    if (!selectedGym) return;
    rejectMutation.mutate({ id: selectedGym.id, reason: rejectReason });
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Gym Listings & Outlets</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Real-time management of fitness centers, clubs, and partner locations
          </Typography>
        </Box>
        <Chip
          label={`${totalElements.toLocaleString('en-IN')} Total Gyms`}
          sx={{ background: 'rgba(255,101,132,0.15)', color: '#FF6584', fontWeight: 800, p: 1 }}
        />
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 2 }}>
          <Tabs value={tab} onChange={(_, val) => { setTab(val); setPage(0); }} sx={{ mb: 2 }}>
            <Tab label="All Gyms" />
            <Tab label="Active" />
            <Tab label="Pending Approvals" />
            <Tab label="Suspended" />
          </Tabs>

          <Box sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search gyms by name..."
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
              <Typography color="error">Failed to load real gym listings from backend API.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Gym Name & Outlets</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Members</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Registered Date</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gyms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">No gyms found in system.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    gyms.map((g) => {
                      const statusStyle = STATUS_COLORS[g.status] || STATUS_COLORS.ACTIVE;
                      return (
                        <TableRow key={g.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar
                                src={g.logoUrl || g.coverImageUrl}
                                sx={{ bgcolor: 'primary.main', fontWeight: 700, width: 42, height: 42 }}
                              >
                                <FitnessCenter />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                  {g.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Slug: /{g.slug}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={g.category || 'GYM'} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={g.status}
                              size="small"
                              sx={{
                                bgcolor: statusStyle.bg,
                                color: statusStyle.color,
                                border: `1px solid ${statusStyle.border}`,
                                fontWeight: 700,
                                fontSize: '0.75rem',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{g.totalMembers || 0}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {g.createdAt ? dayjs(g.createdAt).format('DD MMM YYYY') : '—'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, g)}>
                              <MoreVert />
                            </IconButton>
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

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {selectedGym?.status === 'PENDING_REVIEW' && (
          <MenuItem onClick={handleApprove}>
            <CheckCircle fontSize="small" sx={{ mr: 1, color: 'success.main' }} /> Approve & Activate
          </MenuItem>
        )}
        {selectedGym?.status === 'PENDING_REVIEW' && (
          <MenuItem onClick={() => { handleMenuClose(); setRejectDialog(true); }}>
            <Cancel fontSize="small" sx={{ mr: 1, color: 'error.main' }} /> Reject Gym Listing
          </MenuItem>
        )}
      </Menu>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog} onClose={() => setRejectDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Reject Gym Listing</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Provide a reason for rejecting {selectedGym?.name}:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Incomplete business address verification or missing GST documents."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog(false)}>Cancel</Button>
          <Button onClick={handleRejectConfirm} variant="contained" color="error" disabled={!rejectReason.trim()}>
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
