export interface Issue {
    id: string;           
    name: string;          
    description: string;     
    projectIssueId: string;
    remaining: string;
    assignee:string;
    priority: string;
    dueDate: string;
    comments:any[];
}