
import { asyncHandler } from '@/utility/asyncHandler';
import { IResponse } from '../../../common/types/global/response';
import { Instance } from '../../../interceptor/Instance';
import { Filter, Issue } from '../interface/issue.interfcae';


export const fetchFilterData = asyncHandler(async() => {   
    const response: IResponse<Filter> = await Instance.get('/issues/getfilter')
    return response;
})
export const fetchFilterResult = asyncHandler(async(query?:string) => {   
  const response: IResponse<Issue> = await Instance.get(`/issues${query}`)
  return response;
})

