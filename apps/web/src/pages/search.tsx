import React, { useState } from 'react';
import { useSearch } from '@/hooks/use-search';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';

const SearchPage: React.FC = () => {
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
          <Input id="category" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Electronics" />
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

      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} disabled={isFetching}>
          {isFetching ? 'Loading…' : 'Load more'}
        </Button>
      )}
    </div>
  );
};

export default SearchPage;
