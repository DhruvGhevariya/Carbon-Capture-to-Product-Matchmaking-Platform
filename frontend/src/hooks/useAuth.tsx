import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => {
    const saved = localStorage.getItem('token');
    // Purge mock demo tokens to ensure strict authentic login/signup verification
    if (saved && (saved.startsWith('demo-') || saved === 'mock-jwt-token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
    return saved;
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken || savedToken.startsWith('demo-') || savedToken === 'mock-jwt-token') {
      return null;
    }
    const saved = localStorage.getItem('user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved) as User;
      return parsed;
    } catch {
      return null;
    }
  });

  const role: UserRole | null = user?.role ?? null;
  const isAuthenticated = Boolean(token && user);


  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const login = (newToken: string, newUser: User) => {
    queryClient.clear();
    if (!newToken.startsWith('demo-') && newToken !== 'mock-jwt-token') {
      localStorage.setItem('carbonx_demo_mode_enabled', 'false');
      localStorage.removeItem('carbonx_demo_sellers');
      localStorage.removeItem('carbonx_demo_buyers');
      localStorage.removeItem('carbonx_demo_bids');
      localStorage.removeItem('carbonx_demo_orders');
    }
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    queryClient.clear();
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.setItem('carbonx_demo_mode_enabled', 'false');
    localStorage.removeItem('carbonx_demo_sellers');
    localStorage.removeItem('carbonx_demo_buyers');
    localStorage.removeItem('carbonx_demo_bids');
    localStorage.removeItem('carbonx_demo_orders');
  };

  // switchRole toggles the role on the active authenticated user
  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    queryClient.clear();
    setUser({
      ...user,
      role: newRole,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
