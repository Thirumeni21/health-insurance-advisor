"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, RotateCcw, Users, Wallet, Shield, HeartHandshake, Sparkles, BookOpen } from "lucide-react";
import confetti from "canvas-confetti";
import { UserProtectionProfile } from "@/types/questionnaire";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface PersonalizedInquiryProps {
  profile: UserProtectionProfile;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  onRestartExperience: () => void;
  onProceedToStage3?: () => void;
}

export const PersonalizedInquiry: React.FC<PersonalizedInquiryProps> = ({
  profile,
  selectedOption,
  onSelectOption,
  onRestartExperience,
  onProceedToStage3,
}) => {
  const { t } = useLanguage();
  const [isCompleted, setIsCompleted] = useState(false);

  const finalRef = t.stage2.finalReflection;

  const handleComplete = (type: "options" | "learn_more") => {
    sound.playChime(760, 0.25);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#C47B5A", "#D8B98A", "#F1E9DC", "#B98A91"],
    });
    setIsCompleted(true);
  };

  // Family members list string
  const familyCount = profile.household.familyMembers.length + 1;
  const incomeLabel = (t.step4.incomeOptions as Record<string, string>)[profile.financial.incomeRange || ""] || "Recorded";
  const insuranceLabel = (t.step4.insuranceOptions as Record<string, string>)[profile.insurance.status || ""] || "Recorded";
  const firstConcern = profile.concerns[0];
  const concernTitle = firstConcern ? ((t.step5.concerns as any)[firstConcern]?.title || firstConcern) : "Comprehensive Family Protection";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 select-none z-10 relative animate-fadeIn">
      {/* Title */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-deep-aubergine/80 border border-glass-border">
          <Sparkles className="w-3.5 h-3.5 text-burnished-copper" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-burnished-copper">
            {finalRef.badge}
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-warm-ivory tracking-tight max-w-2xl mx-auto leading-tight">
          {finalRef.headline}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-dusty-mauve max-w-xl mx-auto font-light leading-relaxed">
          {finalRef.subheading}
        </p>
      </div>

      {/* 4 Core Personalized Reflection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {/* Family Circle */}
        <div className="luxury-card p-4 rounded-2xl border-glass-border flex flex-col justify-between space-y-2">
          <div className="flex items-center space-x-2 text-burnished-copper">
            <Users className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-wider">{finalRef.cards.family}</span>
          </div>
          <div>
            <div className="font-serif text-lg text-warm-ivory">{familyCount} Protected Nodes</div>
            <div className="text-[11px] text-dusty-mauve font-mono">{profile.user.city} · Primary Anchor</div>
          </div>
        </div>

        {/* Financial Context */}
        <div className="luxury-card p-4 rounded-2xl border-glass-border flex flex-col justify-between space-y-2">
          <div className="flex items-center space-x-2 text-soft-champagne">
            <Wallet className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-wider">{finalRef.cards.financial}</span>
          </div>
          <div>
            <div className="font-serif text-lg text-warm-ivory">{incomeLabel}</div>
            <div className="text-[11px] text-dusty-mauve font-mono">Resilience Context</div>
          </div>
        </div>

        {/* Current Insurance */}
        <div className="luxury-card p-4 rounded-2xl border-glass-border flex flex-col justify-between space-y-2">
          <div className="flex items-center space-x-2 text-warm-ivory">
            <Shield className="w-4 h-4 text-burnished-copper" />
            <span className="text-xs font-mono uppercase tracking-wider">{finalRef.cards.insurance}</span>
          </div>
          <div>
            <div className="font-serif text-lg text-warm-ivory">{insuranceLabel}</div>
            <div className="text-[11px] text-dusty-mauve font-mono">Current Coverage</div>
          </div>
        </div>

        {/* Primary Concern */}
        <div className="luxury-card p-4 rounded-2xl border-glass-border flex flex-col justify-between space-y-2">
          <div className="flex items-center space-x-2 text-muted-rose">
            <HeartHandshake className="w-4 h-4 text-burnished-copper" />
            <span className="text-xs font-mono uppercase tracking-wider">{finalRef.cards.concern}</span>
          </div>
          <div>
            <div className="font-serif text-base text-warm-ivory line-clamp-2">{concernTitle}</div>
            <div className="text-[11px] text-dusty-mauve font-mono">Focus Area</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!isCompleted ? (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              if (onProceedToStage3) {
                onProceedToStage3();
              } else {
                handleComplete("options");
              }
            }}
            className="group inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory text-xs font-semibold uppercase tracking-wider shadow-copper-glow hover:scale-105 transition-all duration-300 min-h-[44px]"
          >
            <span>{finalRef.ctaPrimary}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => {
              if (onProceedToStage3) {
                onProceedToStage3();
              } else {
                handleComplete("learn_more");
              }
            }}
            className="inline-flex items-center space-x-2 px-6 py-4 rounded-full bg-obsidian-plum border border-glass-border text-xs font-mono text-dusty-mauve hover:text-warm-ivory hover:border-burnished-copper/40 transition-all min-h-[44px]"
          >
            <BookOpen className="w-4 h-4 text-burnished-copper" />
            <span>{finalRef.ctaSecondary}</span>
          </button>
        </div>
      ) : (
        <div className="luxury-card p-8 rounded-3xl border-burnished-copper/40 bg-oxblood-burgundy/30 text-center space-y-4 max-w-xl mx-auto animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-burnished-copper/20 border border-burnished-copper flex items-center justify-center mx-auto text-burnished-copper">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-warm-ivory">{finalRef.modalTitle}</h3>
          <p className="text-xs text-dusty-mauve font-light leading-relaxed">
            {finalRef.modalSubtitle}
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            {onProceedToStage3 && (
              <button
                onClick={onProceedToStage3}
                className="group inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory text-xs font-semibold uppercase tracking-wider shadow-copper-glow transition-all"
              >
                <span>How Health Insurance Actually Helps You →</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            )}
            <button
              onClick={onRestartExperience}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-obsidian-plum border border-glass-border text-xs font-mono text-dusty-mauve hover:text-warm-ivory hover:border-burnished-copper transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{finalRef.restart}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};