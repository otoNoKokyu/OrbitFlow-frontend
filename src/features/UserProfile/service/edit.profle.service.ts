import { IResponse } from "../../../common/types/global/response";
import { Instance } from "../../../interceptor/Instance";
import { EditProfileModel } from "../../../model/user-edit-model";
import { asyncHandler } from '../../../utility/asyncHandler'

const editProfileService = {
    editUserProfile: asyncHandler(async({data, userId} : {data: EditProfileModel, userId: string}): Promise<IResponse<string>> => {
        const response: IResponse<string> = await Instance.post(`/user/editUserProfile?id:${userId}`, data);
        return response
    }), 
}

export default editProfileService;