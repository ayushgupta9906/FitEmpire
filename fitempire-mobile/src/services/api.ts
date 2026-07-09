import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const BASE_URL = 'https://ayush150152-fitempire-api.hf.space/api/v1';

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

        const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        await AsyncStorage.setItem('fitempire_access_token', accessToken);
        await AsyncStorage.setItem('fitempire_refresh_token', newRefreshToken);

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

// ── Service API endpoints ──────────────────────────────────────────────────

export const authApi = {
  requestOtp: (phone: string) =>
    apiClient.post('/auth/otp/send', { phone, purpose: 'LOGIN' }),
  
  verifyOtp: (phone: string, code: string) =>
    apiClient.post('/auth/otp/verify', { phone, otp: code, purpose: 'LOGIN' }),
  
  getProfile: () =>
    apiClient.get('/users/profile/me'),
};

export const gymsApi = {
  getNearby: (lat: number, lng: number, radiusKm: number = 10) =>
    apiClient.get('/gyms/nearby', { params: { latitude: lat, longitude: lng, radius: radiusKm } }),
  
  getGymDetails: (id: string) =>
    apiClient.get(`/gyms/${id}`),

  getBranches: (gymId: string) =>
    apiClient.get(`/gyms/${gymId}/branches`),
};

export const classesApi = {
  getSchedules: (branchId: string, date: string) =>
    apiClient.get(`/classes/schedules/branch/${branchId}`, { params: { date } }),

  bookSlot: (scheduleId: string) =>
    apiClient.post('/bookings', { scheduleId, bookingType: 'CLASS' }),
};

export const bookingsApi = {
  create: (data: {
    gymId: string;
    branchId: string;
    membershipId?: string;
    classScheduleId?: string;
    trainerId?: string;
    bookingType: 'GYM' | 'CLASS' | 'TRAINER';
    bookingDate: string;
    startTime?: string;
    endTime?: string;
    notes?: string;
  }) => apiClient.post('/bookings', data),

  getMyBookings: (page: number = 0, size: number = 20) =>
    apiClient.get('/bookings/my', { params: { page, size } }),

  cancel: (bookingId: string, reason?: string) =>
    apiClient.post(`/bookings/${bookingId}/cancel`, null, { params: { reason } }),

  getQrCode: (bookingId: string) =>
    apiClient.get(`/bookings/${bookingId}/qr`),
};

export const membershipsApi = {
  getPlans: () => apiClient.get('/memberships/plans'),
  
  getPlanById: (planId: string) => apiClient.get(`/memberships/plans/${planId}`),

  getMyMemberships: (page: number = 0, size: number = 20) =>
    apiClient.get('/memberships/my', { params: { page, size } }),

  getMyActiveMemberships: () =>
    apiClient.get('/memberships/my/active'),
};

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

export const walletApi = {
  getWalletInfo: () =>
    apiClient.get('/wallets/me'),
  
  getTransactions: (page: number = 0, size: number = 20) =>
    apiClient.get('/wallets/me/transactions', { params: { page, size } }),
};

export const aiApi = {
  getWorkoutPlan: () =>
    apiClient.get('/ai/recommendations'),

  generateWorkout: () =>
    apiClient.post('/ai/recommendations/workout'),

  generateNutrition: () =>
    apiClient.post('/ai/recommendations/nutrition'),
};
