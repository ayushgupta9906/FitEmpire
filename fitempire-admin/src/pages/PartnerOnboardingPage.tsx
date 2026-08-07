import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Grid,
  MenuItem, Paper, Divider, Chip, CircularProgress
} from '@mui/material';
import {
  FitnessCenter, PersonAdd, LocationOn, Lock, Email, Phone,
  CheckCircle, Business
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { gymsApi } from '../api';

const CATEGORIES = [
  { value: 'GYM', label: 'Gym & Fitness Center' },
  { value: 'YOGA', label: 'Yoga & Meditation Studio' },
  { value: 'MMA', label: 'MMA & Combat Academy' },
  { value: 'BOXING', label: 'Boxing Club' },
  { value: 'KICKBOXING', label: 'Kickboxing Arena' },
  { value: 'DANCE', label: 'Dance & Zumba Studio' },
  { value: 'SWIMMING', label: 'Swimming & Aquatics Pool' },
  { value: 'SPORTS', label: 'Sports Complex & Turf' },
  { value: 'GAMES', label: 'Recreational Gaming Lounge' },
];

export function PartnerOnboardingPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    gymName: '',
    category: 'GYM',
    description: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessResult(null);

    try {
      const res = await gymsApi.registerPartner(formData);
      const resultData = res.data.data;
      setSuccessResult(resultData);
      enqueueSnackbar('Gym Partner account & Gym created successfully!', { variant: 'success' });
      // Reset form
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        gymName: '',
        category: 'GYM',
        description: '',
        addressLine1: '',
        city: '',
        state: '',
        pincode: '',
      });
    } catch (err: any) {
      console.error('Partner registration error:', err);
      const msg = err.response?.data?.message || 'Failed to register Gym Partner. Please check inputs.';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1100, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 1 }}>
            Admin Gym Partner Registration
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Register new Gym Partners and initialize their active gym listing on FitEmpire.
          </Typography>
        </Box>
        <Chip
          icon={<CheckCircle sx={{ color: '#43D787 !important' }} />}
          label="Admin Authority Only"
          sx={{ background: 'rgba(67,215,135,0.12)', color: '#43D787', fontWeight: 700, p: 1 }}
        />
      </Box>

      {/* Success Notification Banner */}
      {successResult && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(67,215,135,0.15) 0%, rgba(108,99,255,0.15) 100%)',
            border: '1px solid rgba(67,215,135,0.4)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircle sx={{ color: '#43D787', fontSize: 32, mr: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#43D787' }}>
              Gym Partner Registered Successfully!
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Partner <strong>{successResult.firstName} {successResult.lastName}</strong> ({successResult.email}) can now log into both the <strong>Admin Portal</strong> and <strong>Mobile App</strong>.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Partner ID</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{successResult.partnerId}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Gym Name</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{successResult.gymName}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Gym Category & City</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{successResult.category} — {successResult.city}</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Section 1: Partner User Account */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonAdd sx={{ color: '#6C63FF', mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    1. Partner Credentials & Account
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="First Name"
                      value={formData.firstName}
                      onChange={handleChange('firstName')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={formData.lastName}
                      onChange={handleChange('lastName')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      label="Business Email Address"
                      value={formData.email}
                      onChange={handleChange('email')}
                      slotProps={{
                        input: {
                          startAdornment: <Email sx={{ color: 'text.secondary', mr: 1 }} />,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      type="password"
                      label="Account Password"
                      value={formData.password}
                      onChange={handleChange('password')}
                      helperText="Minimum 6 characters"
                      slotProps={{
                        input: {
                          startAdornment: <Lock sx={{ color: 'text.secondary', mr: 1 }} />,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Mobile Phone Number"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      placeholder="+919876543210"
                      slotProps={{
                        input: {
                          startAdornment: <Phone sx={{ color: 'text.secondary', mr: 1 }} />,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Section 2: Gym & Business Profile */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FitnessCenter sx={{ color: '#FF6584', mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    2. Gym Listing & Business Profile
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      required
                      label="Gym / Fitness Center Name"
                      value={formData.gymName}
                      onChange={handleChange('gymName')}
                      placeholder="e.g. Gold's Gym Elite"
                      slotProps={{
                        input: {
                          startAdornment: <Business sx={{ color: 'text.secondary', mr: 1 }} />,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      select
                      required
                      label="Primary Category"
                      value={formData.category}
                      onChange={handleChange('category')}
                      slotProps={{
                        select: {
                          MenuProps: { disableScrollLock: true },
                        },
                      }}
                    >
                      {CATEGORIES.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Gym Description"
                      value={formData.description}
                      onChange={handleChange('description')}
                      placeholder="Describe facilities, equipment, special trainers, and highlights..."
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Section 3: Branch Location */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ color: '#FFB038', mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    3. Main Branch Address
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Street Address / Area"
                      value={formData.addressLine1}
                      onChange={handleChange('addressLine1')}
                      placeholder="e.g. 123 Sector 5, Near Cyber City"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      required
                      label="City"
                      value={formData.city}
                      onChange={handleChange('city')}
                      placeholder="e.g. Gurgaon"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      required
                      label="State"
                      value={formData.state}
                      onChange={handleChange('state')}
                      placeholder="e.g. Haryana"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      required
                      label="Pincode"
                      value={formData.pincode}
                      onChange={handleChange('pincode')}
                      placeholder="e.g. 122001"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Submit Action */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.8,
                px: 6,
                borderRadius: 3,
                fontWeight: 800,
                fontSize: '1.05rem',
                background: 'linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)',
                boxShadow: '0 8px 24px rgba(108,99,255,0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5B52E0 0%, #3D35C6 100%)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Register & Deploy Partner Account'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
