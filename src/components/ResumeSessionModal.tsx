"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-ink/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-[24px] bg-white border border-hairline shadow-elevated p-6 sm:p-7 text-center space-y-4">
        {/* Subtle pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-lavender-100 border border-lavender-300 text-ink text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-lavender-600" />
          <span>{t.resume.tag}</span>
        </div>

        <h3 className="font-display font-bold text-2xl sm:text-3xl text-ink tracking-tight">
          {t.resume.title}
        </h3>

        <p className="font-sans text-sm text-ink-soft leading-relaxed font-normal">
          {t.resume.body}{" "}
          <strong className="text-ink font-semibold">
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
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full text-xs font-semibold tracking-wider bg-ink text-white hover:bg-[#2e283b] transition-all min-h-[44px]"
          >
            <span>{t.resume.continue}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playChime(350, 0.1);
              onDismiss();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-3 rounded-full text-xs font-semibold text-ink-soft hover:text-ink bg-white border border-hairline hover:border-ink transition-all min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resume.startOver}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};