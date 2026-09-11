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
      <div className="text-center sm:text-left space-y-2 border-b border-hairline pb-4">
        <span className="editorial-kicker block">
          {ch.badge}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
          {ch.headline}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-soft leading-relaxed max-w-2xl">
          {ch.subheading}
        </p>
      </div>

      {/* 1. Cashless vs Reimbursement Matrix */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-6">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">{ch.cashlessVsReimbTitle}</h3>
          <p className="text-xs text-ink-soft mt-1">{ch.cashlessVsReimbSub}</p>
        </div>

        {/* Route Selector Buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => {
              sound.playSoftPulse();
              setActiveRouteTab("cashless");
            }}
            className={`px-4 py-2 rounded-full text-xs font-mono transition-all flex items-center space-x-2 ${
              activeRouteTab === "cashless"
                ? "bg-ink text-white font-medium"
                : "bg-bg-soft text-ink-soft hover:text-ink border border-hairline"
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
            className={`px-4 py-2 rounded-full text-xs font-mono transition-all flex items-center space-x-2 ${
              activeRouteTab === "reimb"
                ? "bg-ink text-white font-medium"
                : "bg-bg-soft text-ink-soft hover:text-ink border border-hairline"
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
              className="p-4 rounded-[16px] bg-bg-soft border border-hairline grid grid-cols-1 md:grid-cols-3 gap-3 text-xs items-center"
            >
              <span className="font-mono text-ink-soft uppercase tracking-wider text-[10px]">
                {row.feature}
              </span>
              <div
                className={`p-2.5 rounded-xl border transition-all ${
                  activeRouteTab === "cashless"
                    ? "bg-lavender-100 border-lavender-300 text-ink font-medium"
                    : "bg-white border-hairline text-ink-soft"
                }`}
              >
                <span className="font-mono text-[9px] text-lavender-600 block mb-0.5">CASHLESS</span>
                {row.cashless}
              </div>
              <div
                className={`p-2.5 rounded-xl border transition-all ${
                  activeRouteTab === "reimb"
                    ? "bg-lavender-100 border-lavender-300 text-ink font-medium"
                    : "bg-white border-hairline text-ink-soft"
                }`}
              >
                <span className="font-mono text-[9px] text-ink block mb-0.5 font-semibold">REIMBURSEMENT</span>
                {row.reimb}
              </div>
            </div>
          ))}
        </div>

        {/* Essential Truth Banner */}
        <div className="p-4 rounded-[16px] bg-sage-100/60 border border-hairline flex items-start space-x-3 text-xs text-ink leading-relaxed">
          <AlertCircle className="w-4 h-4 text-ink flex-shrink-0 mt-0.5" />
          <p>{ch.cashlessNotZero}</p>
        </div>
      </div>

      {/* 2. The 7-Step Claim Journey (Interactive Vertical Timeline) */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-6">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">{ch.journeyTitle}</h3>
          <p className="text-xs text-ink-soft mt-1">
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
                        ? "bg-ink text-white border-ink shadow-sm scale-110"
                        : "bg-bg-soft text-ink-soft border-hairline group-hover:border-lavender-300"
                    }`}
                  >
                    {st.step}
                  </div>
                  {!isLast && <div className="w-0.5 h-12 bg-hairline my-1" />}
                </div>

                {/* Step Content */}
                <div
                  className={`flex-1 p-4 rounded-[16px] border transition-all ${
                    isCurrent
                      ? "bg-lavender-100/50 border-lavender-300 shadow-sm"
                      : "bg-bg-soft border-hairline hover:border-lavender-300"
                  }`}
                >
                  <h4 className="font-display text-base text-ink font-semibold mb-1">
                    {st.title}
                  </h4>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Hospitalization Action Checklist */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-6">
        <div className="flex items-center space-x-2 text-ink">
          <ClipboardList className="w-5 h-5 text-lavender-600" />
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">{ch.checklistTitle}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ch.checklistItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-[16px] bg-bg-soft border border-hairline flex items-start space-x-2.5 text-xs text-ink font-medium"
            >
              <CheckCircle2 className="w-4 h-4 text-lavender-600 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Can a Claim Be Rejected? Total Transparency */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-6">
        <div className="flex items-center space-x-2 text-rose-700">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">{ch.rejectionsTitle}</h3>
        </div>
        <p className="text-xs text-ink-soft leading-relaxed">
          {ch.rejectionsSub}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ch.rejectionReasons.map((rj, idx) => (
            <div
              key={idx}
              className="p-4 rounded-[16px] bg-rose-50/50 border border-rose-200 flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="font-sans text-sm font-semibold text-rose-900 block mb-1">
                  {rj.reason}
                </span>
                <p className="text-xs text-ink-soft leading-relaxed">
                  {rj.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Waiting Periods Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-6">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">{ch.waitingPeriodsTitle}</h3>
          <p className="text-xs text-ink-soft mt-1">{ch.waitingPeriodsSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ch.waitingTimeline.map((wt, idx) => (
            <div
              key={idx}
              className="p-5 rounded-[16px] bg-bg-soft border border-hairline space-y-2"
            >
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-lavender-100 text-ink border border-hairline font-medium">
                {wt.time}
              </span>
              <h4 className="font-display text-base text-ink font-semibold pt-1">
                {wt.title}
              </h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                {wt.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Stepper */}
      <div className="pt-4 flex items-center justify-between border-t border-hairline">
        <button
          onClick={() => {
            sound.playChime(380, 0.1);
            window.scrollTo({ top: 0, behavior: "smooth" });
            onPrevChapter();
          }}
          className="px-5 py-3 rounded-full bg-white border border-hairline text-xs font-mono text-ink-soft hover:text-ink hover:bg-bg-soft transition-all"
        >
          {t.stage3.nav.prevChapter}
        </button>

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
