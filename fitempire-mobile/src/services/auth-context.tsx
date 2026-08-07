import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, logOut as apiLogOut } from './api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  requestOtp: (phone: string) => Promise<string | null>;
  verifyOtp: (phone: string, code: string) => Promise<void>;
  loginAsPartner: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('fitempire_access_token');
      const storedUser = await AsyncStorage.getItem('fitempire_user');
      
      if (accessToken && storedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
        // Async update profile in background
        fetchUserProfile();
      }
    } catch (e) {
      console.warn('Failed to load stored auth:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await authApi.getProfile();
      const userData = res.data.data.user;
      setUser(userData);
      await AsyncStorage.setItem('fitempire_user', JSON.stringify(userData));
    } catch (e) {
      console.warn('Failed to refresh profile:', e);
    }
  };

  const requestOtp = async (phone: string): Promise<string | null> => {
    const res = await authApi.requestOtp(phone);
    return res.data?.data || null;
  };

  const verifyOtp = async (phone: string, code: string) => {
    const res = await authApi.verifyOtp(phone, code);
    const { accessToken, refreshToken, user: userData } = res.data.data;
    
    await AsyncStorage.setItem('fitempire_access_token', accessToken);
    await AsyncStorage.setItem('fitempire_refresh_token', refreshToken);
    await AsyncStorage.setItem('fitempire_user', JSON.stringify(userData));
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  const loginAsPartner = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const { accessToken, refreshToken, userId, role, email: userEmail, firstName } = res.data.data;
    const userData = { id: userId, email: userEmail, firstName, role };
    
    await AsyncStorage.setItem('fitempire_access_token', accessToken);
    if (refreshToken) {
      await AsyncStorage.setItem('fitempire_refresh_token', refreshToken);
    }
    await AsyncStorage.setItem('fitempire_user', JSON.stringify(userData));
    
    setUser(userData);
    setIsAuthenticated(true);
    fetchUserProfile();
  };

  const logout = async () => {
    await apiLogOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        requestOtp,
        verifyOtp,
        loginAsPartner,
        logout,
        refreshProfile: fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
