import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Product } from './use-products';

export interface RecommendationResult {
  products: Array<{
    product: Product;
    score: number;
    reason: string;
  }>;
}

export const useRecommendations = (mode: 'user' | 'item' = 'user', enabled = true) => {
  return useQuery({
    queryKey: ['recommendations', mode],
    queryFn: async () => {
      const response = await api.get('/reco', { params: { mode } });
      return response.data as RecommendationResult;
    },
    enabled
  });
};
