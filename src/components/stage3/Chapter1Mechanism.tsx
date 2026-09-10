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
      <div className="luxury-card p-6 sm:p-10 rounded-3xl border-burnished-copper/40 bg-oxblood-burgundy/25 space-y-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-glass-border/40 pb-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-deep-aubergine text-[11px] font-mono text-burnished-copper border border-glass-border">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{ch.badge}</span>
          </div>
          <span className="text-xs font-mono text-dusty-mauve">
            {lang === "ta" ? "நிலை 2 தொடர்ச்சி" : "Stage 2 Continuity"}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl text-warm-ivory leading-tight">
          {ch.transitionTitle}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-dusty-mauve font-light leading-relaxed max-w-2xl">
          {ch.transitionSub}
        </p>

        {/* Re-displaying the Stage 2 Scenario Badge */}
        <div className="p-4 rounded-2xl bg-deep-aubergine/70 border border-glass-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-burnished-copper/20 border border-burnished-copper flex items-center justify-center text-burnished-copper font-mono font-bold">
              ₹
            </div>
            <div>
              <span className="font-mono text-[10px] text-burnished-copper uppercase tracking-wider block">
                {lang === "ta" ? "உங்கள் நிலை 2 மாதிரிச் சூழல்" : "Your Stage 2 Scenario"}
              </span>
              <strong className="text-warm-ivory font-serif text-base">{scenario.title[lang]}</strong>
              <span className="text-dusty-mauve ml-2">({scenario.targetPerson.name})</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-dusty-mauve block">
              {lang === "ta" ? "மாதிரி மருத்துவச் செலவு" : "Illustrative Medical Bill"}
            </span>
            <span className="font-serif text-2xl font-bold text-warm-ivory text-glow-copper">
              ₹{expenseAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* 2. What is Health Insurance? */}
      <div className="luxury-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl text-warm-ivory">
            {ch.whatIsTitle}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-warm-ivory/90 leading-relaxed font-light">
            {ch.whatIsDefinition}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-deep-aubergine/80 border border-burnished-copper/40 space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-burnished-copper flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === "ta" ? "எளிய விளக்கம்" : "In Simple Terms"}</span>
            </span>
            <p className="text-xs text-warm-ivory font-light leading-relaxed">
              {ch.whatIsSimple}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-deep-aubergine/80 border border-glass-border space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-soft-champagne flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{lang === "ta" ? "முக்கிய தெளிவுரை" : "Essential Clarity"}</span>
            </span>
            <p className="text-xs text-dusty-mauve font-light leading-relaxed">
              {ch.whatIsNot}
            </p>
          </div>
        </div>
      </div>

      {/* 3. The Basic Money Flow (5 Animated Steps) */}
      <div className="luxury-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between border-b border-glass-border pb-3">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-warm-ivory">
              {ch.moneyFlowTitle}
            </h3>
            <p className="text-xs text-dusty-mauve font-light mt-1">
              {ch.moneyFlowSub}
            </p>
          </div>
          <Layers className="w-5 h-5 text-burnished-copper" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ch.steps.map((st, idx) => (
            <div
              key={st.step}
              className="p-4 rounded-2xl bg-deep-aubergine/70 border border-glass-border hover:border-burnished-copper/50 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-burnished-copper/20 border border-burnished-copper text-[11px] font-mono font-bold text-burnished-copper flex items-center justify-center group-hover:bg-burnished-copper group-hover:text-obsidian-plum transition-all">
                    {st.step}
                  </span>
                  <span className="font-mono text-[10px] text-dusty-mauve uppercase tracking-wider">
                    {st.actor}
                  </span>
                </div>
                <h4 className="font-serif text-sm text-warm-ivory font-semibold mb-1">
                  {st.action}
                </h4>
                <p className="text-[11px] text-dusty-mauve font-light leading-relaxed">
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
        <div className="luxury-card p-6 rounded-3xl space-y-4 border-glass-border">
          <div className="flex items-center space-x-2 text-burnished-copper">
            <TrendingUp className="w-4 h-4" />
            <h3 className="font-serif text-xl text-warm-ivory">{ch.premiumTitle}</h3>
          </div>
          <p className="text-xs text-warm-ivory/90 leading-relaxed font-light">
            {ch.premiumDesc}
          </p>
          <div className="p-3.5 rounded-2xl bg-obsidian-plum/80 border border-glass-border text-[11px] text-dusty-mauve leading-relaxed">
            {ch.premiumFactors}
          </div>
          <span className="text-[10px] font-mono text-dusty-mauve/60 block italic">
            {ch.premiumDisclaimer}
          </span>
        </div>

        {/* Sum Insured Card */}
        <div className="luxury-card p-6 rounded-3xl space-y-4 border-glass-border">
          <div className="flex items-center space-x-2 text-soft-champagne">
            <Shield className="w-4 h-4" />
            <h3 className="font-serif text-xl text-warm-ivory">{ch.sumInsuredTitle}</h3>
          </div>
          <p className="text-xs text-warm-ivory/90 leading-relaxed font-light">
            {ch.sumInsuredSub}
          </p>
          <div className="p-3.5 rounded-2xl bg-obsidian-plum/80 border border-glass-border text-[11px] text-soft-champagne leading-relaxed">
            {ch.sumInsuredImportant}
          </div>
          <span className="text-[10px] font-mono text-burnished-copper block">
            {lang === "ta" ? "சம் இன்ஷூர்டு = பாதுகாப்புக் கொள்ளளவு (உத்தரவாதப் பணம் அல்ல)" : "Sum Insured = Protective Capacity, not cash reward"}
          </span>
        </div>
      </div>

      {/* 5. Recreating the Stage 2 Bill inside Sum Insured Capacity */}
      <div className="luxury-card p-6 sm:p-8 rounded-3xl border-burnished-copper/40 bg-oxblood-burgundy/20 space-y-6">
        <div>
          <h3 className="font-serif text-2xl text-warm-ivory">
            {ch.recreateBillTitle}
          </h3>
          <p className="text-xs text-dusty-mauve font-light mt-1">
            {ch.recreateBillSub}
          </p>
        </div>

        {/* Visual Capacity Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-burnished-copper font-medium">
              {ch.expenseLabel}: ₹{expenseAmount.toLocaleString("en-IN")} ({expensePercentage}%)
            </span>
            <span className="text-warm-ivory">
              {ch.capacityLabel}: ₹{standardCapacity.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Dual-color Capacity Progress Bar */}
          <div className="w-full h-7 rounded-full bg-deep-aubergine border border-glass-border overflow-hidden flex p-1">
            <div
              style={{ width: `${expensePercentage}%` }}
              className="h-full rounded-full bg-gradient-to-r from-burnished-copper to-burnished-copper-light flex items-center justify-end px-2 text-[10px] font-mono text-obsidian-plum font-bold shadow-copper-glow transition-all duration-700"
            >
              {expensePercentage}%
            </div>
            <div
              style={{ width: `${100 - expensePercentage}%` }}
              className="h-full rounded-full bg-deep-aubergine/40 flex items-center justify-center text-[10px] font-mono text-dusty-mauve/70"
            >
              ₹{remainingCapacity.toLocaleString("en-IN")} {lang === "ta" ? "மீதம்" : "buffer"}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-dusty-mauve font-mono pt-1">
            <span>{ch.remainingCapacityLabel}: <strong className="text-soft-champagne">₹{remainingCapacity.toLocaleString("en-IN")}</strong></span>
            <span>{lang === "ta" ? "1 ஆண்டிற்கு செல்லுபடியாகும்" : "Per Policy Year"}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-deep-aubergine/80 border border-glass-border space-y-2 text-xs font-light leading-relaxed">
          <p className="text-warm-ivory">{ch.recreateBillExplanation}</p>
          <p className="text-dusty-mauve/80 text-[11px] pt-1 border-t border-glass-border/40">
            {ch.recreateBillDisclaimer}
          </p>
        </div>
      </div>

      {/* Navigation Stepper */}
      <div className="pt-4 flex items-center justify-between border-t border-glass-border/40">
        {onBackToScenario ? (
          <button
            onClick={onBackToScenario}
            className="px-5 py-3 rounded-full bg-obsidian-plum border border-glass-border text-xs font-mono text-dusty-mauve hover:text-warm-ivory transition-all"
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
          className="group inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory text-xs font-semibold uppercase tracking-wider shadow-copper-glow hover:scale-105 transition-all duration-300 min-h-[44px]"
        >
          <span>{t.stage3.nav.nextChapter}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
