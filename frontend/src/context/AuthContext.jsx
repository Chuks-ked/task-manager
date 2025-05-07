import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
        fetchUser();
        }
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axiosInstance.post('/token/', { username, password });
            const { access } = response.data;
            localStorage.setItem('token', access);
            axiosInstance.defaults.headers.Authorization = `Bearer ${access}`;
            await fetchUser();
            setError(null);
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axiosInstance.defaults.headers.Authorization;
        setUser(null);
        setError(null);
        // Redirect to login if using React Router
        // window.location.href = '/login';
    };

    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get('tasks/');
            setUser(response.data.results[0] || null); // Adjust based on your API response
        } catch (err) {
            setError('Failed to fetch user data.');
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ user, error, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
