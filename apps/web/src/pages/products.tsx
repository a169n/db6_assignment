import React from 'react';
import { useProducts } from '@/hooks/use-products';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductGridSkeleton } from '@/components/product/product-grid-skeleton';
import { InteractionButtons } from '@/components/product/interaction-buttons';
import { useInteraction } from '@/hooks/use-interactions';
import { useAuth } from '@/features/auth/auth-context';
import { useFavorites } from '@/hooks/use-favorites';
import { useCart } from '@/hooks/use-cart';
import { showToast } from '@/lib/toast';

const ProductsPage: React.FC = () => {
  const { data, isLoading } = useProducts(1);
  const interaction = useInteraction();
  const { user } = useAuth();
  const favorites = useFavorites(Boolean(user));
  const cart = useCart(Boolean(user));

  const handleInteraction = async (productId: string, type: 'view' | 'like' | 'purchase') => {
    if (!user) {
      showToast('info', 'Sign in to record interactions and improve recommendations.');
      return;
    }
    interaction.mutate({ productId, type });
  };

  const handleFavorite = (productId: string) => {
    if (!user) {
      showToast('info', 'Sign in to save favorites.');
      return;
    }
    const alreadyFavorite = favorites.isFavorite(productId);
    favorites.toggleFavorite(productId);
    if (!alreadyFavorite) {
      interaction.mutate({ productId, type: 'like' });
    }
  };

  const handleAddToCart = (productId: string) => {
    if (!user) {
      showToast('info', 'Sign in to add items to your cart.');
      return;
    }
    cart.addToCart(productId, 1);
  };

  const skeleton = <ProductGridSkeleton />;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Browse products</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Every interaction helps tailor your feed. View, like, or purchase to refine the collaborative filtering model.
        </p>
      </div>
      {isLoading ? (
        skeleton
      ) : (
        <ProductGrid
          products={(data?.items || []).map((item) => ({
            id: item._id,
            name: item.name,
            slug: item.slug,
            description: item.description,
            price: item.price,
            image: item.images?.[0]
          }))}
          onView={(id) => handleInteraction(id, 'view')}
          renderFooter={(product) => (
            <InteractionButtons
              liked={favorites.isFavorite(product.id)}
              inCart={cart.items.some((item) => item.product._id === product.id)}
              onToggleLike={() => handleFavorite(product.id)}
              onAddToCart={() => handleAddToCart(product.id)}
            />
          )}
        />
      )}
    </div>
  );
};

export default ProductsPage;
