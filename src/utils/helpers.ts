import { IAuthPayload } from '../auth';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './constants';

export const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) || 'Invalid email format';
};

export const setAuthTokens = ({
    tokens,
    isRememberMe
}: {
    tokens: IAuthPayload;
    isRememberMe?: boolean;
}) => {
    const { accessToken, refreshToken } = tokens;
    if (isRememberMe) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
};

export const clearAuthTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};
