import React, { FC } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import NewSelect, { NewSelectValues } from '@/components/ui/NewSelect'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

type props = {
    onFilterChange: (item: NewSelectValues | number | string | null, option?: string) => void;
    resetKey: number;
    projectOptions: NewSelectValues[] | undefined,
    statusOptions: NewSelectValues[] | undefined,
    priorityOptions: NewSelectValues[] | undefined
    typeOptions: NewSelectValues[] | undefined
}

const HeaderFilter: FC<props> = ({ onFilterChange, resetKey, projectOptions, statusOptions, priorityOptions, typeOptions }) => {
    return (
        <Popover>
            <PopoverTrigger><Button>Filter</Button></PopoverTrigger>
            <PopoverContent className='min-w-[600px]'>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            onChange={(e) => onFilterChange(e.currentTarget.value, 'projectIssueId')}
                            type="text"
                            placeholder="Search by key"
                            className="max-w-xs py-5 pl-5 h-9 border-gray-200 text-sm pr-12" />
                        <span className='relative right-13 top-2 hover:cursor-pointer'>
                            <Search />
                        </span>
                        <NewSelect
                            key={resetKey + "-project"}
                            placeholder="Project"
                            values={projectOptions}
                            option="projectId"
                            containerClassName="bg-gray-100 text-gray-700 font-medium"
                            triggerClassName="border-0"
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
                    </div>
            </PopoverContent>
        </Popover>
    )
}

export default HeaderFilter
