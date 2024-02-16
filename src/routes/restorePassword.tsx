import { createFileRoute } from '@tanstack/react-router';

import ResetPasswordForm from '../components/auth/ResetPasswordForm';

export const ForgotPassword = () => {
    return (
        <div className="p-2 mx-auto">
            <ResetPasswordForm />
        </div>
    );
};

export const Route = createFileRoute('/restorePassword')({
    component: ForgotPassword
});
