"use client";

import React from "react";
import {
  ArrowRight,
  Shield,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { UserProtectionProfile } from "@/types/questionnaire";
import { PersonalizedScenario } from "@/types/stage2";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface Chapter1MechanismProps {
  scenario: PersonalizedScenario;
  profile: UserProtectionProfile;
  onNextChapter: () => void;
  onBackToScenario?: () => void;
}

export const Chapter1Mechanism: React.FC<Chapter1MechanismProps> = ({
  scenario,
  profile,
  onNextChapter,
  onBackToScenario,
}) => {
  const { language, t } = useLanguage();
  const lang = language === "ta" ? "ta" : "en";
  const ch = t.stage3.chapter1;

  const expenseAmount = scenario.act4_bill.totalAmount;
  const standardCapacity = 1000000; // ₹10,00,000
  const remainingCapacity = Math.max(0, standardCapacity - expenseAmount);
  const expensePercentage = Math.min(100, Math.round((expenseAmount / standardCapacity) * 100));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-10 select-none animate-fadeIn">
      {/* 1. Natural Transition Header from Stage 2 */}
      <div className="bg-white p-6 sm:p-10 rounded-[24px] border border-hairline shadow-subtle space-y-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lavender-100 text-[11px] font-mono text-ink border border-hairline font-medium">
            <Sparkles className="w-3.5 h-3.5 text-lavender-600" />
            <span>{ch.badge}</span>
          </div>
          <span className="text-xs font-mono text-ink-soft">
            {lang === "ta" ? "நிலை 2 தொடர்ச்சி" : "Stage 2 Continuity"}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink leading-tight">
          {ch.transitionTitle}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-soft leading-relaxed max-w-2xl">
          {ch.transitionSub}
        </p>

        {/* Re-displaying the Stage 2 Scenario Badge */}
        <div className="p-4 rounded-[16px] bg-bg-soft border border-hairline flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-lavender-100 border border-lavender-300 flex items-center justify-center text-ink font-mono font-bold">
              ₹
            </div>
            <div>
              <span className="font-mono text-[10px] text-lavender-600 uppercase tracking-wider block">
                {lang === "ta" ? "உங்கள் நிலை 2 மாதிரிச் சூழல்" : "Your Stage 2 Scenario"}
              </span>
              <strong className="text-ink font-sans text-base font-semibold">{scenario.title[lang]}</strong>
              <span className="text-ink-soft ml-2">({scenario.targetPerson.name})</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-ink-soft block">
              {lang === "ta" ? "மாதிரி மருத்துவச் செலவு" : "Illustrative Medical Bill"}
            </span>
            <span className="font-display text-2xl font-bold text-ink">
              ₹{expenseAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* 2. What is Health Insurance? */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            {ch.whatIsTitle}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-ink-soft leading-relaxed">
            {ch.whatIsDefinition}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-[16px] bg-lavender-100/40 border border-hairline space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-lavender-600" />
              <span>{lang === "ta" ? "எளிய விளக்கம்" : "In Simple Terms"}</span>
            </span>
            <p className="text-xs text-ink-soft leading-relaxed">
              {ch.whatIsSimple}
            </p>
          </div>

          <div className="p-4 rounded-[16px] bg-bg-soft border border-hairline space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-lavender-600" />
              <span>{lang === "ta" ? "முக்கிய தெளிவுரை" : "Essential Clarity"}</span>
            </span>
            <p className="text-xs text-ink-soft leading-relaxed">
              {ch.whatIsNot}
            </p>
          </div>
        </div>
      </div>

      {/* 3. The Basic Money Flow (5 Steps) */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-6">
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">
              {ch.moneyFlowTitle}
            </h3>
            <p className="text-xs text-ink-soft mt-1">
              {ch.moneyFlowSub}
            </p>
          </div>
          <Layers className="w-5 h-5 text-lavender-600" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ch.steps.map((st) => (
            <div
              key={st.step}
              className="p-4 rounded-[16px] bg-bg-soft border border-hairline hover:border-lavender-300 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-lavender-100 border border-lavender-300 text-[11px] font-mono font-bold text-ink flex items-center justify-center">
                    {st.step}
                  </span>
                  <span className="font-mono text-[10px] text-ink-soft uppercase tracking-wider">
                    {st.actor}
                  </span>
                </div>
                <h4 className="font-sans text-sm text-ink font-semibold mb-1">
                  {st.action}
                </h4>
                <p className="text-xs text-ink-soft leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Premium & Sum Insured Foundations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Premium Card */}
        <div className="bg-white p-6 rounded-[24px] border border-hairline shadow-subtle space-y-4">
          <div className="flex items-center space-x-2 text-ink">
            <TrendingUp className="w-4 h-4 text-lavender-600" />
            <h3 className="font-display text-xl font-semibold text-ink">{ch.premiumTitle}</h3>
          </div>
          <p className="text-xs text-ink-soft leading-relaxed">
            {ch.premiumDesc}
          </p>
          <div className="p-3.5 rounded-xl bg-bg-soft border border-hairline text-xs text-ink-soft leading-relaxed">
            {ch.premiumFactors}
          </div>
          <span className="text-[10px] font-mono text-muted block italic">
            {ch.premiumDisclaimer}
          </span>
        </div>

        {/* Sum Insured Card */}
        <div className="bg-white p-6 rounded-[24px] border border-hairline shadow-subtle space-y-4">
          <div className="flex items-center space-x-2 text-ink">
            <Shield className="w-4 h-4 text-lavender-600" />
            <h3 className="font-display text-xl font-semibold text-ink">{ch.sumInsuredTitle}</h3>
          </div>
          <p className="text-xs text-ink-soft leading-relaxed">
            {ch.sumInsuredSub}
          </p>
          <div className="p-3.5 rounded-xl bg-bg-soft border border-hairline text-xs text-ink-soft leading-relaxed">
            {ch.sumInsuredImportant}
          </div>
          <span className="text-[10px] font-mono text-ink font-medium block">
            {lang === "ta" ? "சம் இன்ஷூர்டு = பாதுகாப்புக் கொள்ளளவு (உத்தரவாதப் பணம் அல்ல)" : "Sum Insured = Protective Capacity, not cash reward"}
          </span>
        </div>
      </div>

      {/* 5. Recreating the Stage 2 Bill inside Sum Insured Capacity */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-6">
        <div>
          <h3 className="font-display text-2xl font-semibold text-ink">
            {ch.recreateBillTitle}
          </h3>
          <p className="text-xs text-ink-soft mt-1">
            {ch.recreateBillSub}
          </p>
        </div>

        {/* Visual Capacity Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-ink font-semibold">
              {ch.expenseLabel}: ₹{expenseAmount.toLocaleString("en-IN")} ({expensePercentage}%)
            </span>
            <span className="text-ink-soft">
              {ch.capacityLabel}: ₹{standardCapacity.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Dual-color Capacity Progress Bar */}
          <div className="w-full h-7 rounded-full bg-bg-soft border border-hairline overflow-hidden flex p-1">
            <div
              style={{ width: `${expensePercentage}%` }}
              className="h-full rounded-full bg-lavender-600 flex items-center justify-end px-2 text-[10px] font-mono text-white font-bold transition-all duration-700"
            >
              {expensePercentage}%
            </div>
            <div
              style={{ width: `${100 - expensePercentage}%` }}
              className="h-full rounded-full bg-bg-soft flex items-center justify-center text-[10px] font-mono text-ink-soft"
            >
              ₹{remainingCapacity.toLocaleString("en-IN")} {lang === "ta" ? "மீதம்" : "buffer"}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-ink-soft font-mono pt-1">
            <span>{ch.remainingCapacityLabel}: <strong className="text-ink font-semibold">₹{remainingCapacity.toLocaleString("en-IN")}</strong></span>
            <span>{lang === "ta" ? "1 ஆண்டிற்கு செல்லுபடியாகும்" : "Per Policy Year"}</span>
          </div>
        </div>

        <div className="p-4 rounded-[16px] bg-bg-soft border border-hairline space-y-2 text-xs leading-relaxed">
          <p className="text-ink">{ch.recreateBillExplanation}</p>
          <p className="text-ink-soft text-[11px] pt-1 border-t border-hairline">
            {ch.recreateBillDisclaimer}
          </p>
        </div>
      </div>

      {/* Navigation Stepper */}
      <div className="pt-4 flex items-center justify-between border-t border-hairline">
        {onBackToScenario ? (
          <button
            onClick={onBackToScenario}
            className="px-5 py-3 rounded-full bg-white border border-hairline text-xs font-mono text-ink-soft hover:text-ink hover:bg-bg-soft transition-all"
          >
            {t.stage3.nav.backToScenario}
          </button>
        ) : <div />}

        <button
          onClick={() => {
            sound.playChime(580, 0.12);
            window.scrollTo({ top: 0, behavior: "smooth" });
            onNextChapter();
          }}
          className="btn-primary min-h-[44px] px-8 py-4 text-xs group inline-flex items-center space-x-3"
        >
          <span>{t.stage3.nav.nextChapter}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
