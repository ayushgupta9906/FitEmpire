import React, { createContext, useContext, useState } from 'react';
import { partnerApi } from '../api';

export interface PartnerUser {
  id?: string;
  userId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  gymName?: string;
}

const DEFAULT_PARTNER: PartnerUser = {
  id: '407d1eea-9d15-43d9-acc6-e3042be437f7',
  userId: '407d1eea-9d15-43d9-acc6-e3042be437f7',
  email: 'partner@fitempire.in',
  firstName: 'FitEmpire Partner',
  role: 'GYM_PARTNER',
  gymName: 'FitEmpire Flagship • Koramangala',
};

interface AuthContextType {
  user: PartnerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PartnerUser | null>(() => {
    const saved = localStorage.getItem('fitempire_partner_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('fitempire_partner_token');
    return !!token;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await partnerApi.login(email.trim(), password);
      const data = res.data?.data;
      const token = data?.accessToken;
      if (!token) {
        throw new Error('Authentication failed. No token received.');
      }
      
      const userData: PartnerUser = {
        id: data?.userId,
        userId: data?.userId,
        email: data?.email || email,
        firstName: data?.firstName || 'Gym Partner',
        role: data?.role || 'GYM_PARTNER',
        gymName: data?.gymName || 'FitEmpire Partner Gym',
      };

      localStorage.setItem('fitempire_partner_token', token);
      localStorage.setItem('fitempire_partner_user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('fitempire_partner_token');
    localStorage.removeItem('fitempire_partner_user');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/welcome';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
