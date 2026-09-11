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
        <div className="mb-2 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-bg-soft border border-hairline">
          <span className="w-1.5 h-1.5 rounded-full bg-lavender-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            {t.step2.tag}
          </span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-ink tracking-tight mb-2.5 sm:mb-3">
          {t.step2.title}
        </h1>
        <p className="font-sans text-xs sm:text-sm md:text-base text-ink-soft max-w-md mx-auto font-normal">
          {t.step2.subtitle}
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Age Selector */}
        <div className="bg-white border border-hairline rounded-[20px] p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2.5">
              <User className="w-4 h-4 text-lavender-600" />
              <label className="text-sm font-semibold text-ink">{t.step2.ageLabel}</label>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-display font-bold text-4xl text-ink">
                {age}
              </span>
              <span className="text-xs text-muted font-medium">{t.step2.ageUnit}</span>
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

          <div className="flex justify-between text-xs text-muted mt-2 font-mono">
            <span>18</span>
            <span>35</span>
            <span>50</span>
            <span>65</span>
            <span>80</span>
          </div>
        </div>

        {/* 2. Gender Selection */}
        <div className="bg-white border border-hairline rounded-[20px] p-6 shadow-subtle">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-3">
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
                className={`min-h-[44px] py-3 px-2 rounded-[12px] text-xs font-medium transition-all text-center border ${
                  gender === item.id
                    ? "bg-lavender-100 border-lavender-300 text-ink font-semibold shadow-xs"
                    : "bg-white border-hairline text-ink-soft hover:bg-bg-soft hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Location / City Selector */}
        <div className="bg-white border border-hairline rounded-[20px] p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-lavender-600" />
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                {t.step2.cityLabel}
              </label>
            </div>
            {city && (
              <span className="text-xs font-medium text-ink px-2.5 py-0.5 rounded-full bg-lavender-100 border border-lavender-300">
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
              className="w-full min-h-[44px] bg-white border border-hairline rounded-[14px] px-4 py-3 text-sm text-ink placeholder-muted focus:outline-none focus:border-lavender-600 transition-colors"
            />

            {isCityOpen && filteredCities.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto bg-white border border-hairline rounded-[14px] shadow-elevated z-30 py-1">
                {filteredCities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      onUpdate({ city: c });
                      setCitySearch("");
                      setIsCityOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-ink-soft hover:text-ink hover:bg-lavender-100 transition-colors"
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
                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                  city === c
                    ? "bg-lavender-100 border-lavender-300 text-ink font-semibold"
                    : "bg-bg-soft border-hairline text-ink-soft hover:text-ink hover:bg-lavender-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-start space-x-2 text-xs text-ink-soft bg-bg-soft p-3 rounded-[12px] border border-hairline font-normal">
            <Info className="w-3.5 h-3.5 text-lavender-600 flex-shrink-0 mt-0.5" />
            <span>{t.step2.cityNote}</span>
          </div>
        </div>

        {/* Dynamic single conditional question */}
        {isSingle && (
          <div className="bg-white border border-hairline rounded-[20px] p-6 shadow-subtle animate-fadeIn">
            <span className="text-xs font-semibold text-lavender-600 uppercase tracking-wider block mb-1">
              Adaptive Detail
            </span>
            <h4 className="text-sm font-semibold text-ink mb-3">
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
                  className={`min-h-[44px] p-3 rounded-[12px] text-xs font-medium text-center border transition-all ${
                    singleDependents === item.id
                      ? "bg-lavender-100 border-lavender-300 text-ink font-semibold shadow-xs"
                      : "bg-white border-hairline text-ink-soft hover:bg-bg-soft hover:text-ink"
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
          className={`group inline-flex items-center justify-center space-x-3 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 min-h-[48px] w-full sm:w-auto ${
            isValid
              ? "bg-ink hover:bg-[#2e283b] text-white shadow-subtle hover:shadow-elevated hover:scale-105"
              : "bg-bg-soft text-muted cursor-not-allowed border border-hairline"
          }`}
        >
          <span>{t.step2.continue}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};