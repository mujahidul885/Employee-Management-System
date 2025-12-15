import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { initializeMockData } from './services/mockData';

// Auth
import LoginPage from './modules/auth/LoginPage';
import ProtectedRoute from './modules/auth/ProtectedRoute';

// Layout
import MainLayout from './components/layout/MainLayout';

// Modules
import Dashboard from './modules/dashboard/Dashboard';
import EmployeeList from './modules/employee/EmployeeList';
import AttendancePage from './modules/attendance/AttendancePage';
import LeavePage from './modules/leave/LeavePage';
import SettingsPage from './modules/settings/SettingsPage';
import ShiftPage from './modules/shift/ShiftPage';
import PerformancePage from './modules/performance/PerformancePage';
import ExpensesPage from './modules/expenses/ExpensesPage';
import RecruitmentPage from './modules/recruitment/RecruitmentPage';
import TrainingPage from './modules/training/TrainingPage';

// Placeholder components for other modules
const PayrollPage = () => <div className="card"><h2>Payroll Module</h2><p>Coming soon...</p></div>;
const ProfilePage = () => <div className="card"><h2>My Profile</h2><p>Coming soon...</p></div>;

function App() {
  useEffect(() => {
    // Initialize mock data on app load
    initializeMockData();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'white',
              color: 'var(--neutral-800)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              padding: '1rem'
            },
            success: {
              iconTheme: {
                primary: 'var(--success-500)',
                secondary: 'white'
              }
            },
            error: {
              iconTheme: {
                primary: 'var(--danger-500)',
                secondary: 'white'
              }
            }
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <Navigate to="/dashboard" replace />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/employees" element={
            <ProtectedRoute requiredRole={['admin', 'manager']}>
              <MainLayout>
                <EmployeeList />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/attendance" element={
            <ProtectedRoute>
              <MainLayout>
                <AttendancePage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/leave" element={
            <ProtectedRoute>
              <MainLayout>
                <LeavePage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/shift" element={
            <ProtectedRoute requiredRole={['admin', 'manager']}>
              <MainLayout>
                <ShiftPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/payroll" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout>
                <PayrollPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/performance" element={
            <ProtectedRoute>
              <MainLayout>
                <PerformancePage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/expenses" element={
            <ProtectedRoute>
              <MainLayout>
                <ExpensesPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/recruitment" element={
            <ProtectedRoute requiredRole={['admin', 'manager']}>
              <MainLayout>
                <RecruitmentPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/training" element={
            <ProtectedRoute>
              <MainLayout>
                <TrainingPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
