import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
export const useProducts = (page = 1) => {
    return useQuery({
        queryKey: ['products', page],
        queryFn: async () => {
            const response = await api.get('/products', { params: { page } });
            return response.data;
        }
    });
};
export const useProduct = (slug) => {
    return useQuery({
        queryKey: ['product', slug],
        queryFn: async () => {
            const response = await api.get(`/products/${slug}`);
            return response.data.product;
        },
        enabled: Boolean(slug)
    });
};
