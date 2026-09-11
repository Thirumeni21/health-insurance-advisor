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

      {/* 1. Family Floater vs Individual Policy */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-3">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">{ch.floaterVsIndivTitle}</h3>
            <p className="text-xs text-ink-soft mt-0.5">
              {lang === "ta" ? "பகிர்வு அல்லது தனிப்பட்ட ஒதுக்கீட்டின் தாக்கம்:" : "Comparing shared coverage pool versus individual limits:"}
            </p>
          </div>

          <div className="flex items-center space-x-1.5 self-start sm:self-auto">
            <button
              onClick={() => {
                sound.playSoftPulse();
                setPolicyTypeTab("floater");
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all flex items-center space-x-1.5 ${
                policyTypeTab === "floater"
                  ? "bg-ink text-white font-medium"
                  : "bg-bg-soft text-ink-soft hover:text-ink border border-hairline"
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
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all flex items-center space-x-1.5 ${
                policyTypeTab === "individual"
                  ? "bg-ink text-white font-medium"
                  : "bg-bg-soft text-ink-soft hover:text-ink border border-hairline"
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
            className={`p-5 rounded-[16px] border transition-all ${
              policyTypeTab === "floater"
                ? "bg-lavender-100/50 border-lavender-300 shadow-sm"
                : "bg-bg-soft border-hairline"
            }`}
          >
            <div className="flex items-center space-x-2 text-ink mb-2">
              <Share2 className="w-4 h-4 text-lavender-600" />
              <h4 className="font-display text-lg text-ink font-semibold">{ch.floaterTitle}</h4>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed mb-3">
              {ch.floaterDesc}
            </p>
            <div className="p-3 rounded-xl bg-white border border-hairline text-xs text-ink">
              <strong className="text-ink font-mono block text-[10px] uppercase mb-0.5">
                {lang === "ta" ? "யாருக்கு ஏற்றது?" : "Best Suited For"}
              </strong>
              {ch.floaterIdeal}
            </div>
          </div>

          <div
            className={`p-5 rounded-[16px] border transition-all ${
              policyTypeTab === "individual"
                ? "bg-lavender-100/50 border-lavender-300 shadow-sm"
                : "bg-bg-soft border-hairline"
            }`}
          >
            <div className="flex items-center space-x-2 text-ink mb-2">
              <User className="w-4 h-4 text-lavender-600" />
              <h4 className="font-display text-lg text-ink font-semibold">{ch.individualTitle}</h4>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed mb-3">
              {ch.individualDesc}
            </p>
            <div className="p-3 rounded-xl bg-white border border-hairline text-xs text-ink">
              <strong className="text-ink font-mono block text-[10px] uppercase mb-0.5">
                {lang === "ta" ? "யாருக்கு ஏற்றது?" : "Best Suited For"}
              </strong>
              {ch.individualIdeal}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Personalized Household Focus Based on Stage 1 Profile */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-4">
        <div className="flex items-center space-x-2 text-ink">
          <Heart className="w-5 h-5 text-lavender-600" />
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">
            {lang === "ta" ? "உங்கள் குடும்பத்திற்கான தனிப்பயன் பார்வை" : "Tailored Perspective for Your Circle"}
          </h3>
        </div>

        {isSingle && (
          <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-ink-soft">
            <p>
              {lang === "ta"
                ? "நீங்கள் சுயாதீனமாக வாழ்வதால், ஒரு தனிநபர் பாலிசி உங்களுக்கு முழுமையான நிதிச் சுதந்திரத்தை அளிக்கிறது. யாருடைய ஒப்புதலும் இன்றி உங்கள் மருத்துவக் கவனிப்பை நீங்கள் நேரடியாக தீர்மானிக்கலாம்."
                : "As an independent individual, a dedicated individual health cover guarantees self-reliance. You protect your personal savings and investments without placing unexpected medical burdens on relatives."}
            </p>
          </div>
        )}

        {hasSpouse && !hasChildren && (
          <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-ink-soft">
            <p>
              {lang === "ta"
                ? "இருவராக இணைந்து வாழும்போது, 2-உறுப்பினர்கள் கொண்ட ஃபேமிலி ஃப்ளோட்டர் அல்லது இருவருக்குமான தனிநபர் பாலிசிகள் சிறந்த நிதிப் பாதுகாப்பைத் தருகின்றன. ஒருவர் மருத்துவமனையில் அனுமதிக்கப்பட்டாலும் உங்கள் கூட்டுக் கனவுகள் தடைபடாது."
                : "For couples building a joint household, a 2-member floater or two dedicated individual covers shield joint earnings and down-payment savings from medical inflation."}
            </p>
          </div>
        )}

        {hasParents && (
          <div className="p-4 rounded-[16px] bg-bg-soft border border-hairline space-y-2">
            <span className="font-display text-base text-ink font-semibold block">
              {ch.parentsCareTitle}
            </span>
            <p className="text-xs text-ink-soft leading-relaxed">
              {ch.parentsCareDesc}
            </p>
          </div>
        )}

        {hasChildren && (
          <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-ink-soft">
            <p>
              {lang === "ta"
                ? "குழந்தைகள் உள்ள குடும்பத்திற்கு, குழந்தைகளை ஃப்ளோட்டர் பாலிசியில் சேர்ப்பது அவர்கள் சிறந்த குழந்தை மருத்துவமனைகளில் சிகிச்சை பெற உதவுகிறது. அதே நேரத்தில் அவர்களின் எதிர்காலக் கல்விச் சேமிப்பு பாதுகாக்கப்படுகிறது."
                : "Including children in a family floater ensures immediate access to leading pediatric centers without dipping into dedicated education funds."}
            </p>
          </div>
        )}
      </div>

      {/* 3. Employer Insurance Reality Check */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-6">
        <div className="flex items-center space-x-2 text-ink">
          <Briefcase className="w-5 h-5 text-lavender-600" />
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">{ch.employerInsuranceTitle}</h3>
        </div>
        <p className="text-xs text-ink-soft leading-relaxed">
          {ch.employerInsuranceSub}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ch.employerPoints.map((pt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-[16px] bg-bg-soft border border-hairline space-y-1.5"
            >
              <span className="font-sans text-sm font-semibold text-ink block">
                {pt.title}
              </span>
              <p className="text-xs text-ink-soft leading-relaxed">
                {pt.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Policy Continuity, NCB & Restoration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Restoration */}
        <div className="bg-white p-5 rounded-[20px] space-y-2 border border-hairline shadow-subtle">
          <div className="flex items-center space-x-2 text-ink">
            <RefreshCw className="w-4 h-4 text-lavender-600" />
            <h4 className="font-display text-base font-semibold text-ink">{ch.restorationTitle}</h4>
          </div>
          <p className="text-xs text-ink-soft leading-relaxed">
            {ch.restorationDesc}
          </p>
        </div>

        {/* NCB */}
        <div className="bg-white p-5 rounded-[20px] space-y-2 border border-hairline shadow-subtle">
          <div className="flex items-center space-x-2 text-ink">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h4 className="font-display text-base font-semibold text-ink">{ch.ncbTitle}</h4>
          </div>
          <p className="text-xs text-ink-soft leading-relaxed">
            {ch.ncbDesc}
          </p>
        </div>

        {/* Portability */}
        <div className="bg-white p-5 rounded-[20px] space-y-2 border border-hairline shadow-subtle">
          <div className="flex items-center space-x-2 text-ink">
            <ShieldCheck className="w-4 h-4 text-lavender-600" />
            <h4 className="font-display text-base font-semibold text-ink">{ch.portabilityTitle}</h4>
          </div>
          <p className="text-xs text-ink-soft leading-relaxed">
            {ch.portabilityDesc}
          </p>
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
