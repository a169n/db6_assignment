import { render, screen } from '@testing-library/react';
import ProductDetailPage from '@/pages/product-detail';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const product = {
  _id: '1',
  name: 'Test Product',
  slug: 'test-product',
  description: 'A product used for testing',
  price: 99,
  category: 'Testing',
  images: ['https://placehold.co/300']
};

vi.mock('@/hooks/use-products', () => ({
  useProduct: () => ({ data: product })
}));

vi.mock('@/hooks/use-interactions', () => ({
  useInteraction: () => ({ mutate: vi.fn() })
}));

vi.mock('@/features/auth/auth-context', () => ({
  useAuth: () => ({ user: { id: 'user-1', name: 'Test User' } })
}));

describe('ProductDetailPage', () => {
  it('renders product info', () => {
    render(
      <MemoryRouter initialEntries={['/products/test-product']}>
        <Routes>
          <Route path="/products/:slug" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Test Product/)).toBeInTheDocument();
    expect(screen.getByText(/A product used for testing/)).toBeInTheDocument();
  });
});
