import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B5CF6',
      light: '#A78BFA',
      dark: '#6D28D9',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06B6D4',
      light: '#22D3EE',
      dark: '#0891B2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0A0A0F',
      paper: '#12121A',
    },
    surface: {
      main: '#1A1A2E',
      card: '#16213E',
    },
    success: { main: '#43D787' },
    warning: { main: '#FFB038' },
    error: { main: '#FF5757' },
    info: { main: '#38BFFF' },
    text: {
      primary: '#F0F0FF',
      secondary: '#A0A8C8',
    },
    divider: 'rgba(108, 99, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#0A0A0F',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: '#12121A' },
          '&::-webkit-scrollbar-thumb': { background: '#6C63FF', borderRadius: 3 },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, rgba(108,99,255,0.05) 0%, rgba(255,101,132,0.03) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(108, 99, 255, 0.12)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 20px 60px rgba(108, 99, 255, 0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          transition: 'all 0.2s ease',
        },
        contained: {
          background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
          boxShadow: '0 8px 32px rgba(124, 58, 237, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)',
            boxShadow: '0 12px 40px rgba(124, 58, 237, 0.4)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            background: 'rgba(108, 99, 255, 0.08)',
            fontWeight: 700,
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#6C63FF',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: 'rgba(108, 99, 255, 0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': { borderColor: 'rgba(108, 99, 255, 0.2)' },
            '&:hover fieldset': { borderColor: 'rgba(108, 99, 255, 0.4)' },
            '&.Mui-focused fieldset': { borderColor: '#6C63FF' },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #0F0F1A 0%, #12121E 100%)',
          borderRight: '1px solid rgba(108, 99, 255, 0.12)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 10, 15, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(108, 99, 255, 0.1)',
          boxShadow: 'none',
        },
      },
    },
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    surface: { main: string; card: string };
  }
  interface PaletteOptions {
    surface?: { main: string; card: string };
  }
}
