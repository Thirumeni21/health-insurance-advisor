"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Code2, Users, Wallet, Edit3, ShieldAlert } from "lucide-react";
import { UserProtectionProfile } from "@/types/questionnaire";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface SummaryScreenProps {
  profile: UserProtectionProfile;
  onEditSection: (stepNumber: number) => void;
  onConsentChange: (accepted: boolean) => void;
  onProceedToScenario: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  profile,
  onEditSection,
  onConsentChange,
  onProceedToScenario,
}) => {
  const { t } = useLanguage();
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const handleLaunchScenario = () => {
    if (!profile.consent.dataUsageAccepted) {
      setConsentError(true);
      sound.playSoftPulse();
      return;
    }

    setConsentError(false);
    sound.playChime(640, 0.18);
    onProceedToScenario();
  };

  const getIncomeLabel = (val: string | null) => {
    if (!val) return "Not specified";
    const opts = t.step4.incomeOptions as Record<string, string>;
    return opts[val] || val;
  };

  const getInsuranceLabel = (val: string | null) => {
    if (!val) return "None";
    const opts = t.step4.insuranceOptions as Record<string, string>;
    return opts[val] || val;
  };

  const getSavingsLabel = (val: string | null) => {
    if (!val) return "Not specified";
    const opts = t.step4.savingsOptions as Record<string, string>;
    return opts[val] || val;
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn select-none z-10 relative px-4 pb-12">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="mb-3 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-lavender-100 border border-hairline">
          <CheckCircle2 className="w-3.5 h-3.5 text-lavender-600" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-ink font-medium">
            {t.summary.tag}
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink tracking-tight mb-2">
          {t.summary.title}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-soft max-w-lg mx-auto">
          {t.summary.subtitle}
        </p>
      </div>

      {/* Grid: Circle on Left, Financial on Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left: Protection Circle Recap */}
        <div className="bg-white p-6 sm:p-7 rounded-[24px] border border-hairline shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-lavender-600" />
              <h3 className="font-display text-lg font-semibold text-ink">
                {t.summary.circleTitle}
              </h3>
            </div>
            <button
              onClick={() => {
                sound.playChime(420, 0.08);
                onEditSection(3);
              }}
              className="flex items-center space-x-1 px-3 py-1 rounded-full bg-bg-soft border border-hairline text-xs font-mono text-ink-soft hover:text-ink transition-all"
            >
              <Edit3 className="w-3 h-3" />
              <span>{t.summary.editBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Primary User node card */}
            <div className="p-4 rounded-[18px] bg-white border border-lavender-300 shadow-xs flex flex-col justify-between space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-lavender-100 border border-lavender-300 flex items-center justify-center text-ink font-display font-bold text-[11px]">
                  YOU
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-lavender-50 text-lavender-600 border border-lavender-200 font-semibold">
                  Anchor
                </span>
              </div>
              <div>
                <span className="font-sans font-semibold text-ink text-sm block">
                  {t.summary.youAnchor}
                </span>
                <span className="text-[11px] text-ink-soft font-mono">
                  {profile.user.age} {t.step2.ageUnit} · {profile.user.city || "—"}
                </span>
              </div>
            </div>

            {/* Family Members cards */}
            {profile.household.familyMembers.map((member) => {
              const relTranslated =
                t.modal.relationships[member.relationship as keyof typeof t.modal.relationships] ||
                member.relationship;
              const avatarBg =
                member.relationship === "Child"
                  ? "bg-sage-100 border-[#d3e0ba]"
                  : member.relationship === "Mother" || member.relationship === "Father"
                  ? "bg-cream-100 border-[#eae3d2]"
                  : "bg-lavender-100 border-lavender-300";

              return (
                <div
                  key={member.id}
                  className="p-4 rounded-[18px] bg-bg-soft border border-hairline hover:border-lavender-300 flex flex-col justify-between space-y-2.5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-ink font-display font-bold text-[10px] ${avatarBg}`}>
                      {member.relationship.substring(0, 2).toUpperCase()}
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        member.financiallyDependent === "yes"
                          ? "text-ink bg-lavender-100 border border-lavender-300 font-medium"
                          : "text-ink-soft bg-white border border-hairline"
                      }`}
                    >
                      {member.financiallyDependent === "yes" ? "Dependent" : "Self-Reliant"}
                    </span>
                  </div>
                  <div>
                    <span className="font-sans font-semibold text-ink text-sm block truncate">
                      {member.name || relTranslated}
                    </span>
                    <span className="text-[11px] text-ink-soft font-mono">
                      {member.age} {t.step2.ageUnit} · {relTranslated}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Financial Picture Recap */}
        <div className="bg-white p-6 sm:p-7 rounded-[24px] border border-hairline shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-lavender-600" />
              <h3 className="font-display text-lg font-semibold text-ink">
                {t.summary.financialTitle}
              </h3>
            </div>
            <button
              onClick={() => {
                sound.playChime(420, 0.08);
                onEditSection(4);
              }}
              className="flex items-center space-x-1 px-3 py-1 rounded-full bg-bg-soft border border-hairline text-xs font-mono text-ink-soft hover:text-ink transition-all"
            >
              <Edit3 className="w-3 h-3" />
              <span>{t.summary.editBtn}</span>
            </button>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <span className="text-muted text-[11px] block">{t.summary.annualIncome}</span>
              <span className="text-ink font-display text-lg font-semibold">
                {getIncomeLabel(profile.financial.incomeRange)}
              </span>
            </div>

            <div>
              <span className="text-muted text-[11px] block">{t.summary.currentInsurance}</span>
              <span className="text-ink font-medium">
                {getInsuranceLabel(profile.insurance.status)}
              </span>
            </div>

            <div>
              <span className="text-muted text-[11px] block">{t.summary.emergencySavings}</span>
              <span className="text-ink font-medium">
                {getSavingsLabel(profile.financial.emergencySavings)}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-muted text-[11px]">{t.summary.priorityConcerns}</span>
                <button
                  onClick={() => onEditSection(5)}
                  className="text-[10px] text-lavender-600 hover:underline font-sans font-medium"
                >
                  {t.summary.editBtn.toLowerCase()}
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {profile.concerns.map((c) => {
                  const concernObj = (t.step5.concerns as Record<string, { title: string }>)[c];
                  const cTitle = concernObj ? concernObj.title : c.replace(/_/g, " ");
                  return (
                    <span
                      key={c}
                      className="px-2.5 py-0.5 rounded-full bg-lavender-100 border border-hairline text-[11px] text-ink font-sans"
                    >
                      {cTitle}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explicit Privacy & Data Usage Consent Checkbox */}
      <div
        className={
          consentError
            ? "p-5 rounded-[16px] mb-6 transition-all border border-red-300 bg-red-50"
            : "bg-white p-5 rounded-[16px] mb-6 transition-all border border-hairline shadow-subtle"
        }
      >
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={profile.consent.dataUsageAccepted}
            onChange={(e) => {
              setConsentError(false);
              onConsentChange(e.target.checked);
            }}
            className="mt-1 w-4 h-4 rounded accent-ink cursor-pointer"
          />
          <div className="text-xs text-ink-soft leading-relaxed">
            <span className="text-ink font-semibold block mb-0.5">
              {t.summary.consentHeading}
            </span>
            {t.summary.consentText}
          </div>
        </label>
        {consentError && (
          <div className="flex items-center space-x-1.5 text-xs text-red-600 mt-2 font-mono">
            <ShieldAlert className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            <span>{t.summary.consentError}</span>
          </div>
        )}
      </div>

      {/* Transition Box to Stage 2 */}
      <div className="p-8 rounded-[24px] bg-white border border-hairline shadow-elevated text-center space-y-4">
        <span className="editorial-kicker block">
          {t.summary.stage2Notice}
        </span>

        <p className="font-display text-2xl sm:text-3xl font-semibold text-ink max-w-xl mx-auto leading-normal">
          {t.summary.transitionQuote}
        </p>

        <p className="font-sans text-xs sm:text-sm text-ink-soft max-w-md mx-auto">
          {t.summary.transitionSub}
        </p>

        <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full">
          <button
            onClick={handleLaunchScenario}
            className="btn-primary min-h-[48px] px-8 py-4 text-xs group inline-flex items-center justify-center space-x-3 w-full sm:w-auto"
          >
            <span>{t.summary.cta}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => setShowJsonModal(true)}
            className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-full bg-white border border-hairline text-xs font-mono text-ink-soft hover:text-ink hover:bg-bg-soft transition-all min-h-[48px] w-full sm:w-auto"
            title="Inspect Stage 2 Blueprint JSON"
          >
            <Code2 className="w-3.5 h-3.5 text-lavender-600" />
            <span>{t.summary.inspectJson}</span>
          </button>
        </div>
      </div>

      {/* JSON Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-[20px] bg-white border border-hairline shadow-elevated p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-hairline mb-4">
              <h3 className="font-display text-xl font-semibold text-ink">
                {t.summary.jsonModalTitle}
              </h3>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-xs font-mono text-ink-soft hover:text-ink px-3 py-1 rounded-full bg-bg-soft border border-hairline"
              >
                {t.summary.close}
              </button>
            </div>
            <pre className="flex-1 overflow-auto bg-bg-soft p-4 rounded-xl text-[11px] font-mono text-ink border border-hairline">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
