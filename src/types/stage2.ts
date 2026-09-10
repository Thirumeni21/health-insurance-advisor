import { UserProtectionProfile } from "./questionnaire";

export type ScenarioId =
  | "scenario_01_accident"
  | "scenario_02_hospitalization"
  | "scenario_03_specialist"
  | "scenario_04_parent"
  | "scenario_05_child"
  | "scenario_06_savings"
  | "scenario_07_coverage";

export type ScenarioChoiceId =
  | "savings"
  | "insurance"
  | "borrow"
  | "loan"
  | "combination"
  | "not_sure";

export type InsuranceConceptId =
  | "premium"
  | "sum_insured"
  | "waiting_period"
  | "deductible"
  | "copayment"
  | "cashless";

export type CurrentCoverUnderstanding =
  | "clearly"
  | "somewhat"
  | "not_really"
  | "no_insurance"
  | "not_sure";

export type Stage2Step =
  | "scenario"
  | "insurance_concepts"
  | "current_cover_question"
  | "final_reflection";

export type CharacterType = "self" | "spouse" | "child" | "parent" | "dependent";

export interface LocalizedString {
  en: string;
  ta: string;
}

export interface TargetPerson {
  characterType: CharacterType;
  familyMemberId?: string; // id from profile.household.familyMembers or 'self'
  relationship: string;    // 'Self', 'Spouse', 'Child', 'Mother', 'Father', etc.
  name: string;
  age: number;
  gender: string;
  isSelfOnly: boolean;
}

export interface HospitalJourneyStep {
  stepNumber: string;
  title: LocalizedString;
  desc: LocalizedString;
}

export interface CostBreakdownItem {
  key: string;
  amount: number;
  label: LocalizedString;
}

export interface CumulativeMonthItem {
  monthLabel: LocalizedString;
  monthAmount: number;
  cumulativeTotal: number;
}

export interface PersonalizedScenario {
  id: ScenarioId;
  scenarioType:
    | "accident"
    | "hospitalization"
    | "specialist"
    | "parent"
    | "child"
    | "savings"
    | "coverage";
  title: LocalizedString;
  emotionalTheme: LocalizedString;
  targetPerson: TargetPerson;
  adaptationNotice?: LocalizedString;
  act1_normal: {
    headline: LocalizedString;
    story: LocalizedString;
  };
  act2_interruption: {
    headline: LocalizedString;
    story: LocalizedString;
  };
  act3_hospital: {
    steps: HospitalJourneyStep[];
  };
  act4_bill: {
    totalAmount: number;
    breakdown: CostBreakdownItem[];
    cumulativeTimeline?: CumulativeMonthItem[];
  };
  act5_personal_context: {
    savingsNote: LocalizedString;
    insuranceNote: LocalizedString;
  };
  act6_decision: {
    question: LocalizedString;
    sub: LocalizedString;
  };
  act7_realization: {
    headline: LocalizedString;
    quote: LocalizedString;
    sub: LocalizedString;
  };
  environment3D: "accident" | "hospital" | "specialist" | "timeline" | "parents" | "savings" | "self" | "child";
}

export interface Stage2ExperienceState {
  currentStep: Stage2Step;
  currentActIndex: number; // 0 to 6 (Act 1 to Act 7)
  selectedChoice: ScenarioChoiceId | null;
  activeConceptId: InsuranceConceptId | null;
  coverUnderstanding: CurrentCoverUnderstanding | null;
  selectedInquiryOption: string | null;
}
