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
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-16 z-10 select-none animate-fadeIn">
      {/* Category Label */}
      <div className="mb-6 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-bg-soft border border-hairline">
        <span className="w-1.5 h-1.5 rounded-full bg-lavender-600" />
        <span className="text-xs font-semibold tracking-wider uppercase text-ink-soft">
          {t.hero.tag}
        </span>
      </div>

      {/* Hero Headline */}
      <h1 className={`font-display font-bold text-4xl sm:text-6xl lg:text-7xl text-ink max-w-4xl mx-auto leading-[1.08] tracking-tight mb-6 ${language === "ta" ? "text-3xl sm:text-5xl lg:text-6xl" : ""}`}>
        {t.hero.title}
      </h1>

      {/* Subheading */}
      <p className="font-sans text-sm sm:text-base text-ink-soft max-w-[580px] mx-auto mb-10 leading-relaxed font-normal">
        {t.hero.subtitle}
      </p>

      {/* Primary CTA */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <button
          onClick={() => {
            sound.playChime(520, 0.15);
            onStart();
          }}
          className="group inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-ink hover:bg-[#2e283b] text-white text-sm font-medium tracking-wide transition-all duration-300 shadow-subtle hover:shadow-elevated hover:-translate-y-0.5"
        >
          <span>{t.hero.cta}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Microcopy */}
        <div className="flex items-center space-x-2 text-xs text-muted pt-1">
          <span>{t.hero.microcopy}</span>
        </div>
      </div>

      {/* Ambient Insights Bar with 3 Quiet Pastel Fills (Lavender, Sage, Cream) */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full mx-auto text-left pt-8 border-t border-hairline">
        <div className="p-4 rounded-[16px] bg-lavender-100 border border-lavender-300 transition-all">
          <div className="font-sans text-xs font-semibold text-ink">
            {t.hero.chips.inflation}
          </div>
          <div className="text-xs text-ink-soft mt-1 font-normal leading-relaxed">
            {t.hero.chips.inflationDesc}
          </div>
        </div>
        <div className="p-4 rounded-[16px] bg-sage-100 border border-[#d3e0ba] transition-all">
          <div className="font-sans text-xs font-semibold text-ink">
            {t.hero.chips.outOfPocket}
          </div>
          <div className="text-xs text-ink-soft mt-1 font-normal leading-relaxed">
            {t.hero.chips.outOfPocketDesc}
          </div>
        </div>
        <div className="p-4 rounded-[16px] bg-cream-100 border border-[#eae3d2] transition-all">
          <div className="font-sans text-xs font-semibold text-ink">
            {t.hero.chips.noSales}
          </div>
          <div className="text-xs text-ink-soft mt-1 font-normal leading-relaxed">
            {t.hero.chips.noSalesDesc}
          </div>
        </div>
      </div>
    </div>
  );
};