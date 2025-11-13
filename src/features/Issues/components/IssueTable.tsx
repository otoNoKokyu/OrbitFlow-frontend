'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink
} from '@/components/ui/pagination'
import { Issue } from '@/features/Issues/interface/issue.interfcae'
import NewSelect from '@/components/ui/NewSelect'

interface IssueTableProps {
  data: Issue['data']
  page: number
  limit: number
  total: number
  onPageChange: (newPage: number) => void
}

export default function IssueTable({
  data,
  page,
  limit,
  total,
  onPageChange
}: IssueTableProps) {
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="relative flex flex-col w-full h-full overflow-auto text-gray-700 bg-white shadow-md rounded-xl bg-clip-border p-4">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50 font-medium text-neutral-600">
              Name
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50 font-medium text-neutral-600">
              Assignee
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50 font-medium text-neutral-600">
              Priority
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50 font-medium text-neutral-600">
              Type
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50 font-medium text-neutral-600">
              Status
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50 font-medium text-neutral-600">
              Due Date
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50 font-medium text-neutral-600">
              ID
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((issue) => (
            <tr key={issue.id} className="hover:bg-gray-50 cursor-pointer">
              <td className="p-4 border-b border-blue-gray-50 text-sm font-medium">
                {issue.name}
              </td>
              <td className="p-4 border-b border-blue-gray-50 text-sm">
                {issue.assignee}
              </td>
              <td className="p-4 border-b border-blue-gray-50 text-sm">
                <NewSelect
                  values={[{ id: '1', value: 'High' }, { id: '2', value: 'Medium' }, { id: '3', value: 'Low' }]}
                  defaultValue={issue.priority}
                />
              </td>
              <td className="p-4 border-b border-blue-gray-50 text-sm">
                {issue.type}
              </td>
              <td className="p-4 border-b border-blue-gray-50 text-sm">
                <NewSelect
                  values={[{ id: '1', value: 'To Do' }, { id: '2', value: 'In Progress' }, { id: '3', value: 'On Review' }]}
                  defaultValue={issue.status}
                />
              </td>
              <td className="p-4 border-b border-blue-gray-50 text-sm">
                {new Date(issue.dueDate).toLocaleDateString()}
              </td>
              <td className="p-4 border-b border-blue-gray-50 text-sm">
                {issue.projectIssueId ?? '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex flex-col items-center mt-6">
          <span className="text-sm text-gray-700 mb-2">
            Showing{' '}
            <span className="font-semibold text-gray-900">
              {(page - 1) * limit + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-gray-900">
              {Math.min(page * limit, total)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-gray-900">{total}</span> Entries
          </span>
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className={`flex items-center justify-center px-4 h-10 text-base font-medium border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-l-md ${page === 1 ? 'cursor-not-allowed opacity-50' : ''
                }`}
              aria-label="Previous Page"
            >
              {/* Left arrow SVG */}
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1
              const isActive = page === pageNumber
              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`px-4 h-10 text-base font-medium border-t border-b border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-700 ${isActive
                      ? 'z-10 bg-blue-600 text-white border-blue-600'
                      : 'text-gray-500 cursor-pointer'
                    }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              )
            })}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className={`flex items-center justify-center px-4 h-10 text-base font-medium border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-r-md ${page === totalPages ? 'cursor-not-allowed opacity-50' : ''
                }`}
              aria-label="Next Page"
            >
              Next
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
