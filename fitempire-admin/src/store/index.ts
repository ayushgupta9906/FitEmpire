import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// ── Auth Slice ───────────────────────────────────────────────────────────────

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    role: string;
  } | null;
  accessToken: string | null;
}

const initialAuthState: AuthState = {
  isAuthenticated: !!localStorage.getItem('fitempire_access_token'),
  user: null,
  accessToken: localStorage.getItem('fitempire_access_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: AuthState['user']; accessToken: string; refreshToken: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      localStorage.setItem('fitempire_access_token', action.payload.accessToken);
      localStorage.setItem('fitempire_refresh_token', action.payload.refreshToken);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem('fitempire_access_token');
      localStorage.removeItem('fitempire_refresh_token');
    },
  },
});

// ── UI Slice ──────────────────────────────────────────────────────────────────

interface UiState {
  sidebarOpen: boolean;
  loading: boolean;
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: { sidebarOpen: true, loading: false } as UiState,
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => { state.sidebarOpen = action.payload; },
    setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
  },
});

// ── Store ─────────────────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const { toggleSidebar, setSidebarOpen, setLoading } = uiSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
