import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '@/features/auth/auth-context';
import { useRecommendations } from '@/hooks/use-recommendations';
import { useProducts } from '@/hooks/use-products';
import { RecommendationRibbon } from '@/components/product/recommendation-ribbon';
import { RecommendationRibbonSkeleton } from '@/components/product/recommendation-ribbon-skeleton';
const HomePage = () => {
    const { user } = useAuth();
    const { data: userReco, isLoading: userRecoLoading } = useRecommendations('user', Boolean(user));
    const { data: itemReco, isLoading: itemRecoLoading } = useRecommendations('item', Boolean(user));
    const { data: catalog, isLoading: catalogLoading } = useProducts(1);
    const trending = catalog?.items.slice(0, 6).map((item) => ({
        id: item._id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        description: item.description,
        image: item.images?.[0],
        reason: 'Trending in catalog'
    }));
    return (_jsxs("div", { className: "space-y-10", children: [_jsxs("section", { className: "space-y-4", children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900 dark:text-white", children: user ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Discover products tailored to you' }), _jsx("p", { className: "text-slate-600 dark:text-slate-300", children: "Explore curated picks based on your browsing, likes, and purchases. Switch between user and item collaborative filtering to see how recommendations adapt." })] }), user ? (_jsxs("div", { className: "space-y-8", children: [userRecoLoading ? (_jsx(RecommendationRibbonSkeleton, {})) : (_jsx(RecommendationRibbon, { title: "Because people like you loved these", products: (userReco?.products || []).map((entry) => ({
                            id: entry.product._id,
                            name: entry.product.name,
                            slug: entry.product.slug,
                            price: entry.product.price,
                            description: entry.product.description,
                            image: entry.product.images?.[0],
                            reason: entry.reason
                        })) })), itemRecoLoading ? (_jsx(RecommendationRibbonSkeleton, {})) : (_jsx(RecommendationRibbon, { title: "Products similar to your favorites", products: (itemReco?.products || []).map((entry) => ({
                            id: entry.product._id,
                            name: entry.product.name,
                            slug: entry.product.slug,
                            price: entry.product.price,
                            description: entry.product.description,
                            image: entry.product.images?.[0],
                            reason: entry.reason
                        })) }))] })) : (_jsx("p", { className: "rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300", children: "Sign in to personalize recommendations. We use your interactions to recommend items using collaborative filtering and time-decayed trends." })), catalogLoading ? (_jsx(RecommendationRibbonSkeleton, {})) : (_jsx(RecommendationRibbon, { title: "Trending this week", products: trending || [] }))] }));
};
export default HomePage;
