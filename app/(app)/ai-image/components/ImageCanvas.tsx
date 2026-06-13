"use client";

import React from "react";
import { IconPhoto, IconArrowsSplit } from "@tabler/icons-react";
import { filesize } from "filesize";
import { cn } from "@/app/lib/utils";

interface UploadedImage {
  publicId: string;
  url: string;
}

interface ImageCanvasProps {
  sharedFile: UploadedImage | null;
  activeResultUrl: string | null;
  activeTab: string;
  isUploading: boolean;
  isProcessing: boolean;
  rcStats: {
    originalBytes?: number;
    compressedBytes?: number;
    savedBytes?: number;
  } | null;
  showSplitView: boolean;
  setShowSplitView: (show: boolean) => void;
  sliderPosition: number;
  setSliderPosition: (pos: number) => void;
}

export default function ImageCanvas({
  sharedFile,
  activeResultUrl,
  activeTab,
  isUploading,
  isProcessing,
  rcStats,
  showSplitView,
  setShowSplitView,
  sliderPosition,
  setSliderPosition,
}: ImageCanvasProps) {
  return (
    <div className="flex flex-col bg-slate-900 border border-base-content/10 rounded-2xl overflow-hidden shadow-2xl relative min-h-[500px] h-full justify-between">
      {/* Header viewport info */}
      <div className="h-12 border-b border-white/5 bg-slate-950/80 backdrop-blur-md px-4 flex items-center justify-between z-10 shrink-0 text-white/70 text-xs font-bold">
        <div className="flex items-center gap-1.5 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>AI Studio Workspace Visualizer</span>
        </div>

        {/* Split view toggler */}
        {sharedFile && activeResultUrl && (
          <button
            onClick={() => setShowSplitView(!showSplitView)}
            className={cn(
              "p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white cursor-pointer transition-all flex items-center gap-1.5",
              showSplitView && "border-pink-500 bg-pink-500/10 text-pink-400"
            )}
          >
            <IconArrowsSplit className="w-4 h-4" />
            <span className="text-[10px] font-bold hidden sm:inline">Split Slider</span>
          </button>
        )}
      </div>

      {/* Main Visualizer Area */}
      <div className="flex-1 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:16px_16px] bg-slate-950 flex items-center justify-center p-6 overflow-hidden relative select-none">
        {isUploading ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-white text-xs font-bold">Uploading to Cloudinary Asset Vault...</p>
          </div>
        ) : isProcessing ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-t-indigo-500 border-white/10 animate-spin"></div>
            <div className="space-y-1">
              <p className="font-bold text-white text-xs">AI Workspace Processing...</p>
              <p className="text-[10px] text-white/55 font-semibold">Eager background pipeline rendering asset</p>
            </div>
          </div>
        ) : !sharedFile ? (
          <div className="flex flex-col items-center gap-3 text-center text-white/40 max-w-sm">
            <IconPhoto className="w-12 h-12 opacity-60 text-primary" />
            <div>
              <h3 className="font-bold text-white text-sm">Visualizer Idle</h3>
              <p className="text-[10px] text-white/50 leading-normal mt-1 font-semibold">
                Upload a raw image in the left panel to load the AI canvas.
              </p>
            </div>
          </div>
        ) : (
          /* Canvas Viewport */
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            {showSplitView && activeResultUrl ? (
              /* BEFORE / AFTER SLIDER VIEW */
              <div className="relative w-full max-w-xl aspect-video rounded-xl border border-white/10 overflow-hidden shadow-2xl bg-black">
                {/* Background: Processed Image (After) */}
                <img
                  src={activeResultUrl}
                  alt="Processed result"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />

                {/* Foreground: Original Image (Before) clipped by slider */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                  }}
                >
                  <img
                    src={sharedFile.url}
                    alt="Original source"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>

                {/* Divider Line & Drag Handle */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] cursor-ew-resize pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-950 flex items-center justify-center shadow-2xl text-slate-900 pointer-events-auto select-none">
                    <IconArrowsSplit className="w-4 h-4 rotate-90" />
                  </div>
                </div>

                {/* Invisible Range Input Overlay representing the slider logic */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
                />

                {/* Badges */}
                <div className="absolute bottom-3 left-3 bg-slate-950/80 border border-white/10 text-white font-bold text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Original
                </div>
                <div className="absolute bottom-3 right-3 bg-primary text-primary-content font-bold text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                  AI Result
                </div>
              </div>
            ) : (
              /* SINGLE PREVIEW VIEW */
              <div className="relative w-full max-w-xl aspect-video rounded-xl border border-white/10 overflow-hidden shadow-2xl bg-black flex items-center justify-center p-2">
                <img
                  src={activeResultUrl || sharedFile.url}
                  alt="Active Visualizer Preview"
                  className="max-h-full max-w-full object-contain rounded-md"
                />
                <div className="absolute bottom-3 right-3 bg-slate-950/85 border border-white/10 text-white font-bold text-[9px] px-2.5 py-1 rounded-md uppercase font-mono tracking-wider">
                  {activeResultUrl ? `AI Result: ${activeTab}` : "Original Canvas"}
                </div>
              </div>
            )}

            {/* Compression Metrics Telemetry Card overlay */}
            {activeTab === "resize-compress" && rcStats && (
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 border border-white/10 backdrop-blur-md rounded-xl p-3 grid grid-cols-3 gap-4 text-center text-white/80 font-mono text-[10px]">
                <div>
                  <span className="block text-white/40 mb-0.5">Original</span>
                  <span className="font-extrabold text-white">
                    {rcStats.originalBytes ? filesize(rcStats.originalBytes, { round: 1 }) : "0.0 B"}
                  </span>
                </div>
                <div>
                  <span className="block text-white/40 mb-0.5">Optimized</span>
                  <span className="font-extrabold text-primary">
                    {rcStats.compressedBytes ? filesize(rcStats.compressedBytes, { round: 1 }) : "0.0 B"}
                  </span>
                </div>
                <div>
                  <span className="block text-white/40 mb-0.5">Ratio Saved</span>
                  <span className="font-extrabold text-accent">
                    {rcStats.originalBytes && rcStats.compressedBytes
                      ? `${Math.round(((rcStats.originalBytes - rcStats.compressedBytes) / rcStats.originalBytes) * 100)}%`
                      : "0%"}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom telemetry */}
      <div className="h-10 border-t border-white/5 bg-slate-950/90 text-[10px] text-white/50 px-4 flex items-center justify-between shrink-0 font-mono">
        <span>AI Status: {activeResultUrl ? "transformed" : sharedFile ? "canvas loaded" : "idle"}</span>
        <span>Before/After slider enabled</span>
        <span>Cloudinary neural edge engine</span>
      </div>
    </div>
  );
}
