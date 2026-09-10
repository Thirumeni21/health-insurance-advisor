import { HouseholdType, IncomeRange, CurrentInsuranceType, CurrentCoverAmount, EmergencySavingsLevel } from "@/types/questionnaire";

export const HOUSEHOLD_OPTIONS: Array<{
  id: HouseholdType;
  icon: string;
  title: string;
  subtitle: string;
  badge?: string;
}> = [
  {
    id: "myself",
    icon: "👤",
    title: "Myself",
    subtitle: "I'm mainly looking for protection for myself.",
  },
  {
    id: "spouse",
    icon: "👫",
    title: "Me + Spouse",
    subtitle: "Protection for me and my partner.",
  },
  {
    id: "family",
    icon: "👨‍👩‍👧",
    title: "Family",
    subtitle: "Me, my spouse and/or children.",
    badge: "Popular",
  },
  {
    id: "parents",
    icon: "👴👵",
    title: "Parents",
    subtitle: "I mainly want to understand protection for my parents.",
  },
  {
    id: "whole_family",
    icon: "👨‍👩‍👧‍👦",
    title: "My Whole Family",
    subtitle: "Me, spouse, children and parents.",
    badge: "Comprehensive",
  },
  {
    id: "other",
    icon: "✨",
    title: "Someone Else",
    subtitle: "I'm exploring protection for another family member or dependent.",
  },
];

export const POPULAR_CITIES = [
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Kochi",
  "Chandigarh",
  "Lucknow",
  "Indore",
  "Coimbatore",
  "Surat",
  "Nagpur",
  "Bhopal",
  "Visakhapatnam",
  "Patna",
  "Vadodara",
  "Other City / Global",
];

export const TOP_INDIAN_CITIES = [
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Kochi",
  "Chandigarh",
  "Lucknow",
  "Indore",
  "Surat",
  "Nagpur",
  "Bhopal",
  "Visakhapatnam",
  "Patna",
  "Vadodara",
  "Trichy",
  "Salem",
  "Tirunelveli",
  "Tiruppur",
];

export const INCOME_OPTIONS: Array<{
  id: IncomeRange;
  label: string;
  description: string;
}> = [
  { id: "below_3L", label: "Below ₹3 Lakhs", description: "Standard household baseline" },
  { id: "3_5L", label: "₹3 – ₹5 Lakhs", description: "Growing household baseline" },
  { id: "5_10L", label: "₹5 – ₹10 Lakhs", description: "Mid-tier household security" },
  { id: "10_20L", label: "₹10 – ₹20 Lakhs", description: "Established household protection" },
  { id: "above_20L", label: "₹20 Lakhs+", description: "High-protection comprehensive pool" },
  { id: "prefer_not_to_say", label: "Prefer not to say", description: "We'll use general benchmarks" },
];

export const CURRENT_INSURANCE_OPTIONS: Array<{
  id: CurrentInsuranceType;
  label: string;
  desc: string;
  icon: string;
}> = [
  { id: "none", label: "No insurance", desc: "100% out-of-pocket coverage currently", icon: "🛡️" },
  { id: "employer", label: "Employer-provided insurance", desc: "Covered under company group health plan", icon: "🏢" },
  { id: "personal", label: "Personal health insurance", desc: "Independent retail individual/family policy", icon: "📑" },
  { id: "both", label: "Both employer + personal", desc: "Dual layer of company + private cover", icon: "🌟" },
  { id: "not_sure", label: "Not sure / In transition", desc: "Need clarity on active coverage", icon: "❓" },
];

export const CURRENT_COVER_OPTIONS: Array<{
  id: CurrentCoverAmount;
  label: string;
}> = [
  { id: "0", label: "₹0 (No active cover)" },
  { id: "1_3L", label: "₹1 – ₹3 Lakhs" },
  { id: "3_5L", label: "₹3 – ₹5 Lakhs" },
  { id: "5_10L", label: "₹5 – ₹10 Lakhs" },
  { id: "10_25L", label: "₹10 – ₹25 Lakhs" },
  { id: "above_25L", label: "₹25 Lakhs+" },
  { id: "not_sure", label: "Not sure" },
];

export const EMERGENCY_SAVINGS_OPTIONS: Array<{
  id: EmergencySavingsLevel;
  label: string;
  icon: string;
  desc: string;
}> = [
  { id: "comfortable", label: "Comfortable", icon: "🟢", desc: "6+ months of living expenses reserved" },
  { id: "some", label: "Some savings", icon: "🟡", desc: "2 to 3 months buffer in bank/FD" },
  { id: "limited", label: "Limited savings", icon: "🟠", desc: "Medical bill could impact monthly cashflow" },
  { id: "prefer_not_to_say", label: "Prefer not to say", icon: "⚪", desc: "Keep this private" },
];

export const CONCERN_OPTIONS = [
  {
    id: "hospital_bill",
    icon: "🏥",
    title: "A large hospitalization bill",
    desc: "Worry about a sudden ₹5L–₹15L hospital stay wiping out investments.",
  },
  {
    id: "accident",
    icon: "🚑",
    title: "An unexpected accident",
    desc: "Emergency trauma care, surgery, and immediate intensive recovery costs.",
  },
  {
    id: "family_treatment",
    icon: "👨‍👩‍👧",
    title: "A family member needing specialized treatment",
    desc: "Ensuring spouse or children get access to the best private specialists without hesitation.",
  },
  {
    id: "parents_healthcare",
    icon: "👴👵",
    title: "Healthcare costs for aging parents",
    desc: "Managing chronic ailments, surgeries, or cardiac care for elderly parents.",
  },
  {
    id: "savings_depletion",
    icon: "💰",
    title: "Using my hard-earned savings for medical expenses",
    desc: "Having to liquidate mutual funds, gold, or children's education funds.",
  },
  {
    id: "understanding_coverage",
    icon: "📄",
    title: "Understanding what my current insurance actually covers",
    desc: "Worry about hidden room rent caps, co-payments, or claim rejections.",
  },
  {
    id: "dont_know",
    icon: "🤷",
    title: "I don't really know what I should be worried about",
    desc: "New to insurance and want to understand how medical inflation really works.",
    isEducationalHook: true,
  },
];
