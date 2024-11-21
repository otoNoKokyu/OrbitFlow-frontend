import React, { ReactNode, createContext, useState } from 'react';
import { ProviderProps, LoginType, IUser, IUserMeta, KeyMeta } from '../types/Auth/auth';
import authService from '../../features/Authentication/service/auth.service';
export const authContext = createContext<ProviderProps>({} as ProviderProps);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const existsUser = authService.getUserMeta([KeyMeta.USER, KeyMeta.TOKEN]);
    const [user, setUser] = useState<Partial<IUser>>(existsUser);
    
    const userSetter = (data: any) => {
      setUser((prev) => ({ ...prev, ...data }));
    };
        const { username, email, access_token, refresh_token } = user;

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
    const setUserMeta = (data: IUser & IUserMeta) => authService.setUser(data, userSetter)

    const logout = () => {
        authService.removeUserMeta([KeyMeta.TOKEN,KeyMeta.USER])
        setUser({});
    };

    const isUserEmpty = !Object.values({username,email}).some(o => o)
    const isTokenEmpty = !Object.values({access_token,refresh_token}).some(o => o)

    return (
        <authContext.Provider value={{
            login, logout,setUserMeta,
            user:isUserEmpty?null:{username,email} ,
            tokens:isTokenEmpty?null:{access_token,refresh_token}
        }}>
            {children}
        </authContext.Provider>
    );
};

export default AuthProvider;
