import React from 'react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export type NewSelectValues = {
  id: string;
  value: string;
};
type NewSelectProps = {
  disabled?: boolean;
  containerClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  placeholder?: string;
  values: NewSelectValues[] | undefined;
  defaultValue?: string;
  onValueChange?: (value: NewSelectValues, option?: string) => void;
  value?: string;
  option?: string;
};

const NewSelect: React.FC<NewSelectProps> = ({
  containerClassName,
  disabled,
  triggerClassName,
  contentClassName,
  itemClassName,
  placeholder,
  values,
  defaultValue,
  option,
  onValueChange,
  value
}) => {
  const newOnValueChange = (val: string) => {
    const selected = values?.find(v => v.value === val);
    if (selected) onValueChange?.(selected, option ?? undefined);
  }
  return (
    <div className={cn(containerClassName)}>
      <Select
        disabled={disabled}
        defaultValue={defaultValue}
        onValueChange={newOnValueChange}
        value={value}
      >
        <SelectTrigger
          className={cn(
            "p-5 rounded-sm flex items-center data-[placeholder]:text-muted-foreground",
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={cn("w-full rounded-sm", contentClassName)}>
          <SelectGroup>
            {values && values.length > 0 ? (
              values.map((value, index) => (
                <SelectItem
                  key={index}
                  className={cn(
                    "cursor-pointer hover:bg-gray-100",
                    itemClassName
                  )}
                  value={value.value}
                >
                  {value.value}
                </SelectItem>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-400 cursor-default">
                No data found
              </div>
            )}
          </SelectGroup>
        </SelectContent>

      </Select>
    </div>
  );
};

export default NewSelect;