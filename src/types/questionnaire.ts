import { Stage2ExperienceState } from "./stage2";

export type HouseholdType = 
  | "myself"
  | "spouse"
  | "family"
  | "parents"
  | "whole_family"
  | "other";

export type GenderType = "male" | "female" | "non_binary" | "prefer_not_to_say";

export type DependencyType = "yes" | "no" | "partially";
export type InsuranceStatusType = "yes" | "no" | "not_sure";

export type FamilyRelationship = 
  | "Spouse"
  | "Child"
  | "Mother"
  | "Father"
  | "Sibling"
  | "Grandparent"
  | "Other Dependent";

export interface FamilyMember {
  id: string;
  relationship: FamilyRelationship;
  name?: string;
  age: number;
  gender: GenderType;
  financiallyDependent: DependencyType;
  existingInsurance: InsuranceStatusType;
}

export type IncomeRange = 
  | "below_3L"
  | "3_5L"
  | "5_10L"
  | "10_20L"
  | "above_20L"
  | "prefer_not_to_say";

export type CurrentInsuranceType = 
  | "none"
  | "employer"
  | "personal"
  | "both"
  | "not_sure";

export type CurrentCoverAmount = 
  | "0"
  | "1_3L"
  | "3_5L"
  | "5_10L"
  | "10_25L"
  | "above_25L"
  | "not_sure";

export type EmergencySavingsLevel = 
  | "comfortable"
  | "some"
  | "limited"
  | "prefer_not_to_say";

export interface UserProtectionProfile {
  user: {
    age: number | null;
    gender: GenderType | null;
    city: string | null;
    singleDependents?: "parents" | "siblings" | "someone_else" | "no_one" | null;
  };

  household: {
    protectionType: HouseholdType | null;
    familyMembers: FamilyMember[];
  };

  financial: {
    incomeRange: IncomeRange | null;
    emergencySavings: EmergencySavingsLevel | null;
  };

  insurance: {
    status: CurrentInsuranceType | null;
    existingCoverage: CurrentCoverAmount | null;
  };

  concerns: string[];

  journey: {
    currentStage: number; // 1 or 2
    currentStep: number; // 0: hero, 1..5: step1..5, 6: summary, 7: stage2
    completedSteps: number[];
    lastUpdated: string;
    version: string;
  };

  consent: {
    dataUsageAccepted: boolean;
    timestamp: string | null;
    version: string;
  };

  stage2?: Stage2ExperienceState;
}

export type AppStage = 
  | "hero" 
  | "step1" 
  | "step2" 
  | "step3" 
  | "step4" 
  | "step5" 
  | "summary"
  | "stage2"
  | "stage3";