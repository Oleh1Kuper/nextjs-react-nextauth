'use client';

import React from 'react';
import Link from 'next/link';
import classes from './MainNavigation.module.css';
import { signOut, useSession } from 'next-auth/react';

const MainNavigation = () => {
  const { data: session } = useSession();

  const onLogout = () => {
    signOut();
  };

  return (
    <header className={classes.header}>
      <Link href="/">
        <div className={classes.logo}>Next Auth</div>
      </Link>

      <nav>
        <ul>
          {!session && (
            <li>
              <Link href="/auth">Login</Link>
            </li>
          )}

          {session && (
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          )}

          {session && (
            <li>
              <button type="button" onClick={onLogout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
