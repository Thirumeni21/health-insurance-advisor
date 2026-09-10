"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface HeroSectionProps {
  onStart: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStart }) => {
  const { t, language } = useLanguage();

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-12 z-10 select-none animate-fadeIn">
      {/* Category Label */}
      <div className="mb-6 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-deep-aubergine/80 border border-glass-border backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-burnished-copper animate-pulse" />
        <span className="text-[11px] font-mono tracking-widest uppercase text-dusty-mauve">
          {t.hero.tag}
        </span>
      </div>

      {/* Hero Headline */}
      <h1 className={`font-serif text-4xl sm:text-6xl lg:text-7xl text-warm-ivory max-w-4xl mx-auto leading-[1.1] tracking-tight mb-6 ${language === "ta" ? "text-3xl sm:text-5xl lg:text-6xl" : ""}`}>
        {t.hero.title}
      </h1>

      {/* Subheading */}
      <p className="font-sans text-sm sm:text-base text-dusty-mauve max-w-[580px] mx-auto mb-10 leading-relaxed font-light">
        {t.hero.subtitle}
      </p>

      {/* Primary CT· */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <button
          onClick={() => {
            sound.playChime(520, 0.15);
            onStart();
          }}
          className="group relative inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-copper-glow hover:shadow-copper-glow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>{t.hero.cta}</span>
          < ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Microcopy */}
        <div className="flex items-center space-x-2 text-xs text-dusty-mauve/80 pt-2 font-mono">
          <span>{t.hero.microcopy}</span>
        </div>
      </div>

      {/* Ambient Insights Bar */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl w-full mx-auto text-left pt-8 border-t border-glass-border/40">
        <div className="p-3.5 rounded-xl bg-deep-aubergine/40 border border-glass-border/60 backdrop-blur-sm">
          <div className="font-mono text-xs font-semibold text-burnished-copper">
            {t.hero.chips.inflation}
          </div>
          <div className="text-[11px] text-dusty-mauve mt-0.5 font-light">
            {t.hero.chips.inflationDesc}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-deep-aubergine/40 border border-glass-border/60 backdrop-blur-sm">
          <div className="font-mono text-xs font-semibold text-soft-champagne">
            {t.hero.chips.outOfPocket}
          </div>
          <div className="text-[11px] text-dusty-mauve mt-0.5 font-light">
            {t.hero.chips.outOfPocketDesc}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-deep-aubergine/40 border border-glass-border/60 backdrop-blur-sm">
          <div className="font-mono text-xs font-semibold text-warm-ivory">
            {t.hero.chips.noSales}
          </div>
          <div className="text-[11px] text-dusty-mauve mt-0.5 font-light">
            {t.hero.chips.noSalesDesc}
          </div>
        </div>
      </div>
    </div>
  );
};