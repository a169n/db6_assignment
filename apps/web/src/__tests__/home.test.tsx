import { render, screen } from '@testing-library/react';
import HomePage from '@/pages/home';

vi.mock('@/features/auth/auth-context', () => ({
  useAuth: () => ({ user: null })
}));

vi.mock('@/hooks/use-products', () => ({
  useProducts: () => ({ data: { items: [] } })
}));

vi.mock('@/hooks/use-recommendations', () => ({
  useRecommendations: () => ({ data: { products: [] } })
}));

describe('HomePage', () => {
  it('renders hero message for guests', () => {
    render(<HomePage />);
    expect(screen.getByText(/Discover products tailored to you/i)).toBeInTheDocument();
  });
});
