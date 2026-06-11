"use client";

import React, { useState, useEffect } from "react";
import { IconColorSwatch, IconCheck } from "@tabler/icons-react";

const themes = [
  { id: "light", name: "Light Mode" },
  { id: "dark", name: "Corporate" },
  { id: "valentine", name: "Valentine" },
];

export default function ThemeToggle() {
  const [activeTheme, setActiveTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("cosmica-theme") || "dark";
    setActiveTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    setMounted(true);
  }, []);

  const handleThemeChange = (themeId: string) => {
    setActiveTheme(themeId);
    localStorage.setItem("cosmica-theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);

    // Force close DaisyUI dropdown by unfocusing
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  // Prevent hydration mismatch by rendering a skeleton placeholder until mounted
  if (!mounted) {
    return (
      <div className="w-24 h-9 bg-base-350/20 border border-base-content/10 rounded-xl animate-pulse"></div>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      {/* Dropdown Toggle Trigger Button */}
      <div
        tabIndex={0}
        role="button"
        className="btn h-9 min-h-9 bg-base-100 border border-base-content/10 hover:bg-base-300 hover:border-base-content/20 text-base-content font-semibold text-xs tracking-tight rounded-xl flex items-center gap-2 px-3 shadow-inner transition-all duration-200 cursor-pointer"
      >
        <IconColorSwatch className="w-4 h-4 text-primary" />
        <span className="hidden sm:inline font-mono uppercase text-[10px] tracking-wider opacity-70">
          {activeTheme}
        </span>
        <svg
          width="10"
          height="10"
          className="fill-current opacity-60 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>

      {/* Dropdown Content Menu */}
      <ul
        tabIndex={0}
        className="dropdown-content mt-2 bg-base-200 border border-base-content/10 backdrop-blur-xl rounded-2xl z-50 w-52 p-2.5 shadow-2xl space-y-1"
      >
        {themes.map((theme) => {
          const isActive = activeTheme === theme.id;
          return (
            <li key={theme.id}>
              <button
                type="button"
                onClick={() => handleThemeChange(theme.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? "bg-primary/10 border-primary/20 text-primary"
                    : "bg-transparent border-transparent text-base-content/70 hover:bg-base-300 hover:text-base-content"
                }`}
              >
                <span>{theme.name}</span>
                {isActive && (
                  <IconCheck className="w-4 h-4 text-primary shrink-0" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
