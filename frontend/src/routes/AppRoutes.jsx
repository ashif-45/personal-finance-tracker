import { Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import TransactionsPage from '../pages/TransactionsPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { useAuth } from '../hooks/useAuth.js';
import Button from '../components/ui/Button.jsx';

function NavPlaceholder() {
  const { logout, user } = useAuth();
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3.5 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <span className="font-bold text-lg text-blue-600">Finance Tracker</span>
        <Link to="/transactions" className="text-sm font-medium text-gray-700 hover:text-blue-600">
          Transactions
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Hello, {user?.fullName || 'User'}</span>
        <Button variant="outline" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}

function LayoutWrapper({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavPlaceholder />
      <main>{children}</main>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <TransactionsPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard" element={<Navigate to="/transactions" replace />} />
      <Route path="/" element={<Navigate to="/transactions" replace />} />
      <Route path="*" element={<Navigate to="/transactions" replace />} />
    </Routes>
  );
}