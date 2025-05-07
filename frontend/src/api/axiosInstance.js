import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
    });

    // Add a request interceptor to attach the JWT token to headers
    axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        // const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;