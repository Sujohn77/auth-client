import axios from 'axios';
import { setAuthTokens } from '../utils/helpers';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/constants';

const axiosClient = axios.create({
    baseURL: process.env.API_URL,
    withCredentials: true
});

const refreshToken = async () => {
    try {
        const refreshToken =
            sessionStorage.getItem(REFRESH_TOKEN_KEY) ||
            localStorage.getItem(REFRESH_TOKEN_KEY);

        if (!refreshToken) return null;

        const resp = await axiosClient.get('/auth/refresh', {
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        });

        return resp.data;
    } catch (e) {
        console.log('Error', e);
    }
};

axiosClient.interceptors.request.use(
    function (config) {
        const token =
            sessionStorage.getItem(ACCESS_TOKEN_KEY) ||
            localStorage.getItem(ACCESS_TOKEN_KEY);

        if (!config.headers.Authorization) {
            config.headers.Authorization = 'Bearer ' + token;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;

        if (error?.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const data = await refreshToken();

            if (!data?.accessToken || !data?.refreshToken) return;

            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            setAuthTokens({ tokens: data });

            return axiosClient(originalRequest);
        }

        return Promise.reject(error);
    }
);
export default axiosClient;
