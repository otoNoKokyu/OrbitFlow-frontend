import { ReactNode, createContext, useState } from 'react';
import { ProviderProps, KeyMeta } from '../types/Auth/auth';
import authService from '../../features/Authentication/service/auth.service';
import { Login, LoginType } from '../../features/Authentication/Model/auth.model';

export const authContext = createContext<ProviderProps>({} as ProviderProps);

const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<any>(()=>authService.getUserMeta([KeyMeta.USER]));
    const [tokens, setTokens] = useState(() => authService.getUserMeta([KeyMeta.TOKEN]) as Login)

    console.log('user',user)

    const login = async (data: LoginType): Promise<boolean> => {
        try {
            const response = await authService.callLogin(data);
            handleTokens(response);
            if (response.access_token) {
                const userDetails = await authService.getMe();
                if (userDetails) setUser(userDetails)
                return true
            }
            return false;
        } catch (error) {
            console.error("Login failed", error);
            return false;
        }
    };
    const handleTokens = (data: Login) => {
        authService.persistTokens(data);
        setTokens(data)
    };
    const logout = () => {
        authService.removeUserMeta([KeyMeta.TOKEN]);
        setUser(null);
    };
    const isUserValid = !!(user?.username && user?.user_id);
    const isTokenValid = !!(tokens?.access_token && tokens?.refresh_token);

    return (
        <authContext.Provider value={{
            login,
            logout,
            user: isUserValid ? user : null,
            tokens: isTokenValid ? tokens : null
        }}>
            {children}
        </authContext.Provider>
    );
}
export default AuthProvider;
