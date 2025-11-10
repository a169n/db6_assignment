import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

export const useProducts = (page = 1) => {
  return useQuery({
    queryKey: ['products', page],
    queryFn: async () => {
      const response = await api.get('/products', { params: { page } });
      return response.data as { items: Product[]; total: number; page: number; limit: number };
    }
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await api.get(`/products/${slug}`);
      return response.data.product as Product;
    },
    enabled: Boolean(slug)
  });
};
