import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, ThumbsUp, MessageSquare } from "lucide-react";
import { Issue } from "../Model/Issue";

function TaskGrid({ assignment }: { assignment: Issue }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'Medium': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'High': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'Urgent': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md border-0 transition-shadow w-max-[325px] mb-3">
      <CardContent className="p-4">
        {/* Title */}
        <h3 className="text-xl font-medium mb-2">{assignment.name}</h3>
        <p className="my-3 text-sm font-normal overflow-hidden text-ellipsis whitespace-nowrap" >{assignment.description}</p>
        
        {/* Assignees */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Assignees:</span>
            <div className="flex -space-x-2">
              <Avatar>
              <AvatarImage />
              <AvatarFallback>{assignment.assignee}</AvatarFallback>              
              </Avatar>
            </div>
          </div>
        </div>

        {/* Date and Priority */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-gray-500">
            <Calendar className="h-3 w-3" />
            <span className="text-xs">{new Date(assignment?.dueDate).toLocaleDateString()}</span>
          </div>
          <Badge variant="outline" className={`${getPriorityColor(assignment.priority)} text-xs font-normal`}>
            {assignment.priority}
          </Badge>
        </div>

        {/* Metrics */}
        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{assignment?.comments?.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" />
            <span>{assignment.projectIssueId}%</span>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Clock className="h-3 w-3" />
            <span>Remaining hours {assignment.remaining}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default TaskGrid;