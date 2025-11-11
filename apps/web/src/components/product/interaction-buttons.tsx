import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';

interface InteractionButtonsProps {
  liked: boolean;
  inCart: boolean;
  onToggleLike: () => void;
  onAddToCart: () => void;
}

export const InteractionButtons: React.FC<InteractionButtonsProps> = ({ liked, inCart, onToggleLike, onAddToCart }) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={liked ? 'default' : 'outline'}
        size="sm"
        onClick={onToggleLike}
        aria-pressed={liked}
        aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart className="mr-2 h-4 w-4" fill={liked ? 'currentColor' : 'none'} />
        {liked ? 'Liked' : 'Like'}
      </Button>
      <Button
        size="sm"
        onClick={onAddToCart}
        aria-label={inCart ? 'Already in cart' : 'Add product to cart'}
        variant={inCart ? 'secondary' : 'default'}
        disabled={inCart}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {inCart ? 'In cart' : 'Add to cart'}
      </Button>
    </div>
  );
};
