import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/auth-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/providers/theme-provider';
import { Sun, Moon } from 'lucide-react';
const navItems = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/search', label: 'Search' }
];
export const MainLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const { theme, toggle } = useTheme();
    return (_jsxs("div", { className: "flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950", children: [_jsx("header", { className: "border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80", children: _jsxs("div", { className: "mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4", children: [_jsx(Link, { to: "/", className: "text-xl font-semibold text-brand", children: "NovaShop" }), _jsxs("nav", { className: "flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300", children: [navItems.map((item) => (_jsx(NavLink, { to: item.to, className: ({ isActive }) => `transition-colors hover:text-brand ${isActive ? 'text-brand' : ''}`, children: item.label }, item.to))), user && (_jsxs(_Fragment, { children: [_jsx(NavLink, { to: "/favorites", className: ({ isActive }) => `transition-colors hover:text-brand ${isActive ? 'text-brand' : ''}`, children: "Favorites" }), _jsx(NavLink, { to: "/cart", className: ({ isActive }) => `transition-colors hover:text-brand ${isActive ? 'text-brand' : ''}`, children: "Cart" })] }))] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: toggle, "aria-label": "Toggle theme", children: theme === 'dark' ? _jsx(Sun, { className: "h-4 w-4" }) : _jsx(Moon, { className: "h-4 w-4" }) }), user ? (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", children: user.name }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsx(DropdownMenuItem, { asChild: true, children: _jsx(Link, { to: "/profile", children: "Profile" }) }), _jsx(DropdownMenuItem, { onSelect: (event) => {
                                                        event.preventDefault();
                                                        void logout();
                                                    }, children: "Logout" })] })] })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", asChild: true, children: _jsx(Link, { to: "/login", children: "Log in" }) }), _jsx(Button, { asChild: true, children: _jsx(Link, { to: "/register", children: "Sign up" }) })] }))] })] }) }), _jsx("main", { className: "flex-1", children: _jsx("div", { className: "mx-auto w-full max-w-6xl px-6 py-8", children: children }) }), _jsxs("footer", { className: "border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900", children: ["\u00A9 ", new Date().getFullYear(), " NovaShop. Recommendations powered by collaborative filtering."] })] }));
};
