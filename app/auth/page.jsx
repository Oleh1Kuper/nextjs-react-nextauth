import React from 'react';
import AuthForm from '@/components/AuthForm/AuthForm';
import authOptions from './authOption';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const AuthPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/');
  }

  return <AuthForm />;
};

export default AuthPage;
