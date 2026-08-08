import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography, IconButton, Avatar,
  Badge, Tooltip, Divider, useTheme,
} from '@mui/material';
import {
  Dashboard, People, FitnessCenter, CardMembership, Payment,
  BarChart, EventNote, Notifications, Settings, ChevronLeft,
  ChevronRight, Logout, NotificationsNone, Search, CalendarMonth,
  VerifiedUser, CurrencyRupee,
} from '@mui/icons-material';
import type { AppDispatch, RootState } from '../store';
import { logout, toggleSidebar } from '../store';
import { authApi } from '../api';

const DRAWER_WIDTH = 268;
const DRAWER_COLLAPSED = 72;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { label: 'Users', icon: <People />, path: '/users' },
  { label: 'Gyms', icon: <FitnessCenter />, path: '/gyms' },
  { label: 'Memberships', icon: <CardMembership />, path: '/memberships' },
  { label: 'Payments', icon: <Payment />, path: '/payments' },
  { label: 'Bookings', icon: <EventNote />, path: '/bookings' },
  { label: 'Classes', icon: <CalendarMonth />, path: '/classes' },
  { label: 'Analytics', icon: <BarChart />, path: '/analytics' },
  { label: 'Partner Onboarding', icon: <FitnessCenter />, path: '/onboarding' },
  { label: 'Verification Queue', icon: <VerifiedUser />, path: '/verification' },
  { label: 'Settlements', icon: <CurrencyRupee />, path: '/settlements' },
  { label: 'Notifications', icon: <Notifications />, path: '/notifications' },
  { label: 'Settings', icon: <Settings />, path: '/settings' },
];

const DumbbellIcon = ({ size = 24, color = 'currentColor', style = {} }: any) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: 'scaleX(-1)', ...style }}
  >
    <path d="M14.4 14.4 9.6 9.6"/>
    <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l.707-.707a2 2 0 1 1 2.829 2.828z"/>
    <path d="m21.5 21.5-1.4-1.4"/>
    <path d="M3.929 6.757a2 2 0 1 1 2.828-2.828l.707.707a2 2 0 1 1-2.828 2.828z"/>
    <path d="m2.5 2.5 1.4 1.4"/>
    <path d="m8.5 11.5-2.1-2.1a2 2 0 1 1 2.8-2.8l2.1 2.1"/>
    <path d="m15.5 18.5-2.1-2.1a2 2 0 1 1 2.8-2.8l2.1 2.1"/>
  </svg>
);

