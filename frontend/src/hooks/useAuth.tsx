import React, { createContext, useContext, useState, useEffect } from 'react';
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
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // switchRole is only for development preview and must work only after login
  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    if (newRole === 'seller') {
      const sellerUser: User = {
        id: 'user-ultratech',
        email: 'rajesh.verma@ultratech.com',
        full_name: 'Rajesh K. Verma',
        role: 'seller',
        company_id: 'seller-ultratech',
        company_name: 'UltraTech Cement',
        is_active: true,
        company: {
          id: 'seller-ultratech',
          company_name: 'UltraTech Cement',
          industry_type: 'Cement',
          location_name: 'Sanand Industrial Cluster, Ahmedabad, Gujarat',
          latitude: 22.9868,
          longitude: 72.3814,
        },
      };
      setUser(sellerUser);
    } else {
      const buyerUser: User = {
        id: 'user-greengrow',
        email: 'ananya.s@greengrow.in',
        full_name: 'Dr. Ananya Sengupta',
        role: 'buyer',
        company_id: 'buyer-greengrow',
        company_name: 'GreenGrow Chemicals',
        is_active: true,
        company: {
          id: 'buyer-greengrow',
          company_name: 'GreenGrow Chemicals',
          industry_type: 'Agro-Chemicals & Bio-enrichment',
          location_name: 'Kheda Agri Park, Vadodara Hub, Gujarat',
          latitude: 22.3100,
          longitude: 73.1900,
        },
      };
      setUser(buyerUser);
    }
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
