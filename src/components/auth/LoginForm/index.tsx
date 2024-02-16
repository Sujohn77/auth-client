import React from 'react';
import { Button, TextField, Typography } from '@mui/material';

import { useMutation } from '@tanstack/react-query';

import { useForm } from 'react-hook-form';

import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import axiosClient from '../../../api';
import { IAuthPayload, useAuth } from '../../../auth';
import { flushSync } from 'react-dom';
import { setAuthTokens } from '../../../utils/helpers';

interface FormData {
    email: string;
    password: string;
    isRememberMe: boolean;
}

const LoginForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm<FormData>();
    const navigate = useNavigate();
    const auth = useAuth();

    const loginUser = async () => {
        try {
            const formData = getValues();
            const { isRememberMe, ...values } = formData;
            const response = await axiosClient.post('/auth/signIn', values);

            return response?.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    };

    const { mutate: loginMutation, isPending: isLoggingIn } = useMutation<IAuthPayload>({
        mutationFn: loginUser,
        onSuccess: (data) => {
            console.log('Login successful:', data);
            if (data.accessToken && data.refreshToken) {
                const { isRememberMe } = getValues();
                setAuthTokens({ tokens: data, isRememberMe });
                flushSync(() => {
                    auth.setIsAuth(true);
                });

                navigate({ to: '/' });
            }
        },
        onError: (error: any) => {
            console.error('Login error:', error);
        }
    });

    const handleLogin = handleSubmit(() => {
        loginMutation();
    });

    return (
        <form
            className={
                'mx-auto w-600 flex flex-col justify-center bg-indigo-200 p-4 px-6 rounded-xl'
            }
            onSubmit={handleLogin}
        >
            <Typography variant="h5" className="pb-2 border-solid border-1 text-2xl">
                Login to the site
            </Typography>

            <TextField
                {...register('email', {
                    required: 'Email is required'
                })}
                type="email"
                label="Email"
                variant="outlined"
                margin="normal"
                className="w-full mb-4"
                error={!!errors.email}
                helperText={errors.email?.message}
            />

            <TextField
                {...register('password', { required: 'Password is required' })}
                label="Password"
                variant="outlined"
                margin="normal"
                className="w-full mb-4"
                error={!!errors.password}
                helperText={errors.password?.message}
            />
            <Button
                type="submit"
                variant="contained"
                disabled={isLoggingIn}
                color="primary"
                fullWidth
            >
                <p className="font-semibold">{isLoggingIn ? 'Logging in...' : 'Login'}</p>
            </Button>
            <div className="flex justify-between border-b border-gray-400 mt-4 mb-2">
                <div className="flex items-center mb-4">
                    <input
                        id="default-checkbox"
                        type="checkbox"
                        {...register('isRememberMe')}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                        htmlFor="default-checkbox"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                        Remember me
                    </label>
                </div>
            </div>
            <Link to="/register" className="[&.active]:font-bold mx-auto">
                Register
            </Link>
        </form>
    );
};

export default LoginForm;
