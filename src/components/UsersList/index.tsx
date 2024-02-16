import React from 'react';

import { Button, CircularProgress, Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { IUser } from '../../types/entities';
import axiosClient from '../../api';
import { useAuth } from '../../auth';
import { useRouter } from '@tanstack/react-router';
import { clearAuthTokens } from '../../utils/helpers';
import { flushSync } from 'react-dom';

type ApiUserType = Omit<IUser, 'refreshToken'>;

const UsersList: React.FC = () => {
    const router = useRouter();
    const auth = useAuth();

    const handleLogout = () => {
        flushSync(() => {
            auth.setIsAuth(false);
            clearAuthTokens();
        });
        router.navigate({ to: '/login' });
    };

    const { data, isLoading, isError } = useQuery<ApiUserType[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await axiosClient.get('/users');
            return response.data;
        },
        retry: false
    });

    if (isLoading) {
        return <CircularProgress />;
    }

    if (isError) {
        return <Typography variant="body1">Error fetching users</Typography>;
    }

    return (
        <div>
            <div className="container mx-auto">
                <Typography variant="h5" className="my-4">
                    Users
                </Typography>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {data!.map((user) => (
                            <Paper key={`user-${user.id}`} elevation={3} className="p-4">
                                <Typography variant="subtitle1">
                                    Username: {user.username}
                                </Typography>
                                <Typography variant="body1">
                                    Email: {user.email}
                                </Typography>
                            </Paper>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <div className="mt-4">
                    <Button
                        type="button"
                        onClick={handleLogout}
                        className="bg-slate-500 text-white py-2 px-4 rounded-md"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UsersList;
