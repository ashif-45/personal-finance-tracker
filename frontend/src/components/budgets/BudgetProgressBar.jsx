import ProgressBar from '../ui/ProgressBar.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function BudgetProgressBar({ budget }) {
  const {
    category,
    amount,
    spent,
    remaining,
    spentPercentage,
    alertThreshold,
  } = budget;

  const isOverBudget = spentPercentage >= 100;
  const isWarning = spentPercentage >= alertThreshold && !isOverBudget;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: category?.color || '#64748B' }}
          />
          <span className="font-semibold text-gray-900 text-sm">
            {category?.name || 'Overall Budget'}
          </span>
        </div>
        {isOverBudget && (
          <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            OVER BUDGET
          </span>
        )}
        {isWarning && (
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            WARNING
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <ProgressBar percentage={spentPercentage} className="mb-3" />

      {/* Stats Row */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Spent: <span className="font-semibold text-gray-800">{formatCurrency(spent)}</span>
        </span>
        <span>
          Budget: <span className="font-semibold text-gray-800">{formatCurrency(amount)}</span>
        </span>
      </div>
      <div className="flex items-center justify-between text-xs mt-1">
        <span
          className={`font-semibold ${
            isOverBudget ? 'text-red-600' : remaining > 0 ? 'text-emerald-600' : 'text-gray-400'
          }`}
        >
          {isOverBudget
            ? `Over by ${formatCurrency(Math.abs(remaining))}`
            : `${formatCurrency(remaining)} remaining`}
        </span>
        <span className="text-gray-400">{spentPercentage.toFixed(1)}%</span>
      </div>
    </div>
  );
}