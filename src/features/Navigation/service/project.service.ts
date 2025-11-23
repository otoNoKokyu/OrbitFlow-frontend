import { IResponse } from '../../../common/types/global/response';
import { Instance } from '../../../interceptor/Instance';
import { asyncHandler } from '../../../utility/asyncHandler'
import { UserProject } from '../Model/project.model';


const projectService = {
    fetchUserProjects: asyncHandler(async (): Promise<IResponse<UserProject[]>> => {
        let url = 'userProject'
        const response: IResponse<UserProject[]> = await Instance.get(url);
        return response;
    }),
    fetchUsersInProjects: asyncHandler(async (projectId:string): Promise<IResponse<UserProject[]>> => {
        let url = `userProject/users?projectId=${projectId}`
        const response: IResponse<UserProject[]> = await Instance.get(url);
        return response;
    }),

}

export default projectService
