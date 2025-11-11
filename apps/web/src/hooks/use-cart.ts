import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { Product } from '@/hooks/use-products';

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

type CartAction = 'add' | 'update' | 'remove';

export const useCart = (enabled: boolean) => {
  const queryClient = useQueryClient();
  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await api.get('/me/cart');
      return response.data.items as CartItem[];
    },
    enabled
  });

  const mutation = useMutation({
    mutationFn: async ({ action, productId, quantity }: { action: CartAction; productId: string; quantity?: number }) => {
      if (action === 'add') {
        await api.post('/me/cart', { productId, quantity });
      } else if (action === 'update') {
        await api.patch(`/me/cart/${productId}`, { quantity });
      } else {
        await api.delete(`/me/cart/${productId}`);
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      const messageMap: Record<CartAction, string> = {
        add: 'Added to cart',
        update: 'Cart updated',
        remove: 'Removed from cart'
      };
      toast.success(messageMap[variables.action]);
    },
    onError: () => {
      toast.error('Unable to update cart');
    }
  });

  const items = cartQuery.data || [];
  const subtotal = items.reduce((total, item) => total + item.subtotal, 0);

  return {
    items,
    subtotal,
    isLoading: cartQuery.isLoading,
    isUpdating: mutation.isLoading,
    addToCart: (productId: string, quantity = 1) => mutation.mutate({ action: 'add', productId, quantity }),
    updateQuantity: (productId: string, quantity: number) =>
      mutation.mutate({ action: 'update', productId, quantity }),
    removeFromCart: (productId: string) => mutation.mutate({ action: 'remove', productId })
  };
};
