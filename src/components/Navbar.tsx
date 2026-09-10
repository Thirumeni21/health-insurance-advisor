"use client";

import React, { useState } from "react";
import { Shield, RotateCcw, Volume2, VolumeX, Eye, Globe } from "lucide-react";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";
import { AppStage } from "@/types/questionnaire";

interface NavbarProps {
  stage?: AppStage;
  onReset?: () => void;
  currentStep?: number;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stage = "hero",
  onReset,
  currentStep,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isMuted, setIsMuted] = useState(true);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleLanguage = () => {
    sound.playChime(500, 0.08);
    setLanguage(language === "en" ? "ta" : "en");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-obsidian-plum/85 backdrop-blur-xl border-b border-glass-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => {
            sound.playChime(440, 0.1);
            if (onReset) onReset();
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-deep-aubergine border border-burnished-copper/40 flex items-center justify-center text-burnished-copper group-hover:scale-105 transition-transform shadow-copper-glow">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-lg tracking-wide text-warm-ivory">
                {t.nav.brand} <span className="text-burnished-copper font-sans text-xs uppercase tracking-widest font-normal">{t.nav.tagline}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center Stage Badge */}
        <div className="hidden md:flex items-center space-x-2 px-3.5 py-1 rounded-full bg-deep-aubergine/70 border border-glass-border text-xs text-dusty-mauve font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-burnished-copper" />
          <span>{stage === "stage2" ? t.nav.stage2Badge : t.nav.stageBadge}</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Language Switcher Pill (EN | தமிழ்) */}
          <button
            onClick={handleToggleLanguage}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-deep-aubergine/80 hover:bg-oxblood-burgundy border border-glass-border hover:border-burnished-copper text-xs font-mono transition-all text-warm-ivory shadow-sm min-h-[36px]"
            title={language === "en" ? "Switch to தமிழ்" : "Switch to English"}
          >
            <Globe className="w-3 h-3 text-burnished-copper" />
            <span className={language === "en" ? "text-burnished-copper font-bold" : "text-dusty-mauve"}>
              EN
            </span>
            <span className="text-dusty-mauve/40">|</span>
            <span className={language === "ta" ? "text-burnished-copper font-bold" : "text-dusty-mauve"}>
              தமிழ்
            </span>
          </button>

          {/* Sound */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-lg border transition-all text-xs flex items-center space-x-1.5 min-h-[36px] min-w-[36px] justify-center ${
              !isMuted
                ? "bg-burnished-copper/20 border-burnished-copper text-burnished-copper shadow-copper-glow"
                : "bg-deep-aubergine/80 border-glass-border text-dusty-mauve hover:text-warm-ivory"
            }`}
            title={isMuted ? t.nav.soundOn : t.nav.soundOff}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Reduced Motion */}
          <button
            onClick={onToggleReducedMotion}
            className={`hidden sm:flex p-2 rounded-lg border transition-all text-xs items-center space-x-1.5 min-h-[36px] ${
              reducedMotion
                ? "bg-burnished-copper/20 border-burnished-copper text-burnished-copper"
                : "bg-deep-aubergine/80 border-glass-border text-dusty-mauve hover:text-warm-ivory"
            }`}
            title={reducedMotion ? t.nav.motionOn : t.nav.motionOff}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Reset */}
          {((currentStep !== undefined && currentStep > 0) || stage === "stage2") && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-dusty-mauve hover:text-warm-ivory hover:bg-deep-aubergine transition-all border border-glass-border min-h-[36px]"
              title={t.nav.reset}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.nav.reset}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};