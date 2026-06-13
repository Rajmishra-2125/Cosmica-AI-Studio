"use client";

import React, { useState } from "react";
import { IconFileText, IconDownload } from "@tabler/icons-react";
import { toast } from "@/app/store/Toast";
import PdfUploader from "./PdfUploader";

interface UploadedFile {
  name: string;
  publicId: string;
  url: string;
  pages: number;
  bytes: number;
}

interface PdfOptimizeProps {
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
  setErrorMsg: (error: string | null) => void;
  handleDownload: (url: string, filename: string) => void;
}

interface OptimizeResult {
  [publicId: string]: {
    optimizedUrl?: string;
    error?: string;
    stats?: {
      originalBytes: number;
      optimizedBytes: number;
      savedBytes: number;
      savedPercent: string;
    };
  };
}

export default function PdfOptimize({
  isUploading,
  setIsUploading,
  setErrorMsg,
  handleDownload,
}: PdfOptimizeProps) {
  const [optimizeFiles, setOptimizeFiles] = useState<UploadedFile[]>([]);
  const [targetSizeKb, setTargetSizeKb] = useState<number>(200);
  const [isProcessingOptimize, setIsProcessingOptimize] = useState(false);
  const [optimizeResults, setOptimizeResults] = useState<OptimizeResult>({});

  const runOptimize = async () => {
    if (optimizeFiles.length === 0) return;
    setIsProcessingOptimize(true);
    setErrorMsg(null);
    toast("Compressing document stream...", "info");

    try {
      const results: OptimizeResult = {};

      await Promise.all(
        optimizeFiles.map(async (file) => {
          try {
            const response = await fetch("/api/manage-pdf/optimize", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                publicId: file.publicId,
                targetSizeKb: targetSizeKb,
              }),
            });

            const data = await response.json();
            if (data.success) {
              results[file.publicId] = {
                optimizedUrl: data.optimizedUrl,
                stats: data.stats,
              };
            } else {
              results[file.publicId] = { error: data.error || "Compression failed" };
            }
          } catch (err: unknown) {
            results[file.publicId] = { error: err instanceof Error ? err.message : "Request failed" };
          }
        })
      );

      setOptimizeResults(results);
      toast("Compression batch process complete!", "success");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to complete compression queue.");
      toast("Compression failed.", "error");
    } finally {
      setIsProcessingOptimize(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-base-content/60">Upload PDFs to Optimize</label>
        <PdfUploader
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          setErrorMsg={setErrorMsg}
          onUploadSuccess={(file) => setOptimizeFiles((prev) => [...prev, file])}
          label="Choose a PDF file to compress"
          sublabel="Select PDF documents"
        />
      </div>

      {optimizeFiles.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">
              Batch Compression Queue ({optimizeFiles.length} files)
            </span>
            <button
              onClick={() => {
                setOptimizeFiles([]);
                setOptimizeResults({});
              }}
              className="btn btn-ghost btn-xs text-error hover:bg-error/10"
            >
              Clear Batch
            </button>
          </div>

          <div className="space-y-2.5">
            {optimizeFiles.map((file, idx) => {
              const result = optimizeResults[file.publicId];
              return (
                <div
                  key={idx}
                  className="flex flex-col gap-3 p-3.5 rounded-xl bg-base-100 border border-base-content/5 shadow-sm"
                >
                  <div className="flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <IconFileText className="w-7 h-7 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate max-w-xs">{file.name}</p>
                        <p className="text-[10px] text-base-content/40 mt-0.5 font-semibold">
                          Original size: {(file.bytes / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>

                    {/* Action button if optimized */}
                    {result && result.optimizedUrl && (
                      <button
                        onClick={() => handleDownload(result.optimizedUrl!, "optimized.pdf")}
                        className="btn btn-success btn-xs text-white rounded-lg px-3 flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <IconDownload className="w-3 h-3" />
                        Download
                      </button>
                    )}
                  </div>

                  {/* Statistics bar if optimized */}
                  {result && result.stats && (
                    <div className="grid grid-cols-3 gap-2 text-center border-t border-base-content/5 pt-2.5 font-mono text-[9px]">
                      <div>
                        <span className="block text-base-content/40 font-semibold">Compressed</span>
                        <span className="font-bold text-primary">
                          {(result.stats.optimizedBytes / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <div>
                        <span className="block text-base-content/40 font-semibold">Saved</span>
                        <span className="font-bold text-accent">
                          {(result.stats.savedBytes / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <div>
                        <span className="block text-base-content/40 font-semibold">Ratio Saved</span>
                        <span className="font-bold text-accent">{result.stats.savedPercent}%</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-4 border border-base-content/10 rounded-2xl">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase text-base-content/50">Target File Size (KB)</label>
              <input
                type="number"
                value={targetSizeKb}
                onChange={(e) => setTargetSizeKb(Number(e.target.value))}
                className="input input-bordered input-sm rounded-lg bg-base-200 text-xs w-28 focus:border-primary focus:outline-none"
              />
            </div>
            <button
              onClick={runOptimize}
              disabled={isProcessingOptimize}
              className="btn btn-primary text-primary-content border-none shadow-md rounded-xl py-3 px-6 cursor-pointer text-xs font-bold self-end sm:self-auto"
            >
              {isProcessingOptimize ? (
                <span className="flex items-center gap-1.5">
                  <span className="loading loading-spinner loading-xs"></span>
                  Compressing...
                </span>
              ) : (
                "Run Compress Queue"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
