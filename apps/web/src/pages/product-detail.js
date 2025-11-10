import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '@/hooks/use-products';
import { useInteraction } from '@/hooks/use-interactions';
import { useAuth } from '@/features/auth/auth-context';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
const ProductDetailPage = () => {
    const { slug = '' } = useParams();
    const { data: product } = useProduct(slug);
    const interaction = useInteraction();
    const { mutate } = interaction;
    const { user } = useAuth();
    useEffect(() => {
        if (product && user) {
            mutate({ productId: product._id, type: 'view' });
        }
    }, [product?._id, user, mutate]);
    if (!product) {
        return _jsx("div", { className: "py-10 text-center text-sm text-slate-500", children: "Loading product..." });
    }
    const handleAction = (type) => {
        if (!user) {
            toast.info('Sign in to record interactions.');
            return;
        }
        mutate({ productId: product._id, type });
    };
    return (_jsxs("div", { className: "grid gap-10 md:grid-cols-[2fr,1fr]", children: [_jsxs("div", { className: "space-y-6", children: [_jsx("img", { src: product.images?.[0] || 'https://placehold.co/600x400?text=Product', alt: product.name, className: "w-full rounded-lg border border-slate-200 object-cover shadow-sm dark:border-slate-800" }), _jsxs("div", { className: "space-y-4", children: [_jsx("h1", { className: "text-3xl font-semibold text-slate-900 dark:text-white", children: product.name }), _jsx("p", { className: "text-sm uppercase tracking-widest text-brand", children: product.category }), _jsxs("p", { className: "text-lg font-semibold text-slate-800 dark:text-slate-100", children: ["$", product.price.toFixed(2)] }), _jsx("p", { className: "text-slate-600 dark:text-slate-300", children: product.description })] })] }), _jsxs("aside", { className: "space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900", children: [_jsx("h2", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: "Interact" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300", children: "Likes and purchases influence both user-based and item-based recommenders. Your activity updates the matrix instantly." }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(Button, { variant: "outline", onClick: () => handleAction('like'), children: "I like this" }), _jsx(Button, { onClick: () => handleAction('purchase'), children: "Purchase" })] })] })] }));
};
export default ProductDetailPage;
