import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency.js';

const DEFAULT_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#64748B'];

export default function SpendingChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Breakdown</h3>
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
          No expense data for this month
        </div>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d.categoryName,
    value: parseFloat(d.amount),
    color: d.color || DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)],
  }));

  const renderTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-sm">
          <p className="font-semibold text-gray-900">{d.name}</p>
          <p className="text-gray-600">{formatCurrency(d.value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={renderTooltip} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}