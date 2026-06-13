"use client";

import React from "react";

interface UpscaleProps {
  isProcessingUpscale: boolean;
  isProcessing: boolean;
  onRunUpscale: () => void;
}

export default function Upscale({
  isProcessingUpscale,
  isProcessing,
  onRunUpscale,
}: UpscaleProps) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] text-base-content/60 leading-normal bg-base-300/40 p-2.5 rounded-xl border border-base-content/5 font-semibold">
        Apply super-resolution neural networks to upscale the canvas to 4K while synthetically generating crisp details.
      </p>
      <button
        onClick={onRunUpscale}
        disabled={isProcessing}
        className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3 cursor-pointer font-bold text-xs"
      >
        {isProcessingUpscale ? (
          <span className="flex items-center gap-1.5">
            <span className="loading loading-spinner loading-xs"></span>
            Upscaling to 4K...
          </span>
        ) : (
          "Upscale Canvas"
        )}
      </button>
    </div>
  );
}
