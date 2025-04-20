import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Issue } from '../Model/Issue';
import TaskGrid from './Issue';
import { Plus, PlusCircle } from 'lucide-react';
import { useAppSelector } from '@/store';
import { fetchUserDashboardData } from '../service/dashboard.service';

type Column = {
  id: string;
  title: string;
  assignments: Issue[];
};

type Board = Column[];

// Dummy data initialization with assignment cards
const initialBoard: Board = [
  {
    id: 'col-1',
    title: 'To Do',
    assignments: [
      {
        id: 'col-1-assignment-1',
        name: 'Homepage Design Wireframe',
        description: 'Create wireframes for the homepage design',
        projectIssueId: 'PROJ-001',
        remaining: '4d',
        assignee: 'JD',
        priority: 'Low',
        dueDate: '02 Nov 2025',
        comments: [
          {}, {}, {}, {}  // 4 comments
        ],
      },
      {
        id: 'col-1-assignment-2',
        name: 'User Research Survey',
        description: 'Prepare and distribute user research survey',
        projectIssueId: 'PROJ-002',
        remaining: '7d',
        assignee: 'JD',
        priority: 'Medium',
        dueDate: '05 Nov 2025',
        comments: [
          {}, {}  // 2 comments
        ],
      },
    ],
  },
  {
    id: 'col-2',
    title: 'In Progress',
    assignments: [
      {
        id: 'col-2-assignment-1',
        name: 'API Documentation',
        description: 'Document all API endpoints and parameters',
        projectIssueId: 'PROJ-003',
        remaining: '1d',
        assignee: 'KL',
        priority: 'High',
        dueDate: '29 Oct 2025',
        comments: [
          {}, {}, {}, {}, {}, {}, {}
        ],
      },
      {
        id: 'col-2-assignment-2',
        name: 'Frontend Components',
        description: 'Develop reusable frontend components',
        projectIssueId: 'PROJ-004',
        remaining: '3d',
        assignee: 'AM',
        priority: 'Medium',
        dueDate: '01 Nov 2025',
        comments: [
          {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}  // 12 comments
        ],
      },
    ],
  },
  {
    id: 'col-4',
    title: 'On Review',
    assignments: [
      {
        id: 'col-4-assignment-1',
        name: 'Authentication Flow',
        description: 'Implement user authentication flow',
        projectIssueId: 'PROJ-005',
        remaining: '2d',
        assignee: 'AM',
        priority: 'High',
        dueDate: '28 Oct 2025',
        comments: [
          {}, {}, {}, {}, {}, {}  // 6 comments
        ],
      },
      {
        id: 'col-4-assignment-2',
        name: 'User Profile Settings',
        description: 'Implement user profile settings page',
        projectIssueId: 'PROJ-006',
        remaining: '1d',
        assignee: 'JD',
        priority: 'Medium',
        dueDate: '30 Oct 2025',
        comments: [
          {}, {}, {}, {}, {}, {}, {}, {}  // 8 comments
        ],
      },
      {
        id: 'col-4-assignment-3',
        name: 'Payment Integration',
        description: 'Integrate payment processing system',
        projectIssueId: 'PROJ-007',
        remaining: '1d',
        assignee: 'PQ',
        priority: 'Urgent',
        dueDate: '01 Nov 2025',
        comments: [
          {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}  // 14 comments
        ],
      },
    ],
  },
  {
    id: 'col-3',
    title: 'Done',
    assignments: [
      {
        id: 'col-3-assignment-1',
        name: 'Project Setup',
        description: 'Initialize project repository and setup development environment',
        projectIssueId: 'PROJ-008',
        remaining: '0d',
        assignee: 'JD',
        priority: 'Urgent',
        dueDate: '20 Oct 2025',
        comments: [
          {}, {}, {}  // 3 comments
        ],
      },
      {
        id: 'col-3-assignment-2',
        name: 'Requirements Gathering',
        description: 'Collect and document project requirements',
        projectIssueId: 'PROJ-009',
        remaining: '0d',
        assignee: 'RB',
        priority: 'High',
        dueDate: '15 Oct 2025',
        comments: [
          {}, {}, {}, {}, {}, {}, {}, {}, {}  // 9 comments
        ],
      },
    ],
  },
];

