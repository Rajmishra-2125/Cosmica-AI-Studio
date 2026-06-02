"use client";

import React, { useState } from "react";
import { toast } from "@/app/store/Toast";
import {
  IconSend,
  IconMail,
  IconChevronRight,
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconSparkles,
} from "@tabler/icons-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Trigger high-fidelity platform toast
    toast(`Successfully subscribed! Welcome aboard: ${email}`, "success");
    setEmail("");
  };

  return (
    <footer className="w-full border-t border-base-content/10 bg-base-200/60 pt-16 pb-8 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main 4-Column Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Newsletter Column */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="font-extrabold text-sm text-white">C</span>
              </div>
              <span className="font-bold text-lg tracking-wide text-base-content">
                Cosmica
              </span>
            </div>
            
            <p className="text-xs text-base-content/60 leading-relaxed max-w-sm">
              The high-performance workspace for media assets. Transform, compress, and automate layouts instantly.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-2">
              <label className="text-[10px] font-bold tracking-wider text-base-content/50 uppercase flex items-center gap-1.5">
                <IconMail className="w-3.5 h-3.5 text-primary" />
                Subscribe to updates
              </label>
              
              <div className="flex gap-2 max-w-[280px]">
                <input
                  type="email"
                  placeholder="Enter workspace email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered input-sm rounded-xl bg-base-100/40 border-base-content/10 text-base-content text-xs flex-1 focus:border-primary focus:outline-none placeholder-base-content/30"
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm rounded-xl border-none text-white px-3 flex items-center justify-center shrink-0 cursor-pointer shadow-md shadow-primary/10 transition-transform duration-200 active:scale-95"
                  title="Subscribe"
                >
                  <IconSend className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Core Navigation Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold tracking-wider text-base-content uppercase">
              Workspace Hub
            </h4>
            <ul className="space-y-2.5 text-xs text-base-content/70">
              <li>
                <a
                  href="/home"
                  className="flex items-center gap-1 hover:text-primary transition-colors duration-200 group"
                >
                  <IconChevronRight className="w-3.5 h-3.5 opacity-0 -ml-3.5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-primary" />
                  <span>Main Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="/social-share"
                  className="flex items-center gap-1 hover:text-primary transition-colors duration-200 group"
                >
                  <IconChevronRight className="w-3.5 h-3.5 opacity-0 -ml-3.5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-primary" />
                  <span>Social Share Studio</span>
                </a>
              </li>
              <li>
                <a
                  href="/video-share"
                  className="flex items-center gap-1 hover:text-primary transition-colors duration-200 group"
                >
                  <IconChevronRight className="w-3.5 h-3.5 opacity-0 -ml-3.5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-primary" />
                  <span>Video Compressor</span>
                </a>
              </li>
            </ul>
          </div>

          {/* AI SaaS Future Roadmap Column */}
          <div className="space-y-4 lg:col-span-1">
            <h4 className="text-xs font-extrabold tracking-wider text-base-content flex items-center gap-1.5 uppercase">
              <IconSparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              AI SaaS Pipeline
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between gap-2 text-base-content/70">
                <span>💳 Stripe Subscription Billing</span>
                <span className="badge badge-warning text-[9px] font-bold tracking-wide rounded-md px-1.5 py-0.5 border-none shrink-0 scale-90">
                  SaaS Next
                </span>
              </li>
              <li className="flex items-center justify-between gap-2 text-base-content/70">
                <span>🎨 Generative Fill Outpainting</span>
                <span className="badge badge-secondary text-[9px] font-bold tracking-wide rounded-md px-1.5 py-0.5 border-none shrink-0 scale-90">
                  AI Coming
                </span>
              </li>
              <li className="flex items-center justify-between gap-2 text-base-content/70">
                <span>📹 Video AI Audio Transcriptions</span>
                <span className="badge badge-accent text-[9px] font-bold tracking-wide rounded-md px-1.5 py-0.5 border-none shrink-0 scale-90 text-accent-content">
                  AI Soon
                </span>
              </li>
              <li className="flex items-center justify-between gap-2 text-base-content/70">
                <span>✍️ Gemini Social Copywriting Agent</span>
                <span className="badge badge-primary text-[9px] font-bold tracking-wide rounded-md px-1.5 py-0.5 border-none shrink-0 scale-90 text-primary-content">
                  LLM Beta
                </span>
              </li>
              <li className="flex items-center justify-between gap-2 text-base-content/70">
                <span>👥 Organization Collaborative Vaults</span>
                <span className="badge bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold tracking-wide rounded-md px-1.5 py-0.5 shrink-0 scale-90">
                  Teams
                </span>
              </li>
            </ul>
          </div>

          {/* Workspace Ecosystem Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold tracking-wider text-base-content uppercase">
              Technology Stack
            </h4>
            <ul className="space-y-2.5 text-xs text-base-content/50">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-base-content/30" />
                <span>Next.js 16.2 edge routing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-base-content/30" />
                <span>Cloudinary Dynamic Media Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-base-content/30" />
                <span>Clerk Proxy Edge Middleware</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-base-content/30" />
                <span>Neon Serverless PostgreSQL DB</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Separator Divider Line */}
        <div className="h-px bg-base-content/10 w-full mb-8" />

        {/* Bottom Socials & Metadata Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-xs text-base-content/60 font-semibold">
              © 2026 Cosmica. All rights reserved.
            </p>
            <p className="text-[10px] text-base-content/40 leading-normal">
              Empowered by Cloudinary, Clerk, and Next.js. Engineered for high performance digital teams.
            </p>
          </div>

          {/* Social Links & Mock Regulatory */}
          <div className="flex items-center gap-5 justify-center">
            <div className="flex items-center gap-3 border-r border-base-content/10 pr-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-base-content/50 hover:text-base-content transition-colors duration-200 cursor-pointer"
                title="Github Workspace Repository"
              >
                <IconBrandGithub className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-base-content/50 hover:text-base-content transition-colors duration-200 cursor-pointer"
                title="Twitter Dev Stream"
              >
                <IconBrandTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-base-content/50 hover:text-base-content transition-colors duration-200 cursor-pointer"
                title="LinkedIn Workspace Page"
              >
                <IconBrandLinkedin className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-center gap-3 text-[10px] font-semibold text-base-content/50">
              <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
              <span className="opacity-30">•</span>
              <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
