"use client";

import React, { useState, useMemo } from "react";
import { UserProtectionProfile } from "@/types/questionnaire";
import { selectPersonalizedScenario } from "@/lib/scenarioEngine";
import { Chapter1Mechanism } from "./Chapter1Mechanism";
import { Chapter2Boundaries } from "./Chapter2Boundaries";
import { Chapter3Claims } from "./Chapter3Claims";
import { Chapter4Household } from "./Chapter4Household";
import { Chapter5Blueprint } from "./Chapter5Blueprint";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface Stage3ExperienceProps {
  profile: UserProtectionProfile;
  reducedMotion: boolean;
  onRestart: () => void;
  onBackToStage2?: () => void;
}

export const Stage3Experience: React.FC<Stage3ExperienceProps> = ({
  profile,
  reducedMotion,
  onRestart,
  onBackToStage2,
}) => {
  const { language, t } = useLanguage();
  const lang = language === "ta" ? "ta" : "en";
  const scenario = useMemo(() => selectPersonalizedScenario(profile), [profile]);

  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0); // 0 to 4

  const chapterNames = t.stage3.nav.chapters;

  const handleNextChapter = () => {
    sound.playChime(520, 0.12);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (currentChapterIndex < 4) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const handlePrevChapter = () => {
    sound.playChime(380, 0.1);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    } else if (onBackToStage2) {
      onBackToStage2();
    }
  };

  return (
    <div className="relative w-full min-h-[85vh] flex flex-col justify-center select-none py-4">

      {/* Top Persistent Chapter Stepper Navigation */}
      <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-2 z-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-hairline pb-3">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-lavender-600 animate-pulse" />
            <span className="font-mono text-xs text-ink uppercase tracking-wider font-semibold">
              {t.stage3.nav.stageTag}
            </span>
            <span className="text-muted">·</span>
            <span className="text-xs text-ink-soft font-mono">
              {t.stage3.nav.chapterOf} 0{currentChapterIndex + 1} / 05: {chapterNames[currentChapterIndex]}
            </span>
          </div>

          {/* Chapter Navigation Pills */}
          <div className="flex items-center space-x-1.5 self-start sm:self-auto pt-1 sm:pt-0">
            {[0, 1, 2, 3, 4].map((idx) => {
              const isCurrent = idx === currentChapterIndex;
              const isPast = idx < currentChapterIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sound.playSoftPulse();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setCurrentChapterIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? "w-8 bg-ink"
                      : isPast
                      ? "w-3.5 bg-lavender-300 hover:bg-lavender-600"
                      : "w-2 bg-hairline hover:bg-muted"
                  }`}
                  title={`${t.stage3.nav.chapterOf} ${idx + 1}: ${chapterNames[idx]}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Chapter 1: The Mechanism & Money Flow */}
      {currentChapterIndex === 0 && (
        <Chapter1Mechanism
          scenario={scenario}
          profile={profile}
          onNextChapter={handleNextChapter}
          onBackToScenario={onBackToStage2}
        />
      )}

      {/* Chapter 2: Boundaries, Limits & Expenses */}
      {currentChapterIndex === 1 && (
        <Chapter2Boundaries
          onNextChapter={handleNextChapter}
          onPrevChapter={handlePrevChapter}
        />
      )}

      {/* Chapter 3: The Claim Reality & Network */}
      {currentChapterIndex === 2 && (
        <Chapter3Claims
          onNextChapter={handleNextChapter}
          onPrevChapter={handlePrevChapter}
        />
      )}

      {/* Chapter 4: Household & Structure */}
      {currentChapterIndex === 3 && (
        <Chapter4Household
          profile={profile}
          onNextChapter={handleNextChapter}
          onPrevChapter={handlePrevChapter}
        />
      )}

      {/* Chapter 5: Blueprint, Knowledge Check & Next Steps */}
      {currentChapterIndex === 4 && (
        <Chapter5Blueprint
          scenario={scenario}
          profile={profile}
          onPrevChapter={handlePrevChapter}
          onRestartExperience={onRestart}
        />
      )}
    </div>
  );
};
