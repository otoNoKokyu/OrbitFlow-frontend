import React, { useEffect, useState } from 'react';
import {
  Paperclip,
  MessageSquare,
  Calendar,
  Tag,
  Clock,
  ChevronDown,
  MoreHorizontal,
  CheckSquare2,
  Plus,
  Edit3,
  Edit2,
  Edit
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import { cleanMentionMarkup, getMentionsId, isEmptyObject, readableDateConverter } from '@/utility/objectUtils';
import { creatIssue, issueService } from '../service/issue.service';
import { IssueDetail } from '../interface/issue.interfcae';
import { Mention, MentionsInput } from 'react-mentions';
import projectService from '@/features/Navigation/service/project.service';
import { OverlaySpinner } from '@/components/ui/spinner';
import Comments from './IssueView/Comments';
import { Description } from './IssueView/Description';
import { Attachments } from './IssueView/Attachments';
import CreateIssueDemo, { CreateIssueModal } from './Create';
import { Progress } from '@/components/ui/progress';
import classNames from 'classnames';
import Modal from '@/common/component/Modal';
import TimeLogEditor from './IssueView/AddTimeLog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NewSelect from '@/components/ui/NewSelect';
// import '../../../css/pages/issues.css'

// --------------- LEFT SIDE -----------------
// 


const IssueDetailLeft: React.FC<{ issue: IssueDetail, refetch: () => void }> = ({ issue, refetch }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(issue.description ?? "");
  const { data } = useFetch(projectService.fetchUsersInProjects, issue.projectId)


  const attachments = issue.attachments ?? [];
  const subtasks = issue.subtasks ?? [];
  const navigate = useNavigate();

  const deleteComment = async (id: string) => {
    await issueService.deleteComment(id);
    refetch();
  };


  return (
    <div className="space-y-6">

      {/* Description */}
      <Description description={issue.description} issueId={issue.id} refetch={refetch} />

      {/* Subtasks */}
      <section>
        <h3 className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-500" />
          Subtasks ({subtasks.length})
        </h3>

        {subtasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No subtasks.</p>
        ) : (
          <div className="space-y-2">
            {subtasks.map((sub) => (
              <Card key={sub.id}
                onClick={() => navigate(`/issues/${sub.projectIssueId}`)}
                className="p-3 hover:bg-gray-50 transition-colors rounded-xl hover:cursor-pointer ">
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <CheckSquare2 className="w-4 h-4 text-gray-600" />
                    </div>

                    <span className=" text-gray-900">
                      {sub.name}
                    </span>
                    <span className=" text-gray-500">
                      {sub.projectIssueId}
                    </span>
                  </div>

                  {sub.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={sub.assignee.profile_picture_url ?? ""} />
                        <AvatarFallback>
                          {sub.assignee.first_name?.charAt(0) ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">
                        {sub.assignee.first_name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">Unassigned</span>
                  )}

                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Attachments */}
      <Attachments id={issue.id} refecth={refetch} saveFn={issueService.updateIssue} savedAttachments={issue.attachments!} />

      <Separator />

      {/* Comments */}
      <Comments
        comments={issue.comments}
        data={data}
        issueId={issue.id}
        refetch={refetch}
      />
    </div>
  );
};


// --------------- RIGHT SIDE --------------------
const IssueDetailRight: React.FC<{ issue: IssueDetail, updateData: (data: Partial<IssueDetail>) => void, refetch: () => void }> = ({ issue, updateData, refetch }) => {

  const project = issue?.project?.name
  const { data } = useFetch(projectService.fetchUsersInProjects, issue.projectId)

  const transformedData = [
    { id: "Unassigned", display: "Unassigned" },
    ...(data?.map((e) => ({
      id: e.userId,
      display: `${e.first_name} ${e.last_name}`,
    })) ?? [])
  ];
  const assignee = issue.assignee?.user_id ?? "";
  const reporter = issue.reporter?.user_id ?? "";
  const updateRepandAssignee = async (
    obj: Partial<Pick<IssueDetail, 'assigneeId' | 'reporterId'>>
  ) => {
    await updateData(obj)
    refetch()
  }
  const [openTimelog, setOpenTimelog] = useState(false);


  return (
    <div className="space-y-4">

      {/* Priority */}
      <span >Change Priority</span>
      <NewSelect
        placeholder="Priority"
        values={[
          { id: '1', value: 'High' },
          { id: '2', value: 'Medium' },
          { id: '3', value: 'Low' }
        ]}
        value={issue.priority}
        containerClassName="bg-gray-100 max-w-[130px] text-gray-700 font-medium my-3"
        triggerClassName="border-0"
        onValueChange={(e) => updateData({ priority: e.value })}
      />
      {/* Status */}
      <span >Change Status</span>

      <NewSelect
        placeholder="Status"
        values={[
          { id: '1', value: 'To Do' },
          { id: '2', value: 'In Progress' },
          { id: '3', value: 'Done' }
        ]}
        option="status"
        value={issue.status}
        containerClassName="bg-gray-100 max-w-[130px] text-gray-700 font-medium my-3"
        triggerClassName="border-0"
        onValueChange={(e) => updateData({ status: e.value })}
      />

      <Separator />

      {/* Assignee */}
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">
          Assignee
        </label>
        <Select onValueChange={(v) => {
          updateRepandAssignee({assigneeId:v})
        }} value={assignee}>
          <SelectTrigger className={`py-6  border-0 shadow-none hover:bg-gray-100  bg-transparent px-3 text-md mt-1 w-[250px] py-6 px-3 !text-md`}>
            <SelectValue placeholder="Unassigned" />
          </SelectTrigger>
          <SelectContent>
            {transformedData.map((val) => (
              <SelectItem className='m-1 text-lg hover:bg-gray-100' key={val.id} value={val.id}>
                <Avatar className="w-8 h-8 bg-gray-200">
                  <AvatarFallback>{val.display[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-900">{val.display}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>

      {/* Reporter */}
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">
          Reporter
        </label>
        <Select onValueChange={(v)=>updateRepandAssignee({reporterId:v})} value={reporter}>
          <SelectTrigger className={`py-6  border-0 shadow-none hover:bg-gray-100  bg-transparent px-3 text-md mt-1 w-[250px] py-6 px-3 !text-md`}>
            <SelectValue placeholder="Unassigned" />
          </SelectTrigger>
          <SelectContent>
            {transformedData.map((val) => (
              <SelectItem className='m-1 text-lg hover:bg-gray-100' key={val.id} value={val.id}>
                <Avatar className="w-8 h-8 bg-gray-200">
                  <AvatarFallback>{val.display[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-900">{val.display}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />
      <span className='text-md font-medium flex items-center'>
        Time tracking
        <Button variant={'ghost'} size={'sm'} className='ml-3 hover:cursor-pointer' onClick={() => setOpenTimelog(true)}>
          <Edit />
        </Button>

      </span>

      <div>
        Estimated time
        <span>
          <Progress
            className={classNames("w-2/3 h-[15px] rounded-sm border bg-white", issue.estimate! > 0 && 'bg-green-600 [&>div]:bg-green-600')}
            value={issue.estimate! > 0 ? 100 : 0} />
          {issue.estimate ?? 0} hours
        </span>
      </div>
      <div className="mt-3 space-y-2 w-2/3">
        <span className="font-medium text-sm">Logged time</span>

        <Progress
          value={(issue?.loggedTime! / issue.estimate!) * 100}
          className="w-full h-[15px] bg-white rounded-sm border [&>div]:bg-blue-600 cursor-pointer"
        />
        {issue?.loggedTime! ?? 0} hours
      </div>



      <Separator />

      {/* Labels */}
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">
          Project
        </label>

        <div className="flex flex-wrap gap-2">
          <Badge className="text-sm ">
            {project}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Dates */}
      <div className="space-y-3">
        <span className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="w-4 h-4" />
          Created: {readableDateConverter(issue.createdAt)}
        </span>

        <span class-name="flex items-center gap-2 text-xs text-gray-600">
          <Clock className="w-4 h-4" />
          Updated: {readableDateConverter(issue.updatedAt)}
        </span>
      </div>
      <TimeLogEditor
        onClose={() => setOpenTimelog(false)}
        onSubmit={(estimate, logged) => updateData({ estimate, loggedTime: logged })}
        open={openTimelog}
        defaultEstimate={issue.estimate!}
        defaultLogged={issue.loggedTime!}
      />
    </div>
  );
};



// --------------- MAIN COMPONENT --------------------
const IssueDetailS: React.FC = () => {
  const { id } = useParams();
  const { data: issue, loading, refetch } = useFetch(issueService.fetchIssueByProjectIssueId, id);
  const [showCreateIssue, setShowCreateIssue] = useState(false);
  const [updateBody, setUpdateBody] = useState<Partial<IssueDetail> | null>(null);

  const handleUpdate = (body: Partial<IssueDetail>) => setUpdateBody(body)


  useEffect(() => {
    if (!updateBody) return;

    const run = async () => {
      await issueService.updateIssue(issue.id, updateBody);
      await refetch();
      setUpdateBody(null);
    };

    run();
  }, [updateBody]);

  if (loading && !issue) return null;

  const handleSubmit = async (formData: FormData) => {
    await creatIssue(formData);
    await refetch()
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">

      <div className="border-b bg-white px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
          <span>{id}</span>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">
          {issue?.name ?? "Untitled Issue"}
        </h1>
        {issue?.type !== 'subtask' && (
          <Button
            onClick={() => setShowCreateIssue(true)}
            className='hover:cursor-pointer' variant={'outline'}>
            <Plus />
          </Button>)}
      </div>


      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        <div className="lg:col-span-2 overflow-y-auto">
          <div className="p-6">
            <IssueDetailLeft issue={issue!} refetch={refetch} />
          </div>
        </div>

        <div className="lg:col-span-1 border-l bg-white overflow-y-auto">
          <div className="p-6">
            <IssueDetailRight refetch={refetch} issue={issue!} updateData={handleUpdate} />
          </div>
        </div>
      </div>
      <CreateIssueModal
        onClose={() => setShowCreateIssue(false)}
        onSubmit={handleSubmit}
        open={showCreateIssue}
        projectId={issue?.projectId}
        parentId={issue?.id}
      />
    </div>
  );
};

export default IssueDetailS;
