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

      enqueueSnackbar(`Welcome back, ${firstName}! 👋`, { variant: 'success' });
      navigate('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid credentials. Please try again.';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 30% 50%, rgba(108,99,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(255,101,132,0.1) 0%, transparent 60%), linear-gradient(180deg, #0A0A0F 0%, #0D0D18 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background orbs */}
      {[...Array(3)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(80px)',
            opacity: 0.15,
            background: i % 2 === 0
              ? 'linear-gradient(135deg, #6C63FF, #9C94FF)'
              : 'linear-gradient(135deg, #FF6584, #FFB038)',
            width: 300 + i * 100,
            height: 300 + i * 100,
            top: `${20 + i * 25}%`,
            left: `${10 + i * 30}%`,
            animation: `float${i} ${4 + i}s ease-in-out infinite alternate`,
          }}
        />
      ))}

      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          mx: 2,
          background: 'rgba(18, 18, 26, 0.9)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(108, 99, 255, 0.2)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.5)',
          position: 'relative',
          zIndex: 1,
          '&:hover': { transform: 'none' }, // disable lift on login card
        }}
      >
        <CardContent sx={{ p: 5 }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: '0 12px 40px rgba(108, 99, 255, 0.4)',
              }}
            >
              <FitnessCenter sx={{ fontSize: 32, color: '#fff' }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
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
