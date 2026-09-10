"use client";

import React from "react";
import { ArrowRight, Lock, Check } from "lucide-react";
import {
  IncomeRange,
  CurrentInsuranceType,
  CurrentCoverAmount,
  EmergencySavingsLevel,
} from "@/types/questionnaire";
import {
  INCOME_OPTIONS,
  CURRENT_INSURANCE_OPTIONS,
  CURRENT_COVER_OPTIONS,
  EMERGENCY_SAVINGS_OPTIONS,
} from "@/data/constants";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface Question4FinancialProps {
  householdIncome: IncomeRange | null;
  currentInsurance: CurrentInsuranceType | null;
  currentCover: CurrentCoverAmount | null;
  emergencySavings: EmergencySavingsLevel | null;
  onUpdate: (data: {
    householdIncome?: IncomeRange;
    currentInsurance?: CurrentInsuranceType;
    currentCover?: CurrentCoverAmount;
    emergencySavings?: EmergencySavingsLevel;
  }) => void;
  onContinue: () => void;
}

export const Question4Financial: React.FC<Question4FinancialProps> = ({
  householdIncome,
  currentInsurance,
  currentCover,
  emergencySavings,
  onUpdate,
  onContinue,
}) => {
  const { t, language } = useLanguage();

  const isValid =
    !!householdIncome &&
    !!currentInsurance &&
    (currentInsurance === "none" || !!currentCover) &&
    !!emergencySavings;

  return (
    <div className="w-full max-w-3xl mx-auto animate-fadeIn select-none z-10 relative">
      {/* Title */}
      <div className="text-center mb-8">
        <span className="text-[11px] uppercase font-mono tracking-widest text-burnished-copper mb-2 block">
          {t.step4.tag}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-warm-ivory tracking-tight mb-3">
          {t.step4.title}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-dusty-mauve max-w-md mx-auto font-light">
          {t.step4.subtitle}
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Household Income Range */}
        <div className="luxury-card p-6 rounded-2xl">
          <label className="text-xs font-mono uppercase tracking-wider text-dusty-mauve block mb-1">
            {t.step4.incomeLabel}
          </label>
          <p className="text-xs text-dusty-mauve/70 mb-4 font-light">
            {t.step4.incomeDesc}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {INCOME_OPTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  sound.playSoftPulse();
                  onUpdate({ householdIncome: item.id });
                }}
                className={`min-h-[50px] p-3.5 rounded-xl text-left border transition-all ${
                  householdIncome === item.id
                    ? "bg-burnished-copper/20 border-burnished-copper text-warm-ivory shadow-copper-glow"
                    : "bg-obsidian-plum/70 border-glass-border text-dusty-mauve hover:text-warm-ivory hover:border-burnished-copper/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm">
                    {t.step4.incomeOptions[item.id]}
                  </span>
                  {householdIncome === item.id && (
                    <Check className="w-3.5 h-3.5 text-burnished-copper" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Current Health Insurance */}
        <div className="luxury-card p-6 rounded-2xl">
          <label className="text-xs font-mono uppercase tracking-wider text-dusty-mauve block mb-1">
            {t.step4.insuranceLabel}
          </label>
          <p className="text-xs text-dusty-mauve/70 mb-4 font-light">
            {t.step4.insuranceDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {CURRENT_INSURANCE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  sound.playSoftPulse();
                  if (opt.id === "none") {
                    onUpdate({ currentInsurance: "none", currentCover: "0" });
                  } else {
                    onUpdate({
                      currentInsurance: opt.id,
                      currentCover: currentCover === "0" ? undefined : (currentCover ?? undefined),
                    });
                  }
                }}
                className={`min-h-[52px] p-3.5 rounded-xl text-left border transition-all flex items-start space-x-3 ${
                  currentInsurance === opt.id
                    ? "bg-burnished-copper/20 border-burnished-copper shadow-copper-glow"
                    : "bg-obsidian-plum/70 border-glass-border hover:border-burnished-copper/40"
                }`}
              >
                <span className="text-lg mt-0.5">{opt.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-serif text-base ${
                        currentInsurance === opt.id
                          ? "text-warm-ivory font-bold"
                          : "text-dusty-mauve"
                      }`}
                    >
                      {t.step4.insuranceOptions[opt.id]}
                    </span>
                    {currentInsurance === opt.id && (
                      <Check className="w-3.5 h-3.5 text-burnished-copper" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Existing Coverage Amount */}
        {currentInsurance === "none" ? (
          <div className="luxury-card p-5 rounded-2xl border border-glass-border/60 bg-obsidian-plum/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🛡️</span>
              <div>
                <p className="font-serif text-sm text-warm-ivory">
                  {language === "ta" ? "தற்போது காப்பீடு இல்லை (₹0)" : "No Active Cover (₹0)"}
                </p>
                <p className="text-xs text-dusty-mauve/70 font-light mt-0.5">
                  {language === "ta"
                    ? "நீங்கள் தற்போது ஹெல்த் இன்ஷூரன்ஸ் இல்லை என்று குறிப்பிட்டதால் இது ₹0 ஆக அமைக்கப்பட்டுள்ளது."
                    : "Automatically set to ₹0 since you currently have no active health insurance."}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-burnished-copper/20 text-burnished-copper border border-burnished-copper/40 whitespace-nowrap ml-3">
              {language === "ta" ? "பொருந்தாது" : "Not Applicable"}
            </span>
          </div>
        ) : (
          <div className="luxury-card p-6 rounded-2xl">
            <label className="text-xs font-mono uppercase tracking-wider text-dusty-mauve block mb-1">
              {t.step4.coverLabel}
            </label>
            <p className="text-xs text-dusty-mauve/70 mb-4 font-light">
              {t.step4.coverDesc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CURRENT_COVER_OPTIONS.filter((cov) => cov.id !== "0").map((cov) => (
                <button
                  key={cov.id}
                  type="button"
                  onClick={() => {
                    sound.playSoftPulse();
                    onUpdate({ currentCover: cov.id });
                  }}
                  className={`min-h-[44px] py-3 px-2 rounded-xl text-xs font-mono text-center border transition-all ${
                    currentCover === cov.id
                      ? "bg-burnished-copper/20 border-burnished-copper text-warm-ivory font-medium shadow-copper-glow"
                      : "bg-obsidian-plum/70 border-glass-border text-dusty-mauve hover:text-warm-ivory"
                  }`}
                >
                  {cov.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. Emergency Savings Buffer */}
        <div className="luxury-card p-6 rounded-2xl">
          <label className="text-xs font-mono uppercase tracking-wider text-dusty-mauve block mb-1">
            {t.step4.savingsLabel}
          </label>
          <p className="text-xs text-dusty-mauve/70 mb-4 font-light">
            {t.step4.savingsDesc}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {EMERGENCY_SAVINGS_OPTIONS.map((sav) => (
              <button
                key={sav.id}
                type="button"
                onClick={() => {
                  sound.playSoftPulse();
                  onUpdate({ emergencySavings: sav.id });
                }}
                className={`min-h-[48px] p-3.5 rounded-xl text-left border transition-all ${
                  emergencySavings === sav.id
                    ? "bg-soft-champagne/15 border-soft-champagne text-warm-ivory shadow-champagne-glow"
                    : "bg-obsidian-plum/70 border-glass-border text-dusty-mauve hover:text-warm-ivory"
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  <span className="font-serif text-sm">{t.step4.savingsOptions[sav.id]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Zero Private Data Guarantee */}
        <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-deep-aubergine/80 border border-glass-border">
          <Lock className="w-4 h-4 text-burnished-copper flex-shrink-0" />
          <div className="text-[11px] text-dusty-mauve leading-relaxed font-light">
            {t.step4.privacyGuarantee}
          </div>
        </div>
      </div>

      {/* Continue Action */}
      <div className="flex items-center justify-center mt-8">
        <button
          onClick={() => {
            sound.playChime(580, 0.12);
            onContinue();
          }}
          disabled={!isValid}
          className={`group inline-flex items-center space-x-3 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 min-h-[44px] ${
            isValid
              ? "bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory shadow-copper-glow hover:scale-105"
              : "bg-deep-aubergine text-dusty-mauve/30 cursor-not-allowed border border-glass-border"
          }`}
        >
          <span>{t.step4.continue}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
