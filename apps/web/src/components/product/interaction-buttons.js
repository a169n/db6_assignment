import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
export const InteractionButtons = ({ onLike, onPurchase }) => {
    return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: onLike, "aria-label": "Like product", children: [_jsx(Heart, { className: "mr-2 h-4 w-4" }), " Like"] }), _jsxs(Button, { size: "sm", onClick: onPurchase, "aria-label": "Purchase product", children: [_jsx(ShoppingCart, { className: "mr-2 h-4 w-4" }), " Purchase"] })] }));
};
