"use client";

import React from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Shield,
  Wallet,
  AlertCircle,
  HelpCircle,
  Users,
  CreditCard,
  Layers,
  Activity,
  DollarSign,
  Heart,
  Info,
} from "lucide-react";
import { UserProtectionProfile } from "@/types/questionnaire";
import { PersonalizedScenario, ScenarioChoiceId } from "@/types/stage2";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";
import { getCharacterForTargetPerson, getCharacterForUser } from "@/lib/characterEngine";
import { FamilyCharacter } from "../character/FamilyCharacter";

interface ScenarioPlayerProps {
  scenario: PersonalizedScenario;
  currentActIndex: number; // 0 to 6
  onSetActIndex: (act: number) => void;
  onFinishScenario: () => void;
  profile: UserProtectionProfile;
  selectedChoice: ScenarioChoiceId | null;
  onSelectChoice: (choice: ScenarioChoiceId) => void;
}

export const ScenarioPlayer: React.FC<ScenarioPlayerProps> = ({
  scenario,
  currentActIndex,
  onSetActIndex,
  onFinishScenario,
  profile,
  selectedChoice,
  onSelectChoice,
}) => {
  const { language, t } = useLanguage();
  const lang = language === "ta" ? "ta" : "en";

  const handleNextAct = () => {
    sound.playChime(520, 0.12);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (currentActIndex < 6) {
      onSetActIndex(currentActIndex + 1);
    } else {
      onFinishScenario();
    }
  };

  const handlePrevAct = () => {
    sound.playChime(380, 0.1);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (currentActIndex > 0) {
      onSetActIndex(currentActIndex - 1);
    }
  };

  const acts = t.stage2.acts;
  const nav = t.stage2.nav;
  const bill = t.stage2.bill;
  const personalContext = t.stage2.personalContext;
  const decision = t.stage2.decision;

  const savingsLevel = profile.financial.emergencySavings || "some";
  const savingsNote = personalContext.savingsLabels[savingsLevel] || personalContext.savingsLabels.some;

  const insuranceStatus = profile.insurance.status || "none";
  const insuranceNote = personalContext.insuranceLabels[insuranceStatus] || personalContext.insuranceLabels.none;

  const targetChar = getCharacterForTargetPerson(scenario.targetPerson, profile.user);
  const userChar = getCharacterForUser(profile.user);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 select-none z-10 relative animate-fadeIn">
      {/* Act Stepper Bar */}
      <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-hairline pb-3 sm:pb-4">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="w-2 h-2 rounded-full bg-lavender-600 animate-pulse" />
          <span className="font-mono text-xs text-ink uppercase tracking-wider font-semibold">
            {scenario.title[lang]}
          </span>
          <span className="text-muted">·</span>
          <span className="text-xs text-ink-soft font-mono">
            {nav.actOf} 0{currentActIndex + 1} / 07: {nav.actNames[currentActIndex]}
          </span>
        </div>

        {/* Minimal Act Pills */}
        <div className="flex items-center space-x-1.5 self-start sm:self-auto pt-1 sm:pt-0">
          {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
            let pillClass = "h-1.5 rounded-full transition-all duration-300 ";
            if (idx === currentActIndex) {
              pillClass += "w-8 bg-ink";
            } else if (idx < currentActIndex) {
              pillClass += "w-3 bg-lavender-300 hover:bg-lavender-600";
            } else {
              pillClass += "w-2 bg-hairline hover:bg-muted";
            }
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  sound.playSoftPulse();
                  onSetActIndex(idx);
                }}
                className={pillClass}
                title={`Jump to Act ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* ========================================================
          ACT 01: NORMAL LIFE
         ======================================================== */}
      {currentActIndex === 0 && (
        <div className="bg-white p-6 sm:p-10 rounded-[24px] text-center space-y-6 animate-fadeIn border border-hairline shadow-subtle">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-lavender-100 border border-hairline text-xs font-mono text-ink font-medium">
            <Heart className="w-3.5 h-3.5 text-lavender-600" />
            <span>{acts.act1_tag}</span>
          </div>

          {/* Persistent Character Anchor */}
          <div className="flex justify-center -mb-2">
            <FamilyCharacter config={targetChar} variant="bust" size="md" pose="idle" />
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-ink leading-tight tracking-tight">
              {scenario.act1_normal.headline[lang]}
            </h2>
            <p className="font-sans text-sm sm:text-base text-ink-soft leading-relaxed">
              {scenario.act1_normal.story[lang]}
            </p>
          </div>

          {/* Adaptation Notice if single user chose parent/family concern */}
          {scenario.adaptationNotice && (
            <div className="p-4 rounded-[16px] bg-bg-soft border border-hairline max-w-xl mx-auto text-xs text-ink-soft leading-relaxed flex items-start space-x-2.5 text-left">
              <Info className="w-4 h-4 text-lavender-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink font-semibold block mb-0.5">
                  {lang === "ta" ? "தனிப்பயனாக்கப்பட்ட பின்னணி" : "Personalized Context"}
                </span>
                {scenario.adaptationNotice[lang]}
              </div>
            </div>
          )}

          {/* Focus Persona Card */}
          <div className="p-5 rounded-[20px] bg-bg-soft border border-hairline max-w-md mx-auto text-left shadow-subtle flex items-center space-x-4">
            <FamilyCharacter config={targetChar} variant="avatar" size="md" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-lavender-600 font-semibold block mb-0.5">
                {lang === "ta" ? "மையப் புள்ளி (Focus Persona)" : "Scenario Protagonist"}
              </span>
              <div className="font-display font-bold text-lg text-ink truncate">
                {scenario.targetPerson.name}
              </div>
              <div className="text-xs text-ink-soft font-mono">
                {scenario.targetPerson.isSelfOnly
                  ? lang === "ta" ? "சுயாதீனப் பாதுகாப்பு · Self" : "Self · Independent Profile"
                  : `${scenario.targetPerson.relationship} · ${scenario.targetPerson.age} yrs`}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={handleNextAct}
              className="btn-primary min-h-[44px] px-8 py-3.5 text-xs group inline-flex items-center space-x-3"
            >
              <span>{nav.nextAct}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          ACT 02: THE INTERRUPTION
         ======================================================== */}
      {currentActIndex === 1 && (
        <div className="bg-white p-6 sm:p-10 rounded-[24px] text-center space-y-6 animate-fadeIn border border-hairline shadow-subtle">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-lavender-100 border border-hairline text-xs font-mono text-ink font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-lavender-600" />
            <span>{acts.act2_tag}</span>
          </div>

          {/* Persistent Character during Interruption */}
          <div className="flex justify-center -mb-2">
            <FamilyCharacter config={targetChar} variant="bust" size="md" pose="thinking" />
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-ink leading-tight tracking-tight">
              {scenario.act2_interruption.headline[lang]}
            </h2>
            <p className="font-sans text-sm sm:text-base text-ink-soft leading-relaxed">
              {scenario.act2_interruption.story[lang]}
            </p>
          </div>

          <div className="p-4 rounded-[16px] bg-bg-soft border border-hairline max-w-lg mx-auto text-xs text-ink-soft leading-relaxed">
            <span className="font-mono text-ink font-semibold block mb-1">
              {lang === "ta" ? "சிந்திக்க வேண்டிய மாதிரிச் சூழல்" : "Hypothetical Modeling"}
            </span>
            {lang === "ta"
              ? "பயமுறுத்துவது எங்கள் நோக்கம் அல்ல. ஒரு திடீர் மருத்துவச் சூழல் உங்கள் நிதியையும் சுதந்திரத்தையும் எவ்வாறு பாதிக்கலாம் என்பதை ஆழமாக உணரவே இதை நோக்குகிறோம்."
              : "We explore this situation not to cause alarm, but to thoughtfully observe how healthcare and finances interface in real life."}
          </div>

          <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrevAct}
              className="px-5 py-3 rounded-full bg-white border border-hairline text-xs font-mono text-ink-soft hover:text-ink hover:bg-bg-soft transition-all min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1.5" /> Back
            </button>
            <button
              onClick={handleNextAct}
              className="btn-primary min-h-[44px] px-8 py-3.5 text-xs group inline-flex items-center justify-center space-x-3"
            >
              <span>{nav.seeHospitalJourney}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          ACT 03: THE CARE JOURNEY (Illuminated Vertical Timeline)
         ======================================================== */}
      {currentActIndex === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-[24px] space-y-6 animate-fadeIn border border-hairline shadow-subtle">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lavender-100 text-xs font-mono text-ink border border-hairline font-medium">
              <Activity className="w-3.5 h-3.5 text-lavender-600" />
              <span>{acts.act3_tag}</span>
            </div>
            <span className="text-xs font-mono text-ink-soft">
              {lang === "ta" ? "மருத்துவப் பராமரிப்பு படிநிலைகள்" : "Care Journey Progression"}
            </span>
          </div>

          {/* Vertical Step Timeline */}
          <div className="space-y-4 relative py-2">
            {scenario.act3_hospital.steps.map((step, idx) => {
              const isLast = idx === scenario.act3_hospital.steps.length - 1;

              return (
                <div key={idx} className="relative flex items-start space-x-4 group">
                  {/* Timeline connector & dot */}
                  <div className="flex flex-col items-center flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-lavender-100 border border-lavender-600 flex items-center justify-center font-mono text-xs font-bold text-ink transition-all shadow-sm">
                      {step.stepNumber}
                    </div>
                    {!isLast && (
                      <div className="w-0.5 h-16 bg-hairline my-1" />
                    )}
                  </div>

                  {/* Step Card */}
                  <div className="flex-1 p-4 sm:p-5 rounded-[16px] bg-bg-soft border border-hairline hover:border-lavender-300 transition-all shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-display text-lg sm:text-xl font-semibold text-ink">
                        {step.title[lang]}
                      </h4>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white text-ink-soft border border-hairline">
                        {lang === "ta" ? `படிநிலை 0${idx + 1}` : `Phase 0${idx + 1}`}
                      </span>
                    </div>
                    <p className="font-sans text-xs sm:text-sm text-ink-soft leading-relaxed">
                      {step.desc[lang]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-hairline">
            <button
              onClick={handlePrevAct}
              className="px-5 py-3 rounded-full bg-white border border-hairline text-xs font-mono text-ink-soft hover:text-ink hover:bg-bg-soft transition-all"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1.5" /> Back
            </button>
            <button
              onClick={handleNextAct}
              className="btn-primary min-h-[44px] px-8 py-3.5 text-xs group inline-flex items-center space-x-3"
            >
              <span>{nav.seeBill}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          ACT 04: THE MEDICAL BILL
         ======================================================== */}
      {currentActIndex === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-[24px] space-y-6 animate-fadeIn border border-hairline shadow-subtle">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lavender-100 text-xs font-mono text-ink border border-hairline font-medium">
              <DollarSign className="w-3.5 h-3.5 text-lavender-600" />
              <span>{acts.act4_tag}</span>
            </div>
            <span className="text-[11px] font-mono text-ink-soft">
              {lang === "ta" ? "நிதி முறிவு விவரம்" : "Financial Breakdown"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Cost Breakdown List */}
            {/* Left: Cost Breakdown Card Ledger */}
            <div className="bg-bg-soft rounded-[20px] p-5 border border-hairline shadow-subtle space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-ink-soft pb-1 border-b border-hairline">
                {bill.breakdownTitle}
              </h4>
              <div className="divide-y divide-hairline">
                {scenario.act4_bill.breakdown.map((item) => (
                  <div
                    key={item.key}
                    className="py-2.5 flex items-center justify-between text-xs"
                  >
                    <span className="text-ink font-medium">{item.label[lang]}</span>
                    <span className="font-mono font-semibold text-ink">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Total Banner */}
            <div className="p-6 sm:p-8 rounded-[20px] bg-lavender-100/50 border border-lavender-300 text-center space-y-3">
              <div className="flex items-center justify-center -space-x-2 pb-1">
                <FamilyCharacter config={targetChar} variant="avatar" size="sm" />
                {!scenario.targetPerson.isSelfOnly && (
                  <FamilyCharacter config={userChar} variant="avatar" size="sm" />
                )}
              </div>
              <span className="editorial-kicker block">
                {bill.totalLabel}
              </span>
              <div className="font-display text-4xl sm:text-5xl font-bold text-ink">
                ₹{scenario.act4_bill.totalAmount.toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-ink-soft leading-relaxed pt-2 border-t border-hairline">
                {bill.costDisclaimer}
              </div>
            </div>
          </div>

          {/* Cumulative timeline if present */}
          {scenario.act4_bill.cumulativeTimeline && (
            <div className="p-4 rounded-[16px] bg-bg-soft border border-hairline space-y-2">
              <span className="text-xs font-mono text-ink uppercase tracking-wider font-semibold block">
                {bill.cumulativeLabel} Over 4 Months
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {scenario.act4_bill.cumulativeTimeline.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white text-center border border-hairline">
                    <span className="text-[10px] font-mono text-ink-soft block">{item.monthLabel[lang]}</span>
                    <span className="text-xs font-mono font-bold text-ink">₹{item.monthAmount.toLocaleString("en-IN")}</span>
                    <span className="text-[9px] font-mono text-lavender-600 block mt-0.5">Total: ₹{item.cumulativeTotal.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between border-t border-hairline">
            <button
              onClick={handlePrevAct}
              className="px-5 py-3 rounded-full bg-white border border-hairline text-xs font-mono text-ink-soft hover:text-ink hover:bg-bg-soft transition-all"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1.5" /> Back
            </button>
            <button
              onClick={handleNextAct}
              className="btn-primary min-h-[44px] px-8 py-3.5 text-xs group inline-flex items-center space-x-3"
            >
              <span>{nav.seePersonalMoment}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          ACT 05: YOUR FINANCIAL PICTURE
         ======================================================== */}
      {currentActIndex === 4 && (
        <div className="bg-white p-6 sm:p-8 rounded-[24px] space-y-6 animate-fadeIn border border-hairline shadow-subtle">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lavender-100 text-xs font-mono text-ink border border-hairline font-medium">
              <Wallet className="w-3.5 h-3.5 text-lavender-600" />
              <span>{acts.act5_tag}</span>
            </div>
            <span className="text-xs font-mono text-ink-soft">
              {lang === "ta" ? "உங்கள் தனிப்பட்ட நிதிப் பின்னணி" : "Stage 1 Context Connection"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Savings Reflection */}
            <div className="p-5 rounded-[16px] bg-bg-soft border border-hairline space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-ink font-semibold block">
                {personalContext.savingsHeader}
              </span>
              <p className="text-xs text-ink leading-relaxed">
                {savingsNote}
              </p>
              <p className="text-[11px] text-ink-soft pt-1">
                {scenario.act5_personal_context.savingsNote[lang]}
              </p>
            </div>

            {/* Insurance Reflection */}
            <div className="p-5 rounded-[16px] bg-bg-soft border border-hairline space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-ink font-semibold block">
                {personalContext.insuranceHeader}
              </span>
              <p className="text-xs text-ink leading-relaxed">
                {insuranceNote}
              </p>
              <p className="text-[11px] text-ink-soft pt-1">
                {scenario.act5_personal_context.insuranceNote[lang]}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-[16px] bg-bg-soft border border-hairline text-xs text-ink-soft leading-relaxed text-center">
            {personalContext.evalDisclaimer}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-hairline">
            <button
              onClick={handlePrevAct}
              className="px-5 py-3 rounded-full bg-white border border-hairline text-xs font-mono text-ink-soft hover:text-ink hover:bg-bg-soft transition-all"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1.5" /> Back
            </button>
            <button
              onClick={handleNextAct}
              className="btn-primary min-h-[44px] px-8 py-3.5 text-xs group inline-flex items-center space-x-3"
            >
              <span>{nav.makeChoice}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          ACT 06: THE DECISION
         ======================================================== */}
      {currentActIndex === 5 && (
        <div className="bg-white p-6 sm:p-8 rounded-[24px] space-y-6 animate-fadeIn border border-hairline shadow-subtle">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lavender-100 text-xs font-mono text-ink border border-hairline font-medium">
              <Layers className="w-3.5 h-3.5 text-lavender-600" />
              <span>{acts.act6_tag}</span>
            </div>
            <span className="text-xs font-mono text-ink-soft">
              {lang === "ta" ? "உங்கள் முடிவு" : "Interactive Choice"}
            </span>
          </div>

          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
              {scenario.act6_decision.question[lang]}
            </h3>
            <p className="text-xs text-ink-soft">
              {scenario.act6_decision.sub[lang]}
            </p>
          </div>

          {/* 6 Choices Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: "savings" as ScenarioChoiceId, icon: <Wallet className="w-4 h-4" />, ...decision.choices.savings },
              { id: "insurance" as ScenarioChoiceId, icon: <Shield className="w-4 h-4" />, ...decision.choices.insurance },
              { id: "borrow" as ScenarioChoiceId, icon: <Users className="w-4 h-4" />, ...decision.choices.borrow },
              { id: "loan" as ScenarioChoiceId, icon: <CreditCard className="w-4 h-4" />, ...decision.choices.loan },
              { id: "combination" as ScenarioChoiceId, icon: <Layers className="w-4 h-4" />, ...decision.choices.combination },
              { id: "not_sure" as ScenarioChoiceId, icon: <HelpCircle className="w-4 h-4" />, ...decision.choices.not_sure },
            ].map((choice) => {
              const isSelected = selectedChoice === choice.id;
              const cardBg = isSelected
                ? "bg-lavender-100 border-lavender-600 text-ink shadow-sm"
                : "bg-white border-hairline hover:border-lavender-300 hover:bg-bg-soft text-ink-soft hover:text-ink";

              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => {
                    sound.playSoftPulse();
                    onSelectChoice(choice.id);
                  }}
                  className={`p-4 rounded-[16px] text-left border transition-all flex flex-col justify-between min-h-[120px] ${cardBg}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className={isSelected ? "text-lavender-600" : "text-ink-soft"}>
                          {choice.icon}
                        </span>
                        <span className="font-sans text-sm font-semibold text-ink">
                          {choice.title}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-lavender-600 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-ink-soft leading-relaxed">
                      {choice.desc}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-2.5 border-t border-hairline text-[10px] text-lavender-600 font-mono font-medium">
                      Impact: {choice.consequence}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-hairline">
            <button
              onClick={handlePrevAct}
              className="px-5 py-3 rounded-full bg-white border border-hairline text-xs font-mono text-ink-soft hover:text-ink hover:bg-bg-soft transition-all"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1.5" /> Back
            </button>
            <button
              onClick={handleNextAct}
              className="btn-primary min-h-[44px] px-8 py-3.5 text-xs group inline-flex items-center space-x-3"
            >
              <span>{nav.seeRealization}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          ACT 07: THE REALIZATION
         ======================================================== */}
      {currentActIndex === 6 && (
        <div className="bg-white p-6 sm:p-10 rounded-[24px] text-center space-y-6 animate-fadeIn border border-hairline shadow-subtle">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-lavender-100 text-xs font-mono text-ink border border-hairline font-medium">
            <Shield className="w-3.5 h-3.5 text-lavender-600" />
            <span>{acts.act7_tag}</span>
          </div>

          {/* Persistent Character Reflection */}
          <div className="flex justify-center -mb-2">
            <FamilyCharacter config={targetChar} variant="bust" size="md" pose="reflective" />
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-ink leading-tight tracking-tight">
              {scenario.act7_realization.headline[lang]}
            </h2>
            <blockquote className="font-serif text-xl sm:text-2xl text-ink italic max-w-xl mx-auto leading-relaxed">
              {scenario.act7_realization.quote[lang]}
            </blockquote>
            <p className="font-sans text-xs sm:text-sm text-ink-soft leading-relaxed max-w-lg mx-auto">
              {scenario.act7_realization.sub[lang]}
            </p>
          </div>

          {/* Core Assets at Stake Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto pt-2">
            {[
              lang === "ta" ? "சேமிப்பு இருப்பு" : "Savings Reserves",
              lang === "ta" ? "எதிர்காலக் கனவுகள்" : "Future Plans",
              lang === "ta" ? "அவசரகால நிதி" : "Emergency Buffer",
              lang === "ta" ? "மன அமைதி" : "Peace of Mind",
            ].map((pill) => (
              <div
                key={pill}
                className="p-3 rounded-xl bg-bg-soft border border-hairline text-center font-mono text-xs text-ink font-medium"
              >
                {pill}
              </div>
            ))}
          </div>

          <div className="pt-6 flex items-center justify-between max-w-xl mx-auto border-t border-hairline">
            <button
              onClick={handlePrevAct}
              className="px-5 py-3 rounded-full bg-white border border-hairline text-xs font-mono text-ink-soft hover:text-ink hover:bg-bg-soft transition-all"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1.5" /> Back
            </button>
            <button
              onClick={onFinishScenario}
              className="btn-primary min-h-[44px] px-8 py-3.5 text-xs group inline-flex items-center space-x-3"
            >
              <span>{nav.proceedToConcepts}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};