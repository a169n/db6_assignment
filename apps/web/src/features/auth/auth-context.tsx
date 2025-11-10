import React, { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  prefs?: {
    categories?: string[];
  };
  isAdmin?: boolean;
}

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  refetch: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const response = await api.get('/me');
        return response.data.user as AuthUser;
      } catch (error) {
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

  return (
    <AuthContext.Provider value={{ user: data ?? null, isLoading, refetch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
