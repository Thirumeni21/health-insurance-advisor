"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, RotateCcw, Users, Wallet, Shield, HeartHandshake, Sparkles, BookOpen } from "lucide-react";
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
    sound.playChime(640, 0.2);
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
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-lavender-100 border border-hairline">
          <Sparkles className="w-3.5 h-3.5 text-lavender-600" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-ink font-medium">
            {finalRef.badge}
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight max-w-2xl mx-auto leading-tight">
          {finalRef.headline}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-soft max-w-xl mx-auto leading-relaxed">
          {finalRef.subheading}
        </p>
      </div>

      {/* 4 Core Personalized Reflection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {/* Family Circle */}
        <div className="bg-white p-5 rounded-[20px] border border-hairline shadow-subtle flex flex-col justify-between space-y-3">
          <div className="flex items-center space-x-2 text-ink">
            <Users className="w-4 h-4 text-lavender-600" />
            <span className="text-xs font-mono uppercase tracking-wider text-ink-soft">{finalRef.cards.family}</span>
          </div>
          <div>
            <div className="font-display text-lg font-semibold text-ink">{familyCount} Protected Nodes</div>
            <div className="text-[11px] text-muted font-mono">{profile.user.city} · Primary Anchor</div>
          </div>
        </div>

        {/* Financial Context */}
        <div className="bg-white p-5 rounded-[20px] border border-hairline shadow-subtle flex flex-col justify-between space-y-3">
          <div className="flex items-center space-x-2 text-ink">
            <Wallet className="w-4 h-4 text-lavender-600" />
            <span className="text-xs font-mono uppercase tracking-wider text-ink-soft">{finalRef.cards.financial}</span>
          </div>
          <div>
            <div className="font-display text-lg font-semibold text-ink">{incomeLabel}</div>
            <div className="text-[11px] text-muted font-mono">Resilience Context</div>
          </div>
        </div>

        {/* Current Insurance */}
        <div className="bg-white p-5 rounded-[20px] border border-hairline shadow-subtle flex flex-col justify-between space-y-3">
          <div className="flex items-center space-x-2 text-ink">
            <Shield className="w-4 h-4 text-lavender-600" />
            <span className="text-xs font-mono uppercase tracking-wider text-ink-soft">{finalRef.cards.insurance}</span>
          </div>
          <div>
            <div className="font-display text-lg font-semibold text-ink">{insuranceLabel}</div>
            <div className="text-[11px] text-muted font-mono">Current Coverage</div>
          </div>
        </div>

        {/* Primary Concern */}
        <div className="bg-white p-5 rounded-[20px] border border-hairline shadow-subtle flex flex-col justify-between space-y-3">
          <div className="flex items-center space-x-2 text-ink">
            <HeartHandshake className="w-4 h-4 text-lavender-600" />
            <span className="text-xs font-mono uppercase tracking-wider text-ink-soft">{finalRef.cards.concern}</span>
          </div>
          <div>
            <div className="font-display text-base font-semibold text-ink line-clamp-2">{concernTitle}</div>
            <div className="text-[11px] text-muted font-mono">Focus Area</div>
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
            className="btn-primary min-h-[44px] px-8 py-4 text-xs group inline-flex items-center space-x-3"
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
            className="inline-flex items-center space-x-2 px-6 py-4 rounded-full bg-white border border-hairline text-xs font-mono text-ink-soft hover:text-ink hover:bg-bg-soft transition-all min-h-[44px]"
          >
            <BookOpen className="w-4 h-4 text-lavender-600" />
            <span>{finalRef.ctaSecondary}</span>
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-[24px] border border-hairline shadow-elevated text-center space-y-4 max-w-xl mx-auto animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-sage-100 border border-sage-300 flex items-center justify-center mx-auto text-ink">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-display text-2xl font-semibold text-ink">{finalRef.modalTitle}</h3>
          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
            {finalRef.modalSubtitle}
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            {onProceedToStage3 && (
              <button
                onClick={onProceedToStage3}
                className="btn-primary min-h-[44px] px-6 py-3 text-xs group inline-flex items-center space-x-2"
              >
                <span>How Health Insurance Actually Helps You →</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            )}
            <button
              onClick={onRestartExperience}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-bg-soft border border-hairline text-xs font-mono text-ink-soft hover:text-ink hover:bg-bg-soft transition-all"
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