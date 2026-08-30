import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function StatCards({ summary }) {
  if (!summary) return null;

  const cards = [
    {
      label: 'Total Income',
      value: summary.totalIncome,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
    {
      label: 'Total Expenses',
      value: summary.totalExpenses,
      icon: TrendingDown,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
    },
    {
      label: 'Net Balance',
      value: summary.balance,
      icon: Wallet,
      color: summary.balance >= 0 ? 'text-blue-600' : 'text-red-600',
      bg: summary.balance >= 0 ? 'bg-blue-50' : 'bg-red-50',
      border: summary.balance >= 0 ? 'border-blue-200' : 'border-red-200',
    },
    {
      label: 'Savings Rate',
      value: `${summary.savingsRate?.toFixed(1) || 0}%`,
      icon: PiggyBank,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      isPercentage: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`bg-white rounded-xl border ${card.border} p-5 shadow-xs hover:shadow-sm transition-shadow`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{card.label}</span>
              <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center`}>
                <Icon size={18} className={card.color} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>
              {card.isPercentage ? card.value : formatCurrency(card.value)}
            </p>
            <p className="text-xs text-gray-400 mt-1">This month</p>
          </div>
        );
      })}
    </div>
  );
}