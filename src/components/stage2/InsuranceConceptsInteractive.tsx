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
      {/* Header */ }
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-deep-aubergine/80 border border-glass-border">
          <Sparkles className="w-3.5 h-3.5 text-burnished-copper" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-burnished-copper">
            {concepts.badge}
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl text-warm-ivory tracking-tight">
          {concepts.headline}
        </h2>
        <p className="font-sans text-xs sm:text-sm text-dusty-mauve max-w-lg mx-auto font-light">
          {concepts.subheading}
        </p>
      </div>

      {/* 6 Concept Pills Grid */ }
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
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
              className={`p-3.5 rounded-2xl text-left border transition-all ${
                isActive
                  ? "bg-burnished-copper/20 border-burnished-copper shadow-copper-glow text-warm-ivory scale-[1.02]"
                  : "bg-deep-aubergine/70 border-glass-border hover:border-burnished-copper/40 text-dusty-mauve hover:text-warm-ivory"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-serif text-base font-bold text-warm-ivory">{c.title}</span>
                {isActive && <CheckCircle2 className="w-4 h-4 text-burnished-copper flex-shrink-0" />}
              </div>
              <span className="text-[10px] font-mono text-burnished-copper uppercase tracking-wider block">{c.tag}</span>
            </button>
          );
        })}
      </div>

      {/* Active Concept Explanation Showcase */ }
      <div className="luxury-card p-6 sm:p-8 rounded-3xl border-burnished-copper/40 bg-oxblood-burgundy/20 space-y-4 mb-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-glass-border">
          <div>
            <span className="text-[10px] font-mono text-burnished-copper uppercase tracking-wider">Active Concept</span>
            <h3 className="font-serif text-2xl text-warm-ivory">{currentActive.title}</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-deep-aubergine text-xs font-mono text-soft-champagne border border-glass-border self-start sm:self-auto">
            {currentActive.tag}
          </span>
        </div>
        <p className="font-sans text-sm sm:text-base text-dusty-mauve font-light leading-relaxed">
          {currentActive.desc}
        </p>
      </div>

      {/* CTA to Next Step */ }
      <div className="flex justify-center">
        <button
          onClick={() => {
            sound.playChime(580, 0.15);
            onProceedToCoverQuestion();
          }}
          className="group inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory text-xs font-semibold uppercase tracking-wider shadow-copper-glow hover:scale-105 transition-all duration-300 min-h-[44px]"
        >
          <span>{concepts.cta}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};