import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            authApi.getCurrentUser()
                .then(data => {
                    setUser(prev => ({ ...prev, ...data }));
                })
                .catch(() => {
                    logout();
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (identifierId, password) => {
        const data = await authApi.login(identifierId, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setToken(data.token);
        setUser(data);
        return data;
    };

    const register = async (userData) => {
        const data = await authApi.register(userData);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setToken(data.token);
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const updateEcoPoints = (points) => {
        setUser(prev => {
            if (!prev) return prev;
            const updated = { ...prev, ecoPoints: points };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        });
    };

    const getDashboardPath = (roleToTest = user?.role) => {
        switch (roleToTest) {
            case 'ROLE_CITIZEN':
                return '/citizen/dashboard';
            case 'ROLE_WORKER':
                return '/worker/dashboard';
            case 'ROLE_AUTHORITY':
                return '/authority/dashboard';
            default:
                return '/login';
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            register,
            logout,
            updateEcoPoints,
            getDashboardPath,
            isCitizen: user?.role === 'ROLE_CITIZEN',
            isWorker: user?.role === 'ROLE_WORKER',
            isAuthority: user?.role === 'ROLE_AUTHORITY'
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
