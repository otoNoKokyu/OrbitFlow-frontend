import { IUser, LoginType } from '../../../common/interface/Auth/auth'
import axios from 'axios';

const authService = {

    callRegister: async (payload: IUser):Promise<IUser| void> => {
        try {
            const response = await axios.post('http://localhost:3000/auth/signup', {...payload, isInvited:false, assigned_role: 'ADMIN'});
            if (response.status !== 201) throw Error('http status mismatch')
            const { data } = response
            return data
        } catch (error) {
            console.error("Login failed", error);
            
        }
    },
    callLogin: async (data: LoginType) => {
        try {
            const response = await axios.post('http://localhost:3000/auth/signin', data);
            const tokenObj = response.data;
            return tokenObj;
        } catch (error) {
            console.error(error)
        }
    },
    getUser: async (access_token: string): Promise<IUser|null> => {
        try{
            const meData = await axios({
                url: 'http://localhost:3000/auth/me',
                method: 'get',
                headers: {
                    'authorization': `bearer ${access_token}`,
                    'Content-Type' : 'application/json'
                }
            })
            return meData.data;
        }catch(error){
            console.log(error)
            return null
        }


    }

}

export default authService
