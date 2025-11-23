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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useMemo } from 'react';
import { IssueItem } from '../interface/issue.interfcae';
import '../../../css/components/Table.css'
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowDown, ArrowUp, Book, Bug, CheckCircle, CheckCircle2, CheckSquare, CheckSquare2, Flag, MinusCircle, Sliders } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';

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

const issuTypeIconMapper = (type: string) => {
  const icons: Record<string, JSX.Element> = {
    bug: <Bug style={{ color: 'red' }} />,
    task: <CheckSquare2 height={20} style={{ color: 'green' }} />,
    subtask: <CheckCircle style={{ color: 'red' }} />,
    story: <Book style={{ color: 'red' }} />,
    epic: <Book style={{ color: 'red' }} />,
  };

  const icon = icons[type];
  if (!icon) return null;

  return (
    <Tooltip>
      <TooltipTrigger>{icon}</TooltipTrigger>
      <TooltipContent className="bg-black text-white text-sm font-medium">
        {type}
      </TooltipContent>
    </Tooltip>
  );
};

const priorityIcon = (level: string) => {
  const icons: Record<string, JSX.Element> = {
    High: <ArrowUp color="red" size={24} />,
    Medium: <MinusCircle color="orange" size={24} />,
    Low: <ArrowDown color="green" size={24} />,
  };

  const icon = icons[level];
  if (!icon) return null;

  return (
    <Tooltip>
      <TooltipTrigger>{icon}</TooltipTrigger>
      <TooltipContent className="bg-black text-white text-sm font-medium">
        {level} priority
      </TooltipContent>
    </Tooltip>
  );
};

  // ---------- Render ----------
  return (
    <div className="flex flex-col h-full gap-4 overflow-auto rounded-xl bg-white p-4 shadow-md">
      {/* ---------- Table ---------- */}
      <div className="overflow-x-auto h-[850px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Key</TableHead>
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
                  onClick={() => navigate(`/issues/${issue.projectIssueId}`)}
                  key={issue.id}
                  className="hover:bg-muted/80 cursor-pointer py-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <TableCell className="font-medium">{issuTypeIconMapper(issue.type)}</TableCell>

                  <TableCell className="font-medium w-[500px]">{issue.name}</TableCell>
                  <TableCell className="font-medium flex gap-3 items-center">
                    <Avatar>
                      <AvatarImage src='/00024.png' alt={issue.assignee[0]} />
                      {/* <AvatarFallback>
                        {issue.assignee[0].toUpperCase()}
                      </AvatarFallback> */}
                    </Avatar>
                    {issue.assignee}

                  </TableCell>


                  <TableCell className="font-medium">{priorityIcon(issue.priority)}</TableCell>


                  {/* ----- Priority Select ----- */}
                  {/* <TableCell>
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
                  </TableCell> */}

                  <TableCell>{issue.status ?? '-'}</TableCell>

                  {/* ----- Status Select ----- */}
                  {/* <TableCell>
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
                  </TableCell> */}

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