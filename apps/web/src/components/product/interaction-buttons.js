import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
export const InteractionButtons = ({ liked, onToggleLike, onAddToCart }) => {
    return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: liked ? 'default' : 'outline', size: "sm", onClick: onToggleLike, "aria-pressed": liked, "aria-label": liked ? 'Remove from favorites' : 'Add to favorites', children: [_jsx(Heart, { className: "mr-2 h-4 w-4", fill: liked ? 'currentColor' : 'none' }), liked ? 'Liked' : 'Like'] }), _jsxs(Button, { size: "sm", onClick: onAddToCart, "aria-label": "Add product to cart", children: [_jsx(ShoppingCart, { className: "mr-2 h-4 w-4" }), " Add to cart"] })] }));
};
