import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { dashboardApi } from '../api/dashboardApi.js';
import { budgetApi } from '../api/budgetApi.js';
import StatCards from '../components/dashboard/StatCards.jsx';
import SpendingChart from '../components/dashboard/SpendingChart.jsx';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart.jsx';
import RecentTransactions from '../components/dashboard/RecentTransactions.jsx';
import BudgetAlertBanner from '../components/budgets/BudgetAlertBanner.jsx';
import Spinner from '../components/ui/Spinner.jsx';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, alertRes] = await Promise.all([
          dashboardApi.getSummary(),
          budgetApi.getAlerts(),
        ]);
        setSummary(dashRes.data);
        setAlerts(alertRes.data || []);

        // Show budget alerts as toasts
        (alertRes.data || []).forEach((alert) => {
          if (alert.alertLevel === 'CRITICAL') {
            toast.error(alert.message, { duration: 6000, id: `budget-${alert.budgetId}` });
          } else {
            toast(alert.message, { duration: 5000, icon: '⚠️', id: `budget-${alert.budgetId}` });
          }
        });
      } catch (err) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your financial overview for this month</p>
      </div>

      {/* Budget Alerts */}
      <BudgetAlertBanner alerts={alerts} />

      {/* Stat Cards */}
      <StatCards summary={summary} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <IncomeExpenseChart data={summary?.dailyTrend} />
        <SpendingChart data={summary?.categoryBreakdown} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={summary?.recentTransactions} />
    </div>
  );
}