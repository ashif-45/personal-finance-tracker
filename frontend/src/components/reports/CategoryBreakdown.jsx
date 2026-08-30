import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { reportApi } from '../../api/reportApi.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import Spinner from '../ui/Spinner.jsx';
import Select from '../ui/Select.jsx';
import toast from 'react-hot-toast';

const MONTHS = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' },
  { value: 3, label: 'March' },   { value: 4, label: 'April' },
  { value: 5, label: 'May' },     { value: 6, label: 'June' },
  { value: 7, label: 'July' },    { value: 8, label: 'August' },
  { value: 9, label: 'September' },{ value: 10, label: 'October' },
  { value: 11, label: 'November' },{ value: 12, label: 'December' },
];

export default function CategoryBreakdown() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentYear = now.getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => ({
    value: currentYear - i,
    label: String(currentYear - i),
  }));

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await reportApi.getCategory(month, year);
        setData(res.data);
      } catch {
        toast.error('Failed to load category report');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [month, year]);

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const categories = data?.categoryData || [];
  const chartData = categories.map((c) => ({
    name: c.categoryName,
    value: parseFloat(c.totalAmount),
    color: c.color || '#64748B',
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">Category Breakdown</h2>
        <div className="flex gap-3">
          <div className="w-36">
            <Select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              options={MONTHS}
            />
          </div>
          <div className="w-28">
            <Select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              options={years}
            />
          </div>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No expense data for this period.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
            <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat.categoryName} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm font-medium text-gray-800">{cat.categoryName}</span>
                    <span className="text-xs text-gray-400">({cat.transactionCount} txns)</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(cat.totalAmount)}</p>
                    <p className="text-xs text-gray-400">{cat.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}