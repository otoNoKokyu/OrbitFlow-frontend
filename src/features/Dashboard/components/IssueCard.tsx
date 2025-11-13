import React from "react";
import { Calendar, Clock, ThumbsUp, MessageSquare } from "lucide-react";

interface IssueItem {
  id: string;
  name: string;
  description?: string;
  assignee: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  comments?: any[];
  projectIssueId: string | number;
  remaining: number;
  status: string;
}

function IssueCard({ assignment }: { assignment: IssueItem }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'Medium': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'High': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'Urgent': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // return (
  //   <div className="bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow w-full max-w-[325px]">
  //     <div className="p-4">
  //       {/* Title and Description */}
  //       <h3 className="text-2xl font-medium mb-1 text-gray-900">{assignment.name}</h3>
  //       <p className="my-2 font-normal overflow-hidden text-ellipsis whitespace-nowrap text-gray-600">
  //         {assignment.description ?? 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum, ducimus?'}
  //       </p>

  //       {/* Assignees Section */}
  //       <div className="flex items-center justify-between mb-3">
  //         <div className="flex flex-col">
  //           <span className="text-gray-700 mb-1 text-sm">Assignees:</span>
  //           <div className="flex -space-x-2">
  //             <div className="h-10 w-10 rounded-full bg-slate-300 flex items-center justify-center text-gray-700 text-lg font-medium border-2 border-white">
  //               {assignment.assignee ? getInitials(assignment.assignee) : 'NA'}
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Due Date and Priority */}
  //       <div className="flex items-center justify-between mb-4">
  //         <div className="flex items-center gap-1 text-gray-500 text-sm">
  //           <Calendar className="h-5 w-5" />
  //           <span>{new Date(assignment?.dueDate).toLocaleDateString()}</span>
  //         </div>
  //         <span className={`px-2.5 py-0.5 rounded-md text-sm font-normal border ${getPriorityColor(assignment.priority)}`}>
  //           {assignment.priority}
  //         </span>
  //       </div>

  //       {/* Metrics */}
  //       <div className="flex items-center justify-between text-gray-500 border-t border-gray-200 pt-3 text-sm">
  //         <div className="flex items-center gap-1">
  //           <MessageSquare className="h-5 w-5" />
  //           <span>{assignment?.comments?.length || 0}</span>
  //         </div>
  //         <div className="flex items-center gap-1">
  //           <ThumbsUp className="h-5 w-5" />
  //           <span>{assignment.projectIssueId}</span>
  //         </div>
  //         <div className="flex items-center gap-2">
  //           <Clock className="h-5 w-5" />
  //           <span>{assignment.remaining}h</span>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return(
    <div>
      <p>{assignment.assignee}</p>
      <p>{assignment.assignee}</p>
      <p>{assignment.assignee}</p>
      <p>{assignment.assignee}</p>
      <p>{assignment.assignee}</p>
      <p>{assignment.assignee}</p>
      <p>{assignment.assignee}</p>
    </div>
  )
}

export default IssueCard;