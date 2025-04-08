import { Role } from '../../common/types/Auth/auth'
import { IResponse } from '../../common/types/global/response';
import { Instance } from '../../interceptor/Instance';
import { asyncHandler } from '../../utility/asyncHandler'

const roleService = {

        fetchRoles: asyncHandler(async (): Promise<IResponse<Role[]>> => {
                const response: IResponse<Role[]> = await Instance.get('/role');
                return response;
        }),

}

export default roleService
