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
        <div className="mb-3 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-deep-aubergine/80 border border-glass-border">
          <CheckCircle2 className="w-3.5 h-3.5 text-burnished-copper" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-burnished-copper">
            {t.summary.tag}
          </span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-warm-ivory tracking-tight mb-2">
          {t.summary.title}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-dusty-mauve max-w-lg mx-auto font-light">
          {t.summary.subtitle}
        </p>
      </div>

      {/* Grid: Circle on Left, Financial on Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left: Protection Circle Recap */}
        <div className="luxury-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-glass-border">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-burnished-copper" />
              <h3 className="font-serif text-xl text-warm-ivory">
                {t.summary.circleTitle}
              </h3>
            </div>
            <button
              onClick={() => {
                sound.playChime(420, 0.08);
                onEditSection(3);
              }}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-obsidian-plum border border-glass-border text-[11px] font-mono text-burnished-copper hover:text-warm-ivory hover:border-burnished-copper transition-all"
            >
              <Edit3 className="w-3 h-3" />
              <span>{t.summary.editBtn}</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Primary User node */}
            <div className="p-3.5 rounded-xl bg-obsidian-plum/80 border border-burnished-copper/40 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-burnished-copper">
                    {t.summary.youAnchor}
                  </span>
                  <span className="text-xs text-warm-ivory font-serif">
                    {profile.user.age} {t.step2.ageUnit}
                  </span>
                </div>
                <span className="text-[11px] text-dusty-mauve font-mono">
                  {profile.user.city} · {profile.user.gender}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-burnished-copper/20 text-burnished-copper border border-burnished-copper/40">
                Anchor Node
              </span>
            </div>

            {/* Family Members list */}
            {profile.household.familyMembers.map((member) => (
              <div
                key={member.id}
                className="p-3 rounded-xl bg-obsidian-plum/50 border border-glass-border flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-serif text-warm-ivory text-sm block">
                    {member.name ? member.name + " (" + (t.modal.relationships[member.relationship as keyof typeof t.modal.relationships] || member.relationship) + ")" : t.modal.relationships[member.relationship as keyof typeof t.modal.relationships] || member.relationship}
                  </span>
                  <span className="text-[11px] text-dusty-mauve font-mono">
                    {member.age} {t.step2.ageUnit} · {member.gender}
                  </span>
                </div>
                <div className="text-right font-mono text-[10px]">
                  <span
                    className={
                      member.financiallyDependent === "yes"
                        ? "px-1.5 py-0.5 rounded text-burnished-copper bg-burnished-copper/10"
                        : "px-1.5 py-0.5 rounded text-dusty-mauve"
                    }
                  >
                    {member.financiallyDependent === "yes" ? "Dependent" : "Self-Reliant"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Financial Picture Recap */}
        <div className="luxury-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-glass-border">
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-burnished-copper" />
              <h3 className="font-serif text-xl text-warm-ivory">
                {t.summary.financialTitle}
              </h3>
            </div>
            <button
              onClick={() => {
                sound.playChime(420, 0.08);
                onEditSection(4);
              }}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-obsidian-plum border border-glass-border text-[11px] font-mono text-burnished-copper hover:text-warm-ivory hover:border-burnished-copper transition-all"
            >
              <Edit3 className="w-3 h-3" />
              <span>{t.summary.editBtn}</span>
            </button>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <span className="text-dusty-mauve text-[11px] block">{t.summary.annualIncome}</span>
              <span className="text-warm-ivory font-serif text-lg">
                {getIncomeLabel(profile.financial.incomeRange)}
              </span>
            </div>

            <div>
              <span className="text-dusty-mauve text-[11px] block">{t.summary.currentInsurance}</span>
              <span className="text-warm-ivory">
                {getInsuranceLabel(profile.insurance.status)}
              </span>
            </div>

            <div>
              <span className="text-dusty-mauve text-[11px] block">{t.summary.emergencySavings}</span>
              <span className="text-warm-ivory">
                {getSavingsLabel(profile.financial.emergencySavings)}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-dusty-mauve text-[11px]">{t.summary.priorityConcerns}</span>
                <button
                  onClick={() => onEditSection(5)}
                  className="text-[10px] text-burnished-copper hover:underline"
                >
                  {t.summary.editBtn.toLowerCase()}
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {profile.concerns.map((c) => {
                  const concernObj = (t.step5.concerns as Record<string, { title: string }>)[c];
                  const cTitle = concernObj ? concernObj.title : c.replace(/_/g, " ");
                  return (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded-full bg-burnished-copper/15 border border-burnished-copper/30 text-[10px] text-warm-ivory"
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
            ? "luxury-card p-5 rounded-2xl mb-6 transition-all border border-red-400 bg-oxblood-burgundy/60"
            : "luxury-card p-5 rounded-2xl mb-6 transition-all border border-glass-border bg-deep-aubergine/60"
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
            className="mt-1 w-4 h-4 rounded accent-burnished-copper cursor-pointer"
          />
          <div className="text-xs text-dusty-mauve leading-relaxed font-light">
            <span className="text-warm-ivory font-medium block mb-0.5">
              {t.summary.consentHeading}
            </span>
            {t.summary.consentText}
          </div>
        </label>
        {consentError && (
          <div className="flex items-center space-x-1.5 text-xs text-red-300 mt-2 font-mono">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            <span>{t.summary.consentError}</span>
          </div>
        )}
      </div>

      {/* Cinematic Transition Box to Stage 2 */}
      <div className="p-8 rounded-3xl bg-deep-aubergine border border-burnished-copper/40 shadow-luxury-glass text-center space-y-4">
        <span className="text-[11px] uppercase font-mono tracking-widest text-burnished-copper block">
          {t.summary.stage2Notice}
        </span>

        <p className="font-serif text-2xl sm:text-3xl text-warm-ivory max-w-xl mx-auto leading-snug">
          {t.summary.transitionQuote}
        </p>

        <p className="font-sans text-xs text-dusty-mauve max-w-md mx-auto font-light">
          {t.summary.transitionSub}
        </p>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleLaunchScenario}
            className="group inline-flex items-center space-x-3 px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-wider text-warm-ivory bg-burnished-copper hover:bg-burnished-copper-light shadow-copper-glow hover:scale-105 transition-all duration-300 min-h-[44px]"
          >
            <span>{t.summary.cta}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => setShowJsonModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-3 rounded-full bg-obsidian-plum border border-glass-border text-xs font-mono text-dusty-mauve hover:text-warm-ivory transition-all min-h-[44px]"
            title="Inspect Stage 2 Blueprint JSON"
          >
            <Code2 className="w-3.5 h-3.5 text-burnished-copper" />
            <span>{t.summary.inspectJson}</span>
          </button>
        </div>
      </div>

      {/* JSON Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-plum/85 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-2xl bg-deep-aubergine border border-burnished-copper/30 shadow-luxury-glass p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-glass-border mb-4">
              <h3 className="font-serif text-xl text-warm-ivory">
                {t.summary.jsonModalTitle}
              </h3>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-xs font-mono text-dusty-mauve hover:text-warm-ivory px-2 py-1 rounded bg-obsidian-plum"
              >
                {t.summary.close}
              </button>
            </div>
            <pre className="flex-1 overflow-auto bg-obsidian-plum p-4 rounded-xl text-[11px] font-mono text-burnished-copper border border-glass-border/50">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
