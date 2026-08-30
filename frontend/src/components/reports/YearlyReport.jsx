import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { reportApi } from '../../api/reportApi.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import Spinner from '../ui/Spinner.jsx';
import toast from 'react-hot-toast';

export default function YearlyReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await reportApi.getYearly();
        setData(res.data);
      } catch {
        toast.error('Failed to load yearly report');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data || !data.monthlyData?.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No yearly data available yet.</p>
      </div>
    );
  }

  const chartData = data.monthlyData.map((m) => ({
    year: m.month,  // "month" field holds year string from backend
    Income: parseFloat(m.income),
    Expense: parseFloat(m.expense),
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Yearly Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
          <p className="text-sm text-emerald-600 font-medium">All-Time Income</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">{formatCurrency(data.totalIncome)}</p>
        </div>
        <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
          <p className="text-sm text-rose-600 font-medium">All-Time Expenses</p>
          <p className="text-xl font-bold text-rose-700 mt-1">{formatCurrency(data.totalExpenses)}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">All-Time Savings</p>
          <p className="text-xl font-bold text-blue-700 mt-1">{formatCurrency(data.netSavings)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            <Legend />
            <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}