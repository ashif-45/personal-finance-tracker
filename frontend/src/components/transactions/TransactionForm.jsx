import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';

const schema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  type: z.enum(['EXPENSE', 'INCOME']),
  categoryId: z.coerce.number().min(1, 'Category is required'),
  transactionDate: z.string().min(1, 'Date is required'),
  description: z.string().max(255).optional(),
});

export default function TransactionForm({ onSubmit, initialData = null, categories = [], onCancel }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: initialData?.amount || '',
      type: initialData?.type || 'EXPENSE',
      categoryId: initialData?.category?.id || '',
      transactionDate: initialData?.transactionDate || new Date().toISOString().split('T')[0],
      description: initialData?.description || '',
    },
  });

  const selectedType = watch('type');

  // Filter categories matching selected transaction type
  const filteredCategories = categories.filter((c) => c.type === selectedType);

  useEffect(() => {
    // Reset category selection when switching transaction type if current doesn't match
    if (initialData && initialData.type === selectedType && initialData.category?.id) {
      setValue('categoryId', initialData.category.id);
    } else if (filteredCategories.length > 0) {
      setValue('categoryId', filteredCategories[0].id);
    }
  }, [selectedType]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Transaction Type"
          options={[
            { value: 'EXPENSE', label: 'Expense' },
            { value: 'INCOME', label: 'Income' },
          ]}
          error={errors.type?.message}
          {...register('type')}
        />
        <Input
          label="Amount (₹)"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.amount?.message}
          {...register('amount')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Category"
          placeholder="Select category"
          options={filteredCategories.map((c) => ({ value: c.id, label: c.name }))}
          error={errors.categoryId?.message}
          {...register('categoryId')}
        />
        <Input
          label="Date"
          type="date"
          error={errors.transactionDate?.message}
          {...register('transactionDate')}
        />
      </div>

      <Input
        label="Description (Optional)"
        placeholder="e.g. Grocery shopping at DMart"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initialData ? 'Update Transaction' : 'Save Transaction'}
        </Button>
      </div>
    </form>
  );
}