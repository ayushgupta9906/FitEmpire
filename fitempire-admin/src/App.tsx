import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { GymsPage } from './pages/GymsPage';
import { MembershipsPage } from './pages/MembershipsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { BookingsPage } from './pages/BookingsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="gyms" element={<GymsPage />} />
        <Route path="memberships" element={<MembershipsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