export function DashboardLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const sidebarOpen = useSelector((s: RootState) => s.ui.sidebarOpen);
  const user = useSelector((s: RootState) => s.auth.user);
  const drawerWidth = sidebarOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED;

  const isPartner = user?.role === 'PARTNER' || user?.role === 'GYM_PARTNER';

  useEffect(() => {
    const superAdminOnlyPaths = ['/gyms', '/users', '/onboarding', '/verification', '/settlements', '/analytics', '/memberships'];
    if (isPartner && superAdminOnlyPaths.some((p) => location.pathname.startsWith(p))) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, location.pathname, isPartner, navigate]);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: 200,
          }),
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: 200,
            }),
            border: 'none',
          },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarOpen ? 'space-between' : 'center',
            px: sidebarOpen ? 3 : 1,
            py: 2.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            minHeight: 72,
          }}
        >
          {sidebarOpen && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                }}
              >
                <DumbbellIcon size={20} color="#FFFFFF" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, color: '#F0F0FF' }}>
                  FitEmpire
                </Typography>
                <Typography variant="caption" sx={{ color: '#8B5CF6', fontWeight: 600 }}>
                  Admin Portal
                </Typography>
              </Box>
            </Box>
          )}
          {!sidebarOpen && (
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
              }}
            >
              <DumbbellIcon size={20} color="#FFFFFF" />
            </Box>
          )}
          {sidebarOpen && (
            <IconButton onClick={() => dispatch(toggleSidebar())} size="small" sx={{ color: 'text.secondary' }}>
              <ChevronLeft />
            </IconButton>
          )}
        </Box>

        {/* Navigation */}
        <List sx={{ flex: 1, px: 1.5, py: 2, overflowY: 'auto' }}>
          {NAV_ITEMS.filter((item) => {
            if (user?.role === 'PARTNER' || user?.role === 'GYM_PARTNER') {
              return ['/dashboard', '/bookings', '/classes', '/payments', '/notifications', '/settings'].includes(item.path);
            }
            return true;
          }).map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={!sidebarOpen ? item.label : ''} placement="right">
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 3,
                      minHeight: 48,
                      justifyContent: sidebarOpen ? 'initial' : 'center',
                      px: sidebarOpen ? 2 : 1.5,
                      background: active
                        ? 'linear-gradient(135deg, rgba(108,99,255,0.2) 0%, rgba(255,101,132,0.1) 100%)'
                        : 'transparent',
                      border: active ? '1px solid rgba(108, 99, 255, 0.3)' : '1px solid transparent',
                      '&:hover': {
                        background: 'rgba(108, 99, 255, 0.1)',
                        border: '1px solid rgba(108, 99, 255, 0.2)',
                      },
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: sidebarOpen ? 2 : 'auto',
                        justifyContent: 'center',
                        color: active ? 'primary.main' : 'text.secondary',
                        '& svg': { fontSize: 22 },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {sidebarOpen && (
                      <ListItemText
                        primary={item.label}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontSize: '0.875rem',
                            fontWeight: active ? 700 : 500,
                            color: active ? 'primary.main' : 'text.primary',
                          },
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>

        {/* User Footer */}
        <Divider sx={{ borderColor: 'divider' }} />
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: 3,
              background: 'rgba(108, 99, 255, 0.06)',
              cursor: 'pointer',
              '&:hover': { background: 'rgba(108, 99, 255, 0.12)' },
              transition: 'background 0.15s ease',
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                fontSize: '0.9rem',
                fontWeight: 700,
              }}
            >
              {user?.firstName?.[0] || 'A'}
            </Avatar>
            {sidebarOpen && (
              <>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {user?.firstName || 'Admin'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                    {user?.role || 'SUPER_ADMIN'}
                  </Typography>
                </Box>
                <IconButton onClick={handleLogout} size="small" sx={{ color: 'text.secondary' }}>
                  <Logout fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>
          {!sidebarOpen && (
            <IconButton
              onClick={() => dispatch(toggleSidebar())}
              sx={{ mt: 1, width: '100%', color: 'text.secondary' }}
            >
              <ChevronRight />
            </IconButton>
          )}
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', flex: 1 }}>
              {NAV_ITEMS.find(n => n.path === location.pathname)?.label || 'FitEmpire Admin'}
            </Typography>

            {/* Portal Switcher Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
              <Tooltip title="Open FitEmpire Member App">
                <Box
                  component="a"
                  href="http://localhost:8081"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.8,
                    px: 1.5,
                    py: 0.6,
                    borderRadius: 2,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    color: '#6C63FF',
                    bgcolor: 'rgba(108, 99, 255, 0.12)',
                    border: '1px solid rgba(108, 99, 255, 0.25)',
                    '&:hover': { bgcolor: 'rgba(108, 99, 255, 0.25)' },
                    transition: 'all 0.15s ease',
                  }}
                >
                  📱 Member App
                </Box>
              </Tooltip>

              <Tooltip title="Open FitEmpire Gym Partner App">
                <Box
                  component="a"
                  href="http://localhost:3001"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.8,
                    px: 1.5,
                    py: 0.6,
                    borderRadius: 2,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    color: '#3B82F6',
                    bgcolor: 'rgba(59, 130, 246, 0.12)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.25)' },
                    transition: 'all 0.15s ease',
                  }}
                >
                  🏢 FitEmpire Partner App
                </Box>
              </Tooltip>
            </Box>

            <IconButton sx={{ color: 'text.secondary' }}>
              <Search />
            </IconButton>
            <IconButton sx={{ color: 'text.secondary' }}>
              <Badge badgeContent={4} color="error">
                <NotificationsNone />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 3,
            background: 'linear-gradient(180deg, #0A0A0F 0%, #0D0D18 100%)',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
