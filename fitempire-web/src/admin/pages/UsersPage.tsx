import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Chip, IconButton, Avatar, Menu, MenuItem, CircularProgress
} from '@mui/material';
import { Search, MoreVert, Block, CheckCircle } from '../icons';
import { useSnackbar } from 'notistack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api';
import type { User } from '../api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ROLE_COLORS: Record<string, string> = {
  CUSTOMER: '#6C63FF',
  GYM_PARTNER: '#43D787',
  PARTNER: '#43D787',
  TRAINER: '#FFB038',
  ADMIN: '#FF6584',
  SUPER_ADMIN: '#FF5757',
};

export function UsersPage() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: usersRes, isLoading, isError } = useQuery({
    queryKey: ['users', page, rowsPerPage, search],
    queryFn: () => usersApi.getAll(page, rowsPerPage, search).then((res) => res.data.data),
    keepPreviousData: true,
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => usersApi.deactivate(id),
    onSuccess: () => {
      enqueueSnackbar('User account deactivated successfully', { variant: 'success' });
      queryClient.invalidateQueries(['users']);
    },
    onError: (err: any) => {
      enqueueSnackbar(err.response?.data?.message || 'Failed to deactivate user', { variant: 'error' });
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: (id: string) => usersApi.reactivate(id),
    onSuccess: () => {
      enqueueSnackbar('User account reactivated successfully', { variant: 'success' });
      queryClient.invalidateQueries(['users']);
    },
    onError: (err: any) => {
      enqueueSnackbar(err.response?.data?.message || 'Failed to reactivate user', { variant: 'error' });
    },
  });

  const users = usersRes?.content || [];
  const totalElements = usersRes?.totalElements || 0;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleToggleActive = () => {
    if (!selectedUser) return;
    if (selectedUser.active) {
      deactivateMutation.mutate(selectedUser.id);
    } else {
      reactivateMutation.mutate(selectedUser.id);
    }
    handleMenuClose();
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Users Management</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Real-time directory of all registered platform customers, partners, and trainers
          </Typography>
        </Box>
        <Chip
          label={`${totalElements.toLocaleString('en-IN')} Total Registered Users`}
          sx={{ background: 'rgba(108,99,255,0.15)', color: 'primary.main', fontWeight: 800, p: 1 }}
        />
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
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
              <Typography color="error">Failed to load real user data from backend API.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Contact Phone</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Registered Date</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">No registered users found.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((u) => (
                      <TableRow key={u.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ bgcolor: ROLE_COLORS[u.role] || '#6C63FF', fontWeight: 700 }}>
                              {u.firstName ? u.firstName[0].toUpperCase() : 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {u.firstName} {u.lastName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {u.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{u.phone || '—'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={u.role}
                            size="small"
                            sx={{
                              bgcolor: `${ROLE_COLORS[u.role] || '#6C63FF'}20`,
                              color: ROLE_COLORS[u.role] || '#6C63FF',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={u.active ? 'Active' : 'Disabled'}
                            size="small"
                            sx={{
                              bgcolor: u.active ? 'rgba(67,215,135,0.15)' : 'rgba(255,87,87,0.15)',
                              color: u.active ? '#43D787' : '#FF5757',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {u.createdAt ? dayjs(u.createdAt).format('DD MMM YYYY') : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={(e) => handleMenuOpen(e, u)}>
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
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

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleToggleActive}>
          {selectedUser?.active ? (
            <>
              <Block fontSize="small" sx={{ mr: 1, color: 'error.main' }} /> Deactivate User Account
            </>
          ) : (
            <>
              <CheckCircle fontSize="small" sx={{ mr: 1, color: 'success.main' }} /> Reactivate User Account
            </>
          )}
        </MenuItem>
      </Menu>
    </Box>
  );
}
