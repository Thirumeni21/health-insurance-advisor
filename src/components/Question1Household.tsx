"use client";

import React from "react";
import { ArrowRight, Check } from "lucide-react";
import { HouseholdType } from "@/types/questionnaire";
import { HOUSEHOLD_OPTIONS } from "@/data/constants";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";
import { useProtectionProfile } from "@/context/ProtectionProfileContext";
import { getCharacterForUser, getCharacterForMember } from "@/lib/characterEngine";
import { CharacterGuideBubble } from "./character/CharacterGuideBubble";
import { FamilyCharacter } from "./character/FamilyCharacter";

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
  const { profile } = useProtectionProfile();
  const userChar = getCharacterForUser(profile.user);

  const spouseChar = getCharacterForMember({
    id: "preview_spouse",
    relationship: "Spouse",
    age: 30,
    gender: profile.user.gender === "female" ? "male" : "female",
  });
  const childChar = getCharacterForMember({
    id: "preview_child",
    relationship: "Child",
    age: 7,
    gender: "female",
  });
  const fatherChar = getCharacterForMember({
    id: "preview_father",
    relationship: "Father",
    age: 62,
    gender: "male",
  });
  const motherChar = getCharacterForMember({
    id: "preview_mother",
    relationship: "Mother",
    age: 58,
    gender: "female",
  });
  const otherChar = getCharacterForMember({
    id: "preview_other",
    relationship: "Other Dependent",
    age: 22,
    gender: "female",
  });

  const renderHouseholdCharacters = (optionId: HouseholdType) => {
    switch (optionId) {
      case "myself":
        return (
          <div className="flex items-center group-hover:scale-105 transition-transform">
            <FamilyCharacter config={userChar} variant="avatar" size="sm" />
          </div>
        );
      case "spouse":
        return (
          <div className="flex items-center -space-x-2 group-hover:scale-105 transition-transform">
            <FamilyCharacter config={userChar} variant="avatar" size="sm" />
            <FamilyCharacter config={spouseChar} variant="avatar" size="sm" />
          </div>
        );
      case "family":
        return (
          <div className="flex items-center -space-x-2 group-hover:scale-105 transition-transform">
            <FamilyCharacter config={userChar} variant="avatar" size="sm" />
            <FamilyCharacter config={spouseChar} variant="avatar" size="sm" />
            <FamilyCharacter config={childChar} variant="avatar" size="sm" />
          </div>
        );
      case "parents":
        return (
          <div className="flex items-center -space-x-2 group-hover:scale-105 transition-transform">
            <FamilyCharacter config={fatherChar} variant="avatar" size="sm" />
            <FamilyCharacter config={motherChar} variant="avatar" size="sm" />
          </div>
        );
      case "whole_family":
        return (
          <div className="flex items-center -space-x-2 group-hover:scale-105 transition-transform">
            <FamilyCharacter config={userChar} variant="avatar" size="sm" />
            <FamilyCharacter config={spouseChar} variant="avatar" size="sm" />
            <FamilyCharacter config={childChar} variant="avatar" size="sm" />
            <FamilyCharacter config={fatherChar} variant="avatar" size="sm" />
            <FamilyCharacter config={motherChar} variant="avatar" size="sm" />
          </div>
        );
      case "other":
      default:
        return (
          <div className="flex items-center -space-x-2 group-hover:scale-105 transition-transform">
            <FamilyCharacter config={userChar} variant="avatar" size="sm" />
            <FamilyCharacter config={otherChar} variant="avatar" size="sm" />
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fadeIn select-none z-10 relative">
      {/* Title */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="mb-2 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-bg-soft border border-hairline">
          <span className="w-1.5 h-1.5 rounded-full bg-lavender-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            {t.step1.tag}
          </span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-ink tracking-tight mb-2.5 sm:mb-3">
          {t.step1.title}
        </h1>
        <p className="font-sans text-xs sm:text-sm md:text-base text-ink-soft max-w-md mx-auto font-normal">
          {t.step1.subtitle}
        </p>
      </div>

      {/* Persistent Character Guide Bubble */}
      <div className="mb-6 max-w-xl mx-auto">
        <CharacterGuideBubble
          character={userChar}
          layout="compact"
          badge={t.step1.tag}
        >
          {t.step1.subtitle}
        </CharacterGuideBubble>
      </div>

      {/* 6 Minimal Editorial Cards */}
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
              className={`group relative p-6 rounded-[20px] cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-full ${
                isSelected
                  ? "bg-lavender-100 border border-lavender-300 shadow-subtle"
                  : "bg-white hover:bg-bg-soft border border-hairline hover:border-lavender-300 shadow-subtle hover:shadow-elevated"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  {renderHouseholdCharacters(option.id)}
                </div>

                <div className="flex items-center space-x-2">
                  {"badge" in translated && translated.badge && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white text-ink border border-hairline">
                      {translated.badge}
                    </span>
                  )}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-ink text-white"
                        : "border border-hairline opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>

              <h3 className="font-display font-bold text-xl text-ink mb-1.5 group-hover:text-lavender-600 transition-colors">
                {translated.title}
              </h3>
              <p className="text-xs text-ink-soft leading-relaxed font-normal">
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
          className={`group inline-flex items-center justify-center space-x-3 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 min-h-[48px] w-full sm:w-auto ${
            selectedType
              ? "bg-ink hover:bg-[#2e283b] text-white shadow-subtle hover:shadow-elevated hover:scale-105"
              : "bg-bg-soft text-muted cursor-not-allowed border border-hairline"
          }`}
        >
          <span>{t.step1.continue}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};