import * as React from 'react';
import { IUser } from './types/entities';

export interface AuthContext {
    setIsAuth: (isAuth: boolean) => void;
    isAuth: boolean;

    setUser: (isAuth: IUser | null) => void;
    user: IUser | null;
}

export interface IAuthPayload {
    accessToken: string;
    refreshToken: string;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuth, setIsAuth] = React.useState(false);
    const [user, setUser] = React.useState<IUser | null>(null);
    return (
        <AuthContext.Provider value={{ isAuth, setIsAuth, setUser, user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
