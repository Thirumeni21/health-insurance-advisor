"use client";

import React from "react";
import { ArrowRight, Check } from "lucide-react";
import { HouseholdType } from "@/types/questionnaire";
import { HOUSEHOLD_OPTIONS } from "@/data/constants";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface Question1HouseholdProps {
  selectedType: HouseholdType | null;
  onSelect: (type: HouseholdType) => void;
  onContinue: () => void;
}

export const Question1Household: React.FC<Question1HouseholdProps> = ({
  selectedType,
  onSelect,
  onContinue,
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-3xl mx-auto animate-fadeIn select-none z-10 relative">
      {/* Title */}
      <div className="text-center mb-10">
        <span className="text-[11px] uppercase font-mono tracking-widest text-burnished-copper mb-2 block">
          {t.step1.tag}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-warm-ivory tracking-tight mb-3">
          {t.step1.title}
        </h1>
        <p className="font-sans text-sm sm:text-base text-dusty-mauve max-w-md mx-auto font-light">
          {t.step1.subtitle}
        </p>
      </div>

      {/* 6 Minimal Luxury Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {HOUSEHOLD_OPTIONS.map((option) => {
          const isSelected = selectedType === option.id;
          const translated = t.step1.options[option.id];

          return (
            <div
              key={option.id}
              onClick={() => {
                sound.playChime(480, 0.1);
                onSelect(option.id);
              }}
              className={`group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "luxury-card-selected transform scale-[1.02]"
                  : "luxury-card luxury-card-hover"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-deep-aubergine border border-glass-border flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                  {option.icon}
                </div>

                <div className="flex items-center space-x-2">
                  {"badge" in translated && translated.badge && (
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-burnished-copper/15 text-burnished-copper border border-burnished-copper/30">
                      {translated.badge}
                    </span>
                  )}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-burnished-copper text-obsidian-plum shadow-copper-glow"
                        : "border border-dusty-mauve/20 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>

              <h3 className="font-serif text-2xl text-warm-ivory mb-1.5 group-hover:text-burnished-copper transition-colors">
                {translated.title}
              </h3>
              <p className="text-xs text-dusty-mauve leading-relaxed font-light">
                {translated.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Continue */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => {
            sound.playChime(580, 0.12);
            onContinue();
          }}
          disabled={!selectedType}
          className={`group inline-flex items-center space-x-3 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
            selectedType
              ? "bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory shadow-copper-glow hover:scale-105"
              : "bg-deep-aubergine text-dusty-mauve/30 cursor-not-allowed border border-glass-border"
          }`}
        >
          <span>{t.step1.continue}</span>
          < ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};