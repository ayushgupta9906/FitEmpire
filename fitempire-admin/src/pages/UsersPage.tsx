import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Chip, IconButton, Avatar, Menu, MenuItem,
} from '@mui/material';
import { Search, MoreVert, Block, CheckCircle, Visibility } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import type { User } from '../api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const MOCK_USERS: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  email: `user${i + 1}@example.com`,
  firstName: ['Priya', 'Rahul', 'Arjun', 'Ananya', 'Karan', 'Divya', 'Rohit', 'Sneha'][i % 8],
  lastName: ['Sharma', 'Verma', 'Singh', 'Gupta', 'Mehta', 'Patel'][i % 6],
  phone: `9${String(8000000000 + i * 1234567).substring(0, 9)}`,
  role: i < 5 ? 'GYM_PARTNER' : i < 8 ? 'TRAINER' : 'CUSTOMER',
  active: i % 10 !== 7,
  createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  lastLoginAt: new Date(Date.now() - i * 3600000).toISOString(),
}));

const ROLE_COLORS: Record<string, string> = {
  CUSTOMER: '#6C63FF',
  GYM_PARTNER: '#43D787',
  TRAINER: '#FFB038',
  ADMIN: '#FF6584',
  SUPER_ADMIN: '#FF5757',
};

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const filtered = MOCK_USERS.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleAction = (action: string) => {
    setAnchorEl(null);
    if (!selectedUser) return;
    enqueueSnackbar(`${action} action on ${selectedUser.firstName} — (API not connected in demo)`, { variant: 'info' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Users</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Manage all platform users
          </Typography>
        </Box>
        <Chip
          label={`${MOCK_USERS.length.toLocaleString('en-IN')} Total Users`}
          sx={{ background: 'rgba(108,99,255,0.15)', color: 'primary.main', fontWeight: 700 }}
        />
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Toolbar */}
          <Box sx={{ p: 3, pb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              size="small"
              sx={{ flex: 1, maxWidth: 400 }}
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
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            background: `linear-gradient(135deg, ${ROLE_COLORS[user.role] || '#6C63FF'}, #FF6584)`,
                            fontSize: '0.85rem',
                            fontWeight: 700,
                          }}
                        >
                          {user.firstName[0]}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user.firstName} {user.lastName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                        {user.phone || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role.replace('_', ' ')}
                        size="small"
                        sx={{
                          background: `${ROLE_COLORS[user.role]}22`,
                          color: ROLE_COLORS[user.role] || '#6C63FF',
                          border: `1px solid ${ROLE_COLORS[user.role]}44`,
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.active ? 'Active' : 'Inactive'}
                        size="small"
                        icon={user.active
                          ? <CheckCircle sx={{ fontSize: '14px !important', color: '#43D787 !important' }} />
                          : <Block sx={{ fontSize: '14px !important', color: '#FF5757 !important' }} />
                        }
                        sx={{
                          background: user.active ? 'rgba(67,215,135,0.1)' : 'rgba(255,87,87,0.1)',
                          color: user.active ? '#43D787' : '#FF5757',
                          border: `1px solid ${user.active ? 'rgba(67,215,135,0.3)' : 'rgba(255,87,87,0.3)'}`,
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {dayjs(user.createdAt).format('DD MMM YY')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {user.lastLoginAt ? dayjs(user.lastLoginAt).fromNow() : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedUser(user); }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
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

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => handleAction('View')}>
          <Visibility fontSize="small" sx={{ mr: 1.5 }} /> View Details
        </MenuItem>
        <MenuItem onClick={() => handleAction(selectedUser?.active ? 'Deactivate' : 'Reactivate')}>
          {selectedUser?.active
            ? <><Block fontSize="small" sx={{ mr: 1.5, color: '#FF5757' }} /> Deactivate</>
            : <><CheckCircle fontSize="small" sx={{ mr: 1.5, color: '#43D787' }} /> Reactivate</>
          }
        </MenuItem>
      </Menu>
    </Box>
  );
}
