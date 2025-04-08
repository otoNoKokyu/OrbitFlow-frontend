import { IResponse } from '../../../common/types/global/response';
import { Instance } from '../../../interceptor/Instance';
import { asyncHandler } from '../../../utility/asyncHandler'
import { Project } from '../Model/project.model';


const projectService = {
    fetchUserProjects: asyncHandler(async (userId:string): Promise<IResponse<Project[]>> => {
        let  url = `userProject?userId=${userId}`
        const response :IResponse<Project[]>= await Instance.get(url);
        return response;
}),

}

export default projectService
