"use client";

import React, { useState, useEffect } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { cn } from "../../app/lib/utils";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import {
  IconLogout,
} from "@tabler/icons-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export const FloatingNav = ({
  navItems,
  className,
  onOpenCommandPalette,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
  onOpenCommandPalette?: () => void;
}) => {
  const { user, isSignedIn } = useUser();
  
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    if (typeof current === "number") {
      setIsScrolled(current > 20);

      const previous = scrollY.getPrevious() ?? 0;
      const diff = current - previous;

      if (isHovered) {
        setVisible(true);
        return;
      }

      if (current < 30) {
        setVisible(true);
      } else {
        if (diff < -15) {
          setVisible(true);
        } else if (diff > 15) {
          setVisible(false);
        }
      }
    }
  });

  useEffect(() => {
    if (isHovered) {
      setVisible(true);
    }
  }, [isHovered]);


  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -150,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "w-full fixed top-4 inset-x-0 mx-auto z-5000 transition-all duration-300 px-4 md:px-0",
          isScrolled ? "max-w-4xl" : "max-w-6xl",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cn(
            "w-full flex items-center justify-between select-none transition-all duration-300",
            isScrolled
              ? "rounded-2xl border border-base-content/10 bg-base-100/75 shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur-md px-4 py-2 h-14"
              : "rounded-none border-transparent bg-transparent shadow-none px-6 py-4 h-18",
          )}
        >
          {/* Left: Glowing Logo */}
          <a href="/" className="flex items-center gap-2 px-2 shrink-0">
            <span
              className={cn(
                "font-extrabold tracking-widest bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-sans transition-all duration-300",
                isScrolled ? "text-sm sm:text-base" : "text-base sm:text-lg",
              )}
            >
              Cosmica
            </span>
          </a>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-1 relative">
            {navItems.map((navItem, idx: number) => (
              <a
                key={`link-${idx}`}
                href={navItem.link}
                className="relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-tight text-base-content/70 hover:text-base-content hover:bg-base-content/5 transition-all duration-200"
              >
                <span>{navItem.name}</span>
              </a>
            ))}


          </div>

          {/* Right: Actions section */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Search/Command Palette trigger */}
            {onOpenCommandPalette && (
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="btn h-9 min-h-9 px-3 bg-base-100 border border-base-content/10 hover:bg-base-300 hover:border-base-content/20 text-base-content/75 hover:text-base-content rounded-xl flex items-center gap-2 cursor-pointer shadow-inner transition-all duration-200"
                title="Open Command Palette (⌘K)"
              >
                <svg
                  className="w-4 h-4 text-primary shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <kbd className="hidden sm:inline-flex kbd kbd-sm bg-base-200 border border-base-content/10 text-[9px] font-mono px-1.5 py-0.5 rounded-md opacity-70">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Toggle Dropdown */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>

            {/* User Profile / Auth Action */}
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <a href="/profile">
                  <img
                    src={
                      user?.imageUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.fullName || "User",
                      )}`
                    }
                    alt={user?.fullName || "User"}
                    className="w-7 h-7 rounded-full border border-indigo-500/40 object-cover hover:border-indigo-400 transition-all duration-200"
                  />
                </a>

                <SignOutButton>
                  <button
                    className="relative flex items-center justify-center p-1.5 rounded-full border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
                    title="Logout"
                  >
                    <IconLogout className="w-3.5 h-3.5" />
                  </button>
                </SignOutButton>
              </div>
            ) : (
              <a
                href="/sign-in"
                className="h-8 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-[11px] rounded-full px-4 border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06)] flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 shrink-0"
              >
                <span>Get Started</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
