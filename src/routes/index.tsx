import { AnyRoute, createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';
import UserList from '../components/UsersList';

export const Home = () => {
    useEffect(() => {});

    return (
        <div className="p-2 mx-auto">
            <UserList />
        </div>
    );
};

export const Route = createFileRoute('/')({
    beforeLoad: ({ context }: { context: AnyRoute['types']['allContext'] }) => {
        if (!context.auth.isAuth) {
            throw redirect({
                to: '/login'
            });
        }
    },
    component: Home
});
