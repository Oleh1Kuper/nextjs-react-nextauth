'use client';

import React from 'react';
import classes from './ProfileForm.module.css';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfileForm = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      new_password: '',
      old_password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await axios.patch('/api/user', data);

      toast.success(result.data.message, { position: 'top-center' });
      reset();
    } catch (error) {
      toast.error(error.message, { position: 'top-center' });
    }
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={classes.control}>
        <label htmlFor="new_password">New Password</label>
        <input
          {...register('new_password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 charecters',
            },
          })}
          type="password"
          id="new_password"
        />
        {errors.new_password?.message && (
          <span>{errors.new_password.message}</span>
        )}
      </div>

      <div className={classes.control}>
        <label htmlFor="old_password">Old Password</label>
        <input
          {...register('old_password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 charecters',
            },
          })}
          type="password"
          id="old_password"
        />
        {errors.old_password?.message && (
          <span>{errors.old_password.message}</span>
        )}
      </div>

      <div className={classes.action}>
        <button type="submit">Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
