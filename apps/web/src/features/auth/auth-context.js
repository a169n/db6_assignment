import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['auth', 'me'],
        queryFn: async () => {
            try {
                const response = await api.get('/me');
                return response.data.user;
            }
            catch (error) {
                return null;
            }
        },
        retry: false
    });
    const logout = async () => {
        await api.post('/auth/logout');
        queryClient.removeQueries({ queryKey: ['auth', 'me'] });
        queryClient.setQueryData(['auth', 'me'], null);
        queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    };
    return (_jsx(AuthContext.Provider, { value: { user: data ?? null, isLoading, refetch, logout }, children: children }));
};
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