function transformApiToBoard(apiResponse: { data: Issue[]; }, columns = null) {
  console.log(apiResponse)
  const issues = apiResponse.data;
  
  // Use provided columns or create default
  const board = columns || [
    { id: 'col-1', title: 'To Do', assignments: [] },
    { id: 'col-2', title: 'In Progress', assignments: [] },
    { id: 'col-4', title: 'On Review', assignments: [] },
    { id: 'col-3', title: 'Done', assignments: [] }
  ];
  
  // Format date helper
  const fmtDate = (d:string) => new Date(d).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'});
  
  // Map issues to columns (simple distribution)
  issues.forEach((issue: Issue, i:number) => {
    const colIndex = i % board.length;
    const col = board[colIndex];
    
    col.assignments.push({
      id: `${col.id}-assignment-${col.assignments.length + 1}`,
      name: issue.description || `Task ${i+1}`,
      description: issue.description || '',
      projectIssueId: issue.projectIssueId || `PROJ-${String(i+1).padStart(3, '0')}`,
      remaining: issue.remaining ? `${issue.remaining}d` : '0d',
      assignee: issue.assignee.username.substring(0, 2),
      priority: issue.priority,
      dueDate: fmtDate(issue.dueDate),
      comments: issue.comments.length ? issue.comments : Array(3).fill({})
    });
  });
  
  return board;
}


// Sortable Assignment Component
function SortableAssignment({ assignment }: { assignment: Issue }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: assignment.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3">
      <TaskGrid assignment={assignment} />
    </div>
  );
}

// Column Component
function ColumnComponent({ column }: { column: Column }) {
  return (
    <div
      style={{
        backgroundColor: '#f8f8f8',
        padding: 16,
        borderRadius: 8,
        minWidth: 280,
        margin: 8,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="flex justify-between">
        <h3 className="text-medium font-sans font-medium text-center mb-4">{column.title}</h3>
        <span className="mx-4 text-md text-grey-200">{column.assignments.length}</span>
        <Plus className="ml-auto mr-1 text-right" />
      </div>
      <SortableContext
        items={column.assignments.map((assignment) => assignment.id)}
        strategy={verticalListSortingStrategy}
      >
        {column.assignments.map((assignment) => (
          <SortableAssignment key={assignment.id} assignment={assignment} />
        ))}
      </SortableContext>
    </div>
  );
}

// Main Board Component
export default function DnDKitBoard() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);
  const userId = useAppSelector(state=>state.auth.user?.user_id)

useEffect(()=>{
  const fetchUserDashBoard = async(userId:string)=>{
    return await fetchUserDashboardData(userId)
  } 
  fetchUserDashBoard(userId!).then(res=>{
    setBoard(transformApiToBoard(res.responsePayload))
  })
})


  // Sensors for pointer (mouse/touch) input
  const sensors = useSensors(useSensor(PointerSensor));

  // Find column by assignment id helper
  const findColumnByAssignmentId = (assignmentId: string) =>
    board.find((col) => col.assignments.some((assignment) => assignment.id === assignmentId));

  // Find assignment by id helper
  const findAssignmentById = (assignmentId: string): Issue | undefined => {
    const col = findColumnByAssignmentId(assignmentId);
    return col?.assignments.find((assignment) => assignment.id === assignmentId);
  };

  // Drag start - set active assignment id
  const handleDragStart = (event: DragStartEvent) => {
    setActiveAssignmentId(event.active.id as string);
  };

  // Drag end - reorder or move assignments
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveAssignmentId(null);
      return;
    }

    if (active.id === over.id) {
      setActiveAssignmentId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceColIndex = board.findIndex((col) =>
      col.assignments.some((assignment) => assignment.id === activeId)
    );
    const destColIndex = board.findIndex((col) =>
      col.assignments.some((assignment) => assignment.id === overId)
    );

    if (sourceColIndex === -1 || destColIndex === -1) {
      setActiveAssignmentId(null);
      return;
    }

    const sourceCol = board[sourceColIndex];
    const destCol = board[destColIndex];

    const sourceAssignmentIndex = sourceCol.assignments.findIndex((assignment) => assignment.id === activeId);
    const destAssignmentIndex = destCol.assignments.findIndex((assignment) => assignment.id === overId);

    if (sourceColIndex === destColIndex) {
      // Reorder within the same column
      const newAssignments = arrayMove(sourceCol.assignments, sourceAssignmentIndex, destAssignmentIndex);
      const newBoard = [...board];
      newBoard[sourceColIndex] = { ...sourceCol, assignments: newAssignments };
      setBoard(newBoard);
      setActiveAssignmentId(null);
      return;
    }

    // Move assignment between columns
    const newBoard = [...board];

    // Remove from source
    const [movedAssignment] = newBoard[sourceColIndex].assignments.splice(sourceAssignmentIndex, 1);

    // Insert into destination
    newBoard[destColIndex].assignments.splice(destAssignmentIndex, 0, movedAssignment);

    setBoard(newBoard);
    setActiveAssignmentId(null);
  };

  const activeAssignment = activeAssignmentId ? findAssignmentById(activeAssignmentId) : null;
  console.log(activeAssignment)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          padding: 24,
          height: '100%',
          boxSizing: 'border-box',
          // maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {board.map((column) => (
          <ColumnComponent key={column.id} column={column} />
        ))}
      </div>

      <DragOverlay>
        {activeAssignment ? (
          <div style={{ width: '280px' }}>
            <TaskGrid assignment={activeAssignment} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}