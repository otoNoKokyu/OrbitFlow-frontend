
import { asyncHandler } from '@/utility/asyncHandler';
import { IResponse } from '../../../common/types/global/response';
import { Instance } from '../../../interceptor/Instance';
import { Filter, Issue, IssueDetail, Comment, IssueItem } from '../interface/issue.interfcae';



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
  }),
  saveComment: asyncHandler(async (data: Comment) => {
    let url = '/comment'
    let Method = Instance.post
    if (data.id) {
      url = url + `/${data.issue_id}/${data.id}`
      Method = Instance.put
    }
    const response: IResponse<Comment> = await Method(url, data)
    return response;
  }),
  updateIssue: asyncHandler(
    async ( id: string, body: Partial<IssueItem> ) => {
      const response: IResponse<string> = await Instance.put(`/issues/${id}`, body);
      return response;
    }
  ),

  deleteComment: asyncHandler(async (id: string) => {
    const response: IResponse<Comment> = await Instance.delete(`/comment/${id}`)
    return response;
  })
}