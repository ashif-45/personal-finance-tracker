import { Edit2, Trash2 } from 'lucide-react';
import BudgetProgressBar from './BudgetProgressBar.jsx';
import Spinner from '../ui/Spinner.jsx';

export default function BudgetList({ budgets = [], loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!budgets.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No budgets set for this month.</p>
        <p className="text-sm text-gray-400 mt-1">Click "Set Budget" to create your first budget.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {budgets.map((budget) => (
        <div key={budget.id} className="relative group">
          <BudgetProgressBar budget={budget} />
          {/* Action buttons — visible on hover */}
          <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(budget)}
              className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              title="Edit"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => onDelete(budget.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}