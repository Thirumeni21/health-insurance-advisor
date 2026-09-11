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
        <span className="editorial-kicker mb-2 block">
          {t.step4.tag}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink tracking-tight mb-3">
          {t.step4.title}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-soft max-w-md mx-auto">
          {t.step4.subtitle}
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Household Income Range */}
        <div className="bg-white p-6 sm:p-7 rounded-[20px] border border-hairline shadow-subtle">
          <label className="text-xs font-mono uppercase tracking-wider text-ink-soft block mb-1">
            {t.step4.incomeLabel}
          </label>
          <p className="text-xs text-muted mb-4">
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
                    ? "bg-lavender-100 border-lavender-600 text-ink font-semibold shadow-sm"
                    : "bg-white border-hairline text-ink-soft hover:bg-bg-soft hover:text-ink"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm">
                    {t.step4.incomeOptions[item.id]}
                  </span>
                  {householdIncome === item.id && (
                    <Check className="w-3.5 h-3.5 text-lavender-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Current Health Insurance */}
        <div className="bg-white p-6 sm:p-7 rounded-[20px] border border-hairline shadow-subtle">
          <label className="text-xs font-mono uppercase tracking-wider text-ink-soft block mb-1">
            {t.step4.insuranceLabel}
          </label>
          <p className="text-xs text-muted mb-4">
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
                    ? "bg-lavender-100 border-lavender-600 shadow-sm"
                    : "bg-white border-hairline hover:bg-bg-soft"
                }`}
              >
                <span className="text-lg mt-0.5">{opt.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-sans text-base ${
                        currentInsurance === opt.id
                          ? "text-ink font-semibold"
                          : "text-ink-soft"
                      }`}
                    >
                      {t.step4.insuranceOptions[opt.id]}
                    </span>
                    {currentInsurance === opt.id && (
                      <Check className="w-3.5 h-3.5 text-lavender-600" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Existing Coverage Amount */}
        {currentInsurance === "none" ? (
          <div className="p-5 rounded-[16px] border border-hairline bg-bg-soft flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🛡️</span>
              <div>
                <p className="font-display font-medium text-sm text-ink">
                  {language === "ta" ? "தற்போது காப்பீடு இல்லை (₹0)" : "No Active Cover (₹0)"}
                </p>
                <p className="text-xs text-ink-soft mt-0.5">
                  {language === "ta"
                    ? "நீங்கள் தற்போது ஹெல்த் இன்ஷூரன்ஸ் இல்லை என்று குறிப்பிட்டதால் இது ₹0 ஆக அமைக்கப்பட்டுள்ளது."
                    : "Automatically set to ₹0 since you currently have no active health insurance."}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-lavender-100 text-ink border border-hairline whitespace-nowrap ml-3">
              {language === "ta" ? "பொருந்தாது" : "Not Applicable"}
            </span>
          </div>
        ) : (
          <div className="bg-white p-6 sm:p-7 rounded-[20px] border border-hairline shadow-subtle">
            <label className="text-xs font-mono uppercase tracking-wider text-ink-soft block mb-1">
              {t.step4.coverLabel}
            </label>
            <p className="text-xs text-muted mb-4">
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
                      ? "bg-lavender-100 border-lavender-600 text-ink font-semibold shadow-sm"
                      : "bg-white border-hairline text-ink-soft hover:bg-bg-soft hover:text-ink"
                  }`}
                >
                  {cov.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. Emergency Savings Buffer */}
        <div className="bg-white p-6 sm:p-7 rounded-[20px] border border-hairline shadow-subtle">
          <label className="text-xs font-mono uppercase tracking-wider text-ink-soft block mb-1">
            {t.step4.savingsLabel}
          </label>
          <p className="text-xs text-muted mb-4">
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
                    ? "bg-lavender-100 border-lavender-600 text-ink font-semibold shadow-sm"
                    : "bg-white border-hairline text-ink-soft hover:bg-bg-soft hover:text-ink"
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  <span className="font-sans text-sm">{t.step4.savingsOptions[sav.id]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Zero Private Data Guarantee */}
        <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-bg-soft border border-hairline">
          <Lock className="w-4 h-4 text-lavender-600 flex-shrink-0" />
          <div className="text-[11px] text-ink-soft leading-relaxed font-light">
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
          className={`group inline-flex items-center space-x-3 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 min-h-[44px] ${
            isValid
              ? "btn-primary"
              : "bg-bg-soft text-muted cursor-not-allowed border border-hairline"
          }`}
        >
          <span>{t.step4.continue}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
