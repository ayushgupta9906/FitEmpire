import api from './axios';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errorCode?: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// ── Auth ──────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<any>>('/v1/auth/login', { email, password }),

  logout: () => api.post('/v1/auth/logout'),

  refresh: (refreshToken: string) =>
    api.post<ApiResponse<any>>('/v1/auth/refresh', null, {
      headers: { 'X-Refresh-Token': refreshToken },
    }),
};

// ── Dashboard ─────────────────────────────────────────────────

export const dashboardApi = {
  getStats: () => api.get<ApiResponse<DashboardStats>>('/v1/admin/dashboard/stats'),
  getRevenueChart: (period: 'week' | 'month' | 'year') =>
    api.get<ApiResponse<RevenueChartData[]>>(`/v1/admin/dashboard/revenue?period=${period}`),
  getRecentActivity: () =>
    api.get<ApiResponse<ActivityItem[]>>('/v1/admin/dashboard/activity'),
};

// ── Users ─────────────────────────────────────────────────────

export const usersApi = {
  getAll: (page = 0, size = 20, search?: string) =>
    api.get<ApiResponse<PagedResponse<User>>>('/v1/admin/users', {
      params: { page, size, search },
    }),
  getById: (id: string) =>
    api.get<ApiResponse<User>>(`/v1/admin/users/${id}`),
  deactivate: (id: string) =>
    api.post(`/v1/admin/users/${id}/deactivate`),
  reactivate: (id: string) =>
    api.post(`/v1/admin/users/${id}/reactivate`),
};

// ── Gyms ──────────────────────────────────────────────────────

export const gymsApi = {
  getAll: (page = 0, size = 20, status?: string) =>
    api.get<ApiResponse<PagedResponse<Gym>>>('/v1/admin/gyms', {
      params: { page, size, status },
    }),
  getById: (id: string) => api.get<ApiResponse<Gym>>(`/v1/gyms/${id}`),
  approve: (id: string) => api.post(`/v1/gyms/${id}/approve`),
  reject: (id: string, reason: string) =>
    api.post(`/v1/gyms/${id}/reject`, null, { params: { reason } }),
};

// ── Memberships ───────────────────────────────────────────────

export const membershipsApi = {
  getAll: (page = 0, size = 20) =>
    api.get<ApiResponse<PagedResponse<Membership>>>('/v1/admin/memberships', {
      params: { page, size },
    }),
};

// ── Payments ──────────────────────────────────────────────────

export const paymentsApi = {
  getAll: (page = 0, size = 20, status?: string) =>
    api.get<ApiResponse<PagedResponse<Payment>>>('/v1/admin/payments', {
      params: { page, size, status },
    }),
  processRefund: (id: string, amount: number, reason: string) =>
    api.post(`/v1/admin/payments/${id}/refund`, { amount, reason }),
};

// ── Analytics ─────────────────────────────────────────────────

export const analyticsApi = {
  getOverview: () => api.get<ApiResponse<AnalyticsOverview>>('/v1/admin/analytics/overview'),
  getTopGyms: () => api.get<ApiResponse<TopGym[]>>('/v1/admin/analytics/top-gyms'),
  getTopCities: () => api.get<ApiResponse<CityData[]>>('/v1/admin/analytics/cities'),
};

// ── Types ─────────────────────────────────────────────────────

export interface DashboardStats {
  totalUsers: number;
  totalGyms: number;
  totalBookingsToday: number;
  totalRevenueToday: number;
  activeMembers: number;
  pendingApprovals: number;
  growthRate: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  bookings: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  active: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Gym {
  id: string;
  name: string;
  slug: string;
  status: string;
  category: string;
  avgRating: number;
  totalReviews: number;
  totalMembers: number;
  ownerName: string;
  createdAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  userName: string;
  gymName: string;
  planName: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface Payment {
  id: string;
  userName: string;
  amount: number;
  netAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export interface AnalyticsOverview {
  totalRevenue: number;
  totalBookings: number;
  conversionRate: number;
  avgOrderValue: number;
}

export interface TopGym {
  gymId: string;
  gymName: string;
  totalBookings: number;
  revenue: number;
}

export interface CityData {
  city: string;
  users: number;
  gyms: number;
}
