"use client";

import React, { useState } from "react";
import { IconFileText, IconCheck, IconDownload } from "@tabler/icons-react";
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

interface PdfPagesProps {
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
  setErrorMsg: (error: string | null) => void;
  handleDownload: (url: string, filename: string) => void;
}

export default function PdfPages({
  isUploading,
  setIsUploading,
  setErrorMsg,
  handleDownload,
}: PdfPagesProps) {
  const [managerFile, setManagerFile] = useState<UploadedFile | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isProcessingPages, setIsProcessingPages] = useState(false);
  const [extractedPages, setExtractedPages] = useState<{ page: number; imageUrl: string }[]>([]);
  const [removedPagesUrl, setRemovedPagesUrl] = useState<string | null>(null);

  const getPdfPageThumbnailUrl = (publicId: string, pageNumber: number) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxojgqsrh";
    return `https://res.cloudinary.com/${cloudName}/image/upload/w_200,h_260,c_fill,pg_${pageNumber}/${publicId}.jpg`;
  };

  const togglePageSelection = (page: number) => {
    setSelectedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    );
  };

  const runPageManager = async (action: "extract" | "remove") => {
    if (!managerFile || selectedPages.length === 0) return;
    setIsProcessingPages(true);
    setExtractedPages([]);
    setRemovedPagesUrl(null);
    setErrorMsg(null);
    toast("Restructuring document sheets...", "info");

    try {
      if (action === "extract") {
        const response = await fetch("/api/manage-pdf/extract-pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: managerFile.publicId, pages: selectedPages }),
        });

        const data = await response.json();
        if (data.success) {
          setExtractedPages(data.extractedPages);
          toast("Pages extracted successfully!", "success");
        } else {
          throw new Error(data.error || "Extraction failed");
        }
      } else {
        const response = await fetch("/api/manage-pdf/remove-pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publicId: managerFile.publicId,
            totalPages: managerFile.pages,
            removePages: selectedPages,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setRemovedPagesUrl(data.pdfUrl);
          toast("Selected pages removed from document!", "success");
        } else {
          throw new Error(data.error || "Removal failed");
        }
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to perform page operation.");
      toast("Page operation failed.", "error");
    } finally {
      setIsProcessingPages(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-base-content/60">Upload PDF for Structure Restructuring</label>
        {!managerFile ? (
          <PdfUploader
            isUploading={isUploading}
            setIsUploading={setIsUploading}
            setErrorMsg={setErrorMsg}
            onUploadSuccess={(file) => {
              setManagerFile(file);
              setSelectedPages([]);
            }}
            label="Choose a PDF file"
          />
        ) : (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-base-100 border border-base-content/5 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3.5 min-w-0">
              <IconFileText className="w-8 h-8 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold truncate max-w-xs">{managerFile.name}</p>
                <p className="text-[10px] text-base-content/40 mt-0.5 font-semibold">
                  Pages: {managerFile.pages} • Size: {(managerFile.bytes / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setManagerFile(null);
                setSelectedPages([]);
                setExtractedPages([]);
                setRemovedPagesUrl(null);
              }}
              className="btn btn-ghost btn-xs text-error font-bold"
            >
              Replace File
            </button>
          </div>
        )}
      </div>

      {managerFile && (
        <div className="space-y-6 animate-fade-in">
          {/* Visual Grid of PDF Pages with checkbox selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 pl-1 block">
                Visual Page Selection ({selectedPages.length} pages checked)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPages(Array.from({ length: managerFile.pages }, (_, i) => i + 1))}
                  className="btn btn-ghost btn-xs text-[10px] font-bold uppercase cursor-pointer"
                >
                  Check All
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPages([])}
                  className="btn btn-ghost btn-xs text-[10px] font-bold uppercase cursor-pointer"
                >
                  Uncheck All
                </button>
              </div>
            </div>

            {/* visual page grid */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-6 max-h-[300px] overflow-y-auto p-2 bg-slate-900 rounded-2xl border border-base-content/10">
              {Array.from({ length: managerFile.pages }, (_, i) => i + 1).map((page) => {
                const isChecked = selectedPages.includes(page);
                return (
                  <div
                    key={page}
                    onClick={() => togglePageSelection(page)}
                    className={cn(
                      "relative aspect-[3/4] bg-base-100 border border-base-content/10 shadow-sm rounded-lg overflow-hidden cursor-pointer select-none hover:scale-102 hover:border-primary/40 transition-all",
                      isChecked && "border-primary bg-primary/5 shadow-primary/10"
                    )}
                  >
                    <img
                      src={getPdfPageThumbnailUrl(managerFile.publicId, page)}
                      alt={`Page ${page}`}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-primary/2 opacity-20 pointer-events-none"></div>

                    {/* Page Number Label */}
                    <span className="absolute bottom-2 left-2 bg-slate-950/80 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded">
                      Page {page}
                    </span>

                    {/* Visual checkmark circle */}
                    <div
                      className={cn(
                        "absolute top-2 right-2 w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                        isChecked
                          ? "bg-primary border-primary text-primary-content"
                          : "bg-black/50 border-white/20 text-transparent"
                      )}
                    >
                      <IconCheck className="w-2.5 h-2.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => runPageManager("extract")}
              disabled={isProcessingPages || selectedPages.length === 0}
              className="btn btn-primary flex-1 text-primary-content border-none shadow-md rounded-xl py-3 text-xs font-bold cursor-pointer"
            >
              Extract Checked Pages
            </button>
            <button
              onClick={() => runPageManager("remove")}
              disabled={isProcessingPages || selectedPages.length === 0}
              className="btn btn-outline flex-1 border-base-content/10 text-base-content rounded-xl py-3 text-xs font-bold cursor-pointer"
            >
              Remove Checked Pages
            </button>
          </div>
        </div>
      )}

      {/* Display results */}
      {extractedPages.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-base-content/5 animate-fade-in">
          <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 pl-1 block">
            Extracted Pages (Click to download individual pages)
          </span>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-6 max-h-[220px] overflow-y-auto p-1">
            {extractedPages.map((pageData) => (
              <div
                key={pageData.page}
                className="relative aspect-[3/4] bg-base-100 border border-base-content/5 rounded-lg overflow-hidden shadow-md group select-none"
              >
                <img
                  src={pageData.imageUrl}
                  alt={`Extracted ${pageData.page}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button
                    onClick={() => handleDownload(pageData.imageUrl, `page_${pageData.page}.jpg`)}
                    className="btn btn-primary btn-xs text-[10px] font-bold border-none rounded-md cursor-pointer"
                  >
                    Download
                  </button>
                </div>
                <span className="absolute bottom-2 left-2 bg-slate-950/80 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded">
                  Page {pageData.page}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {removedPagesUrl && (
        <div className="p-4 rounded-xl bg-success/15 border border-success/35 flex items-center justify-between gap-4 animate-fade-in">
          <div>
            <p className="text-xs font-bold text-success-content">Restructuring Completed!</p>
            <p className="text-[10px] text-success-content/70 mt-0.5 font-semibold">Selected pages have been omitted.</p>
          </div>
          <button
            onClick={() => handleDownload(removedPagesUrl, "restructured.pdf")}
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
