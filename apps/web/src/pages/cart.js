import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/auth-context';
import { useCart } from '@/hooks/use-cart';
import { useInteraction } from '@/hooks/use-interactions';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { showToast } from '@/lib/toast';
const CartPage = () => {
    const { user } = useAuth();
    const { items, subtotal, isLoading, updateQuantity, removeFromCart } = useCart(Boolean(user));
    const interaction = useInteraction();
    if (!user) {
        return null;
    }
    const handleQuantityChange = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        updateQuantity(productId, quantity);
    };
    const handleCheckout = () => {
        if (!items.length) {
            showToast('info', 'Add items to your cart before checking out.');
            return;
        }
        items.forEach((item) => {
            interaction.mutate({ productId: item.product._id, type: 'purchase' });
        });
        showToast('success', 'Checkout complete! Purchases recorded to refine recommendations.');
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Your cart" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300", children: "We track simulated purchases to boost collaborative filtering accuracy." })] }), isLoading ? (_jsxs("div", { className: "grid gap-6 lg:grid-cols-[2fr,1fr]", children: [_jsxs("div", { className: "space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900", children: [_jsx(Skeleton, { className: "h-24 w-full" }), _jsx(Skeleton, { className: "h-24 w-full" })] }), _jsxs("div", { className: "space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900", children: [_jsx(Skeleton, { className: "h-4 w-1/2" }), _jsx(Skeleton, { className: "h-4 w-3/4" }), _jsx(Skeleton, { className: "h-10 w-full" })] })] })) : items.length ? (_jsxs("div", { className: "grid gap-6 lg:grid-cols-[2fr,1fr]", children: [_jsx("div", { className: "space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900", children: items.map((item) => (_jsxs("div", { className: "flex flex-col gap-4 border-b border-slate-100 pb-4 last:border-b-0 dark:border-slate-800 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { className: "flex flex-1 items-center gap-4", children: [_jsx("img", { src: item.product.images?.[0] || 'https://placehold.co/64x64', alt: item.product.name, className: "h-16 w-16 rounded-md border border-slate-200 object-cover dark:border-slate-700" }), _jsxs("div", { children: [_jsx(Link, { to: `/products/${item.product.slug}`, className: "font-medium text-slate-900 dark:text-slate-100", children: item.product.name }), _jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: ["$", item.product.price.toFixed(2)] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "outline", size: "icon", onClick: () => handleQuantityChange(item.product._id, item.quantity - 1), "aria-label": "Decrease quantity", children: _jsx(Minus, { className: "h-4 w-4" }) }), _jsx("span", { className: "min-w-[2ch] text-center font-medium", children: item.quantity }), _jsx(Button, { variant: "outline", size: "icon", onClick: () => handleQuantityChange(item.product._id, item.quantity + 1), "aria-label": "Increase quantity", children: _jsx(Plus, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => removeFromCart(item.product._id), "aria-label": "Remove item", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }), _jsxs("p", { className: "w-24 text-right font-semibold text-slate-900 dark:text-slate-100", children: ["$", item.subtotal.toFixed(2)] })] }, item.product._id))) }), _jsxs("div", { className: "space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-slate-500", children: "Subtotal" }), _jsxs("span", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: ["$", subtotal.toFixed(2)] })] }), _jsx("p", { className: "text-xs text-slate-500", children: "Cart totals are simulated; checking out records a purchase interaction for each line item." }), _jsx(Button, { className: "w-full", onClick: handleCheckout, children: "Checkout" })] })] })) : (_jsxs("div", { className: "rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300", children: [_jsx("p", { className: "font-medium text-slate-800 dark:text-slate-100", children: "Your cart is empty" }), _jsx("p", { className: "text-sm", children: "Add a few favorites and simulate checkout to see recommendations react." }), _jsx("div", { className: "mt-4 flex justify-center", children: _jsx(Button, { asChild: true, children: _jsx(Link, { to: "/products", children: "Start shopping" }) }) })] }))] }));
};
export default CartPage;
