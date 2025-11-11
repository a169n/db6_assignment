import { useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api';
export const useSearch = (params) => {
    return useInfiniteQuery(['search', params], async ({ pageParam }) => {
        const cursor = pageParam ?? undefined;
        const response = await api.get('/search', {
            params: {
                ...params,
                cursor
            }
        });
        return response.data;
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor || undefined
    });
};
