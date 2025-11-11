import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from '@/pages/login';
vi.mock('@/features/auth/auth-context', () => ({
    useAuth: () => ({ refetch: vi.fn() })
}));
vi.mock('@/lib/api', () => ({
    default: {
        post: vi.fn(() => Promise.resolve({}))
    }
}));
const renderLoginPage = () => {
    const queryClient = new QueryClient();
    render(_jsx(QueryClientProvider, { client: queryClient, children: _jsx(MemoryRouter, { initialEntries: ['/login'], children: _jsx(LoginPage, {}) }) }));
};
describe('LoginPage', () => {
    it('renders login form fields', () => {
        renderLoginPage();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });
});
