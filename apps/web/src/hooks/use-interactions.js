import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
export const useInteraction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ productId, type }) => {
            await api.post('/interactions', { productId, type });
        },
        onSuccess: () => {
            toast.success('Interaction recorded');
            queryClient.invalidateQueries({ queryKey: ['recommendations'] });
        },
        onError: () => {
            toast.error('Failed to record interaction');
        }
    });
};
