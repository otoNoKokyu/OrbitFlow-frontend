import React, { useEffect, useState } from "react";
import {
  DndContext,
  rectIntersection,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical } from "lucide-react";
import IssueCard from "./IssueCard";
// import { IssueItem } from "@/features/Issues/interface/issue.interface";
import { fetchUserDashboardData } from "../service/dashboard.service";
import { useFetch } from "@/hooks/useFetch";
import authService from "@/features/Authentication/service/auth.service";
import { KeyMeta } from "@/common/types/Auth/auth";
import { IssueItem } from "@/features/Issues/interface/issue.interfcae";

/* ---------------------------------------------- */
/*                SORTABLE ASSIGNMENT             */
/* ---------------------------------------------- */
function SortableAssignment({ assignment }: { assignment: IssueItem }) {
  const id = String(assignment.id);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 99 : undefined,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-3" {...attributes} {...listeners}>
      {/* Optional drag handle */}
      <div className="flex items-center gap-2 p-1 bg-gray-50 border border-gray-200 rounded-t-sm">
        <GripVertical className="w-4 h-4 text-gray-400" />
        <span className="text-xs text-gray-400">Drag</span>
      </div>

      <IssueCard assignment={assignment} />
    </div>
  );
}

/* ---------------------------------------------- */
/*                   COLUMN                        */
/* ---------------------------------------------- */
function ColumnComponent({ column }: { column: any }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: isOver ? "#e8f0fe" : "#f3f1f1",
        padding: 16,
        borderRadius: 8,
        minWidth: 300,
        margin: 8,
        display: "flex",
        flexDirection: "column",
        transition: "background-color .2s",
      }}
    >
      <div className="flex items-center mb-4">
        <h3 className="text-xl font-[400]">{column.status}</h3>
        <span className="text-gray-700 ml-2">{`(${column.assignments.length})`}</span>
        <Plus className="ml-auto text-gray-500 cursor-pointer" />
      </div>

      <SortableContext
        items={column.assignments.map((a) => String(a.id))}
        strategy={verticalListSortingStrategy}
      >
        {column.assignments.map((a) => (
          <SortableAssignment key={String(a.id)} assignment={a} />
        ))}
      </SortableContext>
    </div>
  );
}

/* ---------------------------------------------- */
/*                MAIN BOARD COMPONENT            */
/* ---------------------------------------------- */
export default function DnDKitBoard() {
  const [board, setBoard] = useState<any[]>([]);
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const { user_id } = authService.getUserMeta([KeyMeta.USER]);
  const { data: issueData, loading } = useFetch(fetchUserDashboardData, user_id);

  /* ------------ Initialize Board Columns ----------- */
  useEffect(() => {
    if (!issueData?.data) return;

    const statusMap: Record<IssueItem["status"], IssueItem[]> = {
      "To Do": [],
      "In Progress": [],
      "On Review": [],
      Done: [], // if you don't have Done, ignore this
    };

    issueData.data.forEach((issue: IssueItem) => {
      statusMap[issue.status]?.push(issue);
    });

    setBoard([
      { id: "todo", status: "To Do", assignments: statusMap["To Do"] },
      { id: "progress", status: "In Progress", assignments: statusMap["In Progress"] },
      { id: "review", status: "On Review", assignments: statusMap["On Review"] },
    ]);
  }, [issueData]);

  /* ---------------------------------------------- */
  /*                DRAG START                     */
  /* ---------------------------------------------- */
  const handleDragStart = (event: DragStartEvent) => {
    setActiveAssignmentId(String(event.active.id));
  };

  /* ---------------------------------------------- */
  /*                   DRAG END                     */
  /* ---------------------------------------------- */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveAssignmentId(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Find source column
    const sourceColIndex = board.findIndex((col) =>
      col.assignments.some((a: IssueItem) => String(a.id) === activeId)
    );

    if (sourceColIndex === -1) return;

    // Find destination column
    const destColIndex = board.findIndex(
      (col) => col.id === overId || col.assignments.some((a: any) => String(a.id) === overId)
    );

    if (destColIndex === -1) return;

    const next = board.map((c) => ({
      ...c,
      assignments: [...c.assignments],
    }));

    // Remove item from source
    const sourceItemIndex = next[sourceColIndex].assignments.findIndex(
      (a: IssueItem) => String(a.id) === activeId
    );

    const [moved] = next[sourceColIndex].assignments.splice(sourceItemIndex, 1);

    // Drop on column → push at end
    if (next[destColIndex].id === overId) {
      next[destColIndex].assignments.push(moved);
    } else {
      // Drop on item → insert before item
      const destIndex = next[destColIndex].assignments.findIndex(
        (a: IssueItem) => String(a.id) === overId
      );

      if (destIndex === -1) next[destColIndex].assignments.push(moved);
      else next[destColIndex].assignments.splice(destIndex, 0, moved);
    }

    setBoard(next);
  };

  /* ------------ Currently Dragging Card ---------- */
  const activeAssignment = activeAssignmentId
    ? board.flatMap((c) => c.assignments).find((a) => String(a.id) === activeAssignmentId) ?? null
    : null;

  if (loading) {
    return <p className="text-center mt-10">Loading board...</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
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
          <div style={{ width: 300 }}>
            <IssueCard assignment={activeAssignment} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
