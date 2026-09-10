"use client";

import React from "react";
import { ArrowRight, Globe } from "lucide-react";
import { useLanguage, Language } from "@/context/LanguageContext";
import { sound } from "@/lib/soundFx";

export const LanguageSelectionScreen: React.FC = () => {
  const { selectLanguageAndEnter } = useLanguage();

  const handleSelect = (lang: Language) => {
    sound.playChime(560, 0.15);
    selectLanguageAndEnter(lang);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-12 z-20 select-none animate-fadeIn">
      {/* Category Pill */}
      <div className="mb-6 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-deep-aubergine/80 border border-glass-border backdrop-blur-md">
        <Globe className="w-3.5 h-3.5 text-burnished-copper" />
        <span className="text-[11px] font-mono tracking-widest uppercase text-dusty-mauve">
          Language / மொழி
        </span>
      </div>

      {/* Main Title */}
      <h1 className="font-serif text-4xl sm:text-6xl text-warm-ivory tracking-tight mb-3">
        Choose your language
      </h1>
      <p className="font-sans text-xs sm:text-sm text-dusty-mauve max-w-md mx-auto mb-10 font-light">
        Select your preferred language to enter your family protection experience.
      </p>

      {/* Two Premium Language Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl mb-8">
        {/* English Card */}
        <div
          onClick={() => handleSelect("en")}
          className="luxury-card luxury-card-hover p-6 rounded-2xl cursor-pointer text-left group border border-glass-border hover:border-burnished-copper/50 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">🇬🇧</span>
            <div className="w-7 h-7 rounded-full bg-deep-aubergine border border-glass-border flex items-center justify-center text-dusty-mauve group-hover:text-burnished-copper group-hover:border-burnished-copper transition-colors">
              < ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
          <h3 className="font-serif text-2xl text-warm-ivory mb-1 group-hover:text-burnished-copper transition-colors">
            English
          </h3>
          <p className="text-xs text-dusty-mauve font-light">
            Continue in English
          </p>
        </div>

        {/* Tamil Card */}
        <div
          onClick={() => handleSelect("ta")}
          className="luxury-card luxury-card-hover p-6 rounded-2xl cursor-pointer text-left group border border-glass-border hover:border-burnished-copper/50 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">🇮🇳</span>
            <div className="w-7 h-7 rounded-full bg-deep-aubergine border border-glass-border flex items-center justify-center text-dusty-mauve group-hover:text-burnished-copper group-hover:border-burnished-copper transition-colors">
              < ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
          <h3 className="font-serif text-2xl text-warm-ivory mb-1 group-hover:text-burnished-copper transition-colors">
            தமிழ்
          </h3>
          <p className="text-xs text-dusty-mauve font-light">
            தமிழில் தொடரவும்
          </p>
        </div>
      </div>

      <div className="text-[11px] font-mono text-dusty-mauve/60">
        You can switch between English and தமிழ் anytime from the top bar.
      </div>
    </div>
  );
};