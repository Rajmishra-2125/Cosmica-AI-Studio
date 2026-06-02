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
  IconFiles,
  IconFileArrowRight,
  IconEdit,
  IconCpu,
} from "@tabler/icons-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { toast } from "@/app/store/Toast";

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
  const [isPdfHovered, setIsPdfHovered] = useState(false);

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

  const handlePdfAction = (toolName: string) => {
    toast(`🚀 PDF ${toolName} backend API is operational! Frontend integrations coming soon.`, "info");
  };

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
          isScrolled ? "max-w-3xl" : "max-w-6xl",
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

            {/* Special PDF Suite Hover Mega-Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsPdfHovered(true)}
              onMouseLeave={() => setIsPdfHovered(false)}
            >
              <button
                type="button"
                className={cn(
                  "relative flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer border border-transparent",
                  isPdfHovered
                    ? "text-primary bg-primary/10 border-primary/10"
                    : "text-base-content/70 hover:text-base-content hover:bg-base-content/5"
                )}
              >
                <span>PDF Suite</span>
                <svg
                  className={cn(
                    "w-3 h-3 transition-transform duration-200 shrink-0",
                    isPdfHovered ? "rotate-180 text-primary" : "opacity-60"
                  )}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mega Dropdown Menu */}
              <AnimatePresence>
                {isPdfHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full -left-64 mt-2 w-180 bg-base-200 border border-base-content/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl p-6 backdrop-blur-xl z-50 grid grid-cols-4 gap-6 select-none"
                  >
                    {/* Column 1: Organize PDF */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-extrabold tracking-wider text-base-content/50 uppercase flex items-center gap-1.5 border-b border-base-content/5 pb-2">
                        <IconFiles className="w-3.5 h-3.5 text-indigo-400" />
                        Organize PDF
                      </h4>
                      <ul className="space-y-2 text-xs">
                        <li>
                          <button
                            type="button"
                            onClick={() => handlePdfAction("Merge")}
                            className="w-full text-left font-bold text-base-content/85 hover:text-primary hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between"
                          >
                            <span>Merge PDF</span>
                            <span className="badge badge-warning scale-75 text-[8px] font-bold">API</span>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => handlePdfAction("Extract Pages")}
                            className="w-full text-left font-bold text-base-content/85 hover:text-primary hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between"
                          >
                            <span>Extract Pages</span>
                            <span className="badge badge-warning scale-75 text-[8px] font-bold">API</span>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => handlePdfAction("Remove Pages")}
                            className="w-full text-left font-bold text-base-content/85 hover:text-primary hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between"
                          >
                            <span>Remove Pages</span>
                            <span className="badge badge-warning scale-75 text-[8px] font-bold">API</span>
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* Column 2: Convert PDF */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-extrabold tracking-wider text-base-content/50 uppercase flex items-center gap-1.5 border-b border-base-content/5 pb-2">
                        <IconFileArrowRight className="w-3.5 h-3.5 text-pink-400" />
                        Convert PDF
                      </h4>
                      <ul className="space-y-2 text-xs">
                        <li>
                          <button
                            type="button"
                            onClick={() => handlePdfAction("Image to PDF")}
                            className="w-full text-left font-bold text-base-content/85 hover:text-primary hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between"
                          >
                            <span>Image to PDF</span>
                            <span className="badge badge-warning scale-75 text-[8px] font-bold">API</span>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => handlePdfAction("PDF to Image")}
                            className="w-full text-left font-bold text-base-content/85 hover:text-primary hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between"
                          >
                            <span>PDF to Image</span>
                            <span className="badge badge-warning scale-75 text-[8px] font-bold">API</span>
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* Column 3: Edit PDF */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-extrabold tracking-wider text-base-content/50 uppercase flex items-center gap-1.5 border-b border-base-content/5 pb-2">
                        <IconEdit className="w-3.5 h-3.5 text-purple-400" />
                        Edit PDF
                      </h4>
                      <ul className="space-y-2 text-xs">
                        <li>
                          <button
                            type="button"
                            onClick={() => handlePdfAction("Rotate")}
                            className="w-full text-left font-bold text-base-content/85 hover:text-primary hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between"
                          >
                            <span>Rotate PDF</span>
                            <span className="badge badge-warning scale-75 text-[8px] font-bold">API</span>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => handlePdfAction("Crop")}
                            className="w-full text-left font-bold text-base-content/85 hover:text-primary hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between"
                          >
                            <span>Crop PDF</span>
                            <span className="badge badge-warning scale-75 text-[8px] font-bold">API</span>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => handlePdfAction("Watermark")}
                            className="w-full text-left font-bold text-base-content/85 hover:text-primary hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between"
                          >
                            <span>Watermark PDF</span>
                            <span className="badge badge-warning scale-75 text-[8px] font-bold">API</span>
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* Column 4: AI Intelligent PDF */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-extrabold tracking-wider text-base-content/50 uppercase flex items-center gap-1.5 border-b border-base-content/5 pb-2">
                        <IconCpu className="w-3.5 h-3.5 text-accent" />
                        AI PDF Intelligence
                      </h4>
                      <ul className="space-y-2 text-xs">
                        <li className="text-base-content/40 flex items-center justify-between pr-2">
                          <span>AI PDF Summarizer</span>
                          <span className="badge badge-outline scale-75 text-[7px] font-bold border-base-content/20 opacity-50 shrink-0">Soon</span>
                        </li>
                        <li className="text-base-content/40 flex items-center justify-between pr-2">
                          <span>OCR Text Reader</span>
                          <span className="badge badge-outline scale-75 text-[7px] font-bold border-base-content/20 opacity-50 shrink-0">Soon</span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
