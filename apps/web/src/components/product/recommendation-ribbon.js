import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ProductCard } from './product-card';
export const RecommendationRibbon = ({ products, title }) => {
    if (!products.length)
        return null;
    return (_jsxs("section", { className: "space-y-4", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsx("h2", { className: "text-lg font-semibold text-slate-800 dark:text-slate-100", children: title }) }), _jsx("div", { className: "grid grid-flow-col auto-cols-[minmax(220px,1fr)] gap-4 overflow-x-auto pb-2", children: products.map((product) => (_jsx("div", { className: "min-w-[220px]", children: _jsx(ProductCard, { ...product, footer: _jsx("p", { className: "text-xs text-slate-500", children: product.reason }) }) }, product.id))) })] }));
};
