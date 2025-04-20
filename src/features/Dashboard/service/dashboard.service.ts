
import { IResponse } from '../../../common/types/global/response';
import { Instance } from '../../../interceptor/Instance';

export const fetchUserDashboardData = async(userId:string) => {
    const response: IResponse<any> = await Instance.get(`/issues?assigneeId=${userId}`)
    return response;
}