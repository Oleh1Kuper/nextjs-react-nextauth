'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import classes from './AuthForm.module.css';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const regexEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

async function createUser(data) {
  const response = await axios.post('/api/signup', data);

  if (response.status !== 201) {
    throw new Error('Cannot create a user');
  }

  return response;
}

const AuthForm = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const onSubmit = async (data) => {
    if (isLogin) {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!result.error) {
        router.replace('/profile');
        reset();
      }

      toast.error(result.error, { position: 'top-center' });
    } else {
      try {
        const response = await createUser(data);

        const result = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (!result.error) {
          router.replace('/profile');
        }

        toast.success(response.data.message, { position: 'top-center' });
        reset();
      } catch (error) {
        toast.error(error.message, { position: 'top-center' });
      }
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: { value: regexEmail, message: 'Invalid email address' },
            })}
            type="text"
            id="email"
          />

          {errors.email?.message && <span>{errors.email.message}</span>}
        </div>

        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 charecters',
              },
            })}
            type="password"
            id="password"
          />

          {errors.password?.message && <span>{errors.password.message}</span>}
        </div>

        <div className={classes.actions}>
          <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
