import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { showToast } from '@/lib/toast';

export const useInteraction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, type }: { productId: string; type: 'view' | 'like' | 'purchase' }) => {
      await api.post('/interactions', { productId, type });
    },
    onSuccess: (_data, variables) => {
      if (variables.type !== 'view') {
        showToast('success', 'Interaction recorded');
      }
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
    onError: () => {
      showToast('error', 'Failed to record interaction');
    }
  });
};
