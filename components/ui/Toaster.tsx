"use client";

import React from "react";
import { useToastStore, ToastMessage } from "@/app/store/Toast";
import { motion, AnimatePresence } from "motion/react";
import {
  IconCircleCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";

export default function Toaster() {
  const { toasts, removeToast } = useToastStore();

  const getToastStyle = (type: ToastMessage["type"]) => {
    switch (type) {
      case "success":
        return {
          border:
            "border-emerald-500/25 bg-emerald-950/20 shadow-emerald-500/5",
          accent: "bg-emerald-500",
          icon: (
            <IconCircleCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          ),
        };
      case "error":
        return {
          border: "border-red-500/25 bg-red-950/20 shadow-red-500/5",
          accent: "bg-red-500",
          icon: <IconAlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
        };
      case "info":
      default:
        return {
          border: "border-indigo-500/25 bg-indigo-950/20 shadow-indigo-500/5",
          accent: "bg-indigo-500",
          icon: <IconInfoCircle className="w-5 h-5 text-indigo-400 shrink-0" />,
        };
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-99999 flex flex-col gap-3 w-full max-w-sm pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const styles = getToastStyle(toast.type);
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              layout
              className={`pointer-events-auto relative flex items-center justify-between gap-3 overflow-hidden rounded-xl border backdrop-blur-md px-4 py-3.5 shadow-2xl ${styles.border}`}
            >
              {/* Left glowing marker */}
              <div
                className={`absolute top-0 bottom-0 left-0 w-1 ${styles.accent}`}
              />

              <div className="flex items-center gap-3">
                {styles.icon}
                <p className="text-xs font-mono text-gray-200 leading-tight">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-gray-500 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <IconX className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
