import React from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthHeader } from '../components/auth/AuthHeader';
import { SignupForm } from '../components/auth/SignupForm';
import { AuthVisualPanel } from '../components/auth/AuthVisualPanel';

export const Signup: React.FC = () => {
  return (
    <AuthLayout visualPanel={<AuthVisualPanel />}>
      <AuthHeader
        title="Create Your Account"
        subtitle="Start securing your Kubernetes infrastructure with intelligent attack path visibility."
      />
      <SignupForm />
    </AuthLayout>
  );
};
