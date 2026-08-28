import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Chip, IconButton, Button, Avatar, Dialog,
  DialogTitle, DialogContent, DialogActions, Tabs, Tab, Menu, MenuItem, Grid
} from '@mui/material';
import { Search, CheckCircle, Cancel, MoreVert, EventNote, QrCodeScanner, AccessTime } from '../icons';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';

interface Booking {
  id: string;
  userName: string;
  userEmail: string;
  centerName: string;
  category: string;
  bookingType: 'CLASS' | 'PASS' | 'TRAINER';
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  bookingDate: string;
  timeSlot: string;
  checkedInAt?: string;
}

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  CONFIRMED: { bg: 'rgba(67,215,135,0.1)', color: '#43D787', border: 'rgba(67,215,135,0.3)' },
  COMPLETED: { bg: 'rgba(108,99,255,0.1)', color: '#6C63FF', border: 'rgba(108,99,255,0.3)' },
  CANCELLED: { bg: 'rgba(255,87,87,0.1)', color: '#FF5757', border: 'rgba(255,87,87,0.3)' },
};

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  CLASS: { bg: 'rgba(108,99,255,0.1)', color: '#6C63FF' },
  PASS: { bg: 'rgba(0,184,212,0.1)', color: '#00B8D4' },
  TRAINER: { bg: 'rgba(255,176,56,0.1)', color: '#FFB038' },
};

const MOCK_BOOKINGS: Booking[] = Array.from({ length: 30 }, (_, i) => {
  const types: ('CLASS' | 'PASS' | 'TRAINER')[] = ['CLASS', 'PASS', 'TRAINER'];
  const categories = ['GYM', 'MMA', 'BOXING', 'KICKBOXING', 'DANCE', 'SWIMMING', 'YOGA', 'SPORTS', 'GAMES'];
  const statuses: ('CONFIRMED' | 'COMPLETED' | 'CANCELLED')[] = ['CONFIRMED', 'COMPLETED', 'CANCELLED'];
  const type = types[i % 3];
  const status = statuses[i % 3];
  return {
    id: `bk-${1000 + i}`,
    userName: ['Aarav Sharma', 'Ananya Iyer', 'Kabir Mehta', 'Riya Patel', 'Vihaan Malhotra'][i % 5],
    userEmail: ['aarav@fitempire.in', 'ananya@fitempire.in', 'kabir@fitempire.in', 'riya@fitempire.in', 'vihaan@fitempire.in'][i % 5],
    centerName: [
      'PowerZone Fitness', 'Strike Force MMA', 'Rocky\'s Boxing Club',
      'Rhythm & Beats Studio', 'Blue Wave Aquatics', 'Zen Yoga Center'
    ][i % 6],
    category: categories[i % 9],
    bookingType: type,
    status: status,
    bookingDate: dayjs().add((i % 4) - 2, 'day').format('YYYY-MM-DD'),
    timeSlot: ['07:00 AM - 08:00 AM', '09:30 AM - 10:30 AM', '06:00 PM - 07:00 PM', '08:00 PM - 09:00 PM'][i % 4],
    checkedInAt: status === 'COMPLETED' ? dayjs().format('hh:mm A') : undefined,
  };
});

export function BookingsPage() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const typeFilters = ['ALL', 'CLASS', 'PASS', 'TRAINER'];

  const filtered = MOCK_BOOKINGS.filter((b) => {
    const matchesSearch = b.userName.toLowerCase().includes(search.toLowerCase())
      || b.centerName.toLowerCase().includes(search.toLowerCase())
      || b.id.toLowerCase().includes(search.toLowerCase());
    const selectedType = typeFilters[tab];
    const matchesTab = selectedType === 'ALL' || b.bookingType === selectedType;
    return matchesSearch && matchesTab;
  });

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, booking: Booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCheckIn = () => {
    if (!selectedBooking) return;
    setAnchorEl(null);
    enqueueSnackbar(`Checked in user for Booking ${selectedBooking.id}`, { variant: 'success' });
  };

  const handleCancelBooking = () => {
    if (!selectedBooking) return;
    setAnchorEl(null);
    enqueueSnackbar(`Booking ${selectedBooking.id} cancelled. Refund initiated.`, { variant: 'info' });
  };

  const confirmedCount = MOCK_BOOKINGS.filter((b) => b.status === 'CONFIRMED').length;
  const completedCount = MOCK_BOOKINGS.filter((b) => b.status === 'COMPLETED').length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Bookings</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Monitor and manage real-time user bookings and check-ins
          </Typography>
        </Box>
      </Box>

      {/* Booking Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.05), rgba(108,99,255,0.1))', border: '1px solid rgba(108,99,255,0.1)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                <EventNote />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>Total Bookings</Typography>
                <Typography variant="h5" fontWeight={700}>{MOCK_BOOKINGS.length}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(67,215,135,0.05), rgba(67,215,135,0.1))', border: '1px solid rgba(67,215,135,0.1)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#43D787', width: 48, height: 48 }}>
                <QrCodeScanner />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>Active Confirmed</Typography>
                <Typography variant="h5" fontWeight={700} sx={{ color: '#43D787' }}>{confirmedCount}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(0,184,212,0.05), rgba(0,184,212,0.1))', border: '1px solid rgba(0,184,212,0.1)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#00B8D4', width: 48, height: 48 }}>
                <AccessTime />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>Completed Check-ins</Typography>
                <Typography variant="h5" fontWeight={700}>{completedCount}</Typography>
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
              {typeFilters.map((t) => (
                <Tab key={t} label={t.replace('_', ' ')} sx={{ fontWeight: 600, fontSize: '0.8rem' }} />
              ))}
            </Tabs>
          </Box>

          {/* Filters & Search */}
          <Box sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search by User, Center or ID..."
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
                  <TableCell>Booking ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Center</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((booking) => {
                  const statusStyle = STATUS_COLORS[booking.status] || STATUS_COLORS.CONFIRMED;
                  const typeStyle = TYPE_COLORS[booking.bookingType] || { bg: 'rgba(0,0,0,0.05)', color: '#000' };
                  return (
                    <TableRow key={booking.id}>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'primary.main' }}>
                        {booking.id}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {booking.userName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                            {booking.userEmail}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {booking.centerName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                            {booking.category}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={booking.bookingType}
                          size="small"
                          sx={{
                            background: typeStyle.bg,
                            color: typeStyle.color,
                            fontWeight: 700, fontSize: '0.65rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {dayjs(booking.bookingDate).format('MMM DD, YYYY')}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                            {booking.timeSlot}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
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
                        <IconButton size="small" onClick={(e) => handleActionClick(e, booking)}>
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

      {/* Row Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleCheckIn} disabled={selectedBooking?.status !== 'CONFIRMED'}>
          <CheckCircle sx={{ mr: 1, fontSize: 18, color: '#43D787' }} /> Check-in User
        </MenuItem>
        <MenuItem onClick={handleCancelBooking} disabled={selectedBooking?.status !== 'CONFIRMED'}>
          <Cancel sx={{ mr: 1, fontSize: 18, color: '#FF5757' }} /> Cancel Booking
        </MenuItem>
      </Menu>
    </Box>
  );
}
