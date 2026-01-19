import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useAdminAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = () => {
    return !!sessionStorage.getItem('adminToken');
  };

  const login = (token) => {
    sessionStorage.setItem('adminToken', token);
  };

  const logout = () => {
    sessionStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      navigate('/admin/login');
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [navigate]);

  useEffect(() => {
    // Protect admin routes
    if (location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') {
      if (!isAuthenticated()) {
        navigate('/admin/login');
      }
    }
  }, [location.pathname, navigate]);

  return { isAuthenticated, login, logout };
}
