import { IResponse } from '../../../common/types/global/response';
import { Instance } from '../../../interceptor/Instance';
import { asyncHandler } from '../../../utility/asyncHandler'


const projectService = {
    fetchProjects: asyncHandler(async (owned_by:string): Promise<IResponse<any>> => {
        let url = `/project`
        if(owned_by) url = `/project?owned_by=${owned_by}`
        const response :IResponse<any>= await Instance.get(url);
        return response;
}),

}

export default projectService
