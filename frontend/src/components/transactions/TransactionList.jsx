import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import Spinner from '../ui/Spinner.jsx';

export default function TransactionList({
  transactions = [],
  loading,
  pageResponse,
  onPageChange,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="py-16 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-base">No transactions found for the current filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/75 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Transaction</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              <th className="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {transactions.map((tx) => {
              const isIncome = tx.type === 'INCOME';
              return (
                <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}
                      >
                        {isIncome ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {tx.description || tx.category?.name || 'Transaction'}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">{tx.type.toLowerCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: tx.category?.color || '#94A3B8' }}
                      />
                      <span className="font-medium text-gray-700">{tx.category?.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">{formatDate(tx.transactionDate)}</td>
                  <td
                    className={`py-3.5 px-4 text-right font-semibold ${
                      isIncome ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(tx)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(tx.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pageResponse && pageResponse.totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
          <p>
            Showing <span className="font-medium">{pageResponse.pageNumber * pageResponse.pageSize + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min((pageResponse.pageNumber + 1) * pageResponse.pageSize, pageResponse.totalElements)}
            </span>{' '}
            of <span className="font-medium">{pageResponse.totalElements}</span> results
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pageResponse.pageNumber === 0}
              onClick={() => onPageChange(pageResponse.pageNumber - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pageResponse.isLast}
              onClick={() => onPageChange(pageResponse.pageNumber + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}