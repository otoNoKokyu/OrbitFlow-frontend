// FileUploader.tsx
import { useRef, useId } from "react";
import { X, Upload } from "lucide-react";

export interface FileWithId extends File {
  id: string;
}

/** Props accepted by the component */
interface FileUploaderProps {
  value: FileWithId[];
  onChange: (files: FileWithId[]) => void;
  name: string;
}

export default function FileUploader({ value, onChange,name }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const addFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;

    const newFiles: FileWithId[] = Array.from(fileList).map((f) => {
      const file = new File([f], f.name, { type: f.type }) as FileWithId;
      file.id = genId();
      return file;
    });

    onChange([...value, ...newFiles]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (id: string) => {
    onChange(value.filter((f) => f.id !== id));
  };

  return (
    <div className="w-[350px]">
      <label
        htmlFor={uid}
        className="block border border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer p-6 transition"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          addFiles(e.dataTransfer.files);
        }}
      >
        <input
          id={uid}
          ref={inputRef}
          type="file"
          multiple
          name={name}
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
        />

        <div className="flex flex-col items-center text-center space-y-2">
          <Upload className="w-6 h-6 text-gray-600" />
        </div>

        {value.length > 0 && (
          <div className="mt-4 space-y-2">
            {value.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between bg-white rounded-md p-2 border"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Upload className="w-4 h-4 flex-shrink-0 text-gray-600" />
                  <span className="text-sm truncate max-w-[180px]">
                    {file.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="text-red-600 hover:text-red-800 transition"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </label>
    </div>
  );
}