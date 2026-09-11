"use client";

import React from "react";
import { ArrowRight, Check } from "lucide-react";
import { CONCERN_OPTIONS } from "@/data/constants";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface Question5ConcernsProps {
  selectedConcerns: string[];
  onToggleConcern: (id: string) => void;
  onContinue: () => void;
}

export const Question5Concerns: React.FC<Question5ConcernsProps> = ({
  selectedConcerns,
  onToggleConcern,
  onContinue,
}) => {
  const { t } = useLanguage();
  const isValid = selectedConcerns.length > 0;

  const handleToggle = (id: string) => {
    sound.playSoftPulse();
    onToggleConcern(id);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fadeIn z-10 relative select-none">
      {/* Title */}
      <div className="text-left mb-6">
        <span className="editorial-kicker mb-1 block">
          {t.step5.tag}
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight mb-2">
          {t.step5.title}
        </h2>
        <p className="text-xs sm:text-sm text-ink-soft max-w-md">
          {t.step5.subtitle}
        </p>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {CONCERN_OPTIONS.map((item) => {
          const isSelected = selectedConcerns.includes(item.id);
          const translated = (t.step5.concerns as Record<string, { title: string; desc: string }>)[item.id] || { title: item.title, desc: item.desc };

          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`group p-4 rounded-[16px] cursor-pointer transition-all duration-200 flex items-start space-x-3 border min-h-[48px] ${
                isSelected
                  ? "bg-lavender-100 border-lavender-600 shadow-sm"
                  : "bg-white border-hairline hover:border-lavender-300 hover:bg-bg-soft"
              } ${item.isEducationalHook ? "sm:col-span-2 bg-gradient-to-r from-bg-soft to-lavender-100/40" : ""}`}
            >
              <div className="w-9 h-9 rounded-xl bg-bg-soft border border-hairline flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-sans font-medium text-base text-ink group-hover:text-lavender-600 transition-colors leading-snug">
                    {translated.title}
                  </h3>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center transition-all flex-shrink-0 ml-1.5 ${
                      isSelected
                        ? "bg-lavender-600 text-white"
                        : "border border-hairline bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <p className="text-xs text-ink-soft leading-relaxed font-light">
                  {translated.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Action */}
      <div className="flex items-center justify-center sm:justify-start">
        <button
          onClick={() => {
            sound.playChime(660, 0.15);
            onContinue();
          }}
          disabled={!isValid}
          className={`group inline-flex items-center justify-center space-x-3 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 min-h-[48px] w-full sm:w-auto ${
            isValid
              ? "btn-primary"
              : "bg-bg-soft text-muted cursor-not-allowed border border-hairline"
          }`}
        >
          <span>{t.step5.continue}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};