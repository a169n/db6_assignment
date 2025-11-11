import { jsx as _jsx } from "react/jsx-runtime";
import { ProductCardSkeleton } from './product-card-skeleton';
export const ProductGridSkeleton = ({ count = 6 }) => {
    return (_jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: Array.from({ length: count }).map((_, index) => (_jsx(ProductCardSkeleton, {}, index))) }));
};
