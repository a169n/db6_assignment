import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/auth-context';
import { useCart } from '@/hooks/use-cart';
import { useInteraction } from '@/hooks/use-interactions';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const CartPage: React.FC = () => {
  const { user } = useAuth();
  const { items, subtotal, isLoading, updateQuantity, removeFromCart } = useCart(Boolean(user));
  const interaction = useInteraction();

  if (!user) {
    return null;
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    updateQuantity(productId, quantity);
  };

  const handleCheckout = () => {
    if (!items.length) {
      toast.info('Add items to your cart before checking out.');
      return;
    }
    items.forEach((item) => {
      interaction.mutate({ productId: item.product._id, type: 'purchase' });
    });
    toast.success('Checkout complete! Purchases recorded to refine recommendations.');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Your cart</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          We track simulated purchases to boost collaborative filtering accuracy.
        </p>
      </div>
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading cart…</p>
      ) : items.length ? (
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            {items.map((item) => (
              <div
                key={item.product._id}
                className="flex flex-col gap-4 border-b border-slate-100 pb-4 last:border-b-0 dark:border-slate-800 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-1 items-center gap-4">
                  <img
                    src={item.product.images?.[0] || 'https://placehold.co/64x64'}
                    alt={item.product.name}
                    className="h-16 w-16 rounded-md border border-slate-200 object-cover dark:border-slate-700"
                  />
                  <div>
                    <Link to={`/products/${item.product.slug}`} className="font-medium text-slate-900 dark:text-slate-100">
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-slate-500 dark:text-slate-400">${item.product.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[2ch] text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.product._id)}
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="w-24 text-right font-semibold text-slate-900 dark:text-slate-100">
                  ${item.subtotal.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Subtotal</span>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-slate-500">
              Cart totals are simulated; checking out records a purchase interaction for each line item.
            </p>
            <Button className="w-full" onClick={handleCheckout}>
              Checkout
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <p className="font-medium text-slate-800 dark:text-slate-100">Your cart is empty</p>
          <p className="text-sm">Add a few favorites and simulate checkout to see recommendations react.</p>
          <div className="mt-4 flex justify-center">
            <Button asChild>
              <Link to="/products">Start shopping</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
