import { Button, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from '@tanstack/react-router';
import axiosClient from '../../../api';

interface FormData {
    newPassword: string;
    confirmPassword: string;
}
const token = '...';
export const ResetPasswordForm = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>();

    const resetPassword = async (formData: FormData) => {
        try {
            const response = await axiosClient.post('/api/reset-password', {
                ...formData,
                token
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    };

    const { mutate: resetPasswordMutation, isPending: isResettingPassword } = useMutation(
        {
            mutationFn: resetPassword,
            onSuccess: (data: any) => {
                console.log('Password reset successful:', data);
                router.navigate({ to: '/login' });
            },
            onError: (error: any) => {
                console.error('Error resetting password:', error);
            }
        }
    );

    const onSubmit: SubmitHandler<FormData> = (data) => {
        resetPasswordMutation(data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center w-full max-w-sm mt-8 p-4 bg-gray-100 rounded-lg shadow-md"
        >
            <Typography variant="h5" className="mb-4">
                Reset Password
            </Typography>
            <TextField
                label="New Password"
                variant="outlined"
                type="password"
                {...register('newPassword', { required: true })}
                error={!!errors.newPassword}
                helperText={errors.newPassword ? 'New password is required' : ''}
                margin="normal"
                className="w-full mb-4"
            />
            <TextField
                label="Confirm Password"
                variant="outlined"
                type="password"
                {...register('confirmPassword', { required: true })}
                error={!!errors.confirmPassword}
                helperText={
                    errors.confirmPassword ? 'Password confirmation is required' : ''
                }
                margin="normal"
                className="w-full mb-4"
            />
            <Button
                type="submit"
                variant="contained"
                disabled={isResettingPassword}
                color="primary"
                fullWidth
                className="w-full"
            >
                {isResettingPassword ? 'Resetting...' : 'Reset Password'}
            </Button>
        </form>
    );
};

export default ResetPasswordForm;
