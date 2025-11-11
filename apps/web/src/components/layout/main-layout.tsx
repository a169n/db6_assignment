import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/auth-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/providers/theme-provider';
import { Sun, Moon } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/search', label: 'Search' }
];

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const cart = useCart(Boolean(user));
  const cartCount = cart.items.length;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-semibold text-brand">
            NovaShop
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition-colors hover:text-brand ${isActive ? 'text-brand' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user && (
              <>
                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    `transition-colors hover:text-brand ${isActive ? 'text-brand' : ''}`
                  }
                >
                  Favorites
                </NavLink>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `relative transition-colors hover:text-brand ${isActive ? 'text-brand' : ''}`
                  }
                >
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-1 rounded-full bg-brand/10 px-2 text-xs font-medium text-brand">{cartCount}</span>
                  )}
                </NavLink>
              </>
            )}
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">{user.name}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      void logout();
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 py-8">{children}</div>
      </main>
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        © {new Date().getFullYear()} NovaShop. Recommendations powered by collaborative filtering.
      </footer>
    </div>
  );
};
