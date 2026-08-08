import axios from 'axios';

export const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api') + '/v1';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('fitempire_partner_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fitempire_partner_token');
      localStorage.removeItem('fitempire_partner_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const partnerApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
    
  getProfile: () =>
    apiClient.get('/users/profile/me'),

  getDashboardActivity: () =>
    apiClient.get('/admin/dashboard/activity'),

  getGymDetails: () =>
    apiClient.get('/gyms/partner/my-gym'),

  verifyPass: (passCode: string) =>
    apiClient.post('/bookings/verify-qr', { code: passCode }),

  confirmCheckIn: (bookingId: string) =>
    apiClient.post(`/bookings/${bookingId}/check-in`),

  getClasses: () =>
    apiClient.get('/classes'),

  addClassSlot: (slotData: any) =>
    apiClient.post('/classes', slotData),

  getSettlements: () =>
    apiClient.get('/settlements'),

  requestPayout: (amount: number) =>
    apiClient.post('/settlements/payout-request', { amount }),
};
