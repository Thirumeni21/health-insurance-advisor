"use client";

import React, { useState } from "react";
import { ArrowRight, MapPin, User, Info } from "lucide-react";
import { GenderType, HouseholdType } from "@/types/questionnaire";
import { POPULAR_CITIES } from "@/data/constants";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface Question2UserBasicProps {
  householdType: HouseholdType | null;
  age: number;
  gender: GenderType | null;
  city: string;
  singleDependents?: "parents" | "siblings" | "someone_else" | "no_one" | null;
  onUpdate: (data: {
    age?: number;
    gender?: GenderType;
    city?: string;
    singleDependents?: "parents" | "siblings" | "someone_else" | "no_one";
  }) => void;
  onContinue: () => void;
}

export const Question2UserBasic: React.FC<Question2UserBasicProps> = ({
  householdType,
  age,
  gender,
  city,
  singleDependents,
  onUpdate,
  onContinue,
}) => {
  const { t } = useLanguage();
  const [citySearch, setCitySearch] = useState("");
  const [isCityOpen, setIsCityOpen] = useState(false);

  const filteredCities = POPULAR_CITIES.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  const isSingle = householdType === "myself";
  const isValid = age >= 18 && age <= 100 && gender && city.trim().length > 0 && (!isSingle || singleDependents);

  return (
    <div className="w-full max-w-2xl mx-auto animate-fadeIn select-none z-10 relative">
      {/* Title */}
      <div className="text-center mb-8">
        <span className="text-[11px] uppercase font-mono tracking-widest text-burnished-copper mb-2 block">
          {t.step2.tag}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-warm-ivory tracking-tight mb-3">
          {t.step2.title}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-dusty-mauve max-w-md mx-auto font-light">
          {t.step2.subtitle}
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. ge Selector */}
        <div className="luxury-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-burnished-copper" />
              <label className="text-sm font-medium text-warm-ivory">{t.step2.ageLabel}</label>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-serif text-4xl text-burnished-copper text-glow-copper">
                {age}
              </span>
              <span className="text-xs text-dusty-mauve font-mono">{t.step2.ageUnit}</span>
            </div>
          </div>

          <input
            type="range"
            min={18}
            max={80}
            value={age}
            onChange={(e) => onUpdate({ age: parseInt(e.target.value, 10) })}
            className="w-full"
          />

          <div className="flex justify-between text-[11px] text-dusty-mauve/70 mt-2 font-mono">
            <span>18</span>
            <span>35</span>
            <span>50</span>
            <span>65</span>
            <span>80</span>
          </div>
        </div>

        {/* 2. Gender Selection */}
        <div className="luxury-card p-6 rounded-2xl">
          <label className="text-xs font-mono uppercase tracking-wider text-dusty-mauve block mb-3">
            {t.step2.genderLabel}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: "male" as GenderType, label: t.step2.genderOptions.male },
              { id: "female" as GenderType, label: t.step2.genderOptions.female },
              { id: "non_binary" as GenderType, label: t.step2.genderOptions.non_binary },
              { id: "prefer_not_to_say" as GenderType, label: t.step2.genderOptions.prefer_not_to_say },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  sound.playChime(420, 0.08);
                  onUpdate({ gender: item.id });
                }}
                className={`min-h-[44px] py-3 px-2 rounded-xl text-xs font-medium transition-all text-center border ${
                  gender === item.id
                    ? "bg-burnished-copper/20 border-burnished-copper text-warm-ivory shadow-copper-glow"
                    : "bg-deep-aubergine/70 border-glass-border text-dusty-mauve hover:text-warm-ivory"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Location / City Selector */}
        <div className="luxury-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-burnished-copper" />
              <label className="text-xs font-mono uppercase tracking-wider text-dusty-mauve">
                {t.step2.cityLabel}
              </label>
            </div>
            {city && (
              <span className="text-xs font-mono text-burnished-copper px-2 py-0.5 rounded bg-burnished-copper/10">
                {city}
              </span>
            )}
          </div>

          <div className="relative mb-3">
            <input
              type="text"
              placeholder={t.step2.cityPlaceholder}
              value={citySearch || city}
              onChange={(e) => {
                setCitySearch(e.target.value);
                onUpdate({ city: e.target.value });
                setIsCityOpen(true);
              }}
              onFocus={() => setIsCityOpen(true)}
              className="w-full min-h-[44px] bg-deep-aubergine/90 border border-glass-border rounded-xl px-4 py-3 text-sm text-warm-ivory placeholder-dusty-mauve/40 focus:outline-none focus:border-burnished-copper transition-colors"
            />

            {isCityOpen && filteredCities.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto bg-deep-aubergine border border-glass-border rounded-xl shadow-luxury-glass z-30 py-1">
                {filteredCities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      onUpdate({ city: c });
                      setCitySearch("");
                      setIsCityOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-dusty-mauve hover:text-warm-ivory hover:bg-burnished-copper/15 transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick city pills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {["Mumbai", "Delhi NCR", "Bengaluru", "Chennai", "Coimbatore", "Hyderabad", "Madurai"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  onUpdate({ city: c });
                  setCitySearch("");
                  setIsCityOpen(false);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                  city === c
                    ? "bg-burnished-copper/20 border-burnished-copper text-burnished-copper"
                    : "bg-obsidian-plum/80 border-glass-border text-dusty-mauve hover:text-warm-ivory"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-start space-x-2 text-[11px] text-dusty-mauve/70 bg-deep-aubergine/40 p-2.5 rounded-lg border border-glass-border/40 font-light">
            <Info className="w-3.5 h-3.5 text-burnished-copper flex-shrink-0 mt-0.5" />
            <span>{t.step2.cityNote}</span>
          </div>
        </div>

        {/* Dynamic single conditional question */}
        {isSingle && (
          <div className="luxury-card p-6 rounded-2xl border-burnished-copper/30 animate-fadeIn">
            <span className="text-[10px] font-mono text-burnished-copper uppercase tracking-wider block mb-1">
              Adaptive Detail
            </span>
            <h4 className="text-sm font-medium text-warm-ivory mb-3">
              {t.step2.singleDependentsLabel}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "parents" as const, label: t.step2.singleDependentsOptions.parents },
                { id: "siblings" as const, label: t.step2.singleDependentsOptions.siblings },
                { id: "someone_else" as const, label: t.step2.singleDependentsOptions.someone_else },
                { id: "no_one" as const, label: t.step2.singleDependentsOptions.no_one },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    sound.playSoftPulse();
                    onUpdate({ singleDependents: item.id });
                  }}
                  className={`min-h-[44px] p-3 rounded-xl text-xs font-medium text-center border transition-all ${
                    singleDependents === item.id
                      ? "bg-burnished-copper text-obsidian-plum font-semibold border-burnished-copper shadow-copper-glow"
                      : "bg-deep-aubergine/70 border-glass-border text-dusty-mauve hover:text-warm-ivory"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Continue */}
      <div className="flex items-center justify-center mt-8">
        <button
          onClick={() => {
            sound.playChime(580, 0.12);
            onContinue();
          }}
          disabled={!isValid}
          className={`group inline-flex items-center space-x-3 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
            isValid
              ? "bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory shadow-copper-glow hover:scale-105"
              : "bg-deep-aubergine text-dusty-mauve/30 cursor-not-allowed border border-glass-border"
          }`}
        >
          <span>{t.step2.continue}</span>
          < ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};