import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/providers';
import { DashboardLayout, AuthLayout } from '@/layouts';
import { ProtectedRoute, PublicRoute, CompanyRoute } from '@/routes';
import {
  LoginPage,
  SignupPage,
  ForgotPasswordPage,
  OnboardingPage,
  DashboardPage,
  TransactionsPage,
  BudgetsPage,
  ProjectsPage,
  RecurringExpensesPage,
  SettingsPage,
} from '@/pages';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              <Route path="/recurring-expenses" element={<RecurringExpensesPage />} />
              <Route
                path="/projects"
                element={
                  <CompanyRoute>
                    <ProjectsPage />
                  </CompanyRoute>
                }
              />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
