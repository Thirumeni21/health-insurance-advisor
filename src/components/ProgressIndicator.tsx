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
      <div className="flex items-center justify-between mb-3 text-xs font-sans text-muted">
        {canGoBack ? (
          <button
            onClick={onBack}
            className="group flex items-center space-x-1.5 text-muted hover:text-ink transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-lavender-600" />
            <span>{t.progress.previous}</span>
          </button>
        ) : (
          <div className="w-10" />
        )}

        <div className="flex items-center space-x-1.5 font-sans font-medium text-ink-soft">
          <span>{t.progress.step}</span>
          <span className="text-ink font-bold">0{currentStep}</span>
          <span className="text-hairline">/</span>
          <span className="text-muted">0{totalSteps}</span>
        </div>

        <span className="text-xs uppercase tracking-wider text-lavender-600 font-semibold px-2.5 py-0.5 rounded-full bg-lavender-100 border border-lavender-300">
          {stepCategory}
        </span>
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-[11px] font-mono text-muted">01</span>
        <div className="flex-1 h-[3px] bg-bg-soft rounded-full overflow-hidden relative border border-hairline">
          <div
            className="absolute top-0 bottom-0 left-0 bg-lavender-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>
        <span className="text-[11px] font-mono text-muted">0{totalSteps}</span>
      </div>
    </div>
  );
};