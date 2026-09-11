"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Copy,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { UserProtectionProfile } from "@/types/questionnaire";
import { getCharacterForUser } from "@/lib/characterEngine";
import { FamilyCharacter } from "../character/FamilyCharacter";
import { ADVISOR_CONFIG } from "@/data/advisorConfig";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface FinalAdvisorContactSectionProps {
  profile: UserProtectionProfile;
  onRestartExperience: () => void;
  className?: string;
}

export const FinalAdvisorContactSection: React.FC<FinalAdvisorContactSectionProps> = ({
  profile,
  onRestartExperience,
  className = "",
}) => {
  const { language } = useLanguage();
  const lang = language === "ta" ? "ta" : "en";
  const userChar = getCharacterForUser(profile.user);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldKey: string) => {
    sound.playSoftPulse();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldKey);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  const handleContactAction = () => {
    sound.playChime(640, 0.15);
    if (ADVISOR_CONFIG.phoneRaw) {
      window.location.href = `tel:${ADVISOR_CONFIG.phoneRaw}`;
    } else if (ADVISOR_CONFIG.whatsappRaw) {
      window.open(`https://wa.me/${ADVISOR_CONFIG.whatsappRaw}`, "_blank");
    } else {
      // Smooth scroll to advisor card
      const el = document.getElementById("advisor-contact-card");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div
      className={`relative w-full max-w-2xl mx-auto p-6 sm:p-10 rounded-[28px] bg-white border border-hairline shadow-subtle text-center space-y-8 animate-fadeIn ${className}`}
    >
      {/* Reassuring Persistent Character Position */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="relative">
          <FamilyCharacter
            config={userChar}
            variant="bust"
            size="lg"
            pose="reflective"
            showHalo
          />
          <span className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-lavender-600 text-white shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </span>
        </div>

        {/* Reassurance Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-lavender-100 text-xs font-mono text-ink border border-lavender-300 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-lavender-600" />
          <span>
            {lang === "ta" ? "முழுமையான விழிப்புணர்வு நிறைவு" : "Complete Preparedness Achieved"}
          </span>
        </div>
      </div>

      {/* Primary Section Heading & Supporting Message */}
      <div className="space-y-3 max-w-lg mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          {lang === "ta" ? "அடுத்த கட்டத்திற்கு செல்ல தயாரா?" : "Ready to take the next step?"}
        </h2>
        <p className="font-sans text-xs sm:text-sm text-ink-soft leading-relaxed">
          {lang === "ta"
            ? "உங்கள் ஹெல்த் இன்ஷூரன்ஸ் தேர்வுகளை மேலும் ஆழமாகப் புரிந்து கொள்ளவோ அல்லது அடுத்த கட்டத்திற்குச் செல்லவோ நான் உங்களுக்கு உதவத் தயாராக இருக்கிறேன்."
            : "If you'd like to understand your health insurance options or proceed further, I'm here to help."}
        </p>
      </div>

      {/* Primary Call-to-Action */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
        <button
          onClick={handleContactAction}
          className="btn-primary min-h-[50px] px-8 py-4 text-xs font-semibold group inline-flex items-center justify-center space-x-3 w-full sm:w-auto shadow-subtle hover:shadow-elevated"
        >
          <span>
            {lang === "ta"
              ? "மேலும் விவரங்களுக்கு என்னைத் தொடர்பு கொள்ளவும் →"
              : "Contact Me to Proceed Further →"}
          </span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Professional Advisor Information Card */}
      <div
        id="advisor-contact-card"
        className="p-6 sm:p-7 rounded-[22px] bg-bg-soft border border-hairline hover:border-lavender-300 transition-all text-left space-y-4 max-w-lg mx-auto shadow-xs"
      >
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-lavender-600 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">
              {lang === "ta" ? "ஹெல்த் இன்ஷூரன்ஸ் ஆலோசகர்" : ADVISOR_CONFIG.designation}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white text-ink-soft border border-hairline">
            {lang === "ta" ? "நேரடி ஆலோசனை" : "Direct Guidance"}
          </span>
        </div>

        {/* Advisor Details */}
        <div className="space-y-2.5 text-xs">
          {/* Name */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-hairline">
            <div className="min-w-0 pr-2">
              <span className="font-mono text-[10px] uppercase text-muted block leading-tight">
                {lang === "ta" ? "ஆலோசகர் பெயர்" : "Insurance Advisor"}
              </span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="font-display font-bold text-base text-ink block truncate">
                  {ADVISOR_CONFIG.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(ADVISOR_CONFIG.name, "name")}
                  className="p-1 rounded-md bg-bg-soft hover:bg-lavender-100 text-ink-soft hover:text-ink transition-all border border-hairline inline-flex items-center justify-center flex-shrink-0"
                  title="Copy Name"
                  aria-label="Copy name"
                >
                  {copiedField === "name" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                {copiedField === "name" && (
                  <span className="text-[10px] font-mono text-emerald-600 animate-fadeIn">
                    {lang === "ta" ? "நகலெடுக்கப்பட்டது!" : "Copied!"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Phone with copy icon right near the number */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-hairline hover:border-lavender-200 transition-colors">
            <div className="flex items-center space-x-3 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-lg bg-lavender-100 text-lavender-600 flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[10px] uppercase text-muted block leading-tight">
                  {lang === "ta" ? "தொலைபேசி" : "Phone / WhatsApp"}
                </span>
                <div className="flex items-center space-x-2 mt-0.5 flex-wrap gap-y-1">
                  <a
                    href={`tel:${ADVISOR_CONFIG.phoneRaw}`}
                    className="font-mono font-semibold text-xs sm:text-sm text-ink hover:text-lavender-700 transition-colors"
                  >
                    {ADVISOR_CONFIG.phone}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(ADVISOR_CONFIG.phone, "phone")}
                    className="p-1 rounded-md bg-bg-soft hover:bg-lavender-100 text-ink-soft hover:text-ink transition-all border border-hairline inline-flex items-center justify-center flex-shrink-0"
                    title={lang === "ta" ? "தொலைபேசி எண்ணை நகலெடு" : "Copy phone number"}
                    aria-label="Copy phone number"
                  >
                    {copiedField === "phone" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  {copiedField === "phone" && (
                    <span className="text-[10px] font-mono text-emerald-600 animate-fadeIn">
                      {lang === "ta" ? "நகலெடுக்கப்பட்டது!" : "Copied!"}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <a
              href={`tel:${ADVISOR_CONFIG.phoneRaw}`}
              className="px-3 py-1.5 rounded-lg bg-lavender-50 hover:bg-lavender-100 text-lavender-700 text-xs font-semibold border border-lavender-200 transition-colors flex-shrink-0 hidden sm:inline-flex items-center space-x-1"
            >
              <span>{lang === "ta" ? "அழைக்கவும்" : "Call"}</span>
            </a>
          </div>

          {/* Email with copy icon right near the email */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-hairline hover:border-sage-200 transition-colors">
            <div className="flex items-center space-x-3 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-lg bg-sage-100 text-sage-600 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[10px] uppercase text-muted block leading-tight">
                  {lang === "ta" ? "மின்னஞ்சல்" : "Email"}
                </span>
                <div className="flex items-center space-x-2 mt-0.5 flex-wrap gap-y-1">
                  <a
                    href={`mailto:${ADVISOR_CONFIG.email}`}
                    className="font-mono font-semibold text-xs sm:text-sm text-ink hover:text-sage-700 transition-colors truncate block"
                  >
                    {ADVISOR_CONFIG.email}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(ADVISOR_CONFIG.email, "email")}
                    className="p-1 rounded-md bg-bg-soft hover:bg-sage-100 text-ink-soft hover:text-ink transition-all border border-hairline inline-flex items-center justify-center flex-shrink-0"
                    title={lang === "ta" ? "மின்னஞ்சலை நகலெடு" : "Copy email address"}
                    aria-label="Copy email address"
                  >
                    {copiedField === "email" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  {copiedField === "email" && (
                    <span className="text-[10px] font-mono text-emerald-600 animate-fadeIn">
                      {lang === "ta" ? "நகலெடுக்கப்பட்டது!" : "Copied!"}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <a
              href={`mailto:${ADVISOR_CONFIG.email}`}
              className="px-3 py-1.5 rounded-lg bg-sage-50 hover:bg-sage-100 text-sage-700 text-xs font-semibold border border-sage-200 transition-colors flex-shrink-0 hidden sm:inline-flex items-center space-x-1"
            >
              <span>{lang === "ta" ? "மின்னஞ்சல்" : "Email"}</span>
            </a>
          </div>
        </div>

        <p className="text-[11px] text-muted text-center pt-1">
          {lang === "ta"
            ? "முழுமையான வெளிப்படைத்தன்மை · பூஜ்ஜிய விற்பனை அழுத்தம் · தெளிவான வழிகாட்டுதல்"
            : "Zero sales pressure · 100% Educational Clarity · Transparent Advisory"}
        </p>
      </div>

      {/* Secondary Restart Experience action */}
      <div className="pt-2 border-t border-hairline flex items-center justify-center">
        <button
          onClick={() => {
            sound.playSoftPulse();
            onRestartExperience();
          }}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white border border-hairline text-xs font-mono text-ink-soft hover:text-ink hover:bg-bg-soft transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-muted" />
          <span>
            {lang === "ta" ? "அனுபவத்தை மீண்டும் தொடங்க" : "Restart Experience"}
          </span>
        </button>
      </div>
    </div>
  );
};
