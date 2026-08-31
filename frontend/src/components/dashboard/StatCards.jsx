import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function StatCards({ summary }) {
  if (!summary) return null;

  const cards = [
    {
      label: 'Total Income',
      value: summary.totalIncome,
      icon: TrendingUp,
      color: 'text-emerald-700',
      iconBg: 'bg-emerald-100/80',
      gradient: 'bg-gradient-to-br from-emerald-50 via-white to-green-100',
      border: 'border-emerald-200',
    },
    {
      label: 'Total Expenses',
      value: summary.totalExpenses,
      icon: TrendingDown,
      color: 'text-rose-700',
      iconBg: 'bg-rose-100/80',
      gradient: 'bg-gradient-to-br from-rose-50 via-white to-red-100',
      border: 'border-rose-200',
    },
    {
      label: 'Net Balance',
      value: summary.balance,
      icon: Wallet,
      color:
        summary.balance >= 0
          ? 'text-blue-700'
          : 'text-red-700',
      iconBg:
        summary.balance >= 0
          ? 'bg-blue-100/80'
          : 'bg-red-100/80',
      gradient:
        summary.balance >= 0
          ? 'bg-gradient-to-br from-blue-50 via-white to-cyan-100'
          : 'bg-gradient-to-br from-red-50 via-white to-orange-100',
      border:
        summary.balance >= 0
          ? 'border-blue-200'
          : 'border-red-200',
    },
    {
      label: 'Savings Rate',
      value: `${summary.savingsRate?.toFixed(1) || 0}%`,
      icon: PiggyBank,
      color: 'text-violet-700',
      iconBg: 'bg-violet-100/80',
      gradient:
        'bg-gradient-to-br from-violet-50 via-white to-purple-100',
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
            className={`
              rounded-xl
              border
              ${card.border}
              ${card.gradient}
              p-5
              shadow-xs
              hover:shadow-md
              hover:-translate-y-0.5
              transition-all
              duration-200
            `}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">
                {card.label}
              </span>

              <div
                className={`
                  w-9 h-9
                  rounded-xl
                  ${card.iconBg}
                  flex items-center justify-center
                `}
              >
                <Icon
                  size={18}
                  className={card.color}
                />
              </div>
            </div>

            <p
              className={`
                text-2xl
                font-bold
                ${card.color}
              `}
            >
              {card.isPercentage
                ? card.value
                : formatCurrency(card.value)}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              This month
            </p>
          </div>
        );
      })}
    </div>
  );
}