"use client";

import React from "react";
import { Shield, Globe } from "lucide-react";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";
import { AppStage } from "@/types/questionnaire";

interface NavbarProps {
  stage?: AppStage;
  onReset?: () => void;
  currentStep?: number;
  reducedMotion?: boolean;
  onToggleReducedMotion?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stage = "hero",
  onReset,
}) => {
  const { language, setLanguage, t } = useLanguage();

  const handleToggleLanguage = () => {
    sound.playChime(500, 0.08);
    setLanguage(language === "en" ? "ta" : "en");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-hairline h-[72px]">
      <div className="max-w-editorial mx-auto px-3.5 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group"
          onClick={() => {
            sound.playChime(440, 0.1);
            if (onReset) onReset();
          }}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-lavender-100 border border-lavender-300 flex items-center justify-center text-ink group-hover:scale-105 transition-transform flex-shrink-0">
            <Shield className="w-4 h-4 text-lavender-600" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-ink whitespace-nowrap">
                {t.nav.brand} <span className="hidden sm:inline text-muted font-sans text-xs uppercase tracking-wider font-normal">{t.nav.tagline}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center Stage Badge */}
        <div className="hidden md:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-bg-soft border border-hairline text-xs text-ink-soft">
          <span className="w-1.5 h-1.5 rounded-full bg-lavender-600" />
          <span className="font-medium">{stage === "stage3" ? t.stage3?.nav?.stageTag || "Stage 3" : stage === "stage2" ? t.nav.stage2Badge : t.nav.stageBadge}</span>
        </div>

        {/* Right Controls: Focused Language Switcher Pill (EN | தமிழ்) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={handleToggleLanguage}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-bg-soft hover:bg-lavender-100 border border-hairline hover:border-lavender-300 text-xs transition-all text-ink min-h-[38px]"
            title={language === "en" ? "Switch to தமிழ்" : "Switch to English"}
          >
            <Globe className="w-3.5 h-3.5 text-lavender-600" />
            <span className={language === "en" ? "bg-lavender-100 text-ink px-1.5 py-0.5 rounded font-semibold" : "text-muted"}>
              EN
            </span>
            <span className="text-hairline font-light">|</span>
            <span className={language === "ta" ? "bg-lavender-100 text-ink px-1.5 py-0.5 rounded font-semibold" : "text-muted"}>
              தமிழ்
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};