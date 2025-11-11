import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { AuthProvider } from '@/features/auth/auth-context';
import HomePage from '@/pages/home';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/register';
import ProductsPage from '@/pages/products';
import ProductDetailPage from '@/pages/product-detail';
import ProfilePage from '@/pages/profile';
import SearchPage from '@/pages/search';
import FavoritesPage from '@/pages/favorites';
import CartPage from '@/pages/cart';
import { ProtectedRoute } from '@/components/routing/protected-route';
import { Toaster } from 'sonner';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MainLayout>
      <Toaster richColors />
    </AuthProvider>
  );
};

export default App;
