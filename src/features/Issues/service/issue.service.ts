
import { asyncHandler } from '@/utility/asyncHandler';
import { IResponse } from '../../../common/types/global/response';
import { Instance } from '../../../interceptor/Instance';
import { Filter, Issue, IssueDetail } from '../interface/issue.interfcae';


export const fetchFilterData = asyncHandler(async () => {
  const response: IResponse<Filter> = await Instance.get('/issues/getfilter')
  return response;
})
export const fetchFilterResult = asyncHandler(async (query?: string) => {
  const response: IResponse<Issue> = await Instance.get(`/issues${query}`)
  return response;
})

export const creatIssue = asyncHandler(async (body: any) => {
  const response: IResponse<Issue> = await Instance.post("/issues", body, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
})


export const issueService = {
  fetchIssueByProjectIssueId: asyncHandler(async (projIssueId: string) => {
    const response: IResponse<IssueDetail> = await Instance.get(`/issues/${projIssueId}`)
    return response;
  })
}