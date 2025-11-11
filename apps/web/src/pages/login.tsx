import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth, type AuthUser } from '@/features/auth/auth-context';
import { useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/lib/toast';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { refetch } = useAuth();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await api.post<{ user: AuthUser }>('/auth/login', data);
      queryClient.setQueryData<AuthUser | null>(['auth', 'me'], response.data.user);
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      showToast('success', 'Signed in successfully');
      const redirectTo = (location.state as any)?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      showToast('error', 'Invalid credentials');
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Sign in to see fresh recommendations and track your activity.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
        <p className="text-center text-sm text-slate-500">
          No account yet?{' '}
          <Link to="/register" className="text-brand hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
