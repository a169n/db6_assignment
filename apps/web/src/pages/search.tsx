import React, { useState } from 'react';
import { useSearch } from '@/hooks/use-search';
import { useCategories } from '@/hooks/use-categories';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
import { ProductGridSkeleton } from '@/components/product/product-grid-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const debouncedMin = useDebounce(minPrice, 300);
  const debouncedMax = useDebounce(maxPrice, 300);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useSearch({
    q: debouncedQuery,
    category: category || undefined,
    minPrice: debouncedMin ? Number(debouncedMin) : undefined,
    maxPrice: debouncedMax ? Number(debouncedMax) : undefined
  });
  const { data: categoryOptions = [], isLoading: categoriesLoading } = useCategories();

  const results = data?.pages.flatMap((page) => page.results) ?? [];
  const initialLoading = isLoading && results.length === 0;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Search the catalog</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Use keywords, categories, and price filters. Results are powered by MongoDB text search with cursor pagination.
        </p>
      </div>
      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-4">
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs uppercase text-slate-500" htmlFor="query">
            Keywords
          </label>
          <Input id="query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase text-slate-500" htmlFor="category">
            Category
          </label>
          {categoriesLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <option value="">All categories</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <label className="text-xs uppercase text-slate-500" htmlFor="minPrice">
              Min price
            </label>
            <Input id="minPrice" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="0" />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase text-slate-500" htmlFor="maxPrice">
              Max price
            </label>
            <Input id="maxPrice" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="500" />
          </div>
        </div>
      </div>

      {initialLoading ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {results.map((item) => (
            <ProductCard
              key={item._id}
              id={item._id}
              name={item.name}
              slug={item.slug}
              description={item.description}
              price={item.price}
              image={item.images?.[0]}
            />
          ))}
        </div>
      )}

      {hasNextPage && !initialLoading && (
        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading…' : 'Load more'}
        </Button>
      )}
    </div>
  );
};

export default SearchPage;
