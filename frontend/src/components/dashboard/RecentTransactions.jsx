import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

export default function RecentTransactions({ transactions = [] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>

      {!transactions.length ? (
        <p className="text-sm text-gray-400 text-center py-8">No recent transactions</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => {
            const isIncome = tx.type === 'INCOME';
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {isIncome ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {tx.description || tx.category?.name || 'Transaction'}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(tx.transactionDate)}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    isIncome ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}