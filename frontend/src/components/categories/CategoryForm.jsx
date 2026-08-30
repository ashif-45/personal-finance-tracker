import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  type: z.enum(['EXPENSE', 'INCOME']),
  color: z.string().regex(/^#([A-Fa-f0-9]{6})$/, 'Must be a valid hex color (e.g. #3B82F6)'),
});

const DEFAULT_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#64748B'];

export default function CategoryForm({ onSubmit, initialData = null, onCancel }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || 'EXPENSE',
      color: initialData?.color || '#3B82F6',
    },
  });

  const selectedColor = watch('color');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Category Name" placeholder="e.g. Groceries" error={errors.name?.message} {...register('name')} />
      <Select
        label="Type"
        error={errors.type?.message}
        options={[
          { value: 'EXPENSE', label: 'Expense' },
          { value: 'INCOME', label: 'Income' },
        ]}
        {...register('type')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category Color</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {DEFAULT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setValue('color', c)}
              className={`w-7 h-7 rounded-full border-2 transition-transform ${
                selectedColor === c ? 'scale-110 border-gray-900 ring-2 ring-blue-500' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <Input placeholder="#3B82F6" error={errors.color?.message} {...register('color')} />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initialData ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}