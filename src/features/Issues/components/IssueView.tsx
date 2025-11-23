import React, { useState } from 'react';
import {
  Paperclip,
  MessageSquare,
  Calendar,
  Tag,
  Clock,
  ChevronDown,
  MoreHorizontal,
  CheckSquare2
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import { cleanMentionMarkup, getMentionsId, isEmptyObject, readableDateConverter } from '@/utility/objectUtils';
import { issueService } from '../service/issue.service';
import { IssueDetail } from '../interface/issue.interfcae';
import { Mention, MentionsInput } from 'react-mentions';
import projectService from '@/features/Navigation/service/project.service';
import { OverlaySpinner } from '@/components/ui/spinner';
import Comments from './IssueView/Comments';
import { Description } from './IssueView/Description';
import { Attachments } from './IssueView/Attachments';
// import '../../../css/pages/issues.css'

// --------------- LEFT SIDE -----------------
// 


const IssueDetailLeft: React.FC<{ issue: IssueDetail, refetch: ()=>void }> = ({ issue,refetch }) => {
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
      <Description description={issue.description} issueId={issue.id} refetch={refetch}/>

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
        <Attachments savedAttachments={issue.attachments!}/>

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
const IssueDetailRight: React.FC<{ issue: IssueDetail }> = ({ issue }) => {

  const project = issue?.project?.name

  const assigneeName = issue.assignee?.first_name ?? issue.assignee?.username ?? "Unassigned";
  const reporterName = issue.reporter?.first_name ?? issue.reporter?.username ?? "Unknown";

  return (
    <div className="space-y-4">

      {/* Status */}
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">
          Status
        </label>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center gap-2">{issue.status}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Priority */}
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">
          Priority
        </label>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-orange-500" />
            {issue.priority}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      <Separator />

      {/* Assignee */}
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">
          Assignee
        </label>
        <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
          <Avatar className="w-8 h-8">
            <AvatarFallback>{assigneeName[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-900">{assigneeName}</span>
        </div>
      </div>

      {/* Reporter */}
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">
          Reporter
        </label>
        <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
          <Avatar className="w-8 h-8">
            <AvatarFallback>{reporterName[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-900">{reporterName}</span>
        </div>
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
    </div>
  );
};



// --------------- MAIN COMPONENT --------------------
const IssueDetailS: React.FC = () => {
  const { id } = useParams();
  const { data, loading, refetch } = useFetch(issueService.fetchIssueByProjectIssueId, id);

  if (loading || !data || isEmptyObject(data)) return null;

  return (
    <div className="h-screen flex flex-col bg-gray-50">

      <div className="border-b bg-white px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
          <span>{id}</span>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">
          {data?.name ?? "Untitled Issue"}
        </h1>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        <div className="lg:col-span-2 overflow-y-auto">
          <div className="p-6">
            <IssueDetailLeft issue={data} refetch={refetch} />
          </div>
        </div>

        <div className="lg:col-span-1 border-l bg-white overflow-y-auto">
          <div className="p-6">
            <IssueDetailRight issue={data} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default IssueDetailS;
