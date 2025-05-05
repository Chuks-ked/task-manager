import { createContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";



const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '')
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // check for existing token on app load
        const initializeAuth = async () => {
            if (accessToken) {
                try {
                    // validate token by fetching user data or a protected endpoint
                    const response = await axiosInstance.get('tasks/')
                    setUser({id:response.data[0]?.user || null})
                }
                catch (err) {
                    console.error('Token validation failed:', err)
                    logout(); //Clears invalid token
                }
            }
            setLoading(false);
        }
        initializeAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axiosInstance.post('token/', {username, password})
            const {access, refresh} = response.data
            localStorage.setItem('accessToken', access)
            localStorage.setItem('refreshToken', refresh)
            setAccessToken(access)
            setRefreshToken(refresh)
            setUser({username})
            return true;
        }
        catch (err) {
            console.error('Login in failed:', err)
            throw new Error('Invalid Credentials')
        }
    }

    const signup = async (username, email, password, bio) => {
        try {
            const response = await axiosInstance.post('register/', {username, email, password, bio})
            const userData = response.data
            setUser(userData)
            // after signing up, user have to login to get a token
            return true;
        }
        catch (err) {
            console.error('Signup failed:', err)
            throw new Error('Signup failed. Please try again')
        }
    }

    const logout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')

        setAccessToken('')
        setRefreshToken('')
        setUser(null)
    }


    const value = {
        user,
        accessToken,
        refreshToken,
        loading,
        login,
        signup,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export {AuthContext, AuthProvider}