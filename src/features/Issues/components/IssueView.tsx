import React, { useState } from 'react';
import { 
  Paperclip, 
  MessageSquare, 
  User, 
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

// Types
interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface IssueData {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: {
    name: string;
    avatar?: string;
  };
  reporter: {
    name: string;
    avatar?: string;
  };
  created: string;
  updated: string;
  labels: string[];
  comments: Comment[];
  attachments: Attachment[];
}

// Left Side Component
const IssueDetailLeft: React.FC<{ issue: IssueData }> = ({ issue }) => {
  const [commentText, setCommentText] = useState('');

  return (
    <div className="space-y-6">
      {/* Description Section */}
      <section>
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Description</h3>
        <div className="text-sm text-gray-600 leading-relaxed">
          {issue.description}
        </div>
      </section>

      <Separator />

      {/* Attachments Section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Paperclip className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700">
            Attachments ({issue.attachments.length})
          </h3>
        </div>
        <div className="space-y-2">
          {issue.attachments.map((attachment) => (
            <Card key={attachment.id} className="p-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                    <Paperclip className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                    <p className="text-xs text-gray-500">
                      {attachment.size} • Added by {attachment.uploadedBy}
                    </p>
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

      {/* Comments Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700">
            Comments ({issue.comments.length})
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

        {/* Comments List */}
        <div className="space-y-4">
          {issue.comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={comment.avatar} />
                <AvatarFallback>{comment.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {comment.author}
                  </span>
                  <span className="text-xs text-gray-500">{comment.timestamp}</span>
                </div>
                <div className="text-sm text-gray-700">{comment.content}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Right Side Component
const IssueDetailRight: React.FC<{ issue: IssueData }> = ({ issue }) => {
  return (
    <div className="space-y-4">
      {/* Status */}
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">
          Status
        </label>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            {issue.status}
          </span>
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
        <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
          <Avatar className="w-8 h-8">
            <AvatarImage src={issue.assignee.avatar} />
            <AvatarFallback>{issue.assignee.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-900">{issue.assignee.name}</span>
        </div>
      </div>

      {/* Reporter */}
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">
          Reporter
        </label>
        <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
          <Avatar className="w-8 h-8">
            <AvatarImage src={issue.reporter.avatar} />
            <AvatarFallback>{issue.reporter.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-900">{issue.reporter.name}</span>
        </div>
      </div>

      <Separator />

      {/* Labels */}
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">
          Labels
        </label>
        <div className="flex flex-wrap gap-2">
          {issue.labels.map((label, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {label}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Dates */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Created: {issue.created}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Updated: {issue.updated}</span>
        </div>
      </div>
    </div>
  );
};

// Main Component
const JiraIssueDetail: React.FC = () => {
  const mockIssue: IssueData = {
    id: 'PROJ-123',
    title: 'Implement user authentication flow',
    description: 'We need to implement a secure authentication flow that includes login, registration, and password reset functionality. The implementation should follow OAuth 2.0 standards and include proper error handling and validation.',
    status: 'In Progress',
    priority: 'High',
    assignee: {
      name: 'Sarah Johnson',
      avatar: undefined
    },
    reporter: {
      name: 'Mike Chen',
      avatar: undefined
    },
    created: '2 days ago',
    updated: '3 hours ago',
    labels: ['backend', 'security', 'sprint-5'],
    attachments: [
      {
        id: '1',
        name: 'auth-flow-diagram.png',
        size: '245 KB',
        uploadedBy: 'Sarah Johnson',
        uploadedAt: '2 hours ago'
      },
      {
        id: '2',
        name: 'requirements.pdf',
        size: '1.2 MB',
        uploadedBy: 'Mike Chen',
        uploadedAt: '1 day ago'
      }
    ],
    comments: [
      {
        id: '1',
        author: 'Mike Chen',
        content: 'Please make sure to include rate limiting on the login endpoint to prevent brute force attacks.',
        timestamp: '5 hours ago'
      },
      {
        id: '2',
        author: 'Sarah Johnson',
        content: 'Good point! I\'ll add that to the implementation. Should we use a 5 requests per minute limit?',
        timestamp: '4 hours ago'
      }
    ]
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
          <span>{mockIssue.id}</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">{mockIssue.title}</h1>
      </div>

      {/* Two Column Layout - Full Height */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        {/* Left Side - Main Content */}
        <div className="lg:col-span-2 overflow-y-auto">
          <div className="p-6">
            <IssueDetailLeft issue={mockIssue} />
          </div>
        </div>

        {/* Right Side - Metadata */}
        <div className="lg:col-span-1 border-l bg-white overflow-y-auto">
          <div className="p-6">
            <IssueDetailRight issue={mockIssue} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JiraIssueDetail;