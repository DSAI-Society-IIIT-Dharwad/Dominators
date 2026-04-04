import React from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthHeader } from '../components/auth/AuthHeader';
import { LoginForm } from '../components/auth/LoginForm';
import { AuthVisualPanel } from '../components/auth/AuthVisualPanel';

export const Login: React.FC = () => {
  return (
    <AuthLayout visualPanel={<AuthVisualPanel />}>
      <AuthHeader
        title="Welcome Back"
        subtitle="Sign in to access your Kubernetes security intelligence dashboard."
      />
      <LoginForm />
    </AuthLayout>
  );
};
