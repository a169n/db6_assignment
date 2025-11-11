import React from 'react';
import { useAuth } from '@/features/auth/auth-context';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useFavorites } from '@/hooks/use-favorites';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductGridSkeleton } from '@/components/product/product-grid-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { showToast } from '@/lib/toast';

const ProfilePage: React.FC = () => {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const favorites = useFavorites(Boolean(user));
  const navigate = useNavigate();

  if (isAuthLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-8 w-1/2" />
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <Skeleton className="h-4 w-1/4" />
          <ProductGridSkeleton count={3} />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    showToast('success', 'Signed out');
    navigate('/', { replace: true });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Your profile</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Manage your preferences to steer the recommendation engine toward what you love.
        </p>
      </div>
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-slate-500">Name</p>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Email</p>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.email}</p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Favourite categories</p>
          <p className="text-sm text-slate-700 dark:text-slate-200">
            {(user.prefs?.categories || ['All']).join(', ')}
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Log out
        </Button>
      </div>
      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-slate-500">Liked products</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Heart items anywhere to see them here.</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/favorites">View all</Link>
          </Button>
        </div>
        {favorites.isLoading ? (
          <ProductGridSkeleton count={3} />
        ) : favorites.favorites.length ? (
          <ProductGrid
            products={favorites.favorites.slice(0, 3).map((item) => ({
              id: item._id,
              name: item.name,
              slug: item.slug,
              description: item.description,
              price: item.price,
              image: item.images?.[0]
            }))}
          />
        ) : (
          <p className="text-sm text-slate-500">
            No favorites yet. Tap the heart on any product to improve recommendations.
          </p>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
