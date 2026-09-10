"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserProtectionProfile,
  FamilyMember,
  HouseholdType,
  GenderType,
  IncomeRange,
  CurrentInsuranceType,
  CurrentCoverAmount,
  EmergencySavingsLevel,
  AppStage,
} from "@/types/questionnaire";

const STORAGE_KEY_SESSION = "aegis_user_protection_profile_session_v1";

const DEFAULT_PROFILE: UserProtectionProfile = {
  user: {
    age: 32,
    gender: null,
    city: "Mumbai",
    singleDependents: null,
  },
  household: {
    protectionType: null,
    familyMembers: [],
  },
  financial: {
    incomeRange: null,
    emergencySavings: null,
  },
  insurance: {
    status: null,
    existingCoverage: null,
  },
  concerns: [],
  journey: {
    currentStage: 1,
    currentStep: 0, // 0 = hero, 1..5, 6 = summary
    completedSteps: [],
    lastUpdated: new Date().toISOString(),
    version: "1.0.0",
  },
  consent: {
    dataUsageAccepted: false,
    timestamp: null,
    version: "2026-09-v1",
  },
};

interface ProtectionProfileContextType {
  profile: UserProtectionProfile;
  stage: AppStage;
  setStage: (stage: AppStage) => void;
  setUserDetails: (data: Partial<UserProtectionProfile["user"]>) => void;
  setHouseholdType: (type: HouseholdType) => void;
  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (member: FamilyMember) => void;
  removeFamilyMember: (id: string) => void;
  setFinancial: (data: Partial<UserProtectionProfile["financial"]>) => void;
  setInsurance: (data: Partial<UserProtectionProfile["insurance"]>) => void;
  toggleConcern: (concernId: string) => void;
  setConsent: (accepted: boolean) => void;
  goToStep: (stepNumber: number) => void;
  resetProfile: () => void;
  hasExistingSession: boolean;
  dismissResumePrompt: () => void;
  resumeSession: () => void;
}

const ProtectionProfileContext = createContext<ProtectionProfileContextType | null>(null);

