"use client";

import React from "react";

interface BgRemoveProps {
  isProcessingBg: boolean;
  isProcessing: boolean;
  onRunBgRemove: () => void;
}

export default function BgRemove({
  isProcessingBg,
  isProcessing,
  onRunBgRemove,
}: BgRemoveProps) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] text-base-content/60 leading-normal bg-base-300/40 p-2.5 rounded-xl border border-base-content/5 font-semibold">
        Cloudinary neural filters will isolate the foreground subject, outputting a high-fidelity transparent PNG.
      </p>
      <button
        onClick={onRunBgRemove}
        disabled={isProcessing}
        className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3 cursor-pointer font-bold text-xs"
      >
        {isProcessingBg ? (
          <span className="flex items-center gap-1.5">
            <span className="loading loading-spinner loading-xs"></span>
            Stripping background...
          </span>
        ) : (
          "Remove Background"
        )}
      </button>
    </div>
  );
}
