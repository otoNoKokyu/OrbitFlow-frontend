import { FC, useEffect, useState } from "react";
import { Plus, FileText } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type props = {
  id: string;
  savedAttachments: string[];
  saveFn: (...args: any) => void;
  refecth: () => void;
};

type Attachment = {
  name: string;
  key?: string;
  file?: File;
  isLocal: boolean;
  isImage: boolean;
};

const S3_BASE = "https://orbitflow.s3.us-east-1.amazonaws.com/drafts/";

export const Attachments: FC<props> = ({ id, savedAttachments, saveFn, refecth }) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const makeS3Url = (key: string) => `${S3_BASE}${key.split("_")[0]}/${key}`;

  useEffect(() => {
    if (!savedAttachments?.length) return;

    const remoteFiles: Attachment[] = savedAttachments.map((key) => {
      const name = key.split("/").pop() || "file";
      const ext = name.split(".").pop()?.toLowerCase() || "";
      const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp"];
      const isImage = imageExtensions.includes(ext);

      return {
        name,
        key,
        isLocal: false,
        isImage,
      };
    });

    setAttachments((prev) => {
      const localOnly = prev.filter((f) => f.isLocal);
      return [...remoteFiles, ...localOnly];
    });
  }, [savedAttachments]);

  const getPreviewUrl = (item: Attachment) => {
    if (item.isLocal && item.file) return URL.createObjectURL(item.file);
    if (item.key) return makeS3Url(item.key);
    return "";
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const formData = new FormData();
    Array.from(files)?.forEach((file) =>
      formData.append("attachments", file)
    );

    setIsUploading(true);

    try {
      await saveFn(id, formData, true);
      await refecth();
    } finally {
      setIsUploading(false);
    }
  };

  const handleClickFile = (item: Attachment) => {
    const url = getPreviewUrl(item);
    if (!url) return;

    if (item.isImage) {
      setPreviewImage(url);
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.download = item.name;
      a.click();
    }
  };

  return (
    <section className="mt-4 relative">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Attachments ({attachments.length})
      </h3>

      <div className="grid grid-cols-3 gap-4 relative">
        {attachments.map((item, idx) => {
          const previewUrl = getPreviewUrl(item);

          return (
            <div
              key={idx}
              className="relative border rounded-md p-3 bg-white shadow-sm hover:shadow transition cursor-pointer"
              onClick={() => !isUploading && handleClickFile(item)}
            >
              <div className="flex items-center justify-center mb-3 h-20 bg-gray-50 rounded">
                {item.isImage ? (
                  <img src={previewUrl} alt={item.name} className="max-h-full rounded" />
                ) : (
                  <FileText className="w-8 h-8 text-gray-500" />
                )}
              </div>

              <p className="text-xs font-medium text-gray-800 truncate">
                {item.name}
              </p>
            </div>
          );
        })}

        {/* Upload Button */}
        <label className="border rounded-md p-3 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition">
          <Plus className="w-6 h-6 text-gray-600 mb-1" />
          <span className="text-xs text-gray-600">Add attachment</span>

          <input type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </label>
      </div>

      {/* ⛔ Upload Overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] flex flex-col items-center justify-center z-20">
          <div className="animate-spin h-6 w-6 border-4 border-black border-t-transparent rounded-full mb-2"></div>
          <p className="text-sm font-medium">Uploading...</p>
        </div>
      )}

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="p-0 bg-transparent border-none shadow-none">
          {previewImage && (
            <img
              src={previewImage}
              alt="preview"
              className="max-w-full max-h-[90vh] rounded-lg shadow-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
