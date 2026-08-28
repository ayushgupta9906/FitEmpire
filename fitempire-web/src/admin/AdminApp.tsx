import React from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import { store } from './store';
import { theme } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

import { BrowserRouter } from 'react-router-dom';

export const AdminApp: React.FC<{ onBackToWebsite?: () => void }> = ({ onBackToWebsite }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              autoHideDuration={4000}
            >
              {onBackToWebsite && (
                <button 
                  style={{
                    position: 'fixed',
                    top: '12px',
                    right: '24px',
                    zIndex: 99999,
                    background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                    color: '#FFFFFF',
                    padding: '7px 14px',
                    borderRadius: '20px',
                    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    transition: 'transform 0.2s ease'
                  }}
                  onClick={onBackToWebsite}
                >
                  ← Return to Main Website
                </button>
              )}
              <App />
            </SnackbarProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

export default AdminApp;
