import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useSearch } from '@/hooks/use-search';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const { data, fetchNextPage, hasNextPage, isFetching } = useSearch({
        q: query,
        category: category || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined
    });
    const results = data?.pages.flatMap((page) => page.results) ?? [];
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Search the catalog" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300", children: "Use keywords, categories, and price filters. Results are powered by MongoDB text search with cursor pagination." })] }), _jsxs("div", { className: "grid gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-4", children: [_jsxs("div", { className: "md:col-span-2 space-y-2", children: [_jsx("label", { className: "text-xs uppercase text-slate-500", htmlFor: "query", children: "Keywords" }), _jsx(Input, { id: "query", value: query, onChange: (event) => setQuery(event.target.value), placeholder: "Search products" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs uppercase text-slate-500", htmlFor: "category", children: "Category" }), _jsx(Input, { id: "category", value: category, onChange: (event) => setCategory(event.target.value), placeholder: "Electronics" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs uppercase text-slate-500", htmlFor: "minPrice", children: "Min price" }), _jsx(Input, { id: "minPrice", value: minPrice, onChange: (event) => setMinPrice(event.target.value), placeholder: "0" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs uppercase text-slate-500", htmlFor: "maxPrice", children: "Max price" }), _jsx(Input, { id: "maxPrice", value: maxPrice, onChange: (event) => setMaxPrice(event.target.value), placeholder: "500" })] })] })] }), _jsx("div", { className: "grid gap-6 md:grid-cols-2", children: results.map((item) => (_jsx(ProductCard, { id: item._id, name: item.name, slug: item.slug, description: item.description, price: item.price, image: item.images?.[0] }, item._id))) }), hasNextPage && (_jsx(Button, { onClick: () => fetchNextPage(), disabled: isFetching, children: isFetching ? 'Loading…' : 'Load more' }))] }));
};
export default SearchPage;
