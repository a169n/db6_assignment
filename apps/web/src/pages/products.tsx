import React from 'react';
import { useProducts } from '@/hooks/use-products';
import { ProductGrid } from '@/components/product/product-grid';
import { InteractionButtons } from '@/components/product/interaction-buttons';
import { useInteraction } from '@/hooks/use-interactions';
import { useAuth } from '@/features/auth/auth-context';
import { toast } from 'sonner';

const ProductsPage: React.FC = () => {
  const { data } = useProducts(1);
  const interaction = useInteraction();
  const { user } = useAuth();

  const handleInteraction = async (productId: string, type: 'view' | 'like' | 'purchase') => {
    if (!user) {
      toast.info('Sign in to record interactions and improve recommendations.');
      return;
    }
    interaction.mutate({ productId, type });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Browse products</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Every interaction helps tailor your feed. View, like, or purchase to refine the collaborative filtering model.
        </p>
      </div>
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
            onLike={() => handleInteraction(product.id, 'like')}
            onPurchase={() => handleInteraction(product.id, 'purchase')}
          />
        )}
      />
    </div>
  );
};

export default ProductsPage;
