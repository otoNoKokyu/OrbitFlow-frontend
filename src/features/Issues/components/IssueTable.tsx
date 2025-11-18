'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMemo } from 'react';
import { IssueItem } from '../interface/issue.interfcae';
import '../../../css/components/Table.css'
import { useNavigate } from 'react-router-dom';

interface IssueTableProps {
  data: IssueItem[];              
  page: number;
  limit: number;
  total: number;
  onPageChange: (newPage: number) => void;
  onPriorityChange?: (issueId: string, value: string) => void;
  onStatusChange?: (issueId: string, value: string) => void;
}

export default function IssueTable({
  data,
  page,
  total,
  onPageChange,
  onPriorityChange,
  onStatusChange,
}: IssueTableProps) {
  const totalPages = total;


  // ---------- Helper: safe date ----------
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });;
  };

  const navigate = useNavigate()
  const pageNumbers = useMemo(() => {
    const delta = 2;
    const range: (number | 'ellipsis')[] = [];
    const start = Math.max(1, page - delta);
    const end = Math.min(totalPages, page + delta);

    if (start > 1) range.push(1, 'ellipsis');
    for (let i = start; i <= end; i++) range.push(i);
    if (end < totalPages) range.push('ellipsis', totalPages);

    return range;
  }, [page, totalPages]);

  // ---------- Render ----------
  return (
    <div className="flex flex-col h-full gap-4 overflow-auto rounded-xl bg-white p-4 shadow-md">
      {/* ---------- Table ---------- */}
      <div className="overflow-x-auto h-[850px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>ID</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No issues found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((issue) => (
                <TableRow 
                onClick={()=>navigate(`/issues/${issue.projectIssueId}`)}
                key={issue.id}
                className="hover:bg-muted/80 cursor-pointer py-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <TableCell className="font-medium w-[500px]">{issue.name}</TableCell>
                  <TableCell>{issue.assignee ?? '-'}</TableCell>

                  {/* ----- Priority Select ----- */}
                  <TableCell>
                    <Select
                      value={issue.priority}
                      onValueChange={(v) => onPriorityChange?.(issue.id, v)}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>{issue.type ?? '-'}</TableCell>

                  {/* ----- Status Select ----- */}
                  <TableCell>
                    <Select
                      value={issue.status}
                      onValueChange={(v) => onStatusChange?.(issue.id, v)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="To Do">To Do</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="On Review">On Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>{formatDate(issue.dueDate)}</TableCell>
                  <TableCell>{issue.projectIssueId ?? '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(page - 1)}
                  className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  aria-disabled={page === 1}
                />
              </PaginationItem>

              {pageNumbers.map((p, idx) =>
                p === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      onClick={() => onPageChange(p as number)}
                      isActive={page === p}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(page + 1)}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  aria-disabled={page === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}