import { useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api';
export const useSearch = (params) => {
    return useInfiniteQuery({
        queryKey: ['search', params],
        initialPageParam: undefined,
        queryFn: async ({ pageParam }) => {
            const response = await api.get('/search', {
                params: {
                    ...params,
                    cursor: pageParam || undefined
                }
            });
            return response.data;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor || undefined
    });
};
