import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Grid, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tabs, Tab, Chip, Select, FormControl, InputLabel, CircularProgress
} from '@mui/material';
import { Send, Notifications, History, Message } from '../icons';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';

interface NotificationHistoryItem {
  id: string;
  title: string;
  body: string;
  audience: 'ALL' | 'CUSTOMERS' | 'PARTNERS';
  type: 'PROMOTIONAL' | 'SYSTEM' | 'ALERT';
  sentAt: string;
  status: 'SENT' | 'FAILED';
  deliveredCount: number;
}

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  PROMOTIONAL: { bg: 'rgba(108,99,255,0.1)', color: '#6C63FF' },
  SYSTEM: { bg: 'rgba(0,184,212,0.1)', color: '#00B8D4' },
  ALERT: { bg: 'rgba(255,87,87,0.1)', color: '#FF5757' },
};

const AUDIENCE_NAMES: Record<string, string> = {
  ALL: 'All Users',
  CUSTOMERS: 'Customers Only',
  PARTNERS: 'Gym Owners/Partners',
};

const INITIAL_HISTORY: NotificationHistoryItem[] = [
  {
    id: 'ntf-101',
    title: 'Unlock Unlimited Fitness with FitEmpire Platinum!',
    body: 'Upgrade to Platinum Pass today and enjoy 20% discount on all premium gym partners!',
    audience: 'CUSTOMERS',
    type: 'PROMOTIONAL',
    sentAt: dayjs().subtract(2, 'hour').format('YYYY-MM-DD hh:mm A'),
    status: 'SENT',
    deliveredCount: 1450,
  },
  {
    id: 'ntf-102',
    title: 'Scheduled System Maintenance Notice',
    body: 'The FitEmpire admin panel will undergo a scheduled maintenance on Saturday, 12 AM to 2 AM IST.',
    audience: 'PARTNERS',
    type: 'SYSTEM',
    sentAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD hh:mm A'),
    status: 'SENT',
    deliveredCount: 42,
  },
  {
    id: 'ntf-103',
    title: 'URGENT: Verify your GST Document details',
    body: 'Your gym registration details require verification. Please upload correct documents inside Settings.',
    audience: 'ALL',
    type: 'ALERT',
    sentAt: dayjs().subtract(3, 'day').format('YYYY-MM-DD hh:mm A'),
    status: 'SENT',
    deliveredCount: 1543,
  },
];

export function NotificationsPage() {
  const [tab, setTab] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<'ALL' | 'CUSTOMERS' | 'PARTNERS'>('ALL');
  const [type, setType] = useState<'PROMOTIONAL' | 'SYSTEM' | 'ALERT'>('PROMOTIONAL');
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<NotificationHistoryItem[]>(INITIAL_HISTORY);
  const { enqueueSnackbar } = useSnackbar();

  const handleSend = () => {
    if (!title.trim() || !body.trim()) {
      enqueueSnackbar('Please fill in both the title and body of the notification!', { variant: 'error' });
      return;
    }
    setSending(true);
    setTimeout(() => {
      const newItem: NotificationHistoryItem = {
        id: `ntf-${100 + history.length + 1}`,
        title,
        body,
        audience,
        type,
        sentAt: dayjs().format('YYYY-MM-DD hh:mm A'),
        status: 'SENT',
        deliveredCount: audience === 'ALL' ? 1543 : audience === 'CUSTOMERS' ? 1500 : 43,
      };
      setHistory([newItem, ...history]);
      setSending(false);
      setTitle('');
      setBody('');
      enqueueSnackbar('Push notification broadcasted successfully!', { variant: 'success' });
      setTab(1); // switch to history tab
    }, 1500);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Push Notifications</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Compose and broadcast push notifications to customers and gym partners
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
              <Tab icon={<Message sx={{ fontSize: 18 }} />} iconPosition="start" label="Compose Broadcast" sx={{ fontWeight: 600 }} />
              <Tab icon={<History sx={{ fontSize: 18 }} />} iconPosition="start" label="Broadcast History" sx={{ fontWeight: 600 }} />
            </Tabs>
          </Box>

          {tab === 0 ? (
            /* Compose Form */
            <Box sx={{ p: 4, maxWidth: 800 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="audience-label">Target Audience</InputLabel>
                    <Select
                      labelId="audience-label"
                      value={audience}
                      label="Target Audience"
                      onChange={(e) => setAudience(e.target.value as any)}
                    >
                      <MenuItem value="ALL">All Users</MenuItem>
                      <MenuItem value="CUSTOMERS">Customers Only</MenuItem>
                      <MenuItem value="PARTNERS">Gym Owners/Partners</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="type-label">Notification Type</InputLabel>
                    <Select
                      labelId="type-label"
                      value={type}
                      label="Notification Type"
                      onChange={(e) => setType(e.target.value as any)}
                    >
                      <MenuItem value="PROMOTIONAL">Promotional</MenuItem>
                      <MenuItem value="SYSTEM">System/Maintenance</MenuItem>
                      <MenuItem value="ALERT">Alert/Warning</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Notification Title"
                    placeholder="e.g. FitEmpire discount offer is back!"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Notification Message Body"
                    placeholder="Type the message contents here. Keep it short and engaging..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={sending ? <CircularProgress size={20} color="inherit" /> : <Send />}
                    onClick={handleSend}
                    disabled={sending}
                    sx={{ px: 3, py: 1, fontWeight: 700 }}
                  >
                    {sending ? 'Sending Broadcast...' : 'Send Notification'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ) : (
            /* Broadcast History */
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Broadcast ID</TableCell>
                    <TableCell>Notification Detail</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Audience</TableCell>
                    <TableCell>Sent Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Delivered To</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((item) => {
                    const typeStyle = TYPE_COLORS[item.type] || { bg: 'rgba(0,0,0,0.05)', color: '#000' };
                    return (
                      <TableRow key={item.id}>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.8rem' }}>
                          {item.id}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                              {item.body}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.type}
                            size="small"
                            sx={{
                              background: typeStyle.bg,
                              color: typeStyle.color,
                              fontWeight: 700, fontSize: '0.65rem',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                          {AUDIENCE_NAMES[item.audience]}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                          {item.sentAt}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.status}
                            size="small"
                            sx={{
                              background: 'rgba(67,215,135,0.1)',
                              color: '#43D787',
                              border: '1px solid rgba(67,215,135,0.3)',
                              fontWeight: 700, fontSize: '0.65rem',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                          {item.deliveredCount} devices
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
