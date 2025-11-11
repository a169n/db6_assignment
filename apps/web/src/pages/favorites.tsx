import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/auth-context';
import { useFavorites } from '@/hooks/use-favorites';
import { ProductGrid } from '@/components/product/product-grid';
import { Button } from '@/components/ui/button';
import { HeartOff } from 'lucide-react';

const FavoritesPage: React.FC = () => {
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Your favorites</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Saved items act as strong positive signals for both user-based and item-based recommenders.
        </p>
      </div>
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading favorites…</p>
      ) : products.length ? (
        <ProductGrid
          products={products}
          renderFooter={(product) => (
            <Button variant="ghost" size="sm" onClick={() => toggleFavorite(product.id)} aria-label="Remove favorite">
              Remove
            </Button>
          )}
        />
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <HeartOff className="h-8 w-8 text-slate-400" />
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-100">No favorites yet</p>
            <p className="text-sm">
              Tap the heart on any product to store it here and boost recommendations instantly.
            </p>
          </div>
          <Button asChild>
            <Link to="/products">Browse products</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
