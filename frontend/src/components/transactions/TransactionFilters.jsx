import { RotateCcw } from 'lucide-react';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';

export default function TransactionFilters({ filters, onChange, onReset, categories = [] }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        
        <div className="flex flex-col justify-end">
          <Input
            placeholder="Search description..."
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value, page: 0 })}
          />
        </div>

        <div className="flex flex-col justify-end">
          <Select
            value={filters.type || ''}
            onChange={(e) => onChange({ ...filters, type: e.target.value, page: 0 })}
            options={[
              { value: '', label: 'All Types' },
              { value: 'EXPENSE', label: 'Expenses' },
              { value: 'INCOME', label: 'Income' },
            ]}
          />
        </div>

        <div className="flex flex-col justify-end">
          <Select
            value={filters.categoryId || ''}
            onChange={(e) => onChange({ ...filters, categoryId: e.target.value, page: 0 })}
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
        </div>

        <div className="flex flex-col justify-end">
          <Input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => onChange({ ...filters, startDate: e.target.value, page: 0 })}
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onChange({ ...filters, endDate: e.target.value, page: 0 })}
            />
          </div>
          {/* perfectly square reset button matching the exact 38px height of the Input */}
          <button
            onClick={onReset}
            title="Reset filters"
            className="w-[38px] h-[38px] shrink-0 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RotateCcw size={16} />
          </button>
        </div>
        
      </div>
    </div>
  );
}