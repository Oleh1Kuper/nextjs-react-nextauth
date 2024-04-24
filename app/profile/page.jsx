import React from 'react';
import UserProfile from '@/components/UserProfile/UserProfile';
import { getServerSession } from 'next-auth/next';
import authOptions from '../auth/authOption';
import { redirect } from 'next/navigation';

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth');
  }

  return <UserProfile />;
};

export default ProfilePage;
