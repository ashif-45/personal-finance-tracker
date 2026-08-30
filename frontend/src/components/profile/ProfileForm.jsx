import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format'),
  phone: z.string().max(15, 'Phone must not exceed 15 characters').optional().or(z.literal('')),
  currency: z.string().length(3, 'Must be a 3-letter code'),
});

const CURRENCIES = [
  { value: 'INR', label: '🇮🇳 INR - Indian Rupee' },
  { value: 'USD', label: '🇺🇸 USD - US Dollar' },
  { value: 'EUR', label: '🇪🇺 EUR - Euro' },
  { value: 'GBP', label: '🇬🇧 GBP - British Pound' },
  { value: 'JPY', label: '🇯🇵 JPY - Japanese Yen' },
  { value: 'CAD', label: '🇨🇦 CAD - Canadian Dollar' },
  { value: 'AUD', label: '🇦🇺 AUD - Australian Dollar' },
];

export default function ProfileForm({ profile, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      currency: 'INR',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        currency: profile.currency || 'INR',
      });
    }
  }, [profile, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Full Name"
        placeholder="John Doe"
        error={errors.fullName?.message}
        {...register('fullName')}
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Phone Number"
        placeholder="+91 9876543210"
        error={errors.phone?.message}
        {...register('phone')}
      />
      <Select
        label="Preferred Currency"
        options={CURRENCIES}
        error={errors.currency?.message}
        {...register('currency')}
      />

      <div className="pt-2">
        <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}