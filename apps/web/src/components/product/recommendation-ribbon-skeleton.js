import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Skeleton } from '@/components/ui/skeleton';
import { ProductGridSkeleton } from './product-grid-skeleton';
export const RecommendationRibbonSkeleton = () => (_jsxs("section", { className: "space-y-4", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsx(Skeleton, { className: "h-5 w-48" }) }), _jsx(ProductGridSkeleton, { count: 3 })] }));
