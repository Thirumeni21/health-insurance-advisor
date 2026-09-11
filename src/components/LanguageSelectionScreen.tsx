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
      <div className="mb-6 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-bg-soft border border-hairline">
        <span className="w-1.5 h-1.5 rounded-full bg-lavender-600" />
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
          Language / மொழி
        </span>
      </div>

      {/* Main Title */}
      <h1 className="font-display font-bold text-4xl sm:text-6xl text-ink tracking-tight mb-3">
        Choose your <span className="font-serif italic font-normal text-lavender-600">language</span>
      </h1>
      <p className="font-sans text-sm text-ink-soft max-w-md mx-auto mb-10 font-normal">
        Select your preferred language to enter your family protection experience.
      </p>

      {/* Two Premium Language Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl mb-8">
        {/* English Card */}
        <div
          onClick={() => handleSelect("en")}
          className="bg-white hover:bg-bg-soft border border-hairline hover:border-lavender-300 rounded-[20px] p-6 cursor-pointer text-left group shadow-subtle hover:shadow-elevated transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🇬🇧</span>
            <div className="w-8 h-8 rounded-full bg-lavender-100 border border-lavender-300 flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-white transition-all">
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
          <h3 className="font-display font-bold text-2xl text-ink mb-1 group-hover:text-lavender-600 transition-colors">
            English
          </h3>
          <p className="text-xs text-muted font-normal">
            Continue in English
          </p>
        </div>

        {/* Tamil Card */}
        <div
          onClick={() => handleSelect("ta")}
          className="bg-white hover:bg-bg-soft border border-hairline hover:border-lavender-300 rounded-[20px] p-6 cursor-pointer text-left group shadow-subtle hover:shadow-elevated transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🇮🇳</span>
            <div className="w-8 h-8 rounded-full bg-lavender-100 border border-lavender-300 flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-white transition-all">
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
          <h3 className="font-display font-bold text-2xl text-ink mb-1 group-hover:text-lavender-600 transition-colors">
            தமிழ்
          </h3>
          <p className="text-xs text-muted font-normal">
            தமிழில் தொடரவும்
          </p>
        </div>
      </div>

      <div className="text-xs text-muted">
        You can switch between English and தமிழ் anytime from the top bar.
      </div>
    </div>
  );
};