import React, { useState, DragEvent, useRef } from "react";
import { Upload, FileIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  name: string;
  multiple?: boolean;
  onChange?: (files: File[] | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  name,
  multiple = true,
  onChange,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);
    const newFiles = multiple ? [...files, ...fileArray] : fileArray.slice(0, 1);
    setFiles(newFiles);
    onChange?.(newFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onChange?.(updatedFiles.length ? updatedFiles : null);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={handleDrop}
      className={`w-[350px] px-3 py-6 rounded-xl border border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
        isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-100"
      } hover:border-gray-400`}
      onClick={() => fileInputRef.current?.click()}
    >
      {!files.length ? (
        <>
          <Upload className="w-8 h-8 text-gray-500 mb-2" />
          {/* <p className="text-sm text-gray-600 mb-1">
            {isDragging ? "Drop your files here" : "Drag & drop your files here"}
          </p>
          <p className="text-xs text-gray-400 mb-3">or click to browse</p>
          <Button variant="outline" size="sm" type="button">
            Choose Files
          </Button> */}
        </>
      ) : (
        <div className="w-full space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between w-full px-3 py-2 rounded-md bg-white shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-2 text-gray-700">
                <FileIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm truncate max-w-[180px]">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        name={name}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUploader;
