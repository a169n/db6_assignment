import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth } from '@/features/auth/auth-context';
import { useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/lib/toast';
const loginSchema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters')
});
const LoginPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(loginSchema) });
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const { refetch } = useAuth();
    const onSubmit = async (data) => {
        try {
            const response = await api.post('/auth/login', data);
            queryClient.setQueryData(['auth', 'me'], response.data.user);
            await refetch();
            queryClient.invalidateQueries({ queryKey: ['recommendations'] });
            showToast('success', 'Signed in successfully');
            const redirectTo = location.state?.from?.pathname || '/';
            navigate(redirectTo, { replace: true });
        }
        catch (error) {
            showToast('error', 'Invalid credentials');
        }
    };
    return (_jsxs("div", { className: "mx-auto max-w-md space-y-6", children: [_jsxs("div", { className: "space-y-2 text-center", children: [_jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Welcome back" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300", children: "Sign in to see fresh recommendations and track your activity." })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", placeholder: "you@example.com", ...register('email') }), errors.email && _jsx("p", { className: "text-sm text-red-500", children: errors.email.message })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Password" }), _jsx(Input, { id: "password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", ...register('password') }), errors.password && _jsx("p", { className: "text-sm text-red-500", children: errors.password.message })] }), _jsx(Button, { type: "submit", className: "w-full", disabled: isSubmitting, children: isSubmitting ? 'Signing in…' : 'Sign in' }), _jsxs("p", { className: "text-center text-sm text-slate-500", children: ["No account yet?", ' ', _jsx(Link, { to: "/register", className: "text-brand hover:underline", children: "Create one" })] })] })] }));
};
export default LoginPage;
