import {
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';
import Button from '../ui/Button.jsx';
import Spinner from '../ui/Spinner.jsx';

export const PAGE_SIZE_ALL = -1;
const PAGE_SIZES = [20, 50, 100];

export default function TransactionList({
  transactions = [],
  loading,
  pageResponse,
  onPageChange,
  onPageSizeChange,
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
        <p className="text-gray-500 text-base">
          No transactions found for the current filters.
        </p>
      </div>
    );
  }

  const currentSize = pageResponse?.pageSize;

  // Detect if ALL is selected
  const isAllSelected =
    currentSize === PAGE_SIZE_ALL ||
    currentSize <= 0 ||
    (pageResponse?.totalElements > 0 &&
      currentSize >= pageResponse.totalElements &&
      !PAGE_SIZES.includes(currentSize));

  const showingFrom = isAllSelected
    ? 1
    : pageResponse.pageNumber * pageResponse.pageSize + 1;

  const showingTo = isAllSelected
    ? pageResponse.totalElements
    : Math.min(
        (pageResponse.pageNumber + 1) * pageResponse.pageSize,
        pageResponse.totalElements
      );

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
                <tr
                  key={tx.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isIncome
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-rose-50 text-rose-600'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownLeft size={18} />
                        ) : (
                          <ArrowUpRight size={18} />
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          {tx.description ||
                            tx.category?.name ||
                            'Transaction'}
                        </p>

                        <p className="text-xs text-gray-400 capitalize">
                          {tx.type.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            tx.category?.color || '#94A3B8',
                        }}
                      />

                      <span className="font-medium text-gray-700">
                        {tx.category?.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-gray-600">
                    {formatDate(tx.transactionDate)}
                  </td>

                  <td
                    className={`py-3.5 px-4 text-right font-semibold ${
                      isIncome
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {isIncome ? '+' : '-'}{' '}
                    {formatCurrency(tx.amount)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(tx)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        type="button"
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
      {pageResponse && pageResponse.totalElements > 0 && (
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              items-center
              gap-4
            "
          >
            {/* LEFT — Showing Info */}
            <div className="text-sm text-gray-600 text-center md:text-left">
              Showing{' '}
              <span className="font-medium text-gray-800">
                {showingFrom}
              </span>{' '}
              to{' '}
              <span className="font-medium text-gray-800">
                {showingTo}
              </span>{' '}
              of{' '}
              <span className="font-medium text-gray-800">
                {pageResponse.totalElements}
              </span>
            </div>

            {/* CENTER — Page Size Buttons */}
            <div className="flex items-center justify-center gap-1.5">
              {PAGE_SIZES.map((size) => {
                const active =
                  !isAllSelected && currentSize === size;

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onPageSizeChange(size)}
                    className={`
                      min-w-[40px]
                      h-9
                      px-3
                      rounded-lg
                      text-sm
                      font-medium
                      border
                      transition-all
                      duration-150
                      ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                      }
                    `}
                  >
                    {size}
                  </button>
                );
              })}

              {/* ALL */}
              <button
                type="button"
                onClick={() =>
                  onPageSizeChange(PAGE_SIZE_ALL)
                }
                className={`
                  min-w-[48px]
                  h-9
                  px-3
                  rounded-lg
                  text-sm
                  font-semibold
                  border
                  transition-all
                  duration-150
                  ${
                    isAllSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                  }
                `}
              >
                ALL
              </button>
            </div>

            {/* RIGHT — Previous / Next */}
            <div className="flex items-center justify-center md:justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={
                  isAllSelected ||
                  pageResponse.pageNumber === 0
                }
                onClick={() =>
                  onPageChange(
                    pageResponse.pageNumber - 1
                  )
                }
              >
                Previous
              </Button>

              <Button
                size="sm"
                variant="outline"
                disabled={
                  isAllSelected ||
                  pageResponse.isLast
                }
                onClick={() =>
                  onPageChange(
                    pageResponse.pageNumber + 1
                  )
                }
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
