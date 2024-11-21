import { IUser, KeyMeta, LoginType } from '../../../common/types/Auth/auth'
import { Instance } from '../../../interceptor/Instance';

const authService = {

        callRegister: async (payload: IUser): Promise<IUser> => {
                const response = await Instance.post('/auth/signup', { ...payload, isInvited: false, assigned_role: 'ADMIN' });
                if (response.status !== 200) throw Error('http status mismatch')
                const { data } = response
                return data
        },
        callLogin: async (data: LoginType) => {
                const response = await Instance.post('/auth/signin', data);
                const tokenObj = response.data;
                return tokenObj;
        },
        verifyOtp: async ({ email, otp, type }: { otp?: number, type: 'resend' | 'verify', email: String }): Promise<boolean> => {
                console.log("hello")
                try {
                        const response = await Instance.post(`/auth/handleOtp?type=${type}`, { otp, email });
                        console.log(response)
                        if (response.status === 200) return true


                } catch (error) {
                        console.log(error)
                        return false

                }
                return false

        },
        setUser: (data: IUser, localSetterFn: (args: Partial<IUser>) => void) => {
                const { username, email, access_token, refresh_token } = data;
                switch (true) {
                        case !!(username && email):
                                localStorage.setItem(KeyMeta.USER, JSON.stringify({ username, email }));
                                localSetterFn({ username, email });
                                return;
                        case !!(access_token && refresh_token):
                                localStorage.setItem(KeyMeta.TOKEN, JSON.stringify({ access_token, refresh_token }));
                                localSetterFn({ access_token, refresh_token });
                                return;
                        default:
                                console.warn("No matching case found.");
                                return;
                }
        },
        getUserMeta: (key: KeyMeta[]) => {
                return key.reduce((data, e) => {
                    const storedItem = localStorage.getItem(e);
                    if (storedItem) return { ...data, ...JSON.parse(storedItem) };
                    return data;
                }, {});
            },
        removeUserMeta: (key: KeyMeta[])=>key.forEach(K=>localStorage.removeItem(K))
            
}

export default authService
