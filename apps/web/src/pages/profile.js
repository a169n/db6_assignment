import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '@/features/auth/auth-context';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    if (!user) {
        return null;
    }
    const handleLogout = async () => {
        await logout();
        toast.success('Signed out');
        navigate('/', { replace: true });
    };
    return (_jsxs("div", { className: "mx-auto max-w-2xl space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Your profile" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300", children: "Manage your preferences to steer the recommendation engine toward what you love." })] }), _jsxs("div", { className: "space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900", children: [_jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase text-slate-500", children: "Name" }), _jsx("p", { className: "text-sm font-medium text-slate-900 dark:text-slate-100", children: user.name })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase text-slate-500", children: "Email" }), _jsx("p", { className: "text-sm font-medium text-slate-900 dark:text-slate-100", children: user.email })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase text-slate-500", children: "Favourite categories" }), _jsx("p", { className: "text-sm text-slate-700 dark:text-slate-200", children: (user.prefs?.categories || ['All']).join(', ') })] }), _jsx(Button, { variant: "outline", onClick: handleLogout, children: "Log out" })] })] }));
};
export default ProfilePage;
