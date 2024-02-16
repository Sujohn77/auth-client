import { createFileRoute } from '@tanstack/react-router';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

export const ForgotPassword = () => {
    return (
        <div className="p-2 mx-auto">
            <ForgotPasswordForm />
        </div>
    );
};

export const Route = createFileRoute('/forgotPassword')({
    component: ForgotPassword
});
