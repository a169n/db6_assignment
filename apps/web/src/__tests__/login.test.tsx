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
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('LoginPage', () => {
  it('renders login form fields', () => {
    renderLoginPage();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });
});
