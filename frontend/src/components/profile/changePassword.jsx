import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current',
    path: ['newPassword'],
  });

export default function ChangePassword({ onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const handleFormSubmit = async (values) => {
    await onSubmit({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <Input
        label="Current Password"
        type="password"
        placeholder="••••••••"
        error={errors.currentPassword?.message}
        {...register('currentPassword')}
      />
      <Input
        label="New Password"
        type="password"
        placeholder="Minimum 6 characters"
        error={errors.newPassword?.message}
        {...register('newPassword')}
      />
      <Input
        label="Confirm New Password"
        type="password"
        placeholder="Re-enter new password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <div className="pt-2">
        <Button type="submit" loading={isSubmitting} variant="danger">
          Change Password
        </Button>
      </div>
    </form>
  );
}