import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, CircularProgress,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, FitnessCenter } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { authApi } from '../api';
import { setCredentials } from '../store';
import type { AppDispatch } from '../store';

interface LoginForm {
  email: string;
  password: string;
}

const DumbbellIcon = ({ size = 24, color = 'currentColor', style = {} }: any) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="m6.5 6.5 11 11"/>
    <path d="m21 21-1-1"/>
    <path d="m3 3 1 1"/>
    <path d="m18 22 4-4"/>
    <path d="m2 6 4-4"/>
    <path d="m3 10 7-7"/>
    <path d="m14 21 7-7"/>
    <path d="M6.5 12.5 12.5 6.5"/>
    <path d="m11.5 17.5 6-6"/>
  </svg>
);

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await authApi.login(data.email, data.password);
      const { accessToken, refreshToken, userId, email, firstName, role } = res.data.data;

      // Only allow admin/super admin
      if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) {
        enqueueSnackbar('Access denied. Admin credentials required.', { variant: 'error' });
        return;
      }

      dispatch(setCredentials({
        user: { id: userId, email, firstName, role },
        accessToken,
        refreshToken,
      }));

      enqueueSnackbar('Login successful.', { variant: 'success' });
      navigate('/dashboard');
    } catch (e: any) {
      console.error(e);
      const msg = e.response?.data?.message || 'Login failed. Please check your credentials.';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: 'ADMIN' | 'SUPER_ADMIN') => {
    setLoading(true);
    // Simulating login for demo bypass
    setTimeout(() => {
      dispatch(setCredentials({
        user: {
          id: role === 'ADMIN' ? 'demo-admin-id' : 'demo-superadmin-id',
          email: role === 'ADMIN' ? 'admin@fitempire.in' : 'super@fitempire.in',
          firstName: role === 'ADMIN' ? 'Admin' : 'Super Admin',
          role: role
        },
        accessToken: 'demo-access-token',
        refreshToken: 'demo-refresh-token'
      }));
      enqueueSnackbar('Demo Login successful.', { variant: 'success' });
      navigate('/dashboard');
      setLoading(false);
    }, 800);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 10% 20%, #07080a 0%, #111318 90%)',
        position: 'relative',
        overflow: 'hidden',
        p: 2,
      }}
    >
      {/* Decorative Glows */}
      <Box
        sx={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(108, 99, 255, 0.15) 0%, rgba(108, 99, 255, 0) 70%)',
          top: '-10%',
          left: '-10%',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255, 101, 132, 0.1) 0%, rgba(255, 101, 132, 0) 70%)',
          bottom: '-10%',
          right: '-10%',
          zIndex: 0,
        }}
      />

      <Card
        sx={{
          width: '100%',
          maxWidth: 460,
          background: 'rgba(21, 23, 30, 0.7)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(108, 99, 255, 0.2)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.5)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <CardContent sx={{ p: 5 }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '18px', // matches mobile app's logoBadge borderRadius relative to size
                background: '#6C63FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: '0 12px 40px rgba(108, 99, 255, 0.4)',
              }}
            >
              <DumbbellIcon size={32} color="#ffffff" />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6C63FF 0%, #9C94FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
              }}
            >
              FitEmpire
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Admin Portal — Sign in to continue
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'primary.main', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'primary.main', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In to Admin Portal'}
            </Button>
          </Box>

          <Typography
            variant="caption"
            sx={{ display: 'block', textAlign: 'center', mt: 3, color: 'text.secondary' }}
          >
            FitEmpire Admin — Restricted Access Only
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
