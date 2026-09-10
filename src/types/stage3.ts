import { UserProtectionProfile } from "./questionnaire";
import { PersonalizedScenario, LocalizedString } from "./stage2";

export type Stage3ChapterId =
  | "mechanism"
  | "boundaries"
  | "claims"
  | "household"
  | "blueprint";

export interface ExpenseSorterItem {
  id: string;
  category: "covered" | "not_covered";
  title: LocalizedString;
  explanation: LocalizedString;
}

export interface KnowledgeCheckQuestion {
  id: string;
  statement: LocalizedString;
  correctAnswer: boolean | "not_necessarily";
  userOptions: Array<{
    value: boolean | "not_necessarily";
    label: LocalizedString;
  }>;
  explanation: LocalizedString;
}

export interface PersonalizedChecklistItem {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  tag: LocalizedString;
}

export interface PolicyClauseItem {
  id: string;
  title: LocalizedString;
  badge: LocalizedString;
  plainMeaning: LocalizedString;
  whatToLookFor: LocalizedString;
}

export interface Stage3State {
  currentChapterIndex: number; // 0 to 4
  // Chapter 1
  selectedCoverageCapacity: number; // e.g. 1000000
  // Chapter 2
  roomSelection: "standard" | "deluxe";
  deductibleAmount: number; // e.g. 50000
  copayPercentage: number; // e.g. 20
  sortedItems: Record<string, "covered" | "not_covered">;
  // Chapter 3
  selectedClaimRoute: "cashless" | "reimbursement";
  activeTimelineStep: number;
  // Chapter 4
  householdComparisonTab: "floater" | "individual";
  // Chapter 5
  activePolicyClause: string;
  knowledgeCheckAnswers: Record<string, boolean | "not_necessarily">;
  checkedAuditItems: Record<string, boolean>;
}
