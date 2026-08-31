import { Edit2, Trash2 } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function BudgetProgressBar({ budget, onEdit, onDelete }) {
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
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs hover:shadow-sm transition-shadow relative group">
      
      {/* Header - added pr-16 so text never stretches under absolute buttons */}
      <div className="flex items-start justify-between mb-3 pr-16 min-h-[24px]">
        <div className="flex items-center flex-wrap gap-2">
          <span
            className="w-3 h-3 rounded-full shrink-0 mt-0.5"
            style={{ backgroundColor: category?.color || '#64748B' }}
          />
          <span className="font-semibold text-gray-900 text-sm">
            {category?.name || 'Overall Budget'}
          </span>
          {/* Badges sit right next to the title */}
          {isOverBudget && (
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
              OVER BUDGET
            </span>
          )}
          {isWarning && (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              WARNING
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons - Always positioned top-right nicely out of the way */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-xs px-1 rounded-lg">
        <button
          onClick={() => onEdit(budget)}
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          title="Edit"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={() => onDelete(budget.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
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
        <span className="text-gray-400 font-medium">{spentPercentage.toFixed(1)}%</span>
      </div>
    </div>
  );
}