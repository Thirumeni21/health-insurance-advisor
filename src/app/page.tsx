"use client";

import React, { useState } from "react";
import { useProtectionProfile } from "@/context/ProtectionProfileContext";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ProtectionProfileProvider } from "@/context/ProtectionProfileContext";

// Components
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { HeroSection } from "@/components/HeroSection";
import { LanguageSelectionScreen } from "@/components/LanguageSelectionScreen";
import { Question1Household } from "@/components/Question1Household";
import { Question2UserBasic } from "@/components/Question2UserBasic";
import { Question3FamilyCircle } from "@/components/Question3FamilyCircle";
import { Question4Financial } from "@/components/Question4Financial";
import { Question5Concerns } from "@/components/Question5Concerns";
import { SummaryScreen } from "@/components/SummaryScreen";
import { Stage2Experience } from "@/components/stage2/Stage2Experience";
import { Stage3Experience } from "@/components/stage3/Stage3Experience";
import { ProtectionSpace3D } from "@/components/ProtectionSpace3D";
import { CustomCursor } from "@/components/CustomCursor";
import { ResumeSessionModal } from "@/components/ResumeSessionModal";
import { sound } from "@/lib/soundFx";

function ProtectionAppContent() {
  const {
    profile,
    stage,
    setStage,
    setUserDetails,
    setHouseholdType,
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
    setFinancial,
    setInsurance,
    toggleConcern,
    setConsent,
    goToStep,
    resetProfile,
    hasExistingSession,
    dismissResumePrompt,
    resumeSession,
  } = useProtectionProfile();

  const { isLanguageSelected, t } = useLanguage();

  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedConcernTrigger, setSelectedConcernTrigger] = useState<string | null>(null);

  const getStepNumber = () => {
    switch (stage) {
      case "step1":
        return 1;
      case "step2":
        return 2;
      case "step3":
        return 3;
      case "step4":
        return 4;
      case "step5":
        return 5;
      default:
        return 0;
    }
  };

  const getStepCategory = () => {
    switch (stage) {
      case "step1":
        return t.progress.steps.step1;
      case "step2":
        return t.progress.steps.step2;
      case "step3":
        return t.progress.steps.step3;
      case "step4":
        return t.progress.steps.step4;
      case "step5":
        return t.progress.steps.step5;
      default:
        return t.progress.step;
    }
  };

  const handleBack = () => {
    sound.playChime(380, 0.1);
    window.scrollTo({ top: 0, behavior: "smooth" });
    switch (stage) {
      case "step1":
        setStage("hero");
        break;
      case "step2":
        setStage("step1");
        break;
      case "step3":
        setStage("step2");
        break;
      case "step4":
        setStage("step3");
        break;
      case "step5":
        setStage("step4");
        break;
      case "summary":
        setStage("step5");
        break;
      case "stage2":
        setStage("summary");
        break;
      case "stage3":
        setStage("stage2");
        break;
      default:
        setStage("hero");
        break;
    }
  };

  const handleReset = () => {
    if (window.confirm(t.nav.resetConfirm)) {
      sound.playChime(320, 0.15);
      resetProfile();
    }
  };

  const handleProceedToStage2 = () => {
    sound.playChime(760, 0.2);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStage("stage2");
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-obsidian-plum text-warm-ivory overflow-x-hidden">
      {/* Custom Desktop Cursor */}
      <CustomCursor />

      {/* Stage 1 3D Constellation (rendered when in Stage 1) */}
      {stage !== "stage2" && stage !== "stage3" && (
        <ProtectionSpace3D
          stage={stage}
          familyMembers={profile.household.familyMembers}
          userAge={profile.user.age || 32}
          selectedConcernTrigger={selectedConcernTrigger}
          reducedMotion={reducedMotion}
        />
      )}

      {/* Resume Session Recovery Prompt */}
      <ResumeSessionModal
        isOpen={hasExistingSession}
        stepNumber={profile.journey.currentStep}
        onResume={resumeSession}
        onDismiss={dismissResumePrompt}
      />

      {/* Header */}
      <Navbar
        stage={stage}
        onReset={handleReset}
        currentStep={getStepNumber()}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
      />

      {/* Main Experience Body */}
      <main className="relative z-10 flex-1 flex flex-col justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-full">
        {/* Step Progress Line */}
        {isLanguageSelected && stage !== "hero" && stage !== "summary" && stage !== "stage2" && stage !== "stage3" && (
          <ProgressIndicator
            currentStep={getStepNumber()}
            totalSteps={5}
            stepCategory={getStepCategory()}
            onBack={handleBack}
          />
        )}

        {/* Language Selection Screen */}
        {!isLanguageSelected && stage === "hero" && (
          <LanguageSelectionScreen />
        )}

        {/* Hero Section */}
        {isLanguageSelected && stage === "hero" && (
          <HeroSection
            onStart={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setStage("step1");
            }}
          />
        )}

        {/* Step 1 */}
        {stage === "step1" && (
          <Question1Household
            selectedType={profile.household.protectionType}
            onSelect={(type) => setHouseholdType(type)}
            onContinue={() => {
              sound.playChime(580, 0.12);
              window.scrollTo({ top: 0, behavior: "smooth" });
              setStage("step2");
            }}
          />
        )}

        {/* Step 2 */}
        {stage === "step2" && (
          <Question2UserBasic
            householdType={profile.household.protectionType}
            age={profile.user.age || 32}
            gender={profile.user.gender}
            city={profile.user.city || "Mumbai"}
            singleDependents={profile.user.singleDependents}
            onUpdate={(data) => setUserDetails(data)}
            onContinue={() => {
              sound.playChime(580, 0.12);
              window.scrollTo({ top: 0, behavior: "smooth" });
              setStage("step3");
            }}
          />
        )}

        {/* Step 3 */}
        {stage === "step3" && (
          <Question3FamilyCircle
            householdType={profile.household.protectionType}
            userAge={profile.user.age || 32}
            familyMembers={profile.household.familyMembers}
            onAddMember={addFamilyMember}
            onUpdateMember={updateFamilyMember}
            onRemoveMember={removeFamilyMember}
            onContinue={() => {
              sound.playChime(580, 0.12);
              window.scrollTo({ top: 0, behavior: "smooth" });
              setStage("step4");
            }}
          />
        )}

        {/* Step 4 */}
        {stage === "step4" && (
          <Question4Financial
            householdIncome={profile.financial.incomeRange}
            currentInsurance={profile.insurance.status}
            currentCover={profile.insurance.existingCoverage}
            emergencySavings={profile.financial.emergencySavings}
            onUpdate={(data) => {
              if (data.householdIncome || data.emergencySavings) {
                setFinancial({
                  incomeRange: data.householdIncome ?? profile.financial.incomeRange,
                  emergencySavings: data.emergencySavings ?? profile.financial.emergencySavings,
                });
              }
              if (data.currentInsurance || data.currentCover) {
                setInsurance({
                  status: data.currentInsurance ?? profile.insurance.status,
                  existingCoverage: data.currentCover ?? profile.insurance.existingCoverage,
                });
              }
            }}
            onContinue={() => {
              sound.playChime(580, 0.12);
              window.scrollTo({ top: 0, behavior: "smooth" });
              setStage("step5");
            }}
          />
        )}

        {/* Step 5 */}
        {stage === "step5" && (
          <Question5Concerns
            selectedConcerns={profile.concerns}
            onToggleConcern={(id) => {
              setSelectedConcernTrigger(id);
              toggleConcern(id);
            }}
            onContinue={() => {
              sound.playChime(720, 0.2);
              window.scrollTo({ top: 0, behavior: "smooth" });
              setStage("summary");
            }}
          />
        )}

        {/* Summary Screen */}
        {stage === "summary" && (
          <SummaryScreen
            profile={profile}
            onEditSection={goToStep}
            onConsentChange={setConsent}
            onProceedToScenario={handleProceedToStage2}
          />
        )}

        {/* STAGE 2: “WHAT IF?” MEDICAL EMERGENCY EXPERIENCE */}
        {stage === "stage2" && (
          <Stage2Experience
            profile={profile}
            reducedMotion={reducedMotion}
            onRestart={handleReset}
            onProceedToStage3={() => {
              sound.playChime(760, 0.2);
              window.scrollTo({ top: 0, behavior: "smooth" });
              setStage("stage3");
            }}
          />
        )}

        {/* STAGE 3: HOW HEALTH INSURANCE ACTUALLY HELPS YOU */}
        {stage === "stage3" && (
          <Stage3Experience
            profile={profile}
            reducedMotion={reducedMotion}
            onRestart={handleReset}
            onBackToStage2={() => {
              sound.playChime(380, 0.1);
              window.scrollTo({ top: 0, behavior: "smooth" });
              setStage("stage2");
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <LanguageProvider>
      <ProtectionProfileProvider>
        <ProtectionAppContent />
      </ProtectionProfileProvider>
    </LanguageProvider>
  );
}
