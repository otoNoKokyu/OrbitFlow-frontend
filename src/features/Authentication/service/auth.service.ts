import { IUser, LoginType } from '../../../common/types/Auth/auth'
import { Instance } from '../../../interceptor/Instance';

const authService = {

    callRegister: async (payload: IUser):Promise<IUser> => {
            const response = await Instance.post('/auth/signup', {...payload, isInvited:false, assigned_role: 'ADMIN'});
            if (response.status !== 201) throw Error('http status mismatch')
            const { data } = response
            return data            
    },
    callLogin: async (data: LoginType) => {
            const response = await Instance.post('/auth/signin', data);
            const tokenObj = response.data;
            return tokenObj;
    },
    // getUser: async (access_token: string): Promise<IUser|null> => {
    //         const meData = await Instance({
    //             url: '/auth/me',
    //             method: 'get',
    //             headers: {
    //                 'Content-Type' : 'application/json'
    //             }
    //         })
    //         return meData.data;
    // },
    verifyOtp: async (otp: number): Promise<void> => {
        await Instance.post('/auth/otp', {otp});
}

}

export default authService
