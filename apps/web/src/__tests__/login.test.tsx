import { render, screen } from '@testing-library/react';
import LoginPage from '@/pages/login';

vi.mock('@/features/auth/auth-context', () => ({
  useAuth: () => ({ refetch: vi.fn() })
}));

vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({}))
  }
}));

describe('LoginPage', () => {
  it('renders login form fields', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });
});
