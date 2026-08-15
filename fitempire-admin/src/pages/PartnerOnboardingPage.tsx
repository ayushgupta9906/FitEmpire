import { useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Grid,
  MenuItem, Paper, Divider, Chip, CircularProgress, IconButton,
  Alert, Tooltip, LinearProgress
} from '@mui/material';
import {
  FitnessCenter, PersonAdd, LocationOn, Lock, Email, Phone,
  CheckCircle, Business, AddPhotoAlternate, Schedule, AccessTime,
  AttachMoney, Delete, MapOutlined, CloudUpload, AcUnit, LocalParking,
  Shower, LockOutlined, Wifi, Pool, LocalCafe, PersonPin,
  SportsMma, Celebration, Flare, PauseCircleFilled, GroupAdd, Star,
  Visibility, VisibilityOff, ContentCopy, OpenInNew
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

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const DAY_LABELS: Record<string, string> = {
  MON: 'Mon', TUE: 'Tue', WED: 'Wed', THU: 'Thu',
  FRI: 'Fri', SAT: 'Sat', SUN: 'Sun'
};

const AMENITIES = [
  { value: 'AC', label: 'Air Conditioning' },
  { value: 'PARKING', label: 'Free Parking' },
  { value: 'SHOWERS', label: 'Hot Showers' },
  { value: 'LOCKERS', label: 'Digital Lockers' },
  { value: 'SAUNA', label: 'Sauna / Steam' },
  { value: 'WIFI', label: 'Free Wi-Fi' },
  { value: 'POOL', label: 'Swimming Pool' },
  { value: 'CAFE', label: 'Café / Juice Bar' },
  { value: 'PERSONAL_TRAINING', label: 'Personal Training' },
  { value: 'DIET_CONSULTATION', label: 'Diet Consultation' },
  { value: 'CHANGING_ROOM', label: 'Changing Rooms' },
  { value: 'SUPPLEMENTS', label: 'Supplement Store' },
];

// FitEmpire Platform Plans (Counters Fitpass 180, 360 & Corporate)
const FITEMPIRE_CUSTOMER_PLANS = [
  {
    name: 'FitEmpire 360 (Annual All-in-One)',
    badge: 'FLAGSHIP 360° 👑',
    badgeColor: '#8B5CF6',
    price: '₹7,999 (₹666/mo)',
    features: ['Beats FITPASS 360', 'Dual-Session (Gym + Pool in 1 day)', '60 Days Free Pause + 5 Buddy Passes', 'FitFeast AI Diet + Doctor Consults'],
  },
  {
    name: 'FitEmpire 180 (Semi-Annual Pro)',
    badge: 'BEST VALUE ⚡',
    badgeColor: '#EC4899',
    price: '₹4,799 (₹799/mo)',
    features: ['Beats FITPASS 180', 'UNLIMITED visits per gym (No 5-session cap)', '30 Days Free Pause + 2 Buddy Passes', 'FitCoach AI Workout Generator'],
  },
  {
    name: 'FitEmpire Corporate Pass',
    badge: 'EMPLOYER SUBSIDISED 🏢',
    badgeColor: '#0284C7',
    price: 'Up to 100% Subsidised',
    features: ['500+ Top Corporates (TCS, Infosys, Google)', 'Corporate code & employee email auth', 'Dedicated HR wellness dashboard', 'B2B bulk gym traffic to partner centers'],
  },
  {
    name: 'FitEmpire 90 (Quarterly Power)',
    badge: 'POPULAR ⭐',
    badgeColor: '#F59E0B',
    price: '₹2,699 (₹899/mo)',
    features: ['90 Days Unlimited Access', '15 Days Free Pause Protection', '1 Free Buddy Pass every month', 'AI Nutritionist Diet Coach'],
  },
  {
    name: 'FitEmpire Monthly Pass',
    badge: '30 DAYS FLEXI',
    badgeColor: '#6366F1',
    price: '₹999 / mo',
    features: ['Daily 1 scan access', 'Up to 7 Days Free Pause/Freeze', '12k+ Partner centers nationwide'],
  },
  {
    name: 'Flexi Rollover Pack',
    badge: 'NO EXPIRY ⏳',
    badgeColor: '#10B981',
    price: '₹1,499 (10 Sessions)',
    features: ['Credits NEVER expire', 'Roll over unused visits — zero waste', 'Single gym or multi-gym pass'],
  },
];

function parseGoogleMapsUrl(url: string): { lat: string; lng: string } | null {
  const patterns = [
    /@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
    /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
    /ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return { lat: m[1], lng: m[2] };
  }
  return null;
}

export function PartnerOnboardingPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [lastSavedCreds, setLastSavedCreds] = useState<{ email: string; pass: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Section 1 – Partner Account
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    // Section 2 – Gym Profile
    gymName: '',
    category: 'GYM',
    description: '',
    gymEmail: '',
    gymPhone: '',
    websiteUrl: '',
    gstNumber: '',
    // Section 3 – Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    // Section 5 – Location
    mapsUrl: '',
    latitude: '',
    longitude: '',
    // Section 6 – Hours
    openingTime: '05:00',
    closingTime: '22:00',
    // Section 7 – Custom Gym Monthly Price
    gymMonthlyPrice: '2000',
  });

  const [workingDays, setWorkingDays] = useState<string[]>(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']);
  const [amenities, setAmenities] = useState<string[]>(['AC', 'SHOWERS', 'LOCKERS', 'WIFI']);

  // Real Uploaded Photos State
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => {
      const next = { ...prev, [field]: val };
      if (field === 'mapsUrl') {
        const coords = parseGoogleMapsUrl(val);
        if (coords) {
          next.latitude = coords.lat;
          next.longitude = coords.lng;
        }
      }
      return next;
    });
  };

  // Upload Handlers
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const res = await gymsApi.uploadGymPhoto(file);
      if (res.data?.data?.url) {
        setLogoUrl(res.data.data.url);
        enqueueSnackbar('Logo uploaded successfully!', { variant: 'success' });
      }
    } catch (err: any) {
      console.error('Logo upload error:', err);
      enqueueSnackbar(err.response?.data?.message || 'Failed to upload logo', { variant: 'error' });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const res = await gymsApi.uploadGymPhoto(file);
      if (res.data?.data?.url) {
        setCoverImageUrl(res.data.data.url);
        enqueueSnackbar('Cover banner uploaded successfully!', { variant: 'success' });
      }
    } catch (err: any) {
      console.error('Cover upload error:', err);
      enqueueSnackbar(err.response?.data?.message || 'Failed to upload cover banner', { variant: 'error' });
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < Math.min(files.length, 4); i++) {
        const res = await gymsApi.uploadGymPhoto(files[i]);
        if (res.data?.data?.url) {
          newUrls.push(res.data.data.url);
        }
      }
      setGalleryUrls(prev => [...prev, ...newUrls].slice(0, 6));
      enqueueSnackbar(`${newUrls.length} gallery photos uploaded!`, { variant: 'success' });
    } catch (err: any) {
      console.error('Gallery upload error:', err);
      enqueueSnackbar(err.response?.data?.message || 'Failed to upload photos', { variant: 'error' });
    } finally {
      setUploadingGallery(false);
    }
  };

  const toggleDay = (day: string) => {
    setWorkingDays((prev) => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const toggleAmenity = (a: string) => {
    setAmenities((prev) => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  // Payout calculation
  const monthlyPriceNum = parseFloat(formData.gymMonthlyPrice) || 0;
  const calculatedPerSession = (monthlyPriceNum / 30).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessResult(null);

    const savedEmail = formData.email.trim();
    const savedPassword = formData.password;

    const payload = {
      // Account
      email: savedEmail,
      password: savedPassword,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      // Gym
      gymName: formData.gymName,
      category: formData.category,
      description: formData.description,
      gymEmail: formData.gymEmail || undefined,
      gymPhone: formData.gymPhone || undefined,
      websiteUrl: formData.websiteUrl || undefined,
      gstNumber: formData.gstNumber || undefined,
      // Media (Real Uploaded URLs)
      logoUrl: logoUrl || undefined,
      coverImageUrl: coverImageUrl || undefined,
      galleryUrls: galleryUrls.length > 0 ? galleryUrls : undefined,
      // Address
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2 || undefined,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      // Location
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      // Hours
      openingTime: formData.openingTime || undefined,
      closingTime: formData.closingTime || undefined,
      workingDays: workingDays.length > 0 ? workingDays : undefined,
      // Amenities
      amenities: amenities.length > 0 ? amenities : undefined,
      // Custom Gym Pricing Model
      gymMonthlyPrice: monthlyPriceNum > 0 ? monthlyPriceNum : undefined,
      perSessionRate: monthlyPriceNum > 0 ? parseFloat(calculatedPerSession) : undefined,
    };

    try {
      const res = await gymsApi.registerPartner(payload);
      const resultData = res.data.data;
      setSuccessResult(resultData);
      setLastSavedCreds({ email: savedEmail, pass: savedPassword });
      enqueueSnackbar('Gym Partner account & Gym created successfully!', { variant: 'success' });
      // Reset form
      setFormData({
        email: '', password: '', firstName: '', lastName: '', phone: '',
        gymName: '', category: 'GYM', description: '', gymEmail: '', gymPhone: '',
        websiteUrl: '', gstNumber: '', addressLine1: '', addressLine2: '',
        city: '', state: '', pincode: '', mapsUrl: '',
        latitude: '', longitude: '', openingTime: '05:00', closingTime: '22:00',
        gymMonthlyPrice: '2000',
      });
      setLogoUrl('');
      setCoverImageUrl('');
      setGalleryUrls([]);
      setWorkingDays(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']);
      setAmenities(['AC', 'SHOWERS', 'LOCKERS', 'WIFI']);
    } catch (err: any) {
      console.error('Partner registration error:', err);
      const msg = err.response?.data?.message || 'Failed to register Gym Partner. Please check inputs.';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const sectionCardSx = { borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', mb: 3 };
  const sectionHeaderSx = { display: 'flex', alignItems: 'center', mb: 2 };

  return (
    <Box sx={{ p: 4, maxWidth: 1150, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 1 }}>
            Partner Gym Onboarding
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Onboard gyms with custom per-visit settlement pricing, real photo uploads, and full center details.
          </Typography>
        </Box>
        <Chip
          icon={<CheckCircle sx={{ color: '#43D787 !important' }} />}
          label="Admin Authority"
          sx={{ background: 'rgba(67,215,135,0.12)', color: '#43D787', fontWeight: 700, p: 1 }}
        />
      </Box>

      {/* Success Banner */}
      {successResult && (
        <Paper elevation={0} sx={{
          p: 3, mb: 4, borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(67,215,135,0.15) 0%, rgba(108,99,255,0.15) 100%)',
          border: '1px solid rgba(67,215,135,0.4)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircle sx={{ color: '#43D787', fontSize: 32, mr: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#43D787' }}>
              Gym Partner Registered Successfully!
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Partner <strong>{successResult.firstName} {successResult.lastName}</strong> ({successResult.email}) can now log into the <strong>Partner Portal</strong>.
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={3}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Partner ID</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.78rem', wordBreak: 'break-all' }}>{successResult.partnerId}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Gym Name</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{successResult.gymName}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Per-Visit Payout</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#10B981' }}>₹{calculatedPerSession} / visit</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Login Email</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#6C63FF' }}>{successResult.email}</Typography>
            </Grid>
          </Grid>

          {lastSavedCreds && (
            <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.25)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block' }}>ACCOUNT CREDENTIALS FOR PARTNER PORTAL:</Typography>
                <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 700 }}>
                  Email: <span style={{ color: '#38BDF8' }}>{lastSavedCreds.email}</span> &nbsp;|&nbsp; Password: <span style={{ color: '#FCD34D' }}>{lastSavedCreds.pass}</span>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ContentCopy />}
                  onClick={() => {
                    navigator.clipboard.writeText(`Email: ${lastSavedCreds.email}\nPassword: ${lastSavedCreds.pass}`);
                    enqueueSnackbar('Credentials copied to clipboard!', { variant: 'info' });
                  }}
                  sx={{ color: '#38BDF8', borderColor: 'rgba(56,189,248,0.4)', textTransform: 'none' }}
                >
                  Copy Credentials
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  endIcon={<OpenInNew />}
                  href={`http://localhost:3001/login`}
                  target="_blank"
                  sx={{ bgcolor: '#43D787', color: '#000', fontWeight: 800, textTransform: 'none', '&:hover': { bgcolor: '#38BDF8' } }}
                >
                  Open Partner Login
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>

          {/* ─── SECTION 1: Partner Account ─── */}
          <Grid item xs={12}>
            <Card sx={sectionCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={sectionHeaderSx}>
                  <PersonAdd sx={{ color: '#6C63FF', mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>1. Partner Login Credentials</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth required label="First Name" value={formData.firstName} onChange={handleChange('firstName')} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Last Name" value={formData.lastName} onChange={handleChange('lastName')} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth required type="email" label="Business Email Address" value={formData.email}
                      onChange={handleChange('email')} placeholder="owner@mygym.com"
                      slotProps={{ input: { startAdornment: <Email sx={{ color: 'text.secondary', mr: 1 }} /> } }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      type={showPassword ? 'text' : 'password'}
                      label="Account Password"
                      value={formData.password}
                      onChange={handleChange('password')}
                      helperText="Minimum 6 characters (visible during entry)"
                      slotProps={{
                        input: {
                          startAdornment: <Lock sx={{ color: 'text.secondary', mr: 1 }} />,
                          endAdornment: (
                            <IconButton onClick={() => setShowPassword(p => !p)} edge="end" size="small">
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          ),
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth required label="Owner Mobile Number" value={formData.phone}
                      onChange={handleChange('phone')} placeholder="+919876543210"
                      slotProps={{ input: { startAdornment: <Phone sx={{ color: 'text.secondary', mr: 1 }} /> } }} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* ─── SECTION 2: Gym Profile ─── */}
          <Grid item xs={12}>
            <Card sx={sectionCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={sectionHeaderSx}>
                  <FitnessCenter sx={{ color: '#FF6584', mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>2. Gym Business Profile</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <TextField fullWidth required label="Gym / Fitness Center Name" value={formData.gymName}
                      onChange={handleChange('gymName')} placeholder="e.g. Gold's Gym Elite"
                      slotProps={{ input: { startAdornment: <Business sx={{ color: 'text.secondary', mr: 1 }} /> } }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth select required label="Primary Category" value={formData.category}
                      onChange={handleChange('category')}
                      slotProps={{ select: { MenuProps: { disableScrollLock: true } } }}>
                      {CATEGORIES.map(cat => <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline rows={3} label="Gym Description" value={formData.description}
                      onChange={handleChange('description')}
                      placeholder="Describe facilities, trainers, specialties, equipment highlights..." />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Gym Contact Email" value={formData.gymEmail}
                      onChange={handleChange('gymEmail')} placeholder="info@mygym.com" type="email" />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Gym Desk Phone" value={formData.gymPhone}
                      onChange={handleChange('gymPhone')} placeholder="+91 98765 43210" />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Website URL" value={formData.websiteUrl}
                      onChange={handleChange('websiteUrl')} placeholder="https://www.mygym.com" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="GST Number (optional)" value={formData.gstNumber}
                      onChange={handleChange('gstNumber')} placeholder="29AABCU9603R1ZM" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* ─── SECTION 3: Address ─── */}
          <Grid item xs={12}>
            <Card sx={sectionCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={sectionHeaderSx}>
                  <LocationOn sx={{ color: '#FFB038', mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>3. Main Branch Address</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField fullWidth required label="Street Address / Area" value={formData.addressLine1}
                      onChange={handleChange('addressLine1')} placeholder="e.g. 123 Sector 5, Near Cyber City" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Address Line 2 (optional)" value={formData.addressLine2}
                      onChange={handleChange('addressLine2')} placeholder="Floor, Landmark, Building name" />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth required label="City" value={formData.city}
                      onChange={handleChange('city')} placeholder="e.g. Bangalore" />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth required label="State" value={formData.state}
                      onChange={handleChange('state')} placeholder="e.g. Karnataka" />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth required label="Pincode" value={formData.pincode}
                      onChange={handleChange('pincode')} placeholder="e.g. 560034" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* ─── SECTION 4: REAL PHOTO UPLOAD ─── */}
          <Grid item xs={12}>
            <Card sx={sectionCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={sectionHeaderSx}>
                  <CloudUpload sx={{ color: '#EC4899', mr: 1.5 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>4. Gym Photos (Real File Upload)</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Upload direct photos from your computer (JPG, PNG, WebP up to 10MB)
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {/* Hidden File Inputs */}
                <input type="file" ref={coverInputRef} onChange={handleCoverUpload} accept="image/*" style={{ display: 'none' }} />
                <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" style={{ display: 'none' }} />
                <input type="file" ref={galleryInputRef} onChange={handleGalleryUpload} accept="image/*" multiple style={{ display: 'none' }} />

                <Grid container spacing={3}>
                  {/* Cover Photo Upload */}
                  <Grid item xs={12} md={7}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary' }}>
                      MAIN COVER BANNER
                    </Typography>
                    {coverImageUrl ? (
                      <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', height: 180, border: '1px solid rgba(0,0,0,0.1)' }}>
                        <img src={coverImageUrl} alt="Cover Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <IconButton
                          size="small"
                          onClick={() => setCoverImageUrl('')}
                          sx={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.7)', color: '#fff', '&:hover': { background: '#EF4444' } }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                        <Box sx={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', px: 1.5, py: 0.5, borderRadius: 1 }}>
                          <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700 }}>Cover Banner Ready</Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Paper
                        variant="outlined"
                        onClick={() => coverInputRef.current?.click()}
                        sx={{
                          p: 3, height: 180, boxSizing: 'border-box',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          border: '2px dashed #EC4899', borderRadius: 2, cursor: 'pointer',
                          background: 'rgba(236,72,153,0.02)',
                          '&:hover': { background: 'rgba(236,72,153,0.06)' }
                        }}
                      >
                        {uploadingCover ? (
                          <CircularProgress size={32} sx={{ color: '#EC4899', mb: 1 }} />
                        ) : (
                          <AddPhotoAlternate sx={{ fontSize: 40, color: '#EC4899', mb: 1 }} />
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {uploadingCover ? 'Uploading Cover Photo...' : 'Click to Upload Cover Banner'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Wide landscape image (1200×400px recommended)
                        </Typography>
                      </Paper>
                    )}
                  </Grid>

                  {/* Logo Upload */}
                  <Grid item xs={12} md={5}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary' }}>
                      GYM LOGO
                    </Typography>
                    {logoUrl ? (
                      <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', height: 180, border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                        <img src={logoUrl} alt="Logo" style={{ maxHeight: '80%', maxWidth: '80%', objectFit: 'contain' }} />
                        <IconButton
                          size="small"
                          onClick={() => setLogoUrl('')}
                          sx={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.7)', color: '#fff', '&:hover': { background: '#EF4444' } }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Paper
                        variant="outlined"
                        onClick={() => logoInputRef.current?.click()}
                        sx={{
                          p: 3, height: 180, boxSizing: 'border-box',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          border: '2px dashed #6C63FF', borderRadius: 2, cursor: 'pointer',
                          background: 'rgba(108,99,255,0.02)',
                          '&:hover': { background: 'rgba(108,99,255,0.06)' }
                        }}
                      >
                        {uploadingLogo ? (
                          <CircularProgress size={32} sx={{ color: '#6C63FF', mb: 1 }} />
                        ) : (
                          <Business sx={{ fontSize: 40, color: '#6C63FF', mb: 1 }} />
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {uploadingLogo ? 'Uploading Logo...' : 'Click to Upload Logo'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Square icon (400×400px recommended)
                        </Typography>
                      </Paper>
                    )}
                  </Grid>

                  {/* Gallery Photos */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                        GALLERY PHOTOS ({galleryUrls.length}/6)
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<CloudUpload />}
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={uploadingGallery || galleryUrls.length >= 6}
                        sx={{ textTransform: 'none', fontWeight: 700 }}
                      >
                        {uploadingGallery ? 'Uploading...' : 'Add Gallery Photos'}
                      </Button>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {galleryUrls.map((url, i) => (
                        <Box key={i} sx={{ position: 'relative', width: 120, height: 90, borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                          <img src={url} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <IconButton
                            size="small"
                            onClick={() => setGalleryUrls(prev => prev.filter((_, idx) => idx !== i))}
                            sx={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.7)', color: '#fff', p: 0.3, '&:hover': { background: '#EF4444' } }}
                          >
                            <Delete sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      ))}

                      {galleryUrls.length < 6 && (
                        <Paper
                          variant="outlined"
                          onClick={() => galleryInputRef.current?.click()}
                          sx={{
                            width: 120, height: 90, boxSizing: 'border-box',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            border: '1px dashed #94a3b8', borderRadius: 2, cursor: 'pointer',
                            '&:hover': { borderColor: '#6C63FF', background: 'rgba(108,99,255,0.03)' }
                          }}
                        >
                          <AddPhotoAlternate sx={{ fontSize: 24, color: '#94a3b8' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>+ Add</Typography>
                        </Paper>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* ─── SECTION 5: Map Location ─── */}
          <Grid item xs={12}>
            <Card sx={sectionCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={sectionHeaderSx}>
                  <MapOutlined sx={{ color: '#22C55E', mr: 1.5 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>5. Map Location</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Paste a Google Maps link — latitude & longitude will auto-fill
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Google Maps Link" value={formData.mapsUrl}
                      onChange={handleChange('mapsUrl')}
                      placeholder="https://maps.google.com/?q=28.6139,77.2090 or paste any Google Maps share link"
                      helperText={formData.latitude ? `✅ Parsed: ${formData.latitude}, ${formData.longitude}` : 'Paste a Google Maps URL and lat/lng will auto-extract'} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Latitude" value={formData.latitude}
                      onChange={handleChange('latitude')} placeholder="e.g. 28.6139"
                      helperText="Auto-filled from Maps URL, or enter manually" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Longitude" value={formData.longitude}
                      onChange={handleChange('longitude')} placeholder="e.g. 77.2090"
                      helperText="Auto-filled from Maps URL, or enter manually" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* ─── SECTION 6: Hours & Amenities ─── */}
          <Grid item xs={12}>
            <Card sx={sectionCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={sectionHeaderSx}>
                  <Schedule sx={{ color: '#38BDF8', mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>6. Operating Hours & Amenities</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary' }}>
                  DAILY TIMINGS
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth type="time" label="Opening Time" value={formData.openingTime}
                      onChange={handleChange('openingTime')}
                      slotProps={{ input: { startAdornment: <AccessTime sx={{ color: 'text.secondary', mr: 1 }} /> } }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth type="time" label="Closing Time" value={formData.closingTime}
                      onChange={handleChange('closingTime')}
                      slotProps={{ input: { startAdornment: <AccessTime sx={{ color: 'text.secondary', mr: 1 }} /> } }} />
                  </Grid>
                </Grid>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary' }}>
                  WORKING DAYS
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                  {DAYS.map(day => (
                    <Chip
                      key={day}
                      label={DAY_LABELS[day]}
                      clickable
                      onClick={() => toggleDay(day)}
                      sx={{
                        fontWeight: 700,
                        backgroundColor: workingDays.includes(day) ? '#6C63FF' : 'rgba(0,0,0,0.06)',
                        color: workingDays.includes(day) ? '#fff' : 'text.secondary',
                        '&:hover': { backgroundColor: workingDays.includes(day) ? '#5851D8' : 'rgba(0,0,0,0.1)' },
                      }}
                    />
                  ))}
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary' }}>
                  AMENITIES & FACILITIES
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {AMENITIES.map(am => (
                    <Chip
                      key={am.value}
                      label={am.label}
                      clickable
                      onClick={() => toggleAmenity(am.value)}
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        backgroundColor: amenities.includes(am.value) ? 'rgba(108,99,255,0.15)' : 'transparent',
                        color: amenities.includes(am.value) ? '#6C63FF' : 'text.secondary',
                        border: amenities.includes(am.value) ? '1px solid #6C63FF' : '1px solid rgba(0,0,0,0.15)',
                        '&:hover': { borderColor: '#6C63FF' },
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* ─── SECTION 7: CUSTOM GYM PRICING & SETTLEMENT MODEL ─── */}
          <Grid item xs={12}>
            <Card sx={{ ...sectionCardSx, border: '1px solid rgba(245, 158, 11, 0.4)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={sectionHeaderSx}>
                  <AttachMoney sx={{ color: '#F59E0B', mr: 1.5 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      7. Gym's Own Membership Price & Dynamic Payout Model
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      FitEmpire settles payouts per member visit based on the gym's own standard rate (Beats Fitpass's flat low payouts)
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label="Gym's Own Monthly Membership (₹)"
                      value={formData.gymMonthlyPrice}
                      onChange={handleChange('gymMonthlyPrice')}
                      placeholder="e.g. 2000"
                      helperText="Enter what this gym normally charges members directly per month"
                      slotProps={{
                        input: {
                          startAdornment: <Typography sx={{ mr: 1, fontWeight: 700, color: '#F59E0B' }}>₹</Typography>
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={7}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}>
                        ⚡ AUTO-CALCULATED PER-VISIT SETTLEMENT
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#10B981' }}>
                          ₹{calculatedPerSession}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          / member visit  (= ₹{formData.gymMonthlyPrice || '0'} ÷ 30 days)
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                        💡 When a FitEmpire member scans QR at this center, the gym wallet is credited with <strong>₹{calculatedPerSession}</strong> immediately.
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* FitEmpire Platform Plans Showcase */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Flare sx={{ color: '#6366F1', fontSize: 18 }} />
                    FITEMPIRE CUSTOMER PASSES (Competitive Edge vs Fitpass)
                  </Typography>

                  <Grid container spacing={2}>
                    {FITEMPIRE_CUSTOMER_PLANS.map((plan, i) => (
                      <Grid item xs={12} sm={6} md={4} key={i}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid rgba(0,0,0,0.08)',
                            background: '#fafafa',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
                                {plan.name}
                              </Typography>
                              <Chip
                                label={plan.badge}
                                size="small"
                                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, background: plan.badgeColor, color: '#fff' }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#4F46E5', mb: 1.5 }}>
                              {plan.price}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              {plan.features.map((feat, idx) => (
                                <Typography key={idx} variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  ✓ {feat}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Submit */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.8, px: 6, borderRadius: 3, fontWeight: 800, fontSize: '1.05rem',
                background: 'linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)',
                boxShadow: '0 8px 24px rgba(108,99,255,0.35)',
                '&:hover': { background: 'linear-gradient(135deg, #5B52E0 0%, #3D35C6 100%)' },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : '🚀 Register & Onboard Gym Partner'}
            </Button>
          </Grid>

        </Grid>
      </form>
    </Box>
  );
}
