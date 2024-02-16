import React from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { useForm, SubmitHandler } from 'react-hook-form';
import axiosClient from '../../../api';

interface FormData {
    email: string;
}

const ForgotPasswordForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>();

    const sendResetEmail = async (formData: FormData) => {
        try {
            const response = await axiosClient.post('/api/forgot-password', formData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    };

    const { mutate: sendResetEmailMutation, isPending: isSendingEmail } = useMutation({
        mutationFn: sendResetEmail,
        onSuccess: (data: any) => {
            console.log('Reset email sent:', data);
        },
        onError: (error: any) => {
            console.error('Error sending reset email:', error);
        }
    });

    const onSubmit: SubmitHandler<FormData> = (data) => {
        sendResetEmailMutation(data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center w-full max-w-sm mt-8 p-4 bg-gray-100 rounded-lg shadow-md"
        >
            <Typography variant="h5" className="mb-4">
                Forgot Password
            </Typography>
            <TextField
                label="Email"
                variant="outlined"
                {...register('email', { required: true })}
                error={!!errors.email}
                helperText={errors.email ? 'Email is required' : ''}
                margin="normal"
                className="w-full mb-4"
            />
            <Button
                type="submit"
                variant="contained"
                disabled={isSendingEmail}
                color="primary"
                fullWidth
                className="w-full"
            >
                {isSendingEmail ? 'Sending...' : 'Send Reset Email'}
            </Button>
        </form>
    );
};

export default ForgotPasswordForm;
