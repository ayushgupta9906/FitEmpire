import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import Constants from 'expo-constants';

const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost?.split(':')[0] || 'localhost';
// Must include /api since backend servlet context-path is /api
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${localhost}:8080/api/v1`;
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach JWT access token to request headers
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('fitempire_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh JWT tokens on expiry
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('fitempire_refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');

        // Backend expects refresh token as X-Refresh-Token header, not body
        const res = await axios.post(`${BASE_URL}/auth/refresh`, null, {
          headers: { 'X-Refresh-Token': refreshToken },
        });
        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        await AsyncStorage.setItem('fitempire_access_token', accessToken);
        if (newRefreshToken) {
          await AsyncStorage.setItem('fitempire_refresh_token', newRefreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        logOut();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const logOut = async () => {
  await AsyncStorage.multiRemove([
    'fitempire_access_token',
    'fitempire_refresh_token',
    'fitempire_user',
  ]);
};

// ── Auth API ────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  register: (data: { email?: string; phone?: string; password?: string; firstName: string; lastName?: string }) =>
    apiClient.post('/auth/register', data),

  requestOtp: (phone: string) => {
    return apiClient.post('/auth/otp/send', { phone: phone.trim(), purpose: 'LOGIN' });
  },
  
  verifyOtp: (phone: string, code: string) => {
    return apiClient.post('/auth/otp/verify', { phone: phone.trim(), otp: code.trim(), purpose: 'LOGIN' });
  },
  
  getProfile: () =>
    apiClient.get('/users/profile/me'),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (email: string, otp: string, newPassword: string) =>
    apiClient.post('/auth/reset-password', { email, otp, newPassword }),
};

// ── User Profile API ────────────────────────────────────────────────────────

export const userApi = {
  getProfile: () =>
    apiClient.get('/users/profile/me'),

  updateProfile: (data: {
    bio?: string;
    fitnessGoal?: string;
    fitnessLevel?: string;
    heightCm?: number;
    weightKg?: number;
    targetWeightKg?: number;
    preferredWorkoutTime?: string;
    city?: string;
    state?: string;
    pincode?: string;
    notificationPush?: boolean;
    notificationEmail?: boolean;
    notificationSms?: boolean;
    darkMode?: boolean;
    language?: string;
  }) => apiClient.put('/users/profile/me', data),

  uploadAvatar: (file: FormData) =>
    apiClient.post('/users/profile/avatar', file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ── Gyms API ────────────────────────────────────────────────────────────────

export const gymsApi = {
  getNearby: (lat: number, lng: number, radiusKm: number = 10) =>
    apiClient.get('/gyms/nearby', { params: { latitude: lat, longitude: lng, radius: radiusKm } }),
  
  getGymDetails: (id: string) =>
    apiClient.get(`/gyms/${id}`),

  getBranches: (gymId: string) =>
    apiClient.get(`/gyms/${gymId}/branches`),

  search: (query?: string, city?: string, page: number = 0, size: number = 20) =>
    apiClient.get('/gyms', { params: { query, city, page, size } }),

  getActive: (page: number = 0, size: number = 20) =>
    apiClient.get('/gyms', { params: { page, size } }),

  getFeatured: () =>
    apiClient.get('/gyms/featured'),
};

// ── Classes API ─────────────────────────────────────────────────────────────

export const classesApi = {
  getSchedules: (branchId: string, date: string) =>
    apiClient.get(`/classes/schedules/branch/${branchId}`, { params: { date } }),

  bookSlot: (scheduleId: string) =>
    apiClient.post('/bookings', { scheduleId, bookingType: 'CLASS' }),
};

// ── Bookings API ────────────────────────────────────────────────────────────

export const bookingsApi = {
  create: (data: {
    gymId: string;
    branchId: string;
    membershipId?: string;
    classScheduleId?: string;
    trainerId?: string;
    bookingType: 'GYM_ACCESS' | 'CLASS' | 'TRAINER' | 'SPORTS';
    bookingDate: string;
    startTime?: string;
    endTime?: string;
    notes?: string;
  }) => apiClient.post('/bookings', data),

  getMyBookings: (page: number = 0, size: number = 20) =>
    apiClient.get('/bookings/my', { params: { page, size } }),

  cancel: (bookingId: string, reason?: string) =>
    apiClient.post(`/bookings/${bookingId}/cancel`, null, { params: { reason } }),

  getQrCode: (bookingId: string, userId: string) =>
    apiClient.get(`/bookings/${bookingId}/qr`, { params: { userId } }),
};

// ── Memberships API ─────────────────────────────────────────────────────────

export const membershipsApi = {
  getPlans: () => apiClient.get('/memberships/plans'),
  
  getPlanById: (planId: string) => apiClient.get(`/memberships/plans/${planId}`),

  getMyMemberships: (page: number = 0, size: number = 20) =>
    apiClient.get('/memberships/my', { params: { page, size } }),

  getMyActiveMemberships: () =>
    apiClient.get('/memberships/my/active'),

  freeze: (membershipId: string) =>
    apiClient.post(`/memberships/${membershipId}/freeze`),

  unfreeze: (membershipId: string) =>
    apiClient.post(`/memberships/${membershipId}/unfreeze`),
};

// ── Payments API ────────────────────────────────────────────────────────────

export const paymentsApi = {
  createOrder: (planId: string, walletAmount?: number, discount?: number) =>
    apiClient.post('/payments/order', { planId, walletAmount, discount }),

  verifyPayment: (data: {
    paymentId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => apiClient.post('/payments/verify', data),

  getMyPayments: (page: number = 0, size: number = 20) =>
    apiClient.get('/payments/my', { params: { page, size } }),
};

// ── Wallet API ──────────────────────────────────────────────────────────────

export const walletApi = {
  getWalletInfo: () =>
    apiClient.get('/wallets/me'),
  
  getTransactions: (page: number = 0, size: number = 20) =>
    apiClient.get('/wallets/me/transactions', { params: { page, size } }),

  topUp: (amount: number, paymentMethod?: string) =>
    apiClient.post('/wallets/me/top-up', { amount, paymentMethod: paymentMethod || 'UPI' }),
};

// ── AI API ──────────────────────────────────────────────────────────────────

export const aiApi = {
  getWorkoutPlan: () =>
    apiClient.get('/ai/recommendations'),

  generateWorkout: () =>
    apiClient.post('/ai/recommendations/workout'),

  generateNutrition: () =>
    apiClient.post('/ai/recommendations/nutrition'),

  submitFeedback: (recId: string, feedback: string) =>
    apiClient.post(`/ai/recommendations/${recId}/feedback`, { feedback }),

  dismiss: (recId: string) =>
    apiClient.post(`/ai/recommendations/${recId}/dismiss`),
};

// ── Ecosystem API ───────────────────────────────────────────────────────────

export const ecosystemApi = {
  getActivities: () =>
    apiClient.get('/ecosystem/activities'),

  getFoods: () =>
    apiClient.get('/ecosystem/foods'),

  getStoreProducts: () =>
    apiClient.get('/ecosystem/store/products'),

  getDoctors: () =>
    apiClient.get('/ecosystem/care/doctors'),

  getVideoClasses: () =>
    apiClient.get('/ecosystem/tv/videos'),

  verifyCorporate: (email: string) =>
    apiClient.post('/ecosystem/corporate/verify', { email }),
};

// ── Rewards API ─────────────────────────────────────────────────────────────

export const rewardsApi = {
  getMyPoints: () =>
    apiClient.get('/rewards/me'),

  getHistory: (page: number = 0, size: number = 20) =>
    apiClient.get('/rewards/me/history', { params: { page, size } }),
};

// ── Coupons API ─────────────────────────────────────────────────────────────

export const couponsApi = {
  validate: (code: string, amount: number) =>
    apiClient.post('/coupons/validate', { code, amount }),

  getAvailable: () =>
    apiClient.get('/coupons/available'),
};
