"use client";

import React, { useState } from "react";
import { IconAward, IconFileText, IconDownload } from "@tabler/icons-react";
import { toast } from "@/app/store/Toast";
import PdfUploader from "./PdfUploader";

interface UploadedFile {
  name: string;
  publicId: string;
  url: string;
  pages: number;
  bytes: number;
}

interface PdfWatermarkProps {
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
  setErrorMsg: (error: string | null) => void;
  handleDownload: (url: string, filename: string) => void;
}

export default function PdfWatermark({
  isUploading,
  setIsUploading,
  setErrorMsg,
  handleDownload,
}: PdfWatermarkProps) {
  const [watermarkFile, setWatermarkFile] = useState<UploadedFile | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkOpacity, setWatermarkOpacity] = useState(30);
  const [watermarkGravity, setWatermarkGravity] = useState<string>("center");
  const [watermarkFontSize, setWatermarkFontSize] = useState(48);
  const [watermarkColor, setWatermarkColor] = useState("red");
  const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null);
  const [isProcessingWatermark, setIsProcessingWatermark] = useState(false);

  const getPdfPageThumbnailUrl = (publicId: string, pageNumber: number) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxojgqsrh";
    return `https://res.cloudinary.com/${cloudName}/image/upload/w_200,h_260,c_fill,pg_${pageNumber}/${publicId}.jpg`;
  };

  const runWatermark = async () => {
    if (!watermarkFile) return;
    setIsProcessingWatermark(true);
    setWatermarkedUrl(null);
    setErrorMsg(null);
    toast("Stamping watermark overlay...", "info");

    try {
      const response = await fetch("/api/manage-pdf/watermark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: watermarkFile.publicId,
          text: watermarkText,
          opacity: watermarkOpacity,
          gravity: watermarkGravity,
          fontSize: watermarkFontSize,
          color: watermarkColor,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setWatermarkedUrl(data.watermarkedUrl);
        toast("Watermark applied successfully!", "success");
      } else {
        throw new Error(data.error || "Watermark failed");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to apply watermark.");
      toast("Watermark failed.", "error");
    } finally {
      setIsProcessingWatermark(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-base-content/60">Upload PDF for Watermarking</label>
        {!watermarkFile ? (
          <PdfUploader
            isUploading={isUploading}
            setIsUploading={setIsUploading}
            setErrorMsg={setErrorMsg}
            onUploadSuccess={(file) => setWatermarkFile(file)}
            label="Choose a PDF file"
          />
        ) : (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-base-100 border border-base-content/5 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3.5 min-w-0">
              <IconFileText className="w-8 h-8 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold truncate max-w-xs">{watermarkFile.name}</p>
                <p className="text-[10px] text-base-content/40 mt-0.5 font-semibold">
                  Pages: {watermarkFile.pages} • Size: {(watermarkFile.bytes / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setWatermarkFile(null);
                setWatermarkedUrl(null);
              }}
              className="btn btn-ghost btn-xs text-error font-bold"
            >
              Replace File
            </button>
          </div>
        )}
      </div>

      {watermarkFile && (
        <div className="grid gap-6 md:grid-cols-12 items-start animate-fade-in">
          {/* Controls - Left Pane */}
          <div className="md:col-span-5 space-y-4 bg-base-100 p-4 border border-base-content/10 rounded-2xl">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold uppercase text-base-content/50">Watermark Label</label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="input input-bordered input-sm rounded-lg bg-base-200 text-xs focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-base-content/50">Font Color</label>
                <select
                  value={watermarkColor}
                  onChange={(e) => setWatermarkColor(e.target.value)}
                  className="select select-bordered select-xs rounded-lg bg-base-200 text-[10px]"
                >
                  <option value="red">Red</option>
                  <option value="black">Black</option>
                  <option value="blue">Blue</option>
                  <option value="gray">Gray</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-base-content/50">Opacity (%)</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={watermarkOpacity}
                  onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                  className="input input-bordered input-xs rounded-lg bg-base-200 text-[10px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-base-content/50">Font Size</label>
                <input
                  type="number"
                  value={watermarkFontSize}
                  onChange={(e) => setWatermarkFontSize(Number(e.target.value))}
                  className="input input-bordered input-xs rounded-lg bg-base-200 text-[10px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-base-content/50">Position</label>
                <select
                  value={watermarkGravity}
                  onChange={(e) => setWatermarkGravity(e.target.value)}
                  className="select select-bordered select-xs rounded-lg bg-base-200 text-[10px]"
                >
                  <option value="center">Center</option>
                  <option value="north">Top Center</option>
                  <option value="south">Bottom Center</option>
                  <option value="east">Right</option>
                  <option value="west">Left</option>
                </select>
              </div>
            </div>

            <button
              onClick={runWatermark}
              disabled={isProcessingWatermark || !watermarkText}
              className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3 mt-2 cursor-pointer text-xs font-bold"
            >
              {isProcessingWatermark ? (
                <span className="flex items-center gap-1.5">
                  <span className="loading loading-spinner loading-xs"></span>
                  Applying watermark...
                </span>
              ) : (
                "Apply Watermark Overlay"
              )}
            </button>
          </div>

          {/* Watermark Live preview - Right Pane */}
          <div className="md:col-span-7 space-y-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-base-content/50 pl-1 block">
              Watermark Layout Preview
            </span>
            <div className="bg-slate-900 border border-base-content/10 rounded-2xl p-6 flex items-center justify-center relative min-h-[280px]">
              {/* Page image rendering */}
              <div className="relative w-36 aspect-[3/4] bg-base-100 shadow-2xl rounded-md overflow-hidden flex items-center justify-center select-none">
                <img
                  src={getPdfPageThumbnailUrl(watermarkFile.publicId, 1)}
                  alt="Watermark preview page 1"
                  className="w-full h-full object-cover"
                />

                {/* Mock Watermark Overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
                  style={{
                    alignItems: watermarkGravity === "north" ? "flex-start" : watermarkGravity === "south" ? "flex-end" : "center",
                    justifyContent: watermarkGravity === "west" ? "flex-start" : watermarkGravity === "east" ? "flex-end" : "center",
                    padding: "10px",
                  }}
                >
                  <span
                    className="font-extrabold uppercase select-none pointer-events-none font-sans"
                    style={{
                      color: watermarkColor,
                      opacity: watermarkOpacity / 100,
                      fontSize: `${watermarkFontSize / 4.5}px`,
                      transform: "rotate(-30deg)",
                      textShadow: "0 0 1px white",
                    }}
                  >
                    {watermarkText}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {watermarkedUrl && (
        <div className="p-4 rounded-xl bg-success/15 border border-success/35 flex items-center justify-between gap-4 animate-fade-in">
          <div>
            <p className="text-xs font-bold text-success-content">Watermark Complete!</p>
            <p className="text-[10px] text-success-content/70 mt-0.5 font-semibold">Watermark stamped on all pages.</p>
          </div>
          <button
            onClick={() => handleDownload(watermarkedUrl, "watermarked.pdf")}
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
