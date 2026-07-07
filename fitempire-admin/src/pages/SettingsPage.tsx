import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Grid,
  FormControlLabel, Switch, Divider, InputAdornment
} from '@mui/material';
import { Save, AccountBalance, Loyalty, Security } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

export function SettingsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);

  // Platform State
  const [gstRate, setGstRate] = useState('18.0');
  const [hsnCode, setHsnCode] = useState('999355');
  const [bookingWindow, setBookingWindow] = useState('7');

  // Rewards State
  const [pointsPerRupee, setPointsPerRupee] = useState('1');
  const [pointsPerCheckin, setPointsPerCheckin] = useState('50');
  const [referralPointsReferrer, setReferralPointsReferrer] = useState('500');
  const [referralPointsReferee, setReferralPointsReferee] = useState('200');

  // Security State
  const [forceSsl, setForceSsl] = useState(true);
  const [maxFailedAttempts, setMaxFailedAttempts] = useState('5');
  const [lockoutMinutes, setLockoutMinutes] = useState('30');

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      enqueueSnackbar('Settings updated successfully!', { variant: 'success' });
    }, 1200);
  };

  return (
    <Box sx={{ pb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Platform Settings</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Configure system parameters, financial defaults, reward systems, and security thresholds
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={saving}
          sx={{ fontWeight: 700 }}
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Financial & General */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <AccountBalance sx={{ color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Financials & Tax Configurations</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="GST Tax Rate"
                    type="number"
                    value={gstRate}
                    onChange={(e) => setGstRate(e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Services HSN Code"
                    value={hsnCode}
                    onChange={(e) => setHsnCode(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Advance Booking Window (Days)"
                    type="number"
                    value={bookingWindow}
                    onChange={(e) => setBookingWindow(e.target.value)}
                    helperText="Number of days in advance users can book classes or passes"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Loyalty Program */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Loyalty sx={{ color: '#FFB038' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Loyalty & Rewards Policy</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Reward Points Per Rupee"
                    type="number"
                    value={pointsPerRupee}
                    onChange={(e) => setPointsPerRupee(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Points Per QR Check-in"
                    type="number"
                    value={pointsPerCheckin}
                    onChange={(e) => setPointsPerCheckin(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Referrer Bonus Points"
                    type="number"
                    value={referralPointsReferrer}
                    onChange={(e) => setReferralPointsReferrer(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Referee Bonus Points"
                    type="number"
                    value={referralPointsReferee}
                    onChange={(e) => setReferralPointsReferee(e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Security & Authentication */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Security sx={{ color: '#FF5757' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Security & Account Policies</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={forceSsl}
                        onChange={(e) => setForceSsl(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight={600}>Enforce SSL Connection</Typography>
                        <Typography variant="caption" color="text.secondary">Reject non-HTTPS API traffic</Typography>
                      </Box>
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Max Login Attempts"
                    type="number"
                    value={maxFailedAttempts}
                    onChange={(e) => setMaxFailedAttempts(e.target.value)}
                    helperText="Lock account temporarily after this count"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Temporary Lockout Duration (Minutes)"
                    type="number"
                    value={lockoutMinutes}
                    onChange={(e) => setLockoutMinutes(e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
