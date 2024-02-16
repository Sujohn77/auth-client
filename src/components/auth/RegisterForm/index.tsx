import React from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axiosClient from '../../../api';
import { Link, useRouter } from '@tanstack/react-router';
import { flushSync } from 'react-dom';
import { IAuthPayload, useAuth } from '../../../auth';
import { setAuthTokens } from '../../../utils/helpers';

interface FormData {
    username: string;
    email: string;
    password: string;
}

const RegisterForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm<FormData>();
    const router = useRouter();
    const auth = useAuth();

    const registerUser = async () => {
        try {
            const values = getValues();
            const response = await axiosClient.post('/auth/signUp', values);
            return response.data;
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message);
        }
    };

    const { mutate: registerMutation, isPending: isRegistering } =
        useMutation<IAuthPayload>({
            mutationFn: registerUser,
            onSuccess: (data) => {
                console.log('Registration successful:', data);

                if (data.accessToken && data.refreshToken) {
                    setAuthTokens({ tokens: data });
                    flushSync(() => {
                        auth.setIsAuth(true);
                    });

                    router.navigate({ to: '/' });
                }
            },
            onError: (error) => {
                console.error('Registration error:', error);
            }
        });

    const onSubmit: SubmitHandler<FormData> = () => {
        registerMutation();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center w-full max-w-sm mt-8 p-4 rounded-lg  bg-indigo-200 p-4 px-6 rounded-xl"
        >
            <div className="border-solid border-b border-gray-300 w-full flex justify-center">
                <Typography variant="h5" className="pb-2 ">
                    Registration
                </Typography>
            </div>
            <TextField
                {...register('username', { required: 'Username is required' })}
                label="Username"
                variant="outlined"
                type="text"
                margin="normal"
                className="w-full mb-4"
                error={!!errors.username}
                helperText={errors.username?.message}
            />
            <TextField
                {...register('email', {
                    required: 'Email is required'
                })}
                label="Email"
                variant="outlined"
                margin="normal"
                type="email"
                className="w-full mb-4"
                error={!!errors.email}
                helperText={errors.email?.message}
            />
            <TextField
                {...register('password', { required: 'Password is required' })}
                label="Password"
                variant="outlined"
                type="password"
                margin="normal"
                className="w-full mb-4"
                error={!!errors.password}
                helperText={errors.password?.message}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isRegistering}
            >
                <p className="font-semibold">
                    {isRegistering ? 'Loading...' : 'Register'}
                </p>
            </Button>

            <Link to="/login" className="[&.active]:font-bold mx-auto mt-4">
                Back to login
            </Link>
        </form>
    );
};

export default RegisterForm;
