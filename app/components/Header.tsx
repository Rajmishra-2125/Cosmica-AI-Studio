"use client";

import React from "react";
import {FloatingNav} from "@/components/ui/FloatingNav";
import CommandPalette from "@/components/ui/CommandPalette";
import {IconCameraAi, IconHome, IconVideo, } from "@tabler/icons-react";
import type { FC } from "react";


export default function Header() {
  
  const [isPaletteOpen, setIsPaletteOpen] = React.useState(false)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Cast CommandPalette to any to satisfy JSX prop typing when the component's
  // prop types are not declared/compatible here.
  const CommandPaletteAny = CommandPalette as any

  const navItems = [
    {
      name: "Home",
      link: "/home",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Social Share",
      link: "/social-share",
      icon: (
        <IconCameraAi className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
    {
      name: "Videos",
      link: "/video-share",
      icon: (
        <IconVideo className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },

  ];

  return (
    <div className="relative w-full">
      <FloatingNav
        navItems={navItems}
        onOpenCommandPalette={() => setIsPaletteOpen(true)}
      />
      {isPaletteOpen && (
        <CommandPaletteAny
          onClose={() => setIsPaletteOpen(false)}
        />
      )}
    </div>
  );
}
