import { createFileRoute } from '@tanstack/react-router';
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
    return (
        <div className="p-2">
            <RegisterForm />
        </div>
    );
};

export const Route = createFileRoute('/register')({
    component: Register
});
