import { useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Product } from './use-products';

export const useSearch = (params: { q?: string; category?: string; minPrice?: number; maxPrice?: number }) => {
  return useInfiniteQuery({
    queryKey: ['search', params],
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const response = await api.get('/search', {
        params: {
          ...params,
          cursor: pageParam || undefined
        }
      });
      return response.data as { results: Product[]; nextCursor: string | null };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined
  });
};
