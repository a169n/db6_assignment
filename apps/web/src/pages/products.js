import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useProducts } from '@/hooks/use-products';
import { ProductGrid } from '@/components/product/product-grid';
import { InteractionButtons } from '@/components/product/interaction-buttons';
import { useInteraction } from '@/hooks/use-interactions';
import { useAuth } from '@/features/auth/auth-context';
import { useFavorites } from '@/hooks/use-favorites';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';
const ProductsPage = () => {
    const { data } = useProducts(1);
    const interaction = useInteraction();
    const { user } = useAuth();
    const favorites = useFavorites(Boolean(user));
    const cart = useCart(Boolean(user));
    const handleInteraction = async (productId, type) => {
        if (!user) {
            toast.info('Sign in to record interactions and improve recommendations.');
            return;
        }
        interaction.mutate({ productId, type });
    };
    const handleFavorite = (productId) => {
        if (!user) {
            toast.info('Sign in to save favorites.');
            return;
        }
        const alreadyFavorite = favorites.isFavorite(productId);
        favorites.toggleFavorite(productId);
        if (!alreadyFavorite) {
            interaction.mutate({ productId, type: 'like' });
        }
    };
    const handleAddToCart = (productId) => {
        if (!user) {
            toast.info('Sign in to add items to your cart.');
            return;
        }
        cart.addToCart(productId, 1);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Browse products" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300", children: "Every interaction helps tailor your feed. View, like, or purchase to refine the collaborative filtering model." })] }), _jsx(ProductGrid, { products: (data?.items || []).map((item) => ({
                    id: item._id,
                    name: item.name,
                    slug: item.slug,
                    description: item.description,
                    price: item.price,
                    image: item.images?.[0]
                })), onView: (id) => handleInteraction(id, 'view'), renderFooter: (product) => (_jsx(InteractionButtons, { liked: favorites.isFavorite(product.id), onToggleLike: () => handleFavorite(product.id), onAddToCart: () => handleAddToCart(product.id) })) })] }));
};
export default ProductsPage;
