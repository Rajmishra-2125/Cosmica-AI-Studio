"use client";

import React from "react";
import { IconSearch, IconX } from "@tabler/icons-react";

interface CommandPaletteProps {
  onClose: () => void;
}

export default function CommandPalette({ onClose }: CommandPaletteProps) {
  const [search, setSearch] = React.useState("");

  const commands = [
    { id: 1, label: "Home", action: () => window.location.href = "/home" },
    { id: 2, label: "Social Share", action: () => window.location.href = "/social-share" },
    { id: 3, label: "AI Image Studio", action: () => window.location.href = "/ai-image" },
    { id: 4, label: "Video Share", action: () => window.location.href = "/video-share" },
    { id: 5, label: "PDF Suite", action: () => window.location.href = "/pdf-suite" },
    { id: 6, label: "Profile", action: () => window.location.href = "/profile" },
  ];

  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="rounded-lg border border-white/10 bg-black/80 shadow-2xl backdrop-blur-md">
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <IconSearch className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Type a command..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none placeholder-gray-500"
              autoFocus
            />
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto py-2">
            {filtered.length > 0 ? (
              filtered.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  {cmd.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No commands found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
