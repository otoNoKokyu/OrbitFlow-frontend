import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import NewSelect, { NewSelectValues } from '@/components/ui/NewSelect'
import { useEffect, useState, useMemo, useRef } from 'react'
import { fetchFilterData, fetchFilterResult } from '../service/issue.service'
import { useFetch } from '@/hooks/useFetch'
import IssueTable from './IssueTable'
import { Filter, Issue, IssueItem } from '../interface/issue.interfcae'
import { RotateCw, Search } from 'lucide-react'

const headers = [
  "Type",
  "Id",
  "Name",
  "Assignee",
  "Status",
  "Due",
  'Priority'
];

const issues = [
  {
    type: "Bug",
    key: "BG-167",
    summary: "Big logistics manager needs a calendar view",
    assignee: { name: "Zlatko", avatar: "/avatars/zlatko.png" },
    reporter: { name: "Joshua", avatar: "/avatars/joshua.png" },
    status: "Unresolved",
    resolution: "Unresolved",
    created: "18 Dec 2020",
    updated: "18 Dec 2020",
    due: "08 Jan 2021"
  },
  {
    type: "Task",
    key: "AD-116",
    summary: "Extend booking experience in UI to include calendar",
    assignee: { name: "Joshua", avatar: "/avatars/joshua.png" },
    reporter: { name: "Phan", avatar: "/avatars/phan.png" },
    status: "Fixed",
    resolution: "Fixed",
    created: "24 Sep 2020",
    updated: "24 Sep 2020",
    due: "15 Sep 2019"
  },
  // Add more items as needed
]


const Header = () => {
  const { data, loading, error } = useFetch<Filter>(fetchFilterData);
  const [filter, setFilter] = useState('');
  const { data: resultData, loading: loadingResult, error: errorResult } = useFetch<Issue>(fetchFilterResult, filter);
  const [page, setPage] = useState(1)
  const [resetKey, setResetKey] = useState(0);


  useEffect(() => {
    if (page) onFilterChange(page, 'page')
  }, [page])

 const onFilterChange = (
  item: NewSelectValues | number | string | null,
  option?: string
) => {
  setFilter((prev) => {
    if (option === 'reset')  {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return '?page=1'
    };

    const value =
      option === 'page'
        ? String(item)
        : option === 'anyKey'
        ? String(item || '')
        : option === 'projectIsuueId'
        ? item
        : option === 'projectId'
        ? (item as NewSelectValues).id
        : (item as NewSelectValues).value;

    const enc = encodeURIComponent(value);
    const re = new RegExp(`([?&])${option}=[^&]*`);

    return re.test(prev)
      ? prev.replace(re, `$1${option}=${enc}`)
      : `${prev}${prev.includes("?") ? "&" : "?"}${option}=${enc}`;
  });
};

  const inputRef = useRef<HTMLInputElement>(null);

  const projectOptions = useMemo(() => {
    return data?.projects?.map(e => ({ value: e.name, id: e.id }));
  }, [data?.projects]);

  const statusOptions = useMemo(() => {
    return data?.status?.map(e => ({ value: e.status, id: e.id }));
  }, [data?.status]);

  const priorityOptions = useMemo(() => {
    return data?.priorities?.map(e => ({ value: e.priority, id: e.id }));
  }, [data?.status]);

  // const rowHeaderMap = (
  //   _headers?: string[],
  //   _mapped?: string[]
  // ): Partial<Record<keyof IssueItem, string>> => ({
  //   projectIssueId: 'Id',
  //   name: 'Name',
  //   assignee: 'Assignee',
  //   status: 'Status',
  //   type: 'Type',
  //   priority: 'Priority',
  //   dueDate: 'Due',

  // });

  const typeOptions = useMemo(() => {
    return data?.types?.map(e => ({ value: e.type, id: e.id }));
  }, [data?.types]);

  if (loading || error) return null;
  return (
    <>
      <div className='flex items-center gap-3 p-4'>
        <Input
          ref = {inputRef}
          type="text"
          placeholder="Search"
          className="max-w-xs py-5 pl-5 h-9 border-gray-200 text-sm pr-12" />
        <span className='relative right-13 hover:cursor-pointer'>
          <Search onClick={()=>{
            onFilterChange(inputRef.current?.value ?? '', 'anyKey')}} />
        </span>
        <NewSelect
          
          key={resetKey + "-project"}
          placeholder="Project"
          values={projectOptions}
          option="projectId"
          containerClassName="bg-gray-100 text-gray-700 font-medium"
          triggerClassName="border-0 w-[250px]"
          onValueChange={onFilterChange}
        />

        <NewSelect
          key={resetKey + "-type"}
          placeholder="Type"
          values={typeOptions}
          option="type"
          containerClassName="bg-gray-100 text-gray-700 font-medium"
          triggerClassName="border-0"
          onValueChange={onFilterChange}
        />

        <NewSelect
          key={resetKey + "-status"}
          placeholder="Status"
          values={statusOptions}
          option="status"
          containerClassName="bg-gray-100 text-gray-700 font-medium"
          triggerClassName="border-0"
          onValueChange={onFilterChange}
        />

        <NewSelect
          key={resetKey + "-priority"}
          placeholder="Priority"
          values={priorityOptions}
          option="priority"
          containerClassName="bg-gray-100 text-gray-700 font-medium"
          triggerClassName="border-0"
          onValueChange={onFilterChange}
        />

        <Button
          className="hover:cursor-pointer"
          variant={'outline'}
          onClick={() => {
            onFilterChange(null, 'reset')
            setResetKey(prev => prev + 1); // 👈 force reset selects

          }}

        >
          Reset
          <RotateCw />
        </Button>
      </div>
      {((!loadingResult && !errorResult) || resultData?.data.length) &&
        <IssueTable
          data={resultData?.data!}
          page={page}
          limit={resultData?.totalPages!}
          total={issues.length}
          onPageChange={setPage}
        />
      }
    </>
  )
}

export default Header