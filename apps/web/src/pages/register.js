import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useAuth } from '@/features/auth/auth-context';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
const registerSchema = z
    .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Include an uppercase letter')
        .regex(/[0-9]/, 'Include a number'),
    confirmPassword: z.string()
})
    .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match'
});
const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(registerSchema) });
    const { refetch } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        try {
            await api.post('/auth/register', {
                name: data.name,
                email: data.email,
                password: data.password
            });
            await refetch();
            queryClient.invalidateQueries({ queryKey: ['recommendations'] });
            toast.success('Account created! Welcome to NovaShop');
            navigate('/', { replace: true });
        }
        catch (error) {
            toast.error('Could not create account');
        }
    };
    return (_jsxs("div", { className: "mx-auto max-w-md space-y-6", children: [_jsxs("div", { className: "space-y-2 text-center", children: [_jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Create an account" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300", children: "Tell us about your preferences to fine-tune recommendations instantly." })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "name", children: "Name" }), _jsx(Input, { id: "name", placeholder: "Alex Morgan", ...register('name') }), errors.name && _jsx("p", { className: "text-sm text-red-500", children: errors.name.message })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", placeholder: "you@example.com", ...register('email') }), errors.email && _jsx("p", { className: "text-sm text-red-500", children: errors.email.message })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Password" }), _jsx(Input, { id: "password", type: "password", placeholder: "Strong password", ...register('password') }), errors.password && _jsx("p", { className: "text-sm text-red-500", children: errors.password.message })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "confirmPassword", children: "Confirm password" }), _jsx(Input, { id: "confirmPassword", type: "password", placeholder: "Repeat password", ...register('confirmPassword') }), errors.confirmPassword && _jsx("p", { className: "text-sm text-red-500", children: errors.confirmPassword.message })] }), _jsx(Button, { type: "submit", className: "w-full", disabled: isSubmitting, children: isSubmitting ? 'Creating account…' : 'Create account' })] })] }));
};
export default RegisterPage;
