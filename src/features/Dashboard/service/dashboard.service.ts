
import { asyncHandler } from '@/utility/asyncHandler';
import { IResponse } from '../../../common/types/global/response';
import { Instance } from '../../../interceptor/Instance';
import { Issue } from '@/features/Issues/interface/issue.interfcae';

export const fetchUserDashboardData = asyncHandler(async(userId:string) => {
    const response: IResponse<Issue> = await Instance.get(`/issues?assigneeId=${userId}`)
    return response;
})