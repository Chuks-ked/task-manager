import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeAuth = async () => {
        if (accessToken) {
            axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
            try {
                const response = await axiosInstance.get('tasks/');
                if (response.data.length > 0) {
                    setUser({ id: response.data[0].user || null }); // Use first task's user as a proxy
                }
            }
            catch (err) {
                console.error('Token validation failed:', err);
                setError('Token validation failed. Continuing without authentication.');
                setUser(null); // Proceed without user if validation fails
            }
        }
        setLoading(false); // Ensure loading turns false even on error
        };

        initializeAuth();
    }, [accessToken]);

    const login = async (username, password) => {
        try {
            const response = await axiosInstance.post('token/', { username, password });
            const { access, refresh } = response.data;
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            setAccessToken(access);
            setRefreshToken(refresh);
            axiosInstance.defaults.headers.Authorization = `Bearer ${access}`;
            setUser({ username });
            setError(null);
            return true;
        } 
        catch (err) {
            console.error('Login failed:', err);
            setError('Login failed. Please check your credentials.');
            throw new Error('Invalid credentials');
        }
    };

    const signup = async (username, email, password, bio) => {
        try {
            const response = await axiosInstance.post('register/', { username, email, password, bio });
            const userData = response.data;
            setUser(userData);
            setError(null);
            return true;
        } 
        catch (err) {
            console.error('Signup failed:', err);
            setError('Signup failed. Please try again.');
            throw new Error('Signup failed. Please try again.');
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete axiosInstance.defaults.headers.Authorization;
        setAccessToken('');
        setRefreshToken('');
        setUser(null);
        setError(null);
    };

    const value = {
        user,
        accessToken,
        refreshToken,
        loading,
        error,
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{!loading ? children : <p>Loading...</p>}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
