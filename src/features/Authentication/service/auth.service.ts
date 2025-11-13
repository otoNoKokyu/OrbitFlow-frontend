import { AxiosRequestConfig } from 'axios';
import { User, KeyMeta, RoleEnum } from '../../../common/types/Auth/auth'
import { IResponse } from '../../../common/types/global/response';
import { Instance } from '../../../interceptor/Instance';
import { asyncHandler } from '../../../utility/asyncHandler'
import { Login, sendOtp, Signup, LoginType } from '../Model/auth.model';
import { isEmptyObject } from '@/utility/objectUtils';


const authService = {
        callRegister: asyncHandler(async (): Promise<IResponse<Signup>> => {
                const rawTempData = localStorage.getItem('tempRegisterData')!!
                const parsedData = JSON.parse(rawTempData)
                console.log('p', parsedData)
                const inviteId = parsedData.inviteId
                delete parsedData.inviteId
                const config: AxiosRequestConfig = {
                        url: '/auth/signUp',
                        method: 'post',
                        data: {
                                ...parsedData,
                                isInvited: false,
                                invited_by: ''
                        },
                }
                if (inviteId) {
                        delete config.data.assigned_role
                        config.headers = { id: inviteId }
                        config.data.isInvited = true
                        delete config.data.projectId;
                }
                const response: IResponse<Signup> = await Instance(config)
                if (response.statusCode === 201) localStorage.removeItem('tempRegisterData')
                return response;
        }),
        callLogin: asyncHandler<Login, LoginType>(async (data: LoginType): Promise<IResponse<Login>> => {
                const response: IResponse<Login> = await Instance.post('/auth/signin', data);
                return response;
        }),
        verifyOtp: asyncHandler(async ({ email, otp }: { otp?: number, email: String }): Promise<IResponse<string>> => {
                const response: IResponse<string> = await Instance.post(`/auth/verify`, { otp, email });
                return response;
        }),
        sendOtp: asyncHandler(async ({ email, resend = false }: { email: string, resend: boolean }): Promise<IResponse<sendOtp>> => {
                const response: IResponse<sendOtp> = await Instance.post(`/auth/sendOtp`, { resend, email })
                return response;
        }),
        forgotPassword: asyncHandler(async ( email : string ): Promise<IResponse<sendOtp>> => {
                const response: IResponse<sendOtp> = await Instance.post(`/auth/forget-password`, { email })
                return response;
        }),
        getInvitedEmail: asyncHandler(async (token: string): Promise<IResponse<{ email: string }>> => {
                console.log(1)
                const response: IResponse<{ email: string }> = await Instance.get(`/auth/getInvitedEmail?token=${token}`)
                return response;
        }),
        checkForEmptyUserState: (data: any[]) => {
                let indic = false
                data.forEach(e => {
                        if (isEmptyObject(e)) indic = true
                        return
                })
                return indic
        },
        getMe: asyncHandler(async (): Promise<IResponse<any>> => {
                const response: IResponse<any> = await Instance.get(`/user/me`)
                const { responsePayload: { data: { username, user_id } } } = response
                localStorage.setItem(KeyMeta.USER, JSON.stringify({ username, user_id }))
                return response;
        }),
        inviteUser: asyncHandler(async ({ email, pId, role }: { role: RoleEnum; pId: string; email: string }): Promise<IResponse<string>> => {
                const response: IResponse<any> = await Instance.post(`/auth/invite?roleId=${role}&pId=${pId}`, { email });
                return response;
        }),
        persistTokens: (data: Partial<User>) => {
                const { access_token, refresh_token } = data;
                localStorage.setItem(KeyMeta.TOKEN, JSON.stringify({ access_token, refresh_token }));
        },
        getUserMeta: (key: KeyMeta[]) => {
                return key.reduce((data, e) => {
                        const storedItem = localStorage.getItem(e);
                        if (storedItem) { return { ...data, ...JSON.parse(storedItem) } };
                        return data
                }, {} as Partial<User>);
        },
        removeUserMeta: (key: KeyMeta[]) => key.forEach(K => localStorage.removeItem(K))
}

export default authService
