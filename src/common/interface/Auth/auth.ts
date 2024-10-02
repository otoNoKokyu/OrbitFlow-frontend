export type LoginType = {
    email: string;
    password: string;
}
export interface ProviderProps {
    user:  string ,
    token:  string,
    login: (data: LoginType ) => void,
    logout() :void,
}
