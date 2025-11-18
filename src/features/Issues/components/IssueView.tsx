import React, { useState } from 'react';
import { 
  Paperclip, 
  MessageSquare, 
  Calendar, 
  Tag, 
  Clock,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import { isEmptyObject, readableDateConverter } from '@/utility/objectUtils';
import { issueService } from '../service/issue.service';
import { IssueDetail } from '../interface/issue.interfcae';

// --------------- LEFT SIDE --------------------
const IssueDetailLeft: React.FC<{ issue: IssueDetail }> = ({ issue }) => {
  const [commentText, setCommentText] = useState('');

  const attachments = issue.attachments ?? [];
  const comments = issue.comments ?? [];

  return (
    <div className="space-y-6">
      
      {/* Description */}
      <section>
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Description</h3>
        <div className="text-lg text-gray-600 leading-relaxed h-[500px] overflow-y-auto">
          {issue.description ?? "No description."}
        </div>
      </section>

      <Separator />

      {/* Attachments */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Paperclip className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700">
            Attachments ({attachments.length})
          </h3>
        </div>

        <div className="space-y-2">
          {attachments.map((file, idx) => (
            <Card key={idx} className="p-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                    <Paperclip className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file}</p>
                    <p className="text-xs text-gray-500">Attachment</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Comments */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700">
            Comments ({comments.length})
          </h3>
        </div>

        {/* Comment Input */}
        <div className="mb-4">
          <div className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback>You</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full min-h-[80px] p-3 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-2 mt-2">
                <Button size="sm">Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setCommentText('')}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comment List */}
        <div className="space-y-4">
          {comments.map((comment: any, idx: number) => (
            <div key={idx} className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>C</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {comment?.author ?? "Unknown"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {comment?.timestamp ?? ""}
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  {comment?.content ?? ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
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
  const { data, loading } = useFetch(issueService.fetchIssueByProjectIssueId, id);

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
            <IssueDetailLeft issue={data} />
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
