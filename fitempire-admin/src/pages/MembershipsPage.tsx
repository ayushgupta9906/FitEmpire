import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Chip, IconButton, Button, Avatar, Dialog,
  DialogTitle, DialogContent, DialogActions, Tabs, Tab, Menu, MenuItem, Grid
} from '@mui/material';
import { Search, CardMembership, MoreVert, AttachMoney, Star, Block } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';

interface Membership {
  id: string;
  memberName: string;
  memberEmail: string;
  planName: string;
  gymName: string;
  price: number;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  endDate: string;
}

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  ACTIVE: { bg: 'rgba(67,215,135,0.1)', color: '#43D787', border: 'rgba(67,215,135,0.3)' },
  EXPIRED: { bg: 'rgba(0,0,0,0.05)', color: '#888', border: 'rgba(0,0,0,0.1)' },
  CANCELLED: { bg: 'rgba(255,87,87,0.1)', color: '#FF5757', border: 'rgba(255,87,87,0.3)' },
};

const PLAN_COLORS: Record<string, { bg: string; color: string }> = {
  'Platinum Elite': { bg: 'linear-gradient(135deg, rgba(230,195,108,0.2), rgba(200,165,80,0.25))', color: '#B8860B' },
  'Gold Pass': { bg: 'rgba(255,176,56,0.1)', color: '#FFB038' },
  'Silver Access': { bg: 'rgba(108,99,255,0.1)', color: '#6C63FF' },
};

const MOCK_MEMBERSHIPS: Membership[] = Array.from({ length: 25 }, (_, i) => {
  const plans = ['Platinum Elite', 'Gold Pass', 'Silver Access'];
  const plan = plans[i % 3];
  const prices = [4999, 2999, 1499];
  const price = prices[i % 3];
  const statuses: ('ACTIVE' | 'EXPIRED' | 'CANCELLED')[] = ['ACTIVE', 'EXPIRED', 'ACTIVE', 'CANCELLED'];
  const status = statuses[i % 4];
  return {
    id: `mem-${2000 + i}`,
    memberName: ['Rohan Deshmukh', 'Aditi Rao', 'Vikram Sen', 'Karan Johar', 'Priya Sharma'][i % 5],
    memberEmail: ['rohan@fitempire.in', 'aditi@fitempire.in', 'vikram@fitempire.in', 'karan@fitempire.in', 'priya@fitempire.in'][i % 5],
    planName: plan,
    gymName: ['Gold\'s Gym Elite', 'Strike Force MMA', 'Rhythm & Beats Studio', 'Blue Wave Aquatics'][i % 4],
    price: price,
    status: status,
    startDate: dayjs().subtract(i * 3 + 1, 'day').format('YYYY-MM-DD'),
    endDate: status === 'ACTIVE' ? dayjs().add(30 - i, 'day').format('YYYY-MM-DD') : dayjs().subtract(i, 'day').format('YYYY-MM-DD'),
  };
});

export function MembershipsPage() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const statusFilters = ['ALL', 'ACTIVE', 'EXPIRED', 'CANCELLED'];

  const filtered = MOCK_MEMBERSHIPS.filter((m) => {
    const matchesSearch = m.memberName.toLowerCase().includes(search.toLowerCase())
      || m.gymName.toLowerCase().includes(search.toLowerCase())
      || m.planName.toLowerCase().includes(search.toLowerCase());
    const selectedStatus = statusFilters[tab];
    const matchesTab = selectedStatus === 'ALL' || m.status === selectedStatus;
    return matchesSearch && matchesTab;
  });

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, membership: Membership) => {
    setAnchorEl(event.currentTarget);
    setSelectedMembership(membership);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCancelMembership = () => {
    if (!selectedMembership) return;
    setAnchorEl(null);
    enqueueSnackbar(`Cancelled membership ${selectedMembership.id} subscription.`, { variant: 'info' });
  };

  const handleExtendAccess = () => {
    if (!selectedMembership) return;
    setAnchorEl(null);
    enqueueSnackbar(`Extended membership ${selectedMembership.id} access by 30 days!`, { variant: 'success' });
  };

  const activeCount = MOCK_MEMBERSHIPS.filter((m) => m.status === 'ACTIVE').length;
  const totalRevenue = MOCK_MEMBERSHIPS.reduce((sum, m) => sum + (m.status === 'ACTIVE' ? m.price : 0), 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Memberships</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Manage user subscriptions, plan packages, and access durations
          </Typography>
        </Box>
      </Box>

      {/* Membership stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(67,215,135,0.05), rgba(67,215,135,0.1))', border: '1px solid rgba(67,215,135,0.1)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#43D787', width: 48, height: 48 }}>
                <CardMembership />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>Active Members</Typography>
                <Typography variant="h5" fontWeight={700} sx={{ color: '#43D787' }}>{activeCount}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.05), rgba(108,99,255,0.1))', border: '1px solid rgba(108,99,255,0.1)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                <AttachMoney />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>Monthly Active Revenue</Typography>
                <Typography variant="h5" fontWeight={700}>₹{totalRevenue.toLocaleString('en-IN')}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(255,176,56,0.05), rgba(255,176,56,0.1))', border: '1px solid rgba(255,176,56,0.1)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#FFB038', width: 48, height: 48 }}>
                <Star />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>Premium Tier Members</Typography>
                <Typography variant="h5" fontWeight={700} sx={{ color: '#FFB038' }}>
                  {MOCK_MEMBERSHIPS.filter((m) => m.planName === 'Platinum Elite' && m.status === 'ACTIVE').length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

          {/* Search bar */}
          <Box sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search members, centers or plan tiers..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              sx={{ flexGrow: 1, maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Member ID</TableCell>
                  <TableCell>Member Name</TableCell>
                  <TableCell>Plan Tier</TableCell>
                  <TableCell>Active Center</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((membership) => {
                  const statusStyle = STATUS_COLORS[membership.status] || STATUS_COLORS.ACTIVE;
                  const planStyle = PLAN_COLORS[membership.planName] || { bg: 'rgba(0,0,0,0.05)', color: '#000' };
                  return (
                    <TableRow key={membership.id}>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'primary.main' }}>
                        {membership.id}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {membership.memberName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                            {membership.memberEmail}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={membership.planName}
                          size="small"
                          sx={{
                            background: planStyle.bg,
                            color: planStyle.color,
                            fontWeight: 700, fontSize: '0.65rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {membership.gymName}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        ₹{membership.price}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {dayjs(membership.startDate).format('MMM DD, YYYY')}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                            to {dayjs(membership.endDate).format('MMM DD, YYYY')}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={membership.status}
                          size="small"
                          sx={{
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            border: `1px solid ${statusStyle.border}`,
                            fontWeight: 700, fontSize: '0.65rem',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={(e) => handleActionClick(e, membership)}>
                          <MoreVert />
                        </IconButton>
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
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </CardContent>
      </Card>

      {/* Actions menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleExtendAccess} disabled={selectedMembership?.status !== 'ACTIVE'}>
          <Star sx={{ mr: 1, fontSize: 18, color: '#FFB038' }} /> Extend 30 Days
        </MenuItem>
        <MenuItem onClick={handleCancelMembership} disabled={selectedMembership?.status !== 'ACTIVE'}>
          <Block sx={{ mr: 1, fontSize: 18, color: '#FF5757' }} /> Terminate Plan
        </MenuItem>
      </Menu>
    </Box>
  );
}
