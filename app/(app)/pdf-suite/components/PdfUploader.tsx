"use client";

import React from "react";
import { IconUpload } from "@tabler/icons-react";
import { toast } from "@/app/store/Toast";

interface UploadedFile {
  name: string;
  publicId: string;
  url: string;
  pages: number;
  bytes: number;
}

interface PdfUploaderProps {
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
  onUploadSuccess: (file: UploadedFile) => void;
  setErrorMsg: (error: string | null) => void;
  label?: string;
  sublabel?: string;
}

export default function PdfUploader({
  isUploading,
  setIsUploading,
  onUploadSuccess,
  setErrorMsg,
  label = "Upload PDF Document",
  sublabel = "Select PDF files sequentially",
}: PdfUploaderProps) {

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Url = reader.result as string;

      try {
        const response = await fetch("/api/manage-pdf/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileUrl: base64Url }),
        });

        if (!response.ok) {
          throw new Error("Failed to upload PDF to server");
        }

        const data = await response.json();
        if (data.success) {
          onUploadSuccess({
            name: file.name,
            publicId: data.publicId,
            url: data.url,
            pages: data.pages || 1,
            bytes: data.bytes || file.size,
          });
          toast("Document uploaded to workspace!", "success");
        } else {
          throw new Error(data.error || "Unknown upload error");
        }
      } catch (err: unknown) {
        console.error("PDF upload error:", err);
        const errMsg = err instanceof Error ? err.message : "Failed to upload file.";
        setErrorMsg(errMsg);
        toast("Document registration failed.", "error");
      } finally {
        setIsUploading(false);
      }
    };
  };

  return (
    <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-base-content/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-base-100/40 relative">
      {isUploading ? (
        <div className="flex flex-col items-center gap-2 text-center py-2">
          <span className="loading loading-spinner loading-md text-primary"></span>
          <span className="text-xs font-bold text-base-content/85">Uploading PDF...</span>
        </div>
      ) : (
        <>
          <IconUpload className="w-8 h-8 opacity-40 mb-2 text-primary" />
          <span className="text-xs font-bold">{label}</span>
          <span className="text-[10px] text-base-content/40 mt-1">{sublabel}</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </>
      )}
    </label>
  );
}
