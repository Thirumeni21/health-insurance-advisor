"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CreditCard,
  FileText,
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ClipboardList,
} from "lucide-react";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface Chapter3ClaimsProps {
  onNextChapter: () => void;
  onPrevChapter: () => void;
}

export const Chapter3Claims: React.FC<Chapter3ClaimsProps> = ({
  onNextChapter,
  onPrevChapter,
}) => {
  const { language, t } = useLanguage();
  const lang = language === "ta" ? "ta" : "en";
  const ch = t.stage3.chapter3;

  const [activeRouteTab, setActiveRouteTab] = useState<"cashless" | "reimb">("cashless");
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-10 select-none animate-fadeIn">
      {/* Badge & Title */}
      <div className="text-center sm:text-left space-y-2 border-b border-glass-border pb-4">
        <span className="text-[11px] font-mono tracking-widest uppercase text-burnished-copper block">
          {ch.badge}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-warm-ivory">
          {ch.headline}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-dusty-mauve font-light leading-relaxed max-w-2xl">
          {ch.subheading}
        </p>
      </div>

      {/* 1. Cashless vs Reimbursement Matrix */}
      <div className="luxury-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl text-warm-ivory">{ch.cashlessVsReimbTitle}</h3>
          <p className="text-xs text-dusty-mauve font-light mt-1">{ch.cashlessVsReimbSub}</p>
        </div>

        {/* Route Selector Buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => {
              sound.playSoftPulse();
              setActiveRouteTab("cashless");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center space-x-2 ${
              activeRouteTab === "cashless"
                ? "bg-burnished-copper text-warm-ivory shadow-copper-glow"
                : "bg-deep-aubergine text-dusty-mauve hover:text-warm-ivory border border-glass-border"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{lang === "ta" ? "கேஷ்லெஸ் முறை" : "Cashless Route"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playSoftPulse();
              setActiveRouteTab("reimb");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center space-x-2 ${
              activeRouteTab === "reimb"
                ? "bg-burnished-copper text-warm-ivory shadow-copper-glow"
                : "bg-deep-aubergine text-dusty-mauve hover:text-warm-ivory border border-glass-border"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === "ta" ? "ரீஇம்பர்ஸ்மென்ட் முறை" : "Reimbursement Route"}</span>
          </button>
        </div>

        {/* Matrix Comparison Table */}
        <div className="space-y-2">
          {ch.matrix.map((row, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-deep-aubergine/70 border border-glass-border grid grid-cols-1 md:grid-cols-3 gap-3 text-xs items-center"
            >
              <span className="font-mono text-dusty-mauve uppercase tracking-wider text-[10px]">
                {row.feature}
              </span>
              <div
                className={`p-2.5 rounded-xl border transition-all ${
                  activeRouteTab === "cashless"
                    ? "bg-burnished-copper/15 border-burnished-copper/50 text-warm-ivory"
                    : "bg-obsidian-plum/40 border-glass-border text-dusty-mauve/70"
                }`}
              >
                <span className="font-mono text-[9px] text-burnished-copper block mb-0.5">CASHLESS</span>
                {row.cashless}
              </div>
              <div
                className={`p-2.5 rounded-xl border transition-all ${
                  activeRouteTab === "reimb"
                    ? "bg-burnished-copper/15 border-burnished-copper/50 text-warm-ivory"
                    : "bg-obsidian-plum/40 border-glass-border text-dusty-mauve/70"
                }`}
              >
                <span className="font-mono text-[9px] text-soft-champagne block mb-0.5">REIMBURSEMENT</span>
                {row.reimb}
              </div>
            </div>
          ))}
        </div>

        {/* Essential Truth Banner */}
        <div className="p-4 rounded-2xl bg-oxblood-burgundy/40 border border-burnished-copper/40 flex items-start space-x-3 text-xs text-warm-ivory/90 leading-relaxed font-light">
          <AlertCircle className="w-4 h-4 text-burnished-copper flex-shrink-0 mt-0.5" />
          <p>{ch.cashlessNotZero}</p>
        </div>
      </div>

      {/* 2. The 7-Step Claim Journey (Interactive Vertical Timeline) */}
      <div className="luxury-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl text-warm-ivory">{ch.journeyTitle}</h3>
          <p className="text-xs text-dusty-mauve font-light mt-1">
            {lang === "ta" ? "மருத்துவமனைச் சேர்க்கை முதல் இறுதி பில் தீர்வு வரை:" : "From admission to final settlement:"}
          </p>
        </div>

        <div className="space-y-3.5 relative py-2">
          {ch.journeySteps.map((st, idx) => {
            const isLast = idx === ch.journeySteps.length - 1;
            const isCurrent = activeStepIndex === idx;

            return (
              <div
                key={st.step}
                onClick={() => {
                  sound.playSoftPulse();
                  setActiveStepIndex(idx);
                }}
                className="relative flex items-start space-x-4 cursor-pointer group"
              >
                {/* Connector Dot */}
                <div className="flex flex-col items-center flex-shrink-0 mt-1">
                  <div
                    className={`w-7 h-7 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-burnished-copper text-obsidian-plum border-burnished-copper shadow-copper-glow scale-110"
                        : "bg-deep-aubergine text-dusty-mauve border-glass-border group-hover:border-burnished-copper/50"
                    }`}
                  >
                    {st.step}
                  </div>
                  {!isLast && <div className="w-0.5 h-12 bg-gradient-to-b from-burnished-copper/40 to-glass-border/30 my-1" />}
                </div>

                {/* Step Content */}
                <div
                  className={`flex-1 p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? "bg-deep-aubergine/90 border-burnished-copper/60 shadow-md"
                      : "bg-deep-aubergine/60 border-glass-border hover:border-burnished-copper/30"
                  }`}
                >
                  <h4 className="font-serif text-base text-warm-ivory font-semibold mb-1">
                    {st.title}
                  </h4>
                  <p className="text-xs text-dusty-mauve font-light leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Hospitalization Action Checklist */}
      <div className="luxury-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center space-x-2 text-burnished-copper">
          <ClipboardList className="w-5 h-5" />
          <h3 className="font-serif text-xl sm:text-2xl text-warm-ivory">{ch.checklistTitle}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ch.checklistItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-deep-aubergine/70 border border-glass-border flex items-start space-x-2.5 text-xs text-warm-ivory/90 font-light"
            >
              <CheckCircle2 className="w-4 h-4 text-burnished-copper flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Can a Claim Be Rejected? Total Transparency */}
      <div className="luxury-card p-6 sm:p-8 rounded-3xl border-rose-500/30 bg-oxblood-burgundy/20 space-y-6">
        <div className="flex items-center space-x-2 text-rose-300">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="font-serif text-xl sm:text-2xl text-warm-ivory">{ch.rejectionsTitle}</h3>
        </div>
        <p className="text-xs text-dusty-mauve font-light leading-relaxed">
          {ch.rejectionsSub}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ch.rejectionReasons.map((rj, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-deep-aubergine/80 border border-rose-500/20 flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="font-serif text-sm font-semibold text-rose-200 block mb-1">
                  {rj.reason}
                </span>
                <p className="text-[11px] text-dusty-mauve font-light leading-relaxed">
                  {rj.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Waiting Periods Timeline */}
      <div className="luxury-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl text-warm-ivory">{ch.waitingPeriodsTitle}</h3>
          <p className="text-xs text-dusty-mauve font-light mt-1">{ch.waitingPeriodsSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ch.waitingTimeline.map((wt, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-deep-aubergine/70 border border-glass-border space-y-2"
            >
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-burnished-copper/15 text-burnished-copper border border-burnished-copper/30">
                {wt.time}
              </span>
              <h4 className="font-serif text-base text-warm-ivory font-semibold pt-1">
                {wt.title}
              </h4>
              <p className="text-xs text-dusty-mauve font-light leading-relaxed">
                {wt.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Stepper */}
      <div className="pt-4 flex items-center justify-between border-t border-glass-border/40">
        <button
          onClick={() => {
            sound.playChime(380, 0.1);
            window.scrollTo({ top: 0, behavior: "smooth" });
            onPrevChapter();
          }}
          className="px-5 py-3 rounded-full bg-obsidian-plum border border-glass-border text-xs font-mono text-dusty-mauve hover:text-warm-ivory transition-all"
        >
          {t.stage3.nav.prevChapter}
        </button>

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
