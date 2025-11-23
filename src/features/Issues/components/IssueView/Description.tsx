import React, { FC, useState } from "react";
import { issueService } from "../../service/issue.service";

type props = {
  description: string | null;
  issueId: string;
  refetch: () => void;
};

export const Description: FC<props> = ({ description, issueId, refetch }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(description ?? "");
  const [loading, setLoading] = useState(false);

  const startEditing = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await issueService.updateIssue(issueId, {
        description: value,
      });

      setEditing(false);
      refetch();

    } catch (err) {
      console.error("Failed to update description:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original description from backend
    setValue(description ?? "");
    setEditing(false);
  };

  return (
    <section className="mt-2">

      {/* VIEW MODE */}
      {!editing && (
        <div
          className="text-[14px] text-gray-700 leading-relaxed min-h-[90px] p-2 rounded cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={startEditing}
        >
          {value ? (
            <span>{value}</span>
          ) : (
            <span className="text-gray-400">Click to add description…</span>
          )}
        </div>
      )}

      {/* EDIT MODE */}
      {editing && (
        <div className="border rounded-md shadow-sm bg-white p-3">
          <textarea
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancel();
            }}
            className="w-full min-h-[140px] text-sm p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
          />

          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-slate-700 disabled:opacity-50"
            >
              {loading ? "Saving…" : "Save"}
            </button>

            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-gray-600 hover:underline text-sm"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
