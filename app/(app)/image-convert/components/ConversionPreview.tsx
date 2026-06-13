"use client";

import React, { useState } from "react";
import { IconDownload, IconPhoto, IconArrowsSplit, IconRefresh, IconArrowRight } from "@tabler/icons-react";
import { toast } from "@/app/store/Toast";
import { cn } from "@/app/lib/utils";

interface UploadedFile {
  publicId: string;
  url: string;
  name: string;
  size: number;
  format: string;
}

interface ConversionPreviewProps {
  uploadedFile: UploadedFile | null;
  convertedUrl: string | null;
  targetFormat: string;
  isProcessing: boolean;
  onConvert: () => void;
}

export default function ConversionPreview({
  uploadedFile,
  convertedUrl,
  targetFormat,
  isProcessing,
  onConvert,
}: ConversionPreviewProps) {
  const [viewMode, setViewMode] = useState<"side-by-side" | "result-only">("side-by-side");

  const handleDownload = () => {
    if (!convertedUrl || !uploadedFile) return;

    toast("Preparing converted asset for download...", "info");
    const cleanName = uploadedFile.name.replace(/\.[^/.]+$/, "");
    const filename = `${cleanName}_converted.${targetFormat}`;

    fetch(convertedUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch image data");
        return res.blob();
      })
      .then((blob) => {
        const localUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = localUrl;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(localUrl);
        toast(`Downloaded: ${filename}`, "success");
      })
      .catch((err) => {
        console.error("Direct download failed, opening in new tab:", err);
        const link = document.createElement("a");
        link.href = convertedUrl;
        link.setAttribute("target", "_blank");
        link.click();
      });
  };

  if (!uploadedFile) {
    return (
      <div className="flex-1 bg-slate-950/60 rounded-2xl border border-base-content/10 min-h-[400px] flex items-center justify-center p-6 text-center select-none bg-[radial-gradient(#ffffff04_1px,transparent_1px)] bg-[size:16px_16px]">
        <div className="max-w-xs space-y-2.5">
          <div className="w-12 h-12 rounded-full bg-base-100 border border-base-content/10 flex items-center justify-center mx-auto opacity-55">
            <IconPhoto className="w-5 h-5 text-base-content/70" />
          </div>
          <p className="text-xs font-bold text-base-content/75">Workspace Visualizer Idle</p>
          <p className="text-[10px] text-base-content/40 leading-normal">
            Upload an image to start format conversion operations and preview output changes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-900 border border-base-content/10 rounded-2xl overflow-hidden shadow-xl min-h-[480px]">
      {/* Visualizer Toolbar */}
      <div className="h-12 border-b border-white/5 bg-slate-950/80 backdrop-blur-md px-4 flex items-center justify-between z-10 shrink-0 text-white/70 text-[11px] font-bold">
        <div className="flex items-center gap-1.5 font-semibold">
          <span className={cn("w-2 h-2 rounded-full", isProcessing ? "bg-amber-500 animate-pulse" : convertedUrl ? "bg-emerald-500 animate-pulse" : "bg-indigo-500 animate-pulse")}></span>
          <span>Visualizer Canvas</span>
        </div>

        {/* View Mode Switcher */}
        {convertedUrl && (
          <div className="join bg-white/5 border border-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("side-by-side")}
              className={cn("join-item btn btn-xs border-none text-[9px] uppercase px-2 font-bold cursor-pointer rounded-md", viewMode === "side-by-side" ? "bg-white/15 text-white" : "bg-transparent text-white/40")}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode("result-only")}
              className={cn("join-item btn btn-xs border-none text-[9px] uppercase px-2 font-bold cursor-pointer rounded-md", viewMode === "result-only" ? "bg-white/15 text-white" : "bg-transparent text-white/40")}
            >
              Result Only
            </button>
          </div>
        )}
      </div>

      {/* Main Canvas Viewport */}
      <div className="flex-1 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] bg-[size:16px_16px] bg-slate-950 flex items-center justify-center p-6 overflow-hidden relative select-none min-h-[300px]">
        {isProcessing ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full border-3 border-t-indigo-500 border-white/10 animate-spin"></div>
            <div className="space-y-0.5">
              <p className="font-bold text-white text-xs">Transforming Image Format...</p>
              <p className="text-[9px] text-white/50">Eager rendering pipeline executing on Cloudinary Server</p>
            </div>
          </div>
        ) : convertedUrl ? (
          <div className="w-full h-full flex flex-col justify-center items-center">
            {viewMode === "side-by-side" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full max-w-4xl">
                {/* Source */}
                <div className="flex flex-col items-center gap-2">
                  <div className="text-[9px] text-white/50 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span>Source Canvas</span>
                    <span className="bg-white/10 text-white/70 px-1 py-0.2 rounded font-mono text-[8px]">{uploadedFile.format.toUpperCase()}</span>
                  </div>
                  <div className="w-full aspect-video md:aspect-[4/3] rounded-xl overflow-hidden border border-white/5 bg-slate-900/60 relative flex items-center justify-center group shadow-md">
                    <img src={uploadedFile.url} alt="Original source" className="w-full h-full object-contain pointer-events-none" />
                  </div>
                </div>

                {/* Converted */}
                <div className="flex flex-col items-center gap-2">
                  <div className="text-[9px] text-primary font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span>Converted Canvas</span>
                    <span className="bg-primary/20 text-primary px-1 py-0.2 rounded font-mono text-[8px]">{targetFormat.toUpperCase()}</span>
                  </div>
                  <div className="w-full aspect-video md:aspect-[4/3] rounded-xl overflow-hidden border border-primary/25 bg-slate-900/60 relative flex items-center justify-center group shadow-md">
                    <img src={convertedUrl} alt="Converted result" className="w-full h-full object-contain pointer-events-none" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 w-full max-w-xl">
                <span className="text-[9px] text-primary font-bold uppercase tracking-wider bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                  Resulting {targetFormat.toUpperCase()}
                </span>
                <div className="w-full aspect-video md:aspect-[4/3] rounded-xl overflow-hidden border border-white/5 bg-slate-900/60 relative flex items-center justify-center shadow-lg">
                  <img src={convertedUrl} alt="Converted output" className="w-full h-full object-contain pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/50">
              <IconPhoto className="w-5 h-5" />
            </div>
            <div className="space-y-1 max-w-xs">
              <p className="font-extrabold text-white text-xs">Ready for Conversion</p>
              <p className="text-[9px] text-white/50 leading-normal">
                Choose your desired target format in the options panel, then click convert to execute format transformations.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-white/5 bg-slate-950/40 shrink-0 flex flex-col sm:flex-row gap-2">
        {convertedUrl ? (
          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="flex-1 btn btn-success text-white flex items-center justify-center gap-1.5 rounded-xl shadow-md cursor-pointer font-extrabold text-xs"
          >
            <IconDownload className="w-4 h-4" />
            Download Converted Image
          </button>
        ) : (
          <button
            onClick={onConvert}
            disabled={isProcessing || !targetFormat}
            className="flex-1 btn btn-primary text-primary-content flex items-center justify-center gap-1.5 rounded-xl shadow-md cursor-pointer font-extrabold text-xs border-none"
          >
            {isProcessing ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <>
                <IconRefresh className="w-4 h-4 animate-spin-slow" />
                Convert Format
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
