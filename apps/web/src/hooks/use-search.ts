import { useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Product } from './use-products';

type SearchResponse = { results: Product[]; nextCursor: string | null };

export const useSearch = (params: { q?: string; category?: string; minPrice?: number; maxPrice?: number }) => {
  return useInfiniteQuery<SearchResponse>(
    ['search', params],
    async ({ pageParam }) => {
      const cursor = (pageParam as string | undefined) ?? undefined;
      const response = await api.get('/search', {
        params: {
          ...params,
          cursor
        }
      });
      return response.data as SearchResponse;
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor || undefined
    }
  );
};
