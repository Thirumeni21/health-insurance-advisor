"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-glass-border bg-obsidian-plum/90 py-8 px-4 sm:px-6 lg:px-8 mt-auto z-20 select-none">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-dusty-mauve">
        <div className="flex items-center space-x-2 text-center sm:text-left">
          <ShieldCheck className="w-4 h-4 text-burnished-copper flex-shrink-0" />
          <span>{t.footer.infoNotice}</span>
        </div>

        <div className="flex items-center space-x-6 text-xs font-mono">
          <a
            href="#privacy"
            onClick={(e) => {
              e.preventDefault();
              alert("Privacy Notice: All data entered during this exploration remains within your browser session.");
            }}
            className="hover:text-warm-ivory transition-colors underline-offset-4 hover:underline"
          >
            {t.footer.privacyPolicy}
          </a>
          <a
            href="#terms"
            onClick={(e) => {
              e.preventDefault();
              alert("Educational Disclaimer: All simulations and cost estimations are illustrative models.");
            }}
            className="hover:text-warm-ivory transition-colors underline-offset-4 hover:underline"
          >
            {t.footer.terms}
          </a>
          <a
            href="#data"
            onClick={(e) => {
              e.preventDefault();
              alert("Data Usage: Structured state payload is preserved locally for Stage 2.");
            }}
            className="hover:text-warm-ivory transition-colors underline-offset-4 hover:underline"
          >
            {t.footer.dataUsage}
          </a>
        </div>
      </div>
    </footer>
  );
};