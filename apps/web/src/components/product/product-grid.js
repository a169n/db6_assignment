import { jsx as _jsx } from "react/jsx-runtime";
import { ProductCard } from './product-card';
export const ProductGrid = ({ products, onView, renderFooter }) => {
    return (_jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: products.map((product) => (_jsx(ProductCard, { ...product, onView: () => onView?.(product.id), footer: renderFooter?.(product) }, product.id))) }));
};
