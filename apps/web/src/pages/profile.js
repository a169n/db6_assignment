import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '@/features/auth/auth-context';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useFavorites } from '@/hooks/use-favorites';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductGridSkeleton } from '@/components/product/product-grid-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { showToast } from '@/lib/toast';
const ProfilePage = () => {
    const { user, logout, isLoading: isAuthLoading } = useAuth();
    const favorites = useFavorites(Boolean(user));
    const navigate = useNavigate();
    if (isAuthLoading) {
        return (_jsxs("div", { className: "mx-auto max-w-2xl space-y-6", children: [_jsx(Skeleton, { className: "h-8 w-1/2" }), _jsxs("div", { className: "space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900", children: [_jsx(Skeleton, { className: "h-4 w-1/3" }), _jsx(Skeleton, { className: "h-4 w-1/2" }), _jsx(Skeleton, { className: "h-10 w-24" })] }), _jsxs("div", { className: "space-y-3 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900", children: [_jsx(Skeleton, { className: "h-4 w-1/4" }), _jsx(ProductGridSkeleton, { count: 3 })] })] }));
    }
    if (!user) {
        return null;
    }
    const handleLogout = async () => {
        await logout();
        showToast('success', 'Signed out');
        navigate('/', { replace: true });
    };
    return (_jsxs("div", { className: "mx-auto max-w-2xl space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Your profile" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300", children: "Manage your preferences to steer the recommendation engine toward what you love." })] }), _jsxs("div", { className: "space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900", children: [_jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase text-slate-500", children: "Name" }), _jsx("p", { className: "text-sm font-medium text-slate-900 dark:text-slate-100", children: user.name })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase text-slate-500", children: "Email" }), _jsx("p", { className: "text-sm font-medium text-slate-900 dark:text-slate-100", children: user.email })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase text-slate-500", children: "Favourite categories" }), _jsx("p", { className: "text-sm text-slate-700 dark:text-slate-200", children: (user.prefs?.categories || ['All']).join(', ') })] }), _jsx(Button, { variant: "outline", onClick: handleLogout, children: "Log out" })] }), _jsxs("section", { className: "space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase text-slate-500", children: "Liked products" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300", children: "Heart items anywhere to see them here." })] }), _jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: _jsx(Link, { to: "/favorites", children: "View all" }) })] }), favorites.isLoading ? (_jsx(ProductGridSkeleton, { count: 3 })) : favorites.favorites.length ? (_jsx(ProductGrid, { products: favorites.favorites.slice(0, 3).map((item) => ({
                            id: item._id,
                            name: item.name,
                            slug: item.slug,
                            description: item.description,
                            price: item.price,
                            image: item.images?.[0]
                        })) })) : (_jsx("p", { className: "text-sm text-slate-500", children: "No favorites yet. Tap the heart on any product to improve recommendations." }))] })] }));
};
export default ProfilePage;
