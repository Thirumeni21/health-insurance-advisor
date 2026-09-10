"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Users,
  User,
  Heart,
  Briefcase,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  Share2,
} from "lucide-react";
import { UserProtectionProfile } from "@/types/questionnaire";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface Chapter4HouseholdProps {
  profile: UserProtectionProfile;
  onNextChapter: () => void;
  onPrevChapter: () => void;
}

export const Chapter4Household: React.FC<Chapter4HouseholdProps> = ({
  profile,
  onNextChapter,
  onPrevChapter,
}) => {
  const { language, t } = useLanguage();
  const lang = language === "ta" ? "ta" : "en";
  const ch = t.stage3.chapter4;

  const [policyTypeTab, setPolicyTypeTab] = useState<"floater" | "individual">("floater");

  const members = profile.household.familyMembers || [];
  const hasParents = members.some(
    (m) => m.relationship === "Mother" || m.relationship === "Father" || m.relationship === "Grandparent"
  );
  const hasChildren = members.some((m) => m.relationship === "Child");
  const hasSpouse = members.some((m) => m.relationship === "Spouse");
  const isSingle = profile.household.protectionType === "myself" && members.length === 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-10 select-none animate-fadeIn">
      {/* Badge & Header */}
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

      {/* 1. Family Floater vs Individual Policy */}
      <div className="luxury-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-glass-border pb-3">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-warm-ivory">{ch.floaterVsIndivTitle}</h3>
            <p className="text-xs text-dusty-mauve font-light mt-0.5">
              {lang === "ta" ? "பகிர்வு அல்லது தனிப்பட்ட ஒதுக்கீட்டின் தாக்கம்:" : "Comparing shared coverage pool versus individual limits:"}
            </p>
          </div>

          <div className="flex items-center space-x-1.5 self-start sm:self-auto">
            <button
              onClick={() => {
                sound.playSoftPulse();
                setPolicyTypeTab("floater");
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center space-x-1.5 ${
                policyTypeTab === "floater"
                  ? "bg-burnished-copper text-warm-ivory shadow-copper-glow"
                  : "bg-deep-aubergine text-dusty-mauve hover:text-warm-ivory border border-glass-border"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{lang === "ta" ? "ஃபேமிலி ஃப்ளோட்டர்" : "Family Floater"}</span>
            </button>
            <button
              onClick={() => {
                sound.playSoftPulse();
                setPolicyTypeTab("individual");
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center space-x-1.5 ${
                policyTypeTab === "individual"
                  ? "bg-burnished-copper text-warm-ivory shadow-copper-glow"
                  : "bg-deep-aubergine text-dusty-mauve hover:text-warm-ivory border border-glass-border"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{lang === "ta" ? "தனிநபர் பாலிசி" : "Individual Cover"}</span>
            </button>
          </div>
        </div>

        {/* Visual Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`p-5 rounded-2xl border transition-all ${
              policyTypeTab === "floater"
                ? "bg-burnished-copper/15 border-burnished-copper shadow-md"
                : "bg-deep-aubergine/60 border-glass-border"
            }`}
          >
            <div className="flex items-center space-x-2 text-burnished-copper mb-2">
              <Share2 className="w-4 h-4" />
              <h4 className="font-serif text-lg text-warm-ivory font-semibold">{ch.floaterTitle}</h4>
            </div>
            <p className="text-xs text-dusty-mauve font-light leading-relaxed mb-3">
              {ch.floaterDesc}
            </p>
            <div className="p-3 rounded-xl bg-obsidian-plum/80 border border-glass-border text-[11px] text-warm-ivory/90 font-light">
              <strong className="text-burnished-copper font-mono block text-[10px] uppercase mb-0.5">
                {lang === "ta" ? "யாருக்கு ஏற்றது?" : "Best Suited For"}
              </strong>
              {ch.floaterIdeal}
            </div>
          </div>

          <div
            className={`p-5 rounded-2xl border transition-all ${
              policyTypeTab === "individual"
                ? "bg-burnished-copper/15 border-burnished-copper shadow-md"
                : "bg-deep-aubergine/60 border-glass-border"
            }`}
          >
            <div className="flex items-center space-x-2 text-soft-champagne mb-2">
              <User className="w-4 h-4" />
              <h4 className="font-serif text-lg text-warm-ivory font-semibold">{ch.individualTitle}</h4>
            </div>
            <p className="text-xs text-dusty-mauve font-light leading-relaxed mb-3">
              {ch.individualDesc}
            </p>
            <div className="p-3 rounded-xl bg-obsidian-plum/80 border border-glass-border text-[11px] text-warm-ivory/90 font-light">
              <strong className="text-soft-champagne font-mono block text-[10px] uppercase mb-0.5">
                {lang === "ta" ? "யாருக்கு ஏற்றது?" : "Best Suited For"}
              </strong>
              {ch.individualIdeal}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Personalized Household Focus Based on Stage 1 Profile */}
      <div className="luxury-card p-6 sm:p-8 rounded-3xl border-burnished-copper/40 bg-oxblood-burgundy/20 space-y-4">
        <div className="flex items-center space-x-2 text-burnished-copper">
          <Heart className="w-5 h-5" />
          <h3 className="font-serif text-xl sm:text-2xl text-warm-ivory">
            {lang === "ta" ? "உங்கள் குடும்பத்திற்கான தனிப்பயன் பார்வை" : "Tailored Perspective for Your Circle"}
          </h3>
        </div>

        {isSingle && (
          <div className="space-y-2 text-xs font-light leading-relaxed text-warm-ivory/90">
            <p>
              {lang === "ta"
                ? "நீங்கள் சுயாதீனமாக வாழ்வதால், ஒரு தனிநபர் பாலிசி உங்களுக்கு முழுமையான நிதிச் சுதந்திரத்தை அளிக்கிறது. யாருடைய ஒப்புதலும் இன்றி உங்கள் மருத்துவக் கவனிப்பை நீங்கள் நேரடியாக தீர்மானிக்கலாம்."
                : "As an independent individual, a dedicated individual health cover guarantees self-reliance. You protect your personal savings and investments without placing unexpected medical burdens on relatives."}
            </p>
          </div>
        )}

        {hasSpouse && !hasChildren && (
          <div className="space-y-2 text-xs font-light leading-relaxed text-warm-ivory/90">
            <p>
              {lang === "ta"
                ? "இருவராக இணைந்து வாழும்போது, 2-உறுப்பினர்கள் கொண்ட ஃபேமிலி ஃப்ளோட்டர் அல்லது இருவருக்குமான தனிநபர் பாலிசிகள் சிறந்த நிதிப் பாதுகாப்பைத் தருகின்றன. ஒருவர் மருத்துவமனையில் அனுமதிக்கப்பட்டாலும் உங்கள் கூட்டுக் கனவுகள் தடைபடாது."
                : "For couples building a joint household, a 2-member floater or two dedicated individual covers shield joint earnings and down-payment savings from medical inflation."}
            </p>
          </div>
        )}

        {hasParents && (
          <div className="p-4 rounded-2xl bg-deep-aubergine/80 border border-burnished-copper/30 space-y-2">
            <span className="font-serif text-base text-soft-champagne block">
              {ch.parentsCareTitle}
            </span>
            <p className="text-xs text-dusty-mauve font-light leading-relaxed">
              {ch.parentsCareDesc}
            </p>
          </div>
        )}

        {hasChildren && (
          <div className="space-y-2 text-xs font-light leading-relaxed text-warm-ivory/90">
            <p>
              {lang === "ta"
                ? "குழந்தைகள் உள்ள குடும்பத்திற்கு, குழந்தைகளை ஃப்ளோட்டர் பாலிசியில் சேர்ப்பது அவர்கள் சிறந்த குழந்தை மருத்துவமனைகளில் சிகிச்சை பெற உதவுகிறது. அதே நேரத்தில் அவர்களின் எதிர்காலக் கல்விச் சேமிப்பு பாதுகாக்கப்படுகிறது."
                : "Including children in a family floater ensures immediate access to leading pediatric centers without dipping into dedicated education funds."}
            </p>
          </div>
        )}
      </div>

      {/* 3. Employer Insurance Reality Check */}
      <div className="luxury-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center space-x-2 text-soft-champagne">
          <Briefcase className="w-5 h-5" />
          <h3 className="font-serif text-xl sm:text-2xl text-warm-ivory">{ch.employerInsuranceTitle}</h3>
        </div>
        <p className="text-xs text-dusty-mauve font-light leading-relaxed">
          {ch.employerInsuranceSub}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ch.employerPoints.map((pt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-deep-aubergine/80 border border-glass-border space-y-1.5"
            >
              <span className="font-serif text-sm font-semibold text-warm-ivory block">
                {pt.title}
              </span>
              <p className="text-[11px] text-dusty-mauve font-light leading-relaxed">
                {pt.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Policy Continuity, NCB & Restoration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Restoration */}
        <div className="luxury-card p-5 rounded-2xl space-y-2 border-glass-border">
          <div className="flex items-center space-x-2 text-burnished-copper">
            <RefreshCw className="w-4 h-4" />
            <h4 className="font-serif text-base text-warm-ivory">{ch.restorationTitle}</h4>
          </div>
          <p className="text-xs text-dusty-mauve font-light leading-relaxed">
            {ch.restorationDesc}
          </p>
        </div>

        {/* NCB */}
        <div className="luxury-card p-5 rounded-2xl space-y-2 border-glass-border">
          <div className="flex items-center space-x-2 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
            <h4 className="font-serif text-base text-warm-ivory">{ch.ncbTitle}</h4>
          </div>
          <p className="text-xs text-dusty-mauve font-light leading-relaxed">
            {ch.ncbDesc}
          </p>
        </div>

        {/* Portability */}
        <div className="luxury-card p-5 rounded-2xl space-y-2 border-glass-border">
          <div className="flex items-center space-x-2 text-soft-champagne">
            <ShieldCheck className="w-4 h-4" />
            <h4 className="font-serif text-base text-warm-ivory">{ch.portabilityTitle}</h4>
          </div>
          <p className="text-xs text-dusty-mauve font-light leading-relaxed">
            {ch.portabilityDesc}
          </p>
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