export const ProtectionProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProtectionProfile>(DEFAULT_PROFILE);
  const [stage, setStage] = useState<AppStage>("hero");
  const [hasExistingSession, setHasExistingSession] = useState(false);
  const [pendingSavedProfile, setPendingSavedProfile] = useState<UserProtectionProfile | null>(null);

  // Map step number to AppStage
  const stepToStage = (step: number): AppStage => {
    switch (step) {
      case 1:
        return "step1";
      case 2:
        return "step2";
      case 3:
        return "step3";
      case 4:
        return "step4";
      case 5:
        return "step5";
      case 6:
        return "summary";
      default:
        return "hero";
    }
  };

  const stageToStep = (st: AppStage): number => {
    switch (st) {
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
      case "summary":
        return 6;
      default:
        return 0;
    }
  };

  // 1. Initial hydration from sessionStorage (temporary session persistence)
  useEffect(() => {
    try {
      // Clean up any legacy localStorage backup if present
      localStorage.removeItem("aegis_user_protection_profile_backup_v1");

      const sessionData = sessionStorage.getItem(STORAGE_KEY_SESSION);
      if (sessionData) {
        const parsed = JSON.parse(sessionData) as UserProtectionProfile;
        if (parsed && parsed.journey && parsed.journey.currentStep > 0) {
          // Found active session progress
          setPendingSavedProfile(parsed);
          setHasExistingSession(true);
        }
      }
    } catch (e) {
      console.warn("Session storage hydration error, using defaults", e);
    }
  }, []);

  // 2. Persist profile strictly to client-side sessionStorage for active tab session
  useEffect(() => {
    try {
      const updated = {
        ...profile,
        journey: {
          ...profile.journey,
          currentStep: stageToStep(stage),
          lastUpdated: new Date().toISOString(),
        },
      };

      sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(updated));
    } catch (e) {
      // Storage quota or privacy sandbox limit catch
    }
  }, [profile, stage]);

  const resumeSession = () => {
    if (pendingSavedProfile) {
      setProfile(pendingSavedProfile);
      setStage(stepToStage(pendingSavedProfile.journey.currentStep || 1));
    }
    setHasExistingSession(false);
  };

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE);
    setStage("hero");
    try {
      sessionStorage.removeItem(STORAGE_KEY_SESSION);
    } catch (e) {}
  };

  const dismissResumePrompt = () => {
    setHasExistingSession(false);
    setPendingSavedProfile(null);
    resetProfile();
  };

  const setUserDetails = (data: Partial<UserProtectionProfile["user"]>) => {
    setProfile((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        ...data,
      },
    }));
  };

  const setHouseholdType = (type: HouseholdType) => {
    setProfile((prev) => {
      let members: FamilyMember[] = [];

      if (type === "spouse") {
        members = [
          {
            id: `spouse_${Date.now()}`,
            relationship: "Spouse",
            age: Math.max(18, (prev.user.age || 32) - 2),
            gender: prev.user.gender === "male" ? "female" : "male",
            financiallyDependent: "yes",
            existingInsurance: "no",
          },
        ];
      } else if (type === "family") {
        members = [
          {
            id: `spouse_${Date.now()}`,
            relationship: "Spouse",
            age: Math.max(18, (prev.user.age || 32) - 2),
            gender: "female",
            financiallyDependent: "yes",
            existingInsurance: "no",
          },
          {
            id: `child_${Date.now() + 1}`,
            relationship: "Child",
            age: 6,
            gender: "male",
            financiallyDependent: "yes",
            existingInsurance: "no",
          },
        ];
      } else if (type === "parents") {
        members = [
          {
            id: `mother_${Date.now()}`,
            relationship: "Mother",
            age: 61,
            gender: "female",
            financiallyDependent: "yes",
            existingInsurance: "no",
          },
          {
            id: `father_${Date.now() + 1}`,
            relationship: "Father",
            age: 65,
            gender: "male",
            financiallyDependent: "yes",
            existingInsurance: "no",
          },
        ];
      } else if (type === "whole_family") {
        members = [
          {
            id: `spouse_${Date.now()}`,
            relationship: "Spouse",
            age: Math.max(18, (prev.user.age || 32) - 2),
            gender: "female",
            financiallyDependent: "yes",
            existingInsurance: "no",
          },
          {
            id: `child_${Date.now() + 1}`,
            relationship: "Child",
            age: 6,
            gender: "male",
            financiallyDependent: "yes",
            existingInsurance: "no",
          },
          {
            id: `mother_${Date.now() + 2}`,
            relationship: "Mother",
            age: 61,
            gender: "female",
            financiallyDependent: "yes",
            existingInsurance: "no",
          },
          {
            id: `father_${Date.now() + 3}`,
            relationship: "Father",
            age: 65,
            gender: "male",
            financiallyDependent: "yes",
            existingInsurance: "no",
          },
        ];
      }

      return {
        ...prev,
        household: {
          protectionType: type,
          familyMembers: members,
        },
      };
    });
  };

  const addFamilyMember = (member: FamilyMember) => {
    setProfile((prev) => ({
      ...prev,
      household: {
        ...prev.household,
        familyMembers: [...prev.household.familyMembers, member],
      },
    }));
  };

  const updateFamilyMember = (updated: FamilyMember) => {
    setProfile((prev) => ({
      ...prev,
      household: {
        ...prev.household,
        familyMembers: prev.household.familyMembers.map((m) =>
          m.id === updated.id ? updated : m
        ),
      },
    }));
  };

  const removeFamilyMember = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      household: {
        ...prev.household,
        familyMembers: prev.household.familyMembers.filter((m) => m.id !== id),
      },
    }));
  };

  const setFinancial = (data: Partial<UserProtectionProfile["financial"]>) => {
    setProfile((prev) => ({
      ...prev,
      financial: {
        ...prev.financial,
        ...data,
      },
    }));
  };

  const setInsurance = (data: Partial<UserProtectionProfile["insurance"]>) => {
    setProfile((prev) => ({
      ...prev,
      insurance: {
        ...prev.insurance,
        ...data,
      },
    }));
  };

  const toggleConcern = (concernId: string) => {
    setProfile((prev) => {
      const exists = prev.concerns.includes(concernId);
      return {
        ...prev,
        concerns: exists
          ? prev.concerns.filter((c) => c !== concernId)
          : [...prev.concerns, concernId],
      };
    });
  };

  const setConsent = (accepted: boolean) => {
    setProfile((prev) => ({
      ...prev,
      consent: {
        dataUsageAccepted: accepted,
        timestamp: accepted ? new Date().toISOString() : null,
        version: "2026-09-v1",
      },
    }));
  };

  const goToStep = (stepNumber: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStage(stepToStage(stepNumber));
  };

  return (
    <ProtectionProfileContext.Provider
      value={{
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
      }}
    >
      {children}
    </ProtectionProfileContext.Provider>
  );
};

export const useProtectionProfile = () => {
  const context = useContext(ProtectionProfileContext);
  if (!context) {
    throw new Error("useProtectionProfile must be used within ProtectionProfileProvider");
  }
  return context;
};