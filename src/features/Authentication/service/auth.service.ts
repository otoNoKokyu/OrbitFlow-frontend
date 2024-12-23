import { AxiosRequestConfig } from 'axios';
import { User, KeyMeta } from '../../../common/types/Auth/auth'
import { IResponse } from '../../../common/types/global/response';
import { Instance } from '../../../interceptor/Instance';
import { asyncHandler } from '../../../utility/asyncHandler'
import { Login, sendOtp, Signup, LoginType, SignupType } from '../Model/auth.model';


const authService = {

        callRegister: asyncHandler(async (): Promise<IResponse<Signup>> => {
                const rawTempData = localStorage.getItem('tempRegisterData')!!
                const parsedData = JSON.parse(rawTempData)
                const inviteId =  parsedData.inviteId
                delete parsedData.inviteId
                const config: AxiosRequestConfig = {
                        url: '/auth/signUp',
                        method: 'post',
                        data: {
                                ...parsedData,
                                isInvited: false,
                                assigned_role: 'ADMIN',
                                invited_by: ''
                        },
                }
                if (inviteId) {
                        delete config.data.assigned_role
                        config.headers = { id: inviteId }
                }
                const response: IResponse<Signup> = await Instance(config)
                if(response.statusCode ===200) localStorage.removeItem('tempRegisterData')
                return response;
        }),

        callLogin: asyncHandler(async (data: LoginType): Promise<IResponse<Login>> => {
                const response: IResponse<Login> = await Instance.post('/auth/signin', data);
                return response
        }),
        verifyOtp: asyncHandler(async ({ email, otp }: { otp?: number, email: String }): Promise<IResponse<string>> => {
                const response: IResponse<string> = await Instance.post(`/auth/verify`, { otp, email });
                return response;
        }),
        sendOtp: asyncHandler(async ({ email,resend = false }: { email: string, resend: boolean }): Promise<IResponse<sendOtp>> => {
                console.log(email,resend)
                const response: IResponse<sendOtp> = await Instance.post(`/auth/sendOtp`, { resend, email })
                return response;
        }),
        getMe: asyncHandler(async (): Promise<IResponse<any>> => {
                const response: IResponse<any> = await Instance.get(`/auth/me`)
                return response;
        }),
        setUser: (data: Partial<User>, localSetterFn: (args: User) => void) => {
                const { username, access_token, refresh_token } = data;
                localStorage.setItem(KeyMeta.USER, JSON.stringify({ username }));
                localStorage.setItem(KeyMeta.TOKEN, JSON.stringify({ access_token, refresh_token }));
                localSetterFn({ username, access_token, refresh_token });
        },
        getUserMeta: (key: KeyMeta[]) => {
                return key.reduce((data, e) => {
                        const storedItem = localStorage.getItem(e);
                        if (storedItem) return { ...data, ...JSON.parse(storedItem) };
                        return data
                }, {} as User);
        },
        removeUserMeta: (key: KeyMeta[]) => key.forEach(K => localStorage.removeItem(K))

}

export default authService
