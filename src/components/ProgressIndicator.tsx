"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepCategory: string;
  onBack: () => void;
  canGoBack?: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps = 5,
  stepCategory,
  onBack,
  canGoBack = true,
}) => {
  const { t } = useLanguage();
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-xl mx-auto mb-8 z-20 relative select-none">
      <div className="flex items-center justify-between mb-3 text-xs font-mono text-dusty-mauve">
        {canGoBack ? (
          <button
            onClick={onBack}
            className="group flex items-center space-x-1.5 hover:text-warm-ivory transition-colors"
          >
            < ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-burnished-copper" />
            <span>{t.progress.previous}</span>
          </button>
        ) : (
          <div className="w-10" />
        )}

        <div className="flex items-center space-x-2">
          <span>{t.progress.step}</span>
          <span className="text-burnished-copper font-semibold">0{currentStep}</span>
          <span className="text-dusty-mauve/40">/</span>
          <span>0{totalSteps}</span>
        </div>

        <span className="text-[11px] uppercase tracking-widest text-dusty-mauve/90 px-2.5 py-0.5 rounded-full bg-deep-aubergine/80 border border-glass-border">
          {stepCategory}
        </span>
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-[10px] font-mono text-dusty-mauve/60">01</span>
        <div className="flex-1 h-[2px] bg-deep-aubergine rounded-full overflow-hidden relative border border-glass-border">
          <div
            className="absolute top-0 bottom-0 left-0 bg-burnished-copper transition-all duration-500 ease-out"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-dusty-mauve/60">0{totalSteps}</span>
      </div>
    </div>
  );
};