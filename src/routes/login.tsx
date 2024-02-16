import { createFileRoute, useNavigate } from '@tanstack/react-router';
import LoginForm from '../components/auth/LoginForm';
import axiosClient from '../api';
import { useAuth } from '../auth';

import { useEffect } from 'react';

import { ACCESS_TOKEN_KEY } from '../utils/constants';

export const Login = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    console.log('test');

    useEffect(() => {
        const authMe = async () => {
            try {
                const response = await axiosClient.get('/auth/check');
                response.data.username && auth.setIsAuth(true);
            } catch (error: any) {
                console.log(error);
                throw new Error(error.message);
            }
        };
        const isAuthToken =
            !!sessionStorage.getItem(ACCESS_TOKEN_KEY) ||
            !!localStorage.getItem(ACCESS_TOKEN_KEY);

        isAuthToken && authMe();
    }, []);

    useEffect(() => {
        auth.isAuth && navigate({ to: '/' });
    }, [auth.isAuth]);

    return (
        <div className="p-2 mx-auto">
            <LoginForm />
        </div>
    );
};

export const Route = createFileRoute('/login')({
    component: Login
});
