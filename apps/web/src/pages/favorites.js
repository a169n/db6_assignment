import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/auth-context';
import { useFavorites } from '@/hooks/use-favorites';
import { ProductGrid } from '@/components/product/product-grid';
import { Button } from '@/components/ui/button';
import { HeartOff } from 'lucide-react';
const FavoritesPage = () => {
    const { user } = useAuth();
    const { favorites, isLoading, toggleFavorite } = useFavorites(Boolean(user));
    if (!user) {
        return null;
    }
    const products = favorites.map((item) => ({
        id: item._id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        image: item.images?.[0]
    }));
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Your favorites" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300", children: "Saved items act as strong positive signals for both user-based and item-based recommenders." })] }), isLoading ? (_jsx("p", { className: "text-sm text-slate-500", children: "Loading favorites\u2026" })) : products.length ? (_jsx(ProductGrid, { products: products, renderFooter: (product) => (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => toggleFavorite(product.id), "aria-label": "Remove favorite", children: "Remove" })) })) : (_jsxs("div", { className: "flex flex-col items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300", children: [_jsx(HeartOff, { className: "h-8 w-8 text-slate-400" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-slate-800 dark:text-slate-100", children: "No favorites yet" }), _jsx("p", { className: "text-sm", children: "Tap the heart on any product to store it here and boost recommendations instantly." })] }), _jsx(Button, { asChild: true, children: _jsx(Link, { to: "/products", children: "Browse products" }) })] }))] }));
};
export default FavoritesPage;
