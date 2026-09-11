"use client";

import React from "react";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { InsuranceConceptId } from "@/types/stage2";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface InsuranceConceptsInteractiveProps {
  onProceedToCoverQuestion: () => void;
  activeConceptId: InsuranceConceptId | null;
  onSelectConcept: (id: InsuranceConceptId) => void;
}

export const InsuranceConceptsInteractive: React.FC<InsuranceConceptsInteractiveProps> = ({
  onProceedToCoverQuestion,
  activeConceptId,
  onSelectConcept,
}) => {
  const { t } = useLanguage();
  const concepts = t.stage2.concepts;

  const conceptList: Array<{ id: InsuranceConceptId; title: string; tag: string; desc: string }> = [
    { id: "premium", ...concepts.items.premium },
    { id: "sum_insured", ...concepts.items.sum_insured },
    { id: "waiting_period", ...concepts.items.waiting_period },
    { id: "deductible", ...concepts.items.deductible },
    { id: "copayment", ...concepts.items.copayment },
    { id: "cashless", ...concepts.items.cashless },
  ];

  const currentActive = conceptList.find((c) => c.id === activeConceptId) || conceptList[0];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 select-none z-10 relative animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-lavender-100 border border-hairline">
          <Sparkles className="w-3.5 h-3.5 text-lavender-600" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-ink font-medium">
            {concepts.badge}
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
          {concepts.headline}
        </h2>
        <p className="font-sans text-xs sm:text-sm text-ink-soft max-w-lg mx-auto">
          {concepts.subheading}
        </p>
      </div>

      {/* 6 Concept Pills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 mb-6">
        {conceptList.map((c) => {
          const isActive = (activeConceptId || "premium") === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                sound.playChime(440, 0.08);
                onSelectConcept(c.id);
              }}
              className={`p-3.5 rounded-[16px] text-left border transition-all ${
                isActive
                  ? "bg-lavender-100 border-lavender-600 shadow-sm text-ink"
                  : "bg-white border-hairline hover:border-lavender-300 hover:bg-bg-soft text-ink-soft hover:text-ink"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-sans text-sm sm:text-base font-semibold text-ink">{c.title}</span>
                {isActive && <CheckCircle2 className="w-4 h-4 text-lavender-600 flex-shrink-0" />}
              </div>
              <span className="text-[10px] font-mono text-lavender-600 uppercase tracking-wider block">{c.tag}</span>
            </button>
          );
        })}
      </div>

      {/* Active Concept Explanation Showcase */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-4 mb-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-hairline">
          <div>
            <span className="text-[10px] font-mono text-lavender-600 uppercase tracking-wider">Active Concept</span>
            <h3 className="font-display text-2xl font-semibold text-ink">{currentActive.title}</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-bg-soft text-xs font-mono text-ink-soft border border-hairline self-start sm:self-auto">
            {currentActive.tag}
          </span>
        </div>
        <p className="font-sans text-sm sm:text-base text-ink-soft leading-relaxed">
          {currentActive.desc}
        </p>
      </div>

      {/* CTA to Next Step */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            sound.playChime(580, 0.15);
            onProceedToCoverQuestion();
          }}
          className="btn-primary min-h-[44px] px-8 py-4 text-xs group inline-flex items-center space-x-3"
        >
          <span>{concepts.cta}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};