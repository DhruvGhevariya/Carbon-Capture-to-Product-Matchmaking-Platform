import React, { useEffect } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Sign In • CarbonX B2B CCUS Platform';
  }, []);

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
