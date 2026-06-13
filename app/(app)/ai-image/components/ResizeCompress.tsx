"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

interface ResizeCompressProps {
  rcMode: "compress" | "smart-crop";
  setRcMode: (mode: "compress" | "smart-crop") => void;
  rcQuality: string;
  setRcQuality: (q: string) => void;
  rcFormat: string;
  setRcFormat: (f: string) => void;
  rcWidth: number;
  setRcWidth: (w: number) => void;
  rcHeight: number;
  setRcHeight: (h: number) => void;
  isProcessingRc: boolean;
  isProcessing: boolean;
  onRunResizeCompress: () => void;
}

export default function ResizeCompress({
  rcMode,
  setRcMode,
  rcQuality,
  setRcQuality,
  rcFormat,
  setRcFormat,
  rcWidth,
  setRcWidth,
  rcHeight,
  setRcHeight,
  isProcessingRc,
  isProcessing,
  onRunResizeCompress,
}: ResizeCompressProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-base-content/60 uppercase">Processing Mode</span>
        <div className="join w-full bg-base-100 border border-base-content/10 rounded-xl p-0.5">
          <button
            type="button"
            onClick={() => setRcMode("compress")}
            className={cn(
              "join-item flex-1 btn btn-xs border-none cursor-pointer rounded-lg text-[9px] font-bold uppercase",
              rcMode === "compress" ? "bg-primary text-primary-content shadow-sm" : "bg-transparent text-base-content/50"
            )}
          >
            Compress
          </button>
          <button
            type="button"
            onClick={() => setRcMode("smart-crop")}
            className={cn(
              "join-item flex-1 btn btn-xs border-none cursor-pointer rounded-lg text-[9px] font-bold uppercase",
              rcMode === "smart-crop" ? "bg-primary text-primary-content shadow-sm" : "bg-transparent text-base-content/50"
            )}
          >
            Smart Crop
          </button>
        </div>
      </div>

      {rcMode === "compress" ? (
        <div className="grid gap-3 grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-base-content/60 uppercase">Quality</label>
            <select
              value={rcQuality}
              onChange={(e) => setRcQuality(e.target.value)}
              className="select select-bordered select-xs rounded-lg bg-base-100 text-[10px]"
            >
              <option value="auto">Auto (Balanced)</option>
              <option value="auto:best">Best Quality</option>
              <option value="auto:good">Good savings</option>
              <option value="auto:eco">Eco Max</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-base-content/60 uppercase">Format</label>
            <select
              value={rcFormat}
              onChange={(e) => setRcFormat(e.target.value)}
              className="select select-bordered select-xs rounded-lg bg-base-100 text-[10px]"
            >
              <option value="webp">WEBP</option>
              <option value="avif">AVIF</option>
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-base-content/60 uppercase">Width (px)</label>
            <input
              type="number"
              value={rcWidth}
              onChange={(e) => setRcWidth(parseInt(e.target.value) || 800)}
              className="input input-bordered input-xs rounded-lg bg-base-100 text-[10px] w-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-base-content/60 uppercase">Height (px)</label>
            <input
              type="number"
              value={rcHeight}
              onChange={(e) => setRcHeight(parseInt(e.target.value) || 600)}
              className="input input-bordered input-xs rounded-lg bg-base-100 text-[10px] w-full"
            />
          </div>
        </div>
      )}

      <button
        onClick={onRunResizeCompress}
        disabled={isProcessing}
        className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3 cursor-pointer font-bold text-xs"
      >
        {isProcessingRc ? (
          <span className="flex items-center gap-1.5">
            <span className="loading loading-spinner loading-xs"></span>
            Processing sizes...
          </span>
        ) : (
          "Optimize Image"
        )}
      </button>
    </div>
  );
}
