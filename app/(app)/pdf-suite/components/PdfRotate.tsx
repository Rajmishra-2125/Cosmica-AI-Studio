"use client";

import React, { useState } from "react";
import { IconRotate, IconFileText, IconDownload } from "@tabler/icons-react";
import { toast } from "@/app/store/Toast";
import { cn } from "@/app/lib/utils";
import PdfUploader from "./PdfUploader";

interface UploadedFile {
  name: string;
  publicId: string;
  url: string;
  pages: number;
  bytes: number;
}

interface PdfRotateProps {
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
  setErrorMsg: (error: string | null) => void;
  handleDownload: (url: string, filename: string) => void;
}

export default function PdfRotate({
  isUploading,
  setIsUploading,
  setErrorMsg,
  handleDownload,
}: PdfRotateProps) {
  const [rotateFile, setRotateFile] = useState<UploadedFile | null>(null);
  const [rotateAngle, setRotateAngle] = useState<90 | 180 | 270>(90);
  const [rotatedUrl, setRotatedUrl] = useState<string | null>(null);
  const [isProcessingRotate, setIsProcessingRotate] = useState(false);

  const getPdfPageThumbnailUrl = (publicId: string, pageNumber: number) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxojgqsrh";
    return `https://res.cloudinary.com/${cloudName}/image/upload/w_200,h_260,c_fill,pg_${pageNumber}/${publicId}.jpg`;
  };

  const runRotate = async () => {
    if (!rotateFile) return;
    setIsProcessingRotate(true);
    setRotatedUrl(null);
    setErrorMsg(null);
    toast("Applying rotation matrices to pages...", "info");

    try {
      const response = await fetch("/api/manage-pdf/rotate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: rotateFile.publicId, angle: rotateAngle }),
      });

      const data = await response.json();
      if (data.success) {
        setRotatedUrl(data.rotatedUrl);
        toast("Rotation applied successfully!", "success");
      } else {
        throw new Error(data.error || "Rotate failed");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to rotate PDF.");
      toast("Rotate failed.", "error");
    } finally {
      setIsProcessingRotate(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-base-content/60">Upload PDF to Rotate</label>
        {!rotateFile ? (
          <PdfUploader
            isUploading={isUploading}
            setIsUploading={setIsUploading}
            setErrorMsg={setErrorMsg}
            onUploadSuccess={(file) => setRotateFile(file)}
            label="Choose a PDF file"
          />
        ) : (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-base-100 border border-base-content/5 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3.5 min-w-0">
              <IconFileText className="w-8 h-8 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold truncate max-w-xs">{rotateFile.name}</p>
                <p className="text-[10px] text-base-content/40 mt-0.5 font-semibold">
                  Pages: {rotateFile.pages} • Size: {(rotateFile.bytes / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setRotateFile(null);
                setRotatedUrl(null);
              }}
              className="btn btn-ghost btn-xs text-error font-bold"
            >
              Replace File
            </button>
          </div>
        )}
      </div>

      {rotateFile && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-3">
            <span className="text-xs font-semibold text-base-content/60">Select Rotation Angle</span>
            <div className="grid grid-cols-3 gap-3">
              {([90, 180, 270] as const).map((angle) => (
                <button
                  key={angle}
                  type="button"
                  onClick={() => setRotateAngle(angle)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer",
                    rotateAngle === angle
                      ? "bg-primary/10 border-primary text-primary font-bold shadow-inner"
                      : "bg-base-100/40 border-base-content/10 text-base-content/75 hover:border-base-content/25"
                  )}
                >
                  <IconRotate className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold">{angle}° Clockwise</span>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Page Rotation Indicators Grid */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 pl-1 block">
              Visual rotation indicators (rendering page 1 of {rotateFile.pages})
            </span>
            <div className="flex items-center justify-center bg-slate-900 rounded-xl p-6 border border-base-content/10">
              <div
                className="w-32 aspect-[3/4] bg-base-100 border border-base-content/10 shadow-2xl rounded-md transition-transform duration-300 overflow-hidden flex items-center justify-center relative select-none"
                style={{ transform: `rotate(${rotateAngle}deg)` }}
              >
                <img
                  src={getPdfPageThumbnailUrl(rotateFile.publicId, 1)}
                  alt="PDF Page 1"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/5"></div>
              </div>
            </div>
          </div>

          <button
            onClick={runRotate}
            disabled={isProcessingRotate}
            className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3 cursor-pointer font-bold text-xs"
          >
            {isProcessingRotate ? (
              <span className="flex items-center gap-1.5">
                <span className="loading loading-spinner loading-xs"></span>
                Processing rotation matrices...
              </span>
            ) : (
              "Apply Page Rotation"
            )}
          </button>
        </div>
      )}

      {rotatedUrl && (
        <div className="p-4 rounded-xl bg-success/15 border border-success/35 flex items-center justify-between gap-4 animate-fade-in">
          <div>
            <p className="text-xs font-bold text-success-content">Rotation Applied!</p>
            <p className="text-[10px] text-success-content/70 mt-0.5 font-semibold">
              Document rotated {rotateAngle}° clockwise.
            </p>
          </div>
          <button
            onClick={() => handleDownload(rotatedUrl, "rotated.pdf")}
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
