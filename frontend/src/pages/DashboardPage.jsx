import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { Calendar, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { dashboardApi } from '../api/dashboardApi.js';
import { budgetApi } from '../api/budgetApi.js';
import StatCards from '../components/dashboard/StatCards.jsx';
import SpendingChart from '../components/dashboard/SpendingChart.jsx';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart.jsx';
import RecentTransactions from '../components/dashboard/RecentTransactions.jsx';
import BudgetAlertBanner from '../components/budgets/BudgetAlertBanner.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Select from '../components/ui/Select.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';

const MONTHS = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' },
  { value: 3, label: 'March' }, { value: 4, label: 'April' },
  { value: 5, label: 'May' }, { value: 6, label: 'June' },
  { value: 7, label: 'July' }, { value: 8, label: 'August' },
  { value: 9, label: 'September' }, { value: 10, label: 'October' },
  { value: 11, label: 'November' }, { value: 12, label: 'December' },
];

function buildYearOptions() {
  const current = new Date().getFullYear();
  const years = [];
  for (let y = current + 2; y >= current - 5; y--) {
    years.push({ value: y, label: String(y) });
  }
  return years;
}

export default function DashboardPage() {
  const now = new Date();
  
  // Filter States
  const [filterMode, setFilterMode] = useState('month'); // 'month' or 'custom'
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [customStart, setCustomStart] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [customEnd, setCustomEnd] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));

  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const yearOptions = buildYearOptions();
  const isCurrentPeriod = selectedMonth === now.getMonth() + 1 && selectedYear === now.getFullYear();
  const periodLabel = MONTHS.find((m) => m.value === selectedMonth)?.label + ' ' + selectedYear;

  const loadData = useCallback(async (startDate, endDate) => {
    setLoading(true);
    try {
      const [dashRes, alertRes] = await Promise.all([
        dashboardApi.getSummary(startDate, endDate),
        budgetApi.getAlerts(),
      ]);
      setSummary(dashRes.data);
      setAlerts(alertRes.data || []);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger load when filters change
  useEffect(() => {
    if (filterMode === 'month') {
      const startDate = dayjs().year(selectedYear).month(selectedMonth - 1).startOf('month').format('YYYY-MM-DD');
      const endDate = dayjs().year(selectedYear).month(selectedMonth - 1).endOf('month').format('YYYY-MM-DD');
      loadData(startDate, endDate);
    } else {
      if (customStart && customEnd) {
        loadData(customStart, customEnd);
      }
    }
  }, [filterMode, selectedMonth, selectedYear, customStart, customEnd, loadData]);

  // Navigation functions for Month Mode
  const goToPreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const goToCurrentMonth = () => {
    setSelectedMonth(now.getMonth() + 1);
    setSelectedYear(now.getFullYear());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Your financial overview</p>
        </div>

        {/* Filter Mode Toggle */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterMode('month')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterMode === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar size={16} /> Monthly
          </button>
          <button
            onClick={() => setFilterMode('custom')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterMode === 'custom' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalendarDays size={16} /> Custom Range
          </button>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 mb-6">
        {filterMode === 'month' ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                title="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-2 min-w-[180px] justify-center">
                <span className="text-base font-semibold text-gray-900">{periodLabel}</span>
                {isCurrentPeriod && (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={goToNextMonth}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                title="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="w-[140px]">
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  options={MONTHS}
                />
              </div>
              <div className="w-[100px]">
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  options={yearOptions}
                />
              </div>
              {!isCurrentPeriod && (
                <Button size="sm" variant="outline" onClick={goToCurrentMonth}>
                  This month
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 max-w-[200px]">
              <Input
                label="Start Date"
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
              />
            </div>
            <div className="flex-1 max-w-[200px]">
              <Input
                label="End Date"
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                min={customStart}
              />
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <BudgetAlertBanner alerts={alerts} />
          
          <StatCards summary={summary} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <IncomeExpenseChart data={summary?.dailyTrend} />
            <SpendingChart data={summary?.categoryBreakdown} />
          </div>

          <RecentTransactions transactions={summary?.recentTransactions} />
        </>
      )}
    </div>
  );
}