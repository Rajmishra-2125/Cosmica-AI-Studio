"use client";

import React, { useState } from "react";
import { IconGitMerge, IconArrowUp, IconArrowDown, IconTrash, IconDownload } from "@tabler/icons-react";
import { toast } from "@/app/store/Toast";
import PdfUploader from "./PdfUploader";

interface UploadedFile {
  name: string;
  publicId: string;
  url: string;
  pages: number;
  bytes: number;
}

interface PdfMergeProps {
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
  setErrorMsg: (error: string | null) => void;
  handleDownload: (url: string, filename: string) => void;
}

export default function PdfMerge({
  isUploading,
  setIsUploading,
  setErrorMsg,
  handleDownload,
}: PdfMergeProps) {
  const [mergeFiles, setMergeFiles] = useState<UploadedFile[]>([]);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [isProcessingMerge, setIsProcessingMerge] = useState(false);

  const moveMergeItem = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= mergeFiles.length) return;
    const newFiles = [...mergeFiles];
    const temp = newFiles[index];
    newFiles[index] = newFiles[nextIndex];
    newFiles[nextIndex] = temp;
    setMergeFiles(newFiles);
  };

  const runMerge = async () => {
    if (mergeFiles.length < 2) return;
    setIsProcessingMerge(true);
    setMergedUrl(null);
    setErrorMsg(null);
    toast("Generating merged PDF structure...", "info");

    try {
      const ids = mergeFiles.map((f) => f.publicId);
      const tag = `merge_${Date.now()}`;
      const response = await fetch("/api/manage-pdf/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicIds: ids, mergeTag: tag }),
      });

      const data = await response.json();
      if (data.success) {
        setMergedUrl(data.mergedPdfUrl);
        toast("Documents merged successfully!", "success");
      } else {
        throw new Error(data.error || "Merge failed");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to merge PDF files.");
      toast("Merge operation failed.", "error");
    } finally {
      setIsProcessingMerge(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-base-content/60">Upload PDFs to Merge</label>
        <PdfUploader
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          setErrorMsg={setErrorMsg}
          onUploadSuccess={(newFile) => setMergeFiles((prev) => [...prev, newFile])}
          label="Upload PDF Document"
          sublabel="Select PDF files sequentially"
        />
      </div>

      {mergeFiles.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">
              Merge Order list ({mergeFiles.length} files)
            </span>
            <button
              onClick={() => setMergeFiles([])}
              className="btn btn-ghost btn-xs text-error hover:bg-error/10"
            >
              Clear Queue
            </button>
          </div>

          {/* Visual reorder lists */}
          <div className="space-y-2.5">
            {mergeFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-base-100 border border-base-content/5 shadow-sm"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate max-w-xs">{file.name}</p>
                    <p className="text-[10px] text-base-content/40 mt-0.5 font-semibold">
                      Pages: {file.pages} • Size: {(file.bytes / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveMergeItem(idx, "up")}
                    disabled={idx === 0}
                    className="btn btn-ghost btn-circle btn-xs text-base-content/40 hover:text-base-content disabled:opacity-30"
                    title="Move Up"
                  >
                    <IconArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveMergeItem(idx, "down")}
                    disabled={idx === mergeFiles.length - 1}
                    className="btn btn-ghost btn-circle btn-xs text-base-content/40 hover:text-base-content disabled:opacity-30"
                    title="Move Down"
                  >
                    <IconArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      setMergeFiles((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="btn btn-ghost btn-circle btn-xs text-base-content/40 hover:text-error hover:bg-error/10 ml-1.5"
                    title="Remove file"
                  >
                    <IconTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={runMerge}
            disabled={mergeFiles.length < 2 || isProcessingMerge}
            className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3 cursor-pointer font-bold text-xs"
          >
            {isProcessingMerge ? (
              <span className="flex items-center gap-1.5">
                <span className="loading loading-spinner loading-xs"></span>
                Recombining PDF documents...
              </span>
            ) : (
              "Generate Combined Document"
            )}
          </button>
        </div>
      )}

      {mergedUrl && (
        <div className="p-4 rounded-xl bg-success/15 border border-success/35 flex items-center justify-between gap-4 animate-fade-in">
          <div>
            <p className="text-xs font-bold text-success-content">Merge Completed!</p>
            <p className="text-[10px] text-success-content/70 mt-0.5 font-semibold">Your structured PDF is ready.</p>
          </div>
          <button
            onClick={() => handleDownload(mergedUrl, "merged.pdf")}
            className="btn btn-success btn-sm text-white flex items-center gap-1.5 rounded-lg shadow-sm cursor-pointer"
          >
            <IconDownload className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
