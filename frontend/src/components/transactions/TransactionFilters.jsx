import { Search, RotateCcw } from 'lucide-react';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';

export default function TransactionFilters({ filters, onChange, onReset, categories = [] }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        <div className="relative">
          <Input
            placeholder="Search description..."
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value, page: 0 })}
          />
        </div>

        <Select
          value={filters.type || ''}
          onChange={(e) => onChange({ ...filters, type: e.target.value, page: 0 })}
          options={[
            { value: '', label: 'All Types' },
            { value: 'EXPENSE', label: 'Expenses' },
            { value: 'INCOME', label: 'Income' },
          ]}
        />

        <Select
          value={filters.categoryId || ''}
          onChange={(e) => onChange({ ...filters, categoryId: e.target.value, page: 0 })}
          options={[
            { value: '', label: 'All Categories' },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />

        <Input
          type="date"
          value={filters.startDate || ''}
          onChange={(e) => onChange({ ...filters, startDate: e.target.value, page: 0 })}
        />

        <div className="flex gap-2">
          <Input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value, page: 0 })}
          />
          <Button variant="outline" onClick={onReset} title="Reset filters">
            <RotateCcw size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}