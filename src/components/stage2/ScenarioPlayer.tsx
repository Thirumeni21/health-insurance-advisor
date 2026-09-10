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

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 select-none z-10 relative animate-fadeIn">
      {/* Act Stepper Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-glass-border/40 pb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-burnished-copper animate-pulse" />
          <span className="font-mono text-xs text-burnished-copper uppercase tracking-wider font-semibold">
            {scenario.title[lang]}
          </span>
          <span className="text-dusty-mauve/40">·</span>
          <span className="text-xs text-dusty-mauve font-mono">
            {nav.actOf} 0{currentActIndex + 1} / 07: {nav.actNames[currentActIndex]}
          </span>
        </div>

        {/* Minimal Act Pills */}
        <div className="flex items-center space-x-1.5">
          {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
            let pillClass = "h-1.5 rounded-full transition-all duration-300 ";
            if (idx === currentActIndex) {
              pillClass += "w-8 bg-burnished-copper shadow-copper-glow";
            } else if (idx < currentActIndex) {
              pillClass += "w-3 bg-burnished-copper/40 hover:bg-burnished-copper/60";
            } else {
              pillClass += "w-2 bg-glass-border hover:bg-dusty-mauve/40";
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
        <div className="luxury-card p-6 sm:p-10 rounded-3xl text-center space-y-6 animate-fadeIn border-burnished-copper/30">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-deep-aubergine/80 border border-glass-border text-xs font-mono text-burnished-copper">
            <Heart className="w-3.5 h-3.5" />
            <span>{acts.act1_tag}</span>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-serif text-3xl sm:text-5xl text-warm-ivory leading-tight tracking-tight">
              {scenario.act1_normal.headline[lang]}
            </h2>
            <p className="font-sans text-sm sm:text-base text-dusty-mauve leading-relaxed font-light">
              {scenario.act1_normal.story[lang]}
            </p>
          </div>

          {/* Adaptation Notice if single user chose parent/family concern */}
          {scenario.adaptationNotice && (
            <div className="p-4 rounded-2xl bg-burnished-copper/10 border border-burnished-copper/30 max-w-xl mx-auto text-xs text-soft-champagne/95 font-light leading-relaxed flex items-start space-x-2.5 text-left">
              <Info className="w-4 h-4 text-burnished-copper flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-burnished-copper block mb-0.5">
                  {lang === "ta" ? "தனிப்பயனாக்கப்பட்ட பின்னணி" : "Personalized Context"}
                </span>
                {scenario.adaptationNotice[lang]}
              </div>
            </div>
          )}

          {/* Focus Badge */}
          <div className="p-3.5 rounded-2xl bg-deep-aubergine/40 border border-glass-border/60 max-w-md mx-auto flex items-center justify-between text-xs font-mono text-dusty-mauve">
            <span>
              {lang === "ta" ? "மையப் புள்ளி:" : "Focus Node:"}{" "}
              <strong className="text-warm-ivory">{scenario.targetPerson.name}</strong>
            </span>
            <span>
              {scenario.targetPerson.isSelfOnly
                ? lang === "ta" ? "சுயாதீனப் பாதுகாப்பு" : "Self · Independent"
                : `${scenario.targetPerson.relationship} · ${scenario.targetPerson.age} yrs`}
            </span>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={handleNextAct}
              className="group inline-flex items-center space-x-3 px-8 py-3.5 rounded-full bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory text-xs font-semibold uppercase tracking-wider shadow-copper-glow hover:scale-105 transition-all duration-300 min-h-[44px]"
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
        <div className="luxury-card p-6 sm:p-10 rounded-3xl text-center space-y-6 animate-fadeIn border-burnished-copper/40 bg-oxblood-burgundy/30">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-deep-aubergine/80 border border-burnished-copper/40 text-xs font-mono text-burnished-copper">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{acts.act2_tag}</span>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-serif text-3xl sm:text-5xl text-warm-ivory leading-tight tracking-tight text-glow-copper">
              {scenario.act2_interruption.headline[lang]}
            </h2>
            <p className="font-sans text-sm sm:text-base text-dusty-mauve leading-relaxed font-light">
              {scenario.act2_interruption.story[lang]}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-plum/80 border border-glass-border/60 max-w-lg mx-auto text-xs text-dusty-mauve/90 leading-relaxed font-light">
            <span className="font-mono text-burnished-copper font-medium block mb-1">
              {lang === "ta" ? "சிந்திக்க வேண்டிய மாதிரிச் சூழல்" : "Hypothetical Modeling"}
            </span>
            {lang === "ta"
              ? "பயமுறுத்துவது எங்கள் நோக்கம் அல்ல. ஒரு திடீர் மருத்துவச் சூழல் உங்கள் நிதியையும் சுதந்திரத்தையும் எவ்வாறு பாதிக்கலாம் என்பதை ஆழமாக உணரவே இதை நோக்குகிறோம்."
              : "We explore this situation not to cause alarm, but to thoughtfully observe how healthcare and finances interface in real life."}
          </div>

          <div className="pt-4 flex items-center justify-center space-x-4">
            <button
              onClick={handlePrevAct}
              className="px-5 py-3 rounded-full bg-obsidian-plum border border-glass-border text-xs font-mono text-dusty-mauve hover:text-warm-ivory transition-all"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1.5" /> Back
            </button>
            <button
              onClick={handleNextAct}
              className="group inline-flex items-center space-x-3 px-8 py-3.5 rounded-full bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory text-xs font-semibold uppercase tracking-wider shadow-copper-glow hover:scale-105 transition-all duration-300 min-h-[44px]"
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
        <div className="luxury-card p-6 sm:p-8 rounded-3xl space-y-6 animate-fadeIn border-burnished-copper/30">
          <div className="flex items-center justify-between border-b border-glass-border pb-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-deep-aubergine text-xs font-mono text-burnished-copper border border-glass-border">
              <Activity className="w-3.5 h-3.5" />
              <span>{acts.act3_tag}</span>
            </div>
            <span className="text-xs font-mono text-dusty-mauve">
              {lang === "ta" ? "மருத்துவப் பராமரிப்பு படிநிலைகள்" : "Care Journey Progression"}
            </span>
          </div>

          {/* Vertical Illuminated Step Timeline */}
          <div className="space-y-4 relative py-2">
            {scenario.act3_hospital.steps.map((step, idx) => {
              const isLast = idx === scenario.act3_hospital.steps.length - 1;

              return (
                <div key={idx} className="relative flex items-start space-x-4 group">
                  {/* Timeline connector & dot */}
                  <div className="flex flex-col items-center flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-burnished-copper/20 border border-burnished-copper flex items-center justify-center font-mono text-xs font-bold text-burnished-copper group-hover:scale-110 group-hover:bg-burnished-copper group-hover:text-obsidian-plum transition-all shadow-copper-glow">
                      {step.stepNumber}
                    </div>
                    {!isLast && (
                      <div className="w-0.5 h-16 bg-gradient-to-b from-burnished-copper/60 to-glass-border/40 my-1" />
                    )}
                  </div>

                  {/* Step Card */}
                  <div className="flex-1 p-4 sm:p-5 rounded-2xl bg-deep-aubergine/80 border border-glass-border hover:border-burnished-copper/50 transition-all shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-serif text-lg sm:text-xl text-warm-ivory group-hover:text-glow-copper transition-all">
                        {step.title[lang]}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-obsidian-plum text-dusty-mauve border border-glass-border">
                        {lang === "ta" ? `படிநிலை 0${idx + 1}` : `Phase 0${idx + 1}`}
                      </span>
                    </div>
                    <p className="font-sans text-xs sm:text-sm text-dusty-mauve font-light leading-relaxed">
                      {step.desc[lang]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-glass-border/40">
            <button
              onClick={handlePrevAct}
              className="px-5 py-3 rounded-full bg-obsidian-plum border border-glass-border text-xs font-mono text-dusty-mauve hover:text-warm-ivory transition-all"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1.5" /> Back
            </button>
            <button
              onClick={handleNextAct}
              className="group inline-flex items-center space-x-3 px-8 py-3.5 rounded-full bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory text-xs font-semibold uppercase tracking-wider shadow-copper-glow hover:scale-105 transition-all duration-300 min-h-[44px]"
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
        <div className="luxury-card p-6 sm:p-8 rounded-3xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-glass-border pb-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-deep-aubergine text-xs font-mono text-burnished-copper border border-glass-border">
              <DollarSign className="w-3.5 h-3.5" />
              <span>{acts.act4_tag}</span>
            </div>
            <span className="text-[11px] font-mono text-dusty-mauve">
              {lang === "ta" ? "நிதி முறிவு விவரம்" : "Financial Breakdown"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Cost Breakdown List */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-dusty-mauve mb-2">
                {bill.breakdownTitle}
              </h4>
              {scenario.act4_bill.breakdown.map((item) => (
                <div
                  key={item.key}
                  className="p-3 rounded-xl bg-deep-aubergine/60 border border-glass-border flex items-center justify-between text-xs"
                >
                  <span className="text-dusty-mauve font-light">{item.label[lang]}</span>
                  <span className="font-mono font-medium text-warm-ivory">
                    ₹{item.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Right: Total Banner */}
            <div className="p-6 rounded-3xl bg-oxblood-burgundy/40 border border-burnished-copper/50 text-center space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-burnished-copper block">
                {bill.totalLabel}
              </span>
              <div className="font-serif text-4xl sm:text-5xl text-warm-ivory text-glow-copper">
                ₹{scenario.act4_bill.totalAmount.toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-dusty-mauve/80 leading-relaxed font-light pt-2 border-t border-glass-border/40">
                {bill.costDisclaimer}
              </div>
            </div>
          </div>

          {/* Cumulative timeline if present */}
          {scenario.act4_bill.cumulativeTimeline && (
            <div className="p-4 rounded-2xl bg-deep-aubergine/40 border border-glass-border space-y-2">
              <span className="text-xs font-mono text-burnished-copper uppercase tracking-wider block">
                {bill.cumulativeLabel} Over 4 Months
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {scenario.act4_bill.cumulativeTimeline.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-obsidian-plum text-center border border-glass-border">
                    <span className="text-[10px] font-mono text-dusty-mauve block">{item.monthLabel[lang]}</span>
                    <span className="text-xs font-mono font-bold text-warm-ivory">₹{item.monthAmount.toLocaleString("en-IN")}</span>
                    <span className="text-[9px] font-mono text-burnished-copper block mt-0.5">Total: ₹{item.cumulativeTotal.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between border-t border-glass-border/40">
            <button
              onClick={handlePrevAct}
              className="px-5 py-3 rounded-full bg-obsidian-plum border border-glass-border text-xs font-mono text-dusty-mauve hover:text-warm-ivory transition-all"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1.5" /> Back
            </button>
            <button
              onClick={handleNextAct}
              className="group inline-flex items-center space-x-3 px-8 py-3.5 rounded-full bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory text-xs font-semibold uppercase tracking-wider shadow-copper-glow hover:scale-105 transition-all duration-300 min-h-[44px]"
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
        <div className="luxury-card p-6 sm:p-8 rounded-3xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-glass-border pb-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-deep-aubergine text-xs font-mono text-burnished-copper border border-glass-border">
              <Wallet className="w-3.5 h-3.5" />
              <span>{acts.act5_tag}</span>
            </div>
            <span className="text-xs font-mono text-dusty-mauve">
              {lang === "ta" ? "உங்கள் தனிப்பட்ட நிதிப் பின்னணி" : "Stage 1 Context Connection"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Savings Reflection */}
            <div className="p-5 rounded-2xl bg-deep-aubergine/70 border border-glass-border space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-burnished-copper block">
                {personalContext.savingsHeader}
              </span>
              <p className="text-xs text-warm-ivory/90 leading-relaxed font-light">
                {savingsNote}
              </p>
              <p className="text-[11px] text-dusty-mauve/80 pt-1">
                {scenario.act5_personal_context.savingsNote[lang]}
              </p>
            </div>

            {/* Insurance Reflection */}
            <div className="p-5 rounded-2xl bg-deep-aubergine/70 border border-glass-border space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-soft-champagne block">
                {personalContext.insuranceHeader}
              </span>
              <p className="text-xs text-warm-ivory/90 leading-relaxed font-light">
                {insuranceNote}
              </p>
              <p className="text-[11px] text-dusty-mauve/80 pt-1">
                {scenario.act5_personal_context.insuranceNote[lang]}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-plum/80 border border-glass-border/60 text-xs text-dusty-mauve/80 leading-relaxed font-light text-center">
            {personalContext.evalDisclaimer}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-glass-border/40">
            <button
              onClick={handlePrevAct}
              className="px-5 py-3 rounded-full bg-obsidian-plum border border-glass-border text-xs font-mono text-dusty-mauve hover:text-warm-ivory transition-all"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1.5" /> Back
            </button>
            <button
              onClick={handleNextAct}
              className="group inline-flex items-center space-x-3 px-8 py-3.5 rounded-full bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory text-xs font-semibold uppercase tracking-wider shadow-copper-glow hover:scale-105 transition-all duration-300 min-h-[44px]"
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
        <div className="luxury-card p-6 sm:p-8 rounded-3xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-glass-border pb-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-deep-aubergine text-xs font-mono text-burnished-copper border border-glass-border">
              <Layers className="w-3.5 h-3.5" />
              <span>{acts.act6_tag}</span>
            </div>
            <span className="text-xs font-mono text-dusty-mauve">
              {lang === "ta" ? "உங்கள் முடிவு" : "Interactive Choice"}
            </span>
          </div>

          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl text-warm-ivory">
              {scenario.act6_decision.question[lang]}
            </h3>
            <p className="text-xs text-dusty-mauve font-light">
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
                ? "bg-burnished-copper/20 border-burnished-copper text-warm-ivory shadow-copper-glow"
                : "bg-deep-aubergine/70 border-glass-border hover:border-burnished-copper/40 text-dusty-mauve hover:text-warm-ivory";

              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => {
                    sound.playSoftPulse();
                    onSelectChoice(choice.id);
                  }}
                  className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between min-h-[120px] ${cardBg}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className={isSelected ? "text-burnished-copper" : "text-dusty-mauve"}>
                          {choice.icon}
                        </span>
                        <span className="font-serif text-sm font-semibold text-warm-ivory">
                          {choice.title}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-burnished-copper flex-shrink-0" />}
                    </div>
                    <p className="text-[11px] text-dusty-mauve/80 font-light leading-relaxed">
                      {choice.desc}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-2.5 border-t border-burnished-copper/30 text-[10px] text-burnished-copper font-mono">
                      Impact: {choice.consequence}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-glass-border/40">
            <button
              onClick={handlePrevAct}
              className="px-5 py-3 rounded-full bg-obsidian-plum border border-glass-border text-xs font-mono text-dusty-mauve hover:text-warm-ivory transition-all"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1.5" /> Back
            </button>
            <button
              onClick={handleNextAct}
              className="group inline-flex items-center space-x-3 px-8 py-3.5 rounded-full bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory text-xs font-semibold uppercase tracking-wider shadow-copper-glow hover:scale-105 transition-all duration-300 min-h-[44px]"
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
        <div className="luxury-card p-6 sm:p-10 rounded-3xl text-center space-y-6 animate-fadeIn border-burnished-copper/40">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-deep-aubergine text-xs font-mono text-burnished-copper border border-glass-border">
            <Shield className="w-3.5 h-3.5" />
            <span>{acts.act7_tag}</span>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-serif text-3xl sm:text-5xl text-warm-ivory leading-tight tracking-tight">
              {scenario.act7_realization.headline[lang]}
            </h2>
            <blockquote className="font-serif text-xl sm:text-2xl text-soft-champagne italic max-w-xl mx-auto leading-relaxed">
              {scenario.act7_realization.quote[lang]}
            </blockquote>
            <p className="font-sans text-xs sm:text-sm text-dusty-mauve leading-relaxed font-light max-w-lg mx-auto">
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
                className="p-3 rounded-xl bg-deep-aubergine/80 border border-glass-border text-center font-mono text-xs text-warm-ivory"
              >
                {pill}
              </div>
            ))}
          </div>

          <div className="pt-6 flex items-center justify-between max-w-xl mx-auto border-t border-glass-border/40">
            <button
              onClick={handlePrevAct}
              className="px-5 py-3 rounded-full bg-obsidian-plum border border-glass-border text-xs font-mono text-dusty-mauve hover:text-warm-ivory transition-all"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1.5" /> Back
            </button>
            <button
              onClick={onFinishScenario}
              className="group inline-flex items-center space-x-3 px-8 py-3.5 rounded-full bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory text-xs font-semibold uppercase tracking-wider shadow-copper-glow hover:scale-105 transition-all duration-300 min-h-[44px]"
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