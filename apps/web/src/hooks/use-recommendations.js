import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
export const useRecommendations = (mode = 'user', enabled = true) => {
    return useQuery({
        queryKey: ['recommendations', mode],
        queryFn: async () => {
            const response = await api.get('/reco', { params: { mode } });
            return response.data;
        },
        enabled
    });
};
