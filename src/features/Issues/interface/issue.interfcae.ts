import { FileWithId } from "@/components/ui/Fileuploader";

export interface Issue{
    data: IssueItem[];
    totalRecords: number;
    totalPages: number;
    currentPage: number;
  }
  
  export interface IssueItem {
    id: string;
    createdAt: string;
    assigneeId: string;
    dueDate: string;
    name:string
    type: string;
    priority: 'High' | 'Low' | 'Medium';
    status: 'To Do' | 'In Progress' | 'Done' | 'On Review';
    remaining?: number | null;
    description?: string;
    projectIssueId?: string | null;
    comments: string[];
    assignee: string;
    project: {
      name: string;
    };
  }

  export interface Comment {
    id?: string;
    issue_id: string;
    parent_comment_id?: string;
    content: string;
    updatedAt?: string;
    createdAt?: string;
    mentions?: string[];
    author?:{
      first_name:string;
      last_name:string;
    }
  }
  export interface IssueDetail {
  id: string;
  name: string;
  projectIssueId: string;
  description: string | null;
  estimate: number | null;
  remaining: number | null;
  loggedTime: number | null;
  attachments: string[] | null;
  assigneeId: string | null;
  reporterId: string | null;
  createdBy: string | null;
  status: string;
  priority: string;
  projectId: string;
  sprintId: string | null;
  dueDate: string | null;
  type: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  comments: any[];

  project: {
    id: string;
    name: string;
  };

  assignee: {
    username: string;
    first_name: string;
    last_name: string;
    profile_picture_url: string | null;
    user_id: string;
    email: string;
  } | null;

  reporter: {
    username: string;
    first_name: string;
    last_name: string;
    profile_picture_url: string | null;
    user_id: string;
    email: string;
  } | null;
}

  
  export interface IssueFormData {
    name: string;
    description?: string;
    type: string;
    priority: string;
    assigneeId?: string;
    dueDate?: string;
    estimate?: string;
    attachments?: FileWithId[] | null;
    labels?: string[];
    parentId?: string;
    reporterId: string;
  }
  
export interface Filter {
    projects: { name: string; id: string }[];
    status: { status: string; id: string }[];
    types: { type: string; id: string }[];
    priorities: { priority: string; id: string }[];
  }