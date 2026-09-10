"use client";

import React from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface ResumeSessionModalProps {
  isOpen: boolean;
  stepNumber: number;
  onResume: () => void;
  onDismiss: () => void;
}

export const ResumeSessionModal: React.FC<ResumeSessionModalProps> = ({
  isOpen,
  stepNumber,
  onResume,
  onDismiss,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-obsidian-plum/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-deep-aubergine border border-burnished-copper/40 shadow-luxury-glass p-6 sm:p-7 text-center space-y-4">
        {/* Subtle pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-burnished-copper/15 border border-burnished-copper/30 text-burnished-copper text-xs font-mono">
          <span>{t.resume.tag}</span>
        </div>

        <h3 className="font-serif text-3xl text-warm-ivory tracking-tight">
          {t.resume.title}
        </h3>

        <p className="font-sans text-xs sm:text-sm text-dusty-mauve leading-relaxed font-light">
          {t.resume.body}{" "}
          <strong className="text-warm-ivory font-medium">
            {t.progress.step} 0{stepNumber || 1} / 05
          </strong>
          ?
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            onClick={() => {
              sound.playChime(600, 0.12);
              onResume();
            }}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-burnished-copper text-warm-ivory shadow-copper-glow hover:bg-burnished-copper-light transition-all min-h-[44px]"
          >
            <span>{t.resume.continue}</span>
            < ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playChime(350, 0.1);
              onDismiss();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-3.5 rounded-full text-xs font-mono text-dusty-mauve hover:text-warm-ivory bg-obsidian-plum border border-glass-border transition-all min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resume.startOver}</span>
          </button>
        </div>
      </div>
    </div>
  );
};