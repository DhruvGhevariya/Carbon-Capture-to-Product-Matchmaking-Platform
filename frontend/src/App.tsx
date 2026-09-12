import React, { useEffect } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ToastProvider } from '@/context/ToastContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { DemoModeProvider } from '@/context/DemoModeContext';
import { AppRoutes } from '@/routes';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

// Global Auth Logout Listener
const AuthLogoutListener: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthLogout = () => {
      logout();
      navigate('/login', { replace: true });
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [logout, navigate]);

  return null;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <NotificationProvider>
          <DemoModeProvider>
            <AuthProvider>
              <BrowserRouter>
                <AuthLogoutListener />
                <AppRoutes />
              </BrowserRouter>
            </AuthProvider>
          </DemoModeProvider>
        </NotificationProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
