'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';

const AuthProvider = ({ children }) => (
  <SessionProvider>{children}</SessionProvider>
);

export default AuthProvider;
