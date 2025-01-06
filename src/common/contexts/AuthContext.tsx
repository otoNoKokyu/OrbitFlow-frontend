import { ReactNode, createContext, useState, useCallback } from 'react';
import { ProviderProps, User, KeyMeta } from '../types/Auth/auth';
import authService from '../../features/Authentication/service/auth.service';
import { LoginType } from '../../features/Authentication/Model/auth.model';

export const authContext = createContext<ProviderProps>({} as ProviderProps);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const existsUser = authService.getUserMeta([KeyMeta.USER, KeyMeta.TOKEN]);

    const [user, setUser] = useState<User | null>(existsUser || null);

    const userSetter = useCallback((data: Partial<User>) => {
        setUser(prev => ({ ...prev, ...data }));
    }, []);

    const { username, userId, access_token, refresh_token } = user || {};

    const login = async (data: LoginType): Promise<boolean> => {
        try {
            const response = await authService.callLogin(data);
            setUserMeta(response);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            return false;
        }
    };

    const setUserMeta = (data: User) => {
        authService.setUser(data, userSetter);
    };

    const logout = () => {
        authService.removeUserMeta([KeyMeta.TOKEN, KeyMeta.USER]);
        setUser(null);
    };
    const isUserValid = !!(username || userId);
    const isTokenValid = !!(access_token && refresh_token);

    return (
        <authContext.Provider value={{
            login,
            logout,
            setUserMeta,
            user: isUserValid ? { username, userId } : null,
            tokens: isTokenValid ? { access_token, refresh_token } : null,
        }}>
            {children}
        </authContext.Provider>
    );
}
export default AuthProvider;
