import { FC, useEffect, useState } from "react";
import { Plus, X, FileText, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type props = {
  savedAttachments: string[] | [];
};

type Attachment = {
  name: string;
  url?: string;
  file?: File;
  isLocal: boolean;
  isImage: boolean;
};

export const Attachments: FC<props> = ({ savedAttachments }) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if(!savedAttachments || !savedAttachments.length) return;
    const remoteFiles: Attachment[] = savedAttachments.map((url) => {
      const name = url.split("/").pop() || "file";

      const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp"];
      const ext = name.split(".").pop()?.toLowerCase() || "";
      const isImage = imageExtensions.includes(ext);

      return {
        name,
        url,
        isLocal: false,
        isImage,
      };
    });

    setAttachments((prev) => {
      const filtered = prev.filter((a) => a.isLocal);
      return [...remoteFiles, ...filtered];
    });
  }, [savedAttachments]);

  // Handle local uploads
  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles: Attachment[] = Array.from(files).map((file) => ({
      name: file.name,
      file,
      isLocal: true,
      isImage: file.type.startsWith("image/"),
    }));

    setAttachments((prev) => [...prev, ...newFiles]);
  };

  // Remove attachment
  const removeFile = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  // Image or Download click
  const handleClickFile = (item: Attachment) => {
    if (item.isImage) {
      const url = item.url ?? URL.createObjectURL(item.file!);
      setPreviewImage(url);
    } else {
      const url = item.url ?? URL.createObjectURL(item.file!);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.name;
      a.click();
    }
  };

  return (
    <section className="mt-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Attachments ({attachments.length})
      </h3>

      {/* Grid: 3 per row */}
      <div className="grid grid-cols-3 gap-4">

        {/* Existing attachments */}
        {attachments.map((item, idx) => {
          const previewUrl =
            item.url ?? URL.createObjectURL(item.file || new Blob());

          return (
            <div
              key={idx}
              className="relative border rounded-md p-3 bg-white shadow-sm hover:shadow transition cursor-pointer"
              onClick={() => handleClickFile(item)}
            >
              {/* Remove button */}
              <button
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>

              {/* Thumbnail or icon */}
              <div className="flex items-center justify-center mb-3 h-20 bg-gray-50 rounded">
                {item.isImage ? (
                  <img
                    src={previewUrl}
                    alt={item.name}
                    className="max-h-full rounded"
                  />
                ) : (
                  <FileText className="w-8 h-8 text-gray-500" />
                )}
              </div>

              {/* Name */}
              <p className="text-xs font-medium text-gray-800 truncate">
                {item.name}
              </p>

              {/* No file size from backend → skip */}
            </div>
          );
        })}

        {/* UPLOAD TILE */}
        <label className="border rounded-md p-3 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition">
          <Plus className="w-6 h-6 text-gray-600 mb-1" />
          <span className="text-xs text-gray-600">Add attachment</span>

          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>

      {/* Image Preview Modal */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="p-0 bg-transparent border-none shadow-none">
          {previewImage && (
            <img
              src={previewImage}
              alt="preview"
              className="max-w-full max-height-[90vh] rounded-lg shadow-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
