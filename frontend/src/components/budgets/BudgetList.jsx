import BudgetProgressBar from './BudgetProgressBar.jsx';
import Spinner from '../ui/Spinner.jsx';

export default function BudgetList({
  budgets = [],
  loading,
  onEdit,
  onDelete,
  emptyMessage = 'No budgets set for this month.',
  emptyHint = 'Click "Set Budget" to create your first budget.',
}) {
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
        <p className="text-gray-500">{emptyMessage}</p>
        {emptyHint && (
          <p className="text-sm text-gray-400 mt-1">{emptyHint}</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {budgets.map((budget) => (
        <BudgetProgressBar
          key={budget.id}
          budget={budget}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}