import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { ProtectedRoute } from '@/components/routing/protected-route';
import { Toaster } from 'sonner';
const App = () => {
    return (_jsxs(AuthProvider, { children: [_jsx(MainLayout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/products", element: _jsx(ProductsPage, {}) }), _jsx(Route, { path: "/products/:slug", element: _jsx(ProductDetailPage, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { children: _jsx(ProfilePage, {}) }) }), _jsx(Route, { path: "/search", element: _jsx(SearchPage, {}) })] }) }), _jsx(Toaster, { richColors: true })] }));
};
export default App;
