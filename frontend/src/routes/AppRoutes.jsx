import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import TransactionsPage from '../pages/TransactionsPage.jsx';
import BudgetsPage from '../pages/BudgetsPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { useAuth } from '../hooks/useAuth.js';
import Button from '../components/ui/Button.jsx';

function NavPlaceholder() {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/transactions', label: 'Transactions' },
    { to: '/budgets', label: 'Budgets' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3.5 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <span className="font-bold text-lg text-blue-600">💰 FinanceTracker</span>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm font-medium transition-colors ${
              location.pathname === link.to
                ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 hidden sm:block">
          Hello, <span className="font-medium">{user?.fullName || 'User'}</span>
        </span>
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
      <Route
        path="/budgets"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <BudgetsPage />
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