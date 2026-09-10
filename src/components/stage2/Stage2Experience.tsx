"use client";

import React, { useState, useMemo } from "react";
import { UserProtectionProfile } from "@/types/questionnaire";
import {
  Stage2Step,
  ScenarioChoiceId,
  InsuranceConceptId,
  CurrentCoverUnderstanding,
} from "@/types/stage2";
import { selectPersonalizedScenario } from "@/lib/scenarioEngine";
import { Stage2Space3D } from "./Stage2Space3D";
import { ScenarioPlayer } from "./ScenarioPlayer";
import { InsuranceConceptsInteractive } from "./InsuranceConceptsInteractive";
import { CurrentCoverQuestion } from "./CurrentCoverQuestion";
import { PersonalizedInquiry } from "./PersonalizedInquiry";

interface Stage2ExperienceProps {
  profile: UserProtectionProfile;
  reducedMotion: boolean;
  onRestart: () => void;
  onProceedToStage3?: () => void;
}

export const Stage2Experience: React.FC<Stage2ExperienceProps> = ({
  profile,
  reducedMotion,
  onRestart,
  onProceedToStage3,
}) => {
  // Deterministic 1-scenario selection from the library scenarios
  const scenario = useMemo(() => selectPersonalizedScenario(profile), [profile]);

  const [currentStep, setCurrentStep] = useState<Stage2Step>("scenario");
  const [currentActIndex, setCurrentActIndex] = useState<number>(0); // 0 to 6 (Act 1 to 7)
  const [selectedChoice, setSelectedChoice] = useState<ScenarioChoiceId | null>(null);
  const [activeConceptId, setActiveConceptId] = useState<InsuranceConceptId | null>("premium");
  const [coverUnderstanding, setCoverUnderstanding] = useState<CurrentCoverUnderstanding | null>(null);
  const [selectedInquiryOption, setSelectedInquiryOption] = useState<string | null>(null);

  const handleFinishScenario = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep("insurance_concepts");
  };

  const handleProceedToCoverQuestion = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep("current_cover_question");
  };

  const handleProceedToFinalReflection = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep("final_reflection");
  };

  return (
    <div className="relative w-full min-h-[85vh] flex flex-col justify-center select-none">
      {/* 3D Stage 2 Cinematic Space Canvas */}
      <Stage2Space3D
        currentStep={currentStep}
        currentActIndex={currentActIndex}
        scenario={scenario}
        familyMembers={profile.household.familyMembers}
        userAge={profile.user.age || 32}
        activeConceptId={activeConceptId}
        reducedMotion={reducedMotion}
      />

      {/* Step 1: Single Personalized Scenario (7 Acts) */}
      {currentStep === "scenario" && (
        <ScenarioPlayer
          scenario={scenario}
          currentActIndex={currentActIndex}
          onSetActIndex={setCurrentActIndex}
          onFinishScenario={handleFinishScenario}
          profile={profile}
          selectedChoice={selectedChoice}
          onSelectChoice={setSelectedChoice}
        />
      )}

      {/* Step 2: Interactive 3D Insurance Concepts */}
      {currentStep === "insurance_concepts" && (
        <InsuranceConceptsInteractive
          onProceedToCoverQuestion={handleProceedToCoverQuestion}
          activeConceptId={activeConceptId}
          onSelectConcept={setActiveConceptId}
        />
      )}

      {/* Step 3: Current Cover Understanding Self-Assessment */}
      {currentStep === "current_cover_question" && (
        <CurrentCoverQuestion
          selectedOption={coverUnderstanding}
          onSelectOption={setCoverUnderstanding}
          onProceedToFinalReflection={handleProceedToFinalReflection}
        />
      )}

      {/* Step 4: Final Personalized Reflection & Blueprint */}
      {currentStep === "final_reflection" && (
        <PersonalizedInquiry
          profile={profile}
          selectedOption={selectedInquiryOption}
          onSelectOption={setSelectedInquiryOption}
          onRestartExperience={onRestart}
          onProceedToStage3={onProceedToStage3}
        />
      )}
    </div>
  );
};
