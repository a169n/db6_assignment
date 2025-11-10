import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';

interface InteractionButtonsProps {
  onLike: () => void;
  onPurchase: () => void;
}

export const InteractionButtons: React.FC<InteractionButtonsProps> = ({ onLike, onPurchase }) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onLike} aria-label="Like product">
        <Heart className="mr-2 h-4 w-4" /> Like
      </Button>
      <Button size="sm" onClick={onPurchase} aria-label="Purchase product">
        <ShoppingCart className="mr-2 h-4 w-4" /> Purchase
      </Button>
    </div>
  );
};
