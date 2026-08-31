import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';

const schema = z.object({
  amount: z.coerce.number().min(1, 'Budget must be at least ₹1'),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2020).max(2100),
  categoryId: z.coerce.number().nullable().optional().or(z.literal('')),
  alertThreshold: z.coerce.number().min(10).max(100),
});

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export default function BudgetForm({ onSubmit, initialData = null, categories = [], onCancel }) {
  const now = new Date();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: initialData?.amount || '',
      month: initialData?.month || now.getMonth() + 1,
      year: initialData?.year || now.getFullYear(),
      categoryId: initialData?.category?.id || '',
      alertThreshold: initialData?.alertThreshold || 80,
    },
  });

  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');

  const handleFormSubmit = (values) => {
    onSubmit({
      ...values,
      categoryId: values.categoryId === '' || values.categoryId == null
        ? null
        : Number(values.categoryId),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Budget Amount (₹)"
        type="number"
        step="0.01"
        placeholder="e.g. 10000"
        error={errors.amount?.message}
        {...register('amount')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Month"
          options={MONTHS}
          error={errors.month?.message}
          {...register('month')}
        />
        <Input
          label="Year"
          type="number"
          error={errors.year?.message}
          {...register('year')}
        />
      </div>

      <Select
        label="Category (optional — leave empty for overall budget)"
        placeholder="All Categories (Overall)"
        options={expenseCategories.map((c) => ({ value: c.id, label: c.name }))}
        error={errors.categoryId?.message}
        {...register('categoryId')}
      />

      <Input
        label="Alert Threshold (%)"
        type="number"
        placeholder="80"
        error={errors.alertThreshold?.message}
        {...register('alertThreshold')}
      />
      <p className="text-xs text-gray-400 -mt-2">
        You'll be notified when spending reaches this percentage of your budget.
      </p>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initialData?.id ? 'Update Budget' : 'Set Budget'}
        </Button>
      </div>
    </form>
  );
}