import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { showToast } from '@/lib/toast';
export const useFavorites = (enabled) => {
    const queryClient = useQueryClient();
    const favoritesQuery = useQuery({
        queryKey: ['favorites'],
        queryFn: async () => {
            const response = await api.get('/me/favorites');
            return response.data.favorites;
        },
        enabled
    });
    const mutation = useMutation({
        mutationFn: async ({ productId, action }) => {
            if (action === 'add') {
                await api.post('/me/favorites', { productId });
            }
            else {
                await api.delete(`/me/favorites/${productId}`);
            }
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            queryClient.invalidateQueries({ queryKey: ['recommendations'] });
            showToast('success', variables.action === 'add' ? 'Added to favorites' : 'Removed from favorites');
        },
        onError: () => {
            showToast('error', 'Unable to update favorites');
        }
    });
    const favorites = favoritesQuery.data || [];
    const isFavorite = (productId) => favorites.some((product) => product._id === productId);
    const toggleFavorite = (productId) => {
        const action = isFavorite(productId) ? 'remove' : 'add';
        mutation.mutate({ productId, action });
    };
    return {
        favorites,
        isFavorite,
        toggleFavorite,
        isLoading: favoritesQuery.isLoading,
        isUpdating: mutation.isLoading
    };
};
