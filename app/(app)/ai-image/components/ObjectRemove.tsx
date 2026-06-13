"use client";

import React from "react";

interface ObjectRemoveProps {
  objPrompt: string;
  setObjPrompt: (prompt: string) => void;
  isProcessingObj: boolean;
  isProcessing: boolean;
  onRunObjectRemove: () => void;
}

export default function ObjectRemove({
  objPrompt,
  setObjPrompt,
  isProcessingObj,
  isProcessing,
  onRunObjectRemove,
}: ObjectRemoveProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-base-content/60 uppercase">Object Description</label>
        <input
          type="text"
          placeholder="Describe target (e.g. 'car', 'wire')"
          value={objPrompt}
          onChange={(e) => setObjPrompt(e.target.value)}
          className="input input-bordered input-sm rounded-xl focus:border-primary focus:outline-none bg-base-100 text-xs w-full"
        />
      </div>
      <button
        onClick={onRunObjectRemove}
        disabled={isProcessing || !objPrompt.trim()}
        className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3 cursor-pointer font-bold text-xs"
      >
        {isProcessingObj ? (
          <span className="flex items-center gap-1.5">
            <span className="loading loading-spinner loading-xs"></span>
            Erase processing...
          </span>
        ) : (
          "Erase Object"
        )}
      </button>
    </div>
  );
}
