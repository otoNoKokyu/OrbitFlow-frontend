import React, { useState } from 'react';
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

type Row = {
  id: string;
  content: string;
};

type Column = {
  id: string;
  title: string;
  rows: Row[];
};

type Board = Column[];

// Dummy data initialization
const initialBoard: Board = [
  {
    id: 'col-1',
    title: 'Column 1',
    rows: Array.from({ length: 5 }, (_, i) => ({
      id: `col-1-row-${i + 1}`,
      content: `Row ${i + 1}`,
    })),
  },
  {
    id: 'col-2',
    title: 'Column 2',
    rows: Array.from({ length: 5 }, (_, i) => ({
      id: `col-2-row-${i + 1}`,
      content: `Row ${i + 1}`,
    })),
  },
  {
    id: 'col-3',
    title: 'Column 3',
    rows: Array.from({ length: 5 }, (_, i) => ({
      id: `col-3-row-${i + 1}`,
      content: `Row ${i + 1}`,
    })),
  },
];

// Sortable Row Component
function SortableRow({ row }: { row: Row }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: 8,
    margin: '4px 0',
    backgroundColor: isDragging ? '#d1eaff' : '#fff',
    border: '1px solid #ccc',
    borderRadius: 4,
    cursor: 'grab',
    userSelect: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {row.content}
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
        minWidth: 200,
        margin: 8,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h3 style={{ textAlign: 'center' }}>{column.title}</h3>
      <SortableContext
        items={column.rows.map((row) => row.id)}
        strategy={verticalListSortingStrategy}
      >
        {column.rows.map((row) => (
          <SortableRow key={row.id} row={row} />
        ))}
      </SortableContext>
    </div>
  );
}

// Main Board Component
export default function DnDKitBoard() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  // Sensors for pointer (mouse/touch) input
  const sensors = useSensors(useSensor(PointerSensor));

  // Find column by row id helper
  const findColumnByRowId = (rowId: string) =>
    board.find((col) => col.rows.some((row) => row.id === rowId));

  // Find row by id helper
  const findRowById = (rowId: string): Row | undefined => {
    const col = findColumnByRowId(rowId);
    return col?.rows.find((row) => row.id === rowId);
  };

  // Drag start - set active row id
  const handleDragStart = (event: DragStartEvent) => {
    setActiveRowId(event.active.id as string);
  };

  // Drag end - reorder or move rows
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveRowId(null);
      return;
    }

    if (active.id === over.id) {
      setActiveRowId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceColIndex = board.findIndex((col) =>
      col.rows.some((row) => row.id === activeId)
    );
    const destColIndex = board.findIndex((col) =>
      col.rows.some((row) => row.id === overId)
    );

    if (sourceColIndex === -1 || destColIndex === -1) {
      setActiveRowId(null);
      return;
    }

    const sourceCol = board[sourceColIndex];
    const destCol = board[destColIndex];

    const sourceRowIndex = sourceCol.rows.findIndex((row) => row.id === activeId);
    const destRowIndex = destCol.rows.findIndex((row) => row.id === overId);

    if (sourceColIndex === destColIndex) {
      // Reorder within the same column
      const newRows = arrayMove(sourceCol.rows, sourceRowIndex, destRowIndex);
      const newBoard = [...board];
      newBoard[sourceColIndex] = { ...sourceCol, rows: newRows };
      setBoard(newBoard);
      setActiveRowId(null);
      return;
    }

    // Move row between columns
    const newBoard = [...board];

    // Remove from source
    const [movedRow] = newBoard[sourceColIndex].rows.splice(sourceRowIndex, 1);

    // Insert into destination
    newBoard[destColIndex].rows.splice(destRowIndex, 0, movedRow);

    setBoard(newBoard);
    setActiveRowId(null);
  };

  const activeRow = activeRowId ? findRowById(activeRowId) : null;

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
        }}
      >
        {board.map((column) => (
          <ColumnComponent key={column.id} column={column} />
        ))}
      </div>

      <DragOverlay>
        {activeRow ? (
          <div
            style={{
              padding: 8,
              backgroundColor: '#d1eaff',
              border: '1px solid #90caf9',
              borderRadius: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              userSelect: 'none',
            }}
          >
            {activeRow.content}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
