"use client";

import React from "react";
import { ArrowRight, HelpCircle, Check, ShieldCheck } from "lucide-react";
import { CurrentCoverUnderstanding } from "@/types/stage2";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface CurrentCoverQuestionProps {
  selectedOption: CurrentCoverUnderstanding | null;
  onSelectOption: (option: CurrentCoverUnderstanding) => void;
  onProceedToFinalReflection: () => void;
}

export const CurrentCoverQuestion: React.FC<CurrentCoverQuestionProps> = ({
  selectedOption,
  onSelectOption,
  onProceedToFinalReflection,
}) => {
  const { t } = useLanguage();
  const q = t.stage2.currentCoverQuestion;

  const options: Array<{ id: CurrentCoverUnderstanding; label: string }> = [
    { id: "clearly", label: q.options.clearly },
    { id: "somewhat", label: q.options.somewhat },
    { id: "not_really", label: q.options.not_really },
    { id: "no_insurance", label: q.options.no_insurance },
    { id: "not_sure", label: q.options.not_sure },
  ];

  const activeResponse = selectedOption ? q.responses[selectedOption] : null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 select-none z-10 relative animate-fadeIn">
      {/* Header */ }
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-deep-aubergine/80 border border-glass-border">
          <HelpCircle className="w-3.5 h-3.5 text-burnished-copper" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-burnished-copper">
            {q.badge}
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl text-warm-ivory tracking-tight">
          {q.headline}
        </h2>
        <p className="font-sans text-xs sm:text-sm text-dusty-mauve max-w-lg mx-auto font-light">
          {q.subheading}
        </p>
      </div>

      {/* Options Stack */ }
      <div className="space-y-3 mb-6">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                sound.playSoftPulse();
                onSelectOption(opt.id);
              }}
              className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between min-h-[56px] ${
                isSelected
                  ? "bg-burnished-copper/20 border-burnished-copper text-warm-ivory shadow-copper-glow"
                  : "bg-deep-aubergine/70 border-glass-border hover:border-burnished-copper/40 text-dusty-mauve hover:text-warm-ivory"
              }`}
            >
              <span className="font-serif text-base">{opt.label}</span>
              {isSelected && <Check className="w-4 h-4 text-burnished-copper flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Reassuring Feedback Banner */ }
      {activeResponse && (
        <div className="luxury-card p-5 rounded-2xl border-burnished-copper/30 bg-oxblood-burgundy/20 mb-8 animate-fadeIn flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-burnished-copper flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-warm-ivory/90 leading-relaxed font-light">
            {activeResponse}
          </p>
        </div>
      )}

      {/* Proceed CTA */ }
      <div className="flex justify-center">
        <button
          onClick={() => {
            sound.playChime(620, 0.15);
            onProceedToFinalReflection();
          }}
          disabled={!selectedOption}
          className={`group inline-flex items-center space-x-3 px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 min-h-[44px] ${
            selectedOption
              ? "bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory shadow-copper-glow hover:scale-105"
              : "bg-deep-aubergine text-dusty-mauve/30 cursor-not-allowed border border-glass-border"
          }`}
        >
          <span>{q.cta}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};