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
    remaining: number | null;
    description: string;
    projectIssueId: string | null;
    comments: any[];
    assignee: string;
    project: {
      name: string;
    };
  }
  
export interface Filter {
    projects: { name: string; id: string }[];
    status: { status: string; id: string }[];
    types: { type: string; id: string }[];
    priorities: { priority: string; id: string }[];
  }