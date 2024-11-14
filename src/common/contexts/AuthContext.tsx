import React, { ReactNode, createContext, useState } from 'react';
import { ProviderProps, LoginType, IUser } from '../types/Auth/auth';
import authService from '../../features/Authentication/service/auth.service';
export const authContext = createContext<ProviderProps>({} as ProviderProps);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const existsUser = localStorage.getItem('me') ? JSON.parse(localStorage.getItem('me') || '{}') : null;
    const [user, setUser] = useState(existsUser);
    const [tokens, setTokens] = useState(localStorage.getItem('toekns') ? JSON.parse(localStorage.getItem('tokens') || '{}') : null)

    const login = async (data: LoginType): Promise<boolean> => {
        try {
            const tokens = await authService.callLogin(data)
            setUserMeta(tokens)
            return true
        } catch (error) {
            console.error("Login failed", error);
            return false
        }
    };
    const setUserMeta = (data: IUser) => {
        const { username, email, access_token, refresh_token } = data
        if (username && email) {
            localStorage.setItem('me', JSON.stringify({ username, email }))
            setUser({ username, email })
        }
        if (access_token && refresh_token) {
            localStorage.setItem('tokens', JSON.stringify({ access_token, refresh_token }))
            setTokens({ access_token, refresh_token })
        }

    }

    const logout = () => {
        localStorage.removeItem('me');
        localStorage.removeItem('tokens');
        setUser(null);
        setTokens(null);
    };

    return (
        <authContext.Provider value={{
            login, logout,
            user, tokens, setUserMeta
        }}>
            {children}
        </authContext.Provider>
    );
};

export default AuthProvider;
