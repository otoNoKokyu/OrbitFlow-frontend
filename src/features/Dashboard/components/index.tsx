import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical } from "lucide-react";
import { IssueItem } from "@/features/Issues/interface/issue.interfcae";
import { fetchUserDashboardData } from "../service/dashboard.service";
import authService from "@/features/Authentication/service/auth.service";
import { KeyMeta } from "@/common/types/Auth/auth";
import { useFetch } from "@/hooks/useFetch";
import IssueCard from "./IssueCard";

// ---------- TYPES ----------
type Column = {
  id: string;
  status: string;
  assignments: IssueItem[];
};

type Board = Column[];

// ---------- SORTABLE ITEM ----------
function SortableAssignment({ assignment }: { assignment: IssueItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: assignment.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      {/* DRAG HANDLE */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-2 p-1 cursor-grab active:cursor-grabbing bg-gray-50 border border-gray-200 rounded-t-sm"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
        <span className="text-xs text-gray-400">Drag</span>
      </div>

      {/* CARD CONTENT - pointer-events-none prevents interference */}
      <div className="pointer-events-none">
        <IssueCard assignment={assignment} />
      </div>
    </div>
  );
}

// ---------- COLUMN COMPONENT ----------
function ColumnComponent({ column }: { column: Column }) {
  return (
    <div
      style={{
        backgroundColor: "#f3f1f1",
        padding: 16,
        borderRadius: 8,
        minWidth: 280,
        margin: 8,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-[400]">{column.status}</h3>
        <span className="text-gray-700 ml-1">{`(${column.assignments.length})`}</span>
        <Plus className="ml-auto text-gray-500 cursor-pointer" />
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

// ---------- MAIN BOARD ----------
export default function DnDKitBoard() {
  const [board, setBoard] = useState<Board>([]);
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);
  const { user_id } = authService.getUserMeta([KeyMeta.USER]);
  const { data: issueData, loading } = useFetch(fetchUserDashboardData, user_id);

  console.log(issueData)

  useEffect(() => {
    if (!Array.isArray(issueData?.data) || issueData.data.length === 0) return;

    const { data } = issueData;

    const statusMap: Record<IssueItem["status"], IssueItem[]> = {
      "To Do": [],
      "In Progress": [],
      "On Review": [],
      Done: [],
    };

    for (const issue of data) {
      if (statusMap[issue.status]) statusMap[issue.status].push(issue);
    }

    setBoard([
      { id: "todo", status: "To Do", assignments: statusMap["To Do"] },
      { id: "in-progress", status: "In Progress", assignments: statusMap["In Progress"] },
      { id: "on-review", status: "On Review", assignments: statusMap["On Review"] },
      { id: "done", status: "Done", assignments: statusMap["Done"] },
    ]);
  }, [issueData]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const findColumnByAssignmentId = (assignmentId: string) =>
    board.find((col) => col.assignments.some((a) => a.id === assignmentId));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveAssignmentId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveAssignmentId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceCol = findColumnByAssignmentId(activeId);
    const destCol = board.find(
      (col) => col.id === overId || col.assignments.some((a) => a.id === overId)
    );

    if (!sourceCol || !destCol) {
      setActiveAssignmentId(null);
      return;
    }

    const sourceColIndex = board.indexOf(sourceCol);
    const destColIndex = board.indexOf(destCol);
    const sourceItemIndex = sourceCol.assignments.findIndex((a) => a.id === activeId);
    const destItemIndex = destCol.assignments.findIndex((a) => a.id === overId);

    const updated = [...board];
    const [moved] = updated[sourceColIndex].assignments.splice(sourceItemIndex, 1);

    if (destItemIndex === -1) {
      updated[destColIndex].assignments.push(moved);
    } else {
      updated[destColIndex].assignments.splice(destItemIndex, 0, moved);
    }

    setBoard(updated);
    setActiveAssignmentId(null);
  };

  const activeAssignment = activeAssignmentId
    ? findColumnByAssignmentId(activeAssignmentId)?.assignments.find(
        (a) => a.id === activeAssignmentId
      )
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading board...</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 justify-center p-6 overflow-x-auto">
        {board.map((column) => (
          <ColumnComponent key={column.id} column={column} />
        ))}
      </div>

      <DragOverlay>
        {activeAssignment ? (
          <div style={{ width: 280 }}>
            <IssueCard assignment={activeAssignment} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
