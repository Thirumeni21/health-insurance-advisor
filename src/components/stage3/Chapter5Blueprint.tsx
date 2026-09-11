"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  FileCheck,
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Sparkles,
  RotateCcw,
  Compass,
} from "lucide-react";
import { UserProtectionProfile } from "@/types/questionnaire";
import { PersonalizedScenario } from "@/types/stage2";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";
import { getCharacterForUser } from "@/lib/characterEngine";
import { FamilyCharacter } from "../character/FamilyCharacter";
import { FamilyGroupCluster } from "../character/FamilyGroupCluster";

interface Chapter5BlueprintProps {
  scenario: PersonalizedScenario;
  profile: UserProtectionProfile;
  onPrevChapter: () => void;
  onRestartExperience: () => void;
}

export const Chapter5Blueprint: React.FC<Chapter5BlueprintProps> = ({
  scenario,
  profile,
  onPrevChapter,
  onRestartExperience,
}) => {
  const { language, t } = useLanguage();
  const lang = language === "ta" ? "ta" : "en";
  const ch = t.stage3.chapter5;
  const userChar = getCharacterForUser(profile.user);

  // 1. Digital Policy Document Clauses
  const [activeClauseKey, setActiveClauseKey] = useState<string>("sum_insured");

  // 2. Knowledge Check State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  // Digital Clauses Definition
  const clauses: Array<{ id: string; name: string; tag: string; explanation: string }> = [
    {
      id: "sum_insured",
      name: lang === "ta" ? "சம் இன்ஷூர்டு (Sum Insured)" : "Sum Insured Capacity",
      tag: "CLAUSE 01",
      explanation: lang === "ta"
        ? "ஒரு பாலிசி ஆண்டில் அனுமதிக்கப்பட்ட சிகிச்சைகளுக்கு கிடைக்கக்கூடிய அதிகபட்ச நிதிப் பாதுகாப்புக் கொள்ளளவு."
        : "The maximum financial coverage capacity available per policy year for covered medical events.",
    },
    {
      id: "room_rent",
      name: lang === "ta" ? "அறை வாடகை உச்சவரம்பு (Room Rent Limit)" : "Room Rent Category & Limits",
      tag: "CLAUSE 02",
      explanation: lang === "ta"
        ? "அனுமதிக்கப்பட்ட அறை வகையை விட அதிக கட்டண அறையைத் தேர்ந்தெடுத்தால், மருத்துவர் மற்றும் அறுவை சிகிச்சைக் கட்டணங்களிலும் விகிதாசாரக் குறைப்பு ஏற்படும்."
        : "Selecting a room category beyond the permitted limit can trigger proportionate deductions across doctor and surgeon charges.",
    },
    {
      id: "waiting_period",
      name: lang === "ta" ? "காத்திருப்பு காலம் (Waiting Periods)" : "Waiting Period Stipulations",
      tag: "CLAUSE 03",
      explanation: lang === "ta"
        ? "பாலிசி எடுத்த முதல் 30 நாட்கள் விபத்து மட்டுமே ஏற்கப்படும்; குறிப்பிட்ட நோய்களுக்கு 1-2 ஆண்டுகளும், பழைய நோய்களுக்கு 2-3 ஆண்டுகளும் காத்திருக்க வேண்டும்."
        : "Initial 30 days for accidents only; 1-2 years for specific conditions; 2-3 years for pre-existing declared illnesses.",
    },
    {
      id: "exclusions",
      name: lang === "ta" ? "நிரந்தர விலக்குகள் (Exclusions)" : "Exclusions & Non-Covered Items",
      tag: "CLAUSE 04",
      explanation: lang === "ta"
        ? "அழகு அறுவை சிகிச்சைகள், நிரூபிக்கப்படாத சிகிச்சைகள் மற்றும் நுகர்பொருட்கள் போன்ற பாலிசியில் நிரந்தரமாக விலக்கப்பட்டவை."
        : "Treatments and line items contractually excluded from claim admissibility (e.g. non-medical consumables, aesthetics).",
    },
    {
      id: "copay_deductible",
      name: lang === "ta" ? "டிடக்டிபிள் & கோ-பே (Deductibles & Co-pay)" : "Cost-Sharing Requirements",
      tag: "CLAUSE 05",
      explanation: lang === "ta"
        ? "பாலிசி பணம் தருவதற்கு முன் நீங்கள் செலுத்த வேண்டிய ஆரம்பத் தொகை (டிடக்டிபிள்) அல்லது பில்லில் குறிப்பிட்ட சதவீதப் பங்கு (கோ-பே)."
        : "The agreed initial out-of-pocket threshold (deductible) or fixed percentage (co-payment) borne by the insured.",
    },
  ];

  const activeClause = clauses.find((c) => c.id === activeClauseKey) || clauses[0];

  // 5 Knowledge Check Questions
  const questions = [
    {
      id: "q1",
      statement: lang === "ta" ? "'கேஷ்லெஸ்' என்றால் மருத்துவமனையில் நான் ஒரு பைசா கூட செலுத்தத் தேவையில்லை." : "'Cashless' means I will pay absolutely zero rupees at the hospital.",
      options: [
        { label: lang === "ta" ? "உண்மை" : "True", val: "true" },
        { label: lang === "ta" ? "கட்டாயம் இல்லை (Not necessarily)" : "Not necessarily", val: "not_necessarily" },
      ],
      correct: "not_necessarily",
      explanation: lang === "ta"
        ? "சரி! பாலிசியில் வராத மருத்துவ நுகர்பொருட்கள், கோ-பே அல்லது அறை வாடகை வித்தியாசத்தை நீங்கள் கவுண்டரில் செலுத்த வேண்டும்."
        : "Correct! Non-medical consumables, deductibles, co-pays, or room rent overage must still be settled at the billing desk.",
    },
    {
      id: "q2",
      statement: lang === "ta" ? "₹10 லட்சம் சம் இன்ஷூர்டு இருந்தால், எந்த ₹10 லட்சம் பில்லையும் நிறுவனம் தானாக முழுமையாக ஏற்கும்." : "A ₹10 Lakh sum insured means the insurer automatically pays any ₹10 Lakh bill in full.",
      options: [
        { label: lang === "ta" ? "உண்மை" : "True", val: "true" },
        { label: lang === "ta" ? "கட்டாயம் இல்லை (Not necessarily)" : "Not necessarily", val: "not_necessarily" },
      ],
      correct: "not_necessarily",
      explanation: lang === "ta"
        ? "சரி! சம் இன்ஷூர்டு என்பது கொள்ளளவு மட்டுமே. பில்லில் உள்ள அனுமதிக்கப்பட்ட மருத்துவ விவரங்கள் மட்டுமே ஒப்பந்த விதிகளின்படி வழங்கப்படும்."
        : "Correct! Sum Insured is coverage capacity. Payment depends on eligible medical items, policy limits, and contractual terms.",
    },
    {
      id: "q3",
      statement: lang === "ta" ? "பழைய நோய்களுக்கு (Pre-Existing Diseases) குறிப்பிட்ட காத்திருப்பு காலம் முடிந்த பிறகே கிளைம் அனுமதிக்கப்படும்." : "Declared pre-existing conditions require completing the stipulated waiting period before claims are payable.",
      options: [
        { label: lang === "ta" ? "ஆம் (சரி)" : "Yes, correct", val: "true" },
        { label: lang === "ta" ? "இல்லை" : "No", val: "false" },
      ],
      correct: "true",
      explanation: lang === "ta"
        ? "மிகச் சரி! காத்திருப்பு காலத்தை முழுமையாக நிறைவு செய்வது பழைய நோய்களுக்கான பாதுகாப்பை சட்டப்பூர்வமாக உறுதி செய்கிறது."
        : "Exactly right! Completing the continuous waiting period protects policy continuity and guarantees claim validity.",
    },
    {
      id: "q4",
      statement: lang === "ta" ? "ஃபேமிலி ஃப்ளோட்டரில் குடும்பத்தில் உள்ள ஒவ்வொருவருக்கும் தனித்தனியாக ₹10 லட்சம் ஒதுக்கப்படுகிறது." : "In a family floater, every family member receives their own separate ₹10 Lakh capacity.",
      options: [
        { label: lang === "ta" ? "ஆம்" : "Yes", val: "true" },
        { label: lang === "ta" ? "இல்லை (பகிரப்பட்ட தொகை)" : "No, it's shared", val: "false" },
      ],
      correct: "false",
      explanation: lang === "ta"
        ? "சரி! ஃபேமிலி ஃப்ளோட்டரில் மொத்தக் குடும்பமும் ஒரே தொகையைப் பகிர்ந்துகொள்கிறது. தனித்தனி தொகை வேண்டுமெனில் தனிநபர் பாலிசி எடுக்க வேண்டும்."
        : "Correct! A family floater provides a single shared pool. Separate dedicated amounts require individual policies.",
    },
    {
      id: "q5",
      statement: lang === "ta" ? "பாலிசி வரம்பை விட உயர்ந்த அறையைத் தேர்ந்தெடுப்பது அறுவை சிகிச்சை பில்லிலும் விகிதாசாரக் குறைப்பை ஏற்படுத்தலாம்." : "Choosing a room category above policy limits can cause proportionate deductions across surgery and doctor charges.",
      options: [
        { label: lang === "ta" ? "ஆம் (சரி)" : "Yes, correct", val: "true" },
        { label: lang === "ta" ? "இல்லை" : "No", val: "false" },
      ],
      correct: "true",
      explanation: lang === "ta"
        ? "சரியான பதில்! அறை வாடகை உச்சவரம்பிற்குள் இருக்கும் அறையைத் தேர்ந்தெடுப்பதே விகிதாசாரக் குறைப்பைத் தடுக்கும் வழி."
        : "Spot on! Staying within your contractual room category avoids surprise proportionate fee reductions at discharge.",
    },
  ];

  const handleCtaClick = () => {
    sound.playChime(760, 0.25);
    setIsCompletedModalOpen(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-10 select-none animate-fadeIn">
      {/* Badge & Title */}
      <div className="text-center sm:text-left space-y-2 border-b border-hairline pb-4">
        <span className="editorial-kicker block">
          {ch.badge}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
          {ch.headline}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-soft leading-relaxed max-w-2xl">
          {ch.subheading}
        </p>
      </div>

      {/* Persistent Protection Circle Network */}
      <FamilyGroupCluster profile={profile} size="compact" />

      {/* 1. Interactive Digital Policy Document */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-6">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">{ch.digitalDocTitle}</h3>
          <p className="text-xs text-ink-soft mt-1">{ch.digitalDocSub}</p>
        </div>

        {/* Clickable Clause Badges */}
        <div className="flex flex-wrap gap-2">
          {clauses.map((cl) => {
            const isActive = cl.id === activeClauseKey;
            return (
              <button
                key={cl.id}
                type="button"
                onClick={() => {
                  sound.playSoftPulse();
                  setActiveClauseKey(cl.id);
                }}
                className={`px-4 py-2 rounded-full text-xs font-mono transition-all flex items-center space-x-2 ${
                  isActive
                    ? "bg-ink text-white font-medium"
                    : "bg-bg-soft text-ink-soft hover:text-ink border border-hairline"
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>{cl.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Clause Detail Card */}
        <div className="p-5 rounded-[16px] bg-lavender-100/50 border border-lavender-300 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-ink font-semibold uppercase tracking-wider">
              {activeClause.tag}
            </span>
            <span className="text-xs font-mono text-ink-soft">Contractual Plain English</span>
          </div>
          <h4 className="font-display text-lg text-ink font-semibold">{activeClause.name}</h4>
          <p className="text-xs text-ink-soft leading-relaxed">
            {activeClause.explanation}
          </p>
        </div>
      </div>

      {/* 2. What Health Insurance CANNOT Promise */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-4">
        <div className="flex items-center space-x-2 text-rose-700">
          <AlertOctagon className="w-5 h-5" />
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">{ch.cannotPromiseTitle}</h3>
        </div>

        <div className="space-y-2.5">
          {ch.cannotPromiseList.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 flex items-start space-x-3 text-xs text-ink leading-relaxed"
            >
              <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Five Things to Remember Always */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-6">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">{ch.fiveThingsTitle}</h3>
          <p className="text-xs text-ink-soft mt-1">
            {lang === "ta" ? "மருத்துவ நிதிப் பாதுகாப்பிற்கான எளிய மனப் பார்வை:" : "The clear 5-point mental model for life:"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ch.fiveThings.map((th) => (
            <div
              key={th.num}
              className="p-4 rounded-[16px] bg-bg-soft border border-hairline flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="w-7 h-7 rounded-full bg-lavender-100 border border-lavender-300 text-xs font-mono font-bold text-ink flex items-center justify-center mb-2">
                  {th.num}
                </span>
                <h4 className="font-sans text-sm font-semibold text-ink mb-1">
                  {th.title}
                </h4>
                <p className="text-xs text-ink-soft leading-relaxed">
                  {th.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Interactive 5-Question Knowledge Check */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-6">
        <div className="flex items-center space-x-2 text-ink">
          <HelpCircle className="w-5 h-5 text-lavender-600" />
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">{ch.knowledgeCheckTitle}</h3>
        </div>
        <p className="text-xs text-ink-soft leading-relaxed">
          {ch.knowledgeCheckSub}
        </p>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userChoice = quizAnswers[q.id];
            const isAnswered = !!userChoice;
            const isCorrect = userChoice === q.correct;

            return (
              <div
                key={q.id}
                className="p-4 sm:p-5 rounded-[16px] bg-bg-soft border border-hairline space-y-3"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-white border border-hairline text-xs font-mono text-ink-soft flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <h4 className="font-sans font-medium text-sm sm:text-base text-ink">
                    {q.statement}
                  </h4>
                </div>

                {/* Options */}
                <div className="flex flex-wrap gap-2 pl-9">
                  {q.options.map((opt) => {
                    const isSelected = userChoice === opt.val;
                    return (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => {
                          sound.playSoftPulse();
                          setQuizAnswers({ ...quizAnswers, [q.id]: opt.val });
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                          isSelected
                            ? "bg-ink text-white font-medium"
                            : "bg-white text-ink-soft hover:text-ink border border-hairline"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback */}
                {isAnswered && (
                  <div
                    className={`p-3 rounded-xl text-xs leading-relaxed ml-9 border flex items-start space-x-2 ${
                      isCorrect
                        ? "bg-sage-100/60 border-sage-300 text-ink"
                        : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    )}
                    <span>{q.explanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Final Reflection & Non-Sales CTAs */}
      <div className="bg-white p-6 sm:p-10 rounded-[24px] text-center space-y-6 border border-hairline shadow-elevated">
        <div className="w-12 h-12 rounded-full bg-lavender-100 border border-lavender-300 flex items-center justify-center mx-auto text-ink">
          <Sparkles className="w-6 h-6 text-lavender-600" />
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
            {ch.finalReflectionTitle}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-ink-soft leading-relaxed">
            {ch.finalReflectionSub}
          </p>
        </div>

        {/* Action Buttons */}
        {!isCompletedModalOpen ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-4 w-full sm:w-auto">
            <button
              onClick={handleCtaClick}
              className="btn-primary min-h-[48px] px-8 py-4 text-xs group inline-flex items-center justify-center space-x-3 w-full sm:w-auto"
            >
              <span>{ch.ctas.primary}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={handleCtaClick}
              className="inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-full bg-white border border-hairline text-xs font-mono text-ink-soft hover:text-ink hover:bg-bg-soft transition-all min-h-[48px] w-full sm:w-auto"
            >
              <Compass className="w-4 h-4 text-lavender-600" />
              <span>{ch.ctas.secondary}</span>
            </button>
          </div>
        ) : (
          <div className="p-6 rounded-[20px] bg-bg-soft border border-hairline max-w-md mx-auto space-y-3 animate-fadeIn">
            <div className="flex justify-center -mb-1">
              <FamilyCharacter config={userChar} variant="bust" size="md" pose="reflective" />
            </div>
            <CheckCircle2 className="w-8 h-8 text-ink mx-auto" />
            <h4 className="font-display text-lg font-semibold text-ink">
              {lang === "ta" ? "உங்கள் தனிப்பட்ட வழிகாட்டி தயாராகிறது" : "Your Educational Journey Complete"}
            </h4>
            <p className="text-xs text-ink-soft">
              {lang === "ta"
                ? "நீங்கள் இப்போது ஹெல்த் இன்ஷூரன்ஸின் அனைத்து விதிகளையும் வெளிப்படையாக அறிந்துகொண்டீர்கள். உங்கள் விருப்பங்கள் பாதுகாப்பாக பதிவு செய்யப்பட்டுள்ளன."
                : "You now understand what health insurance actually does and where its boundaries lie. Zero sales push, total clarity."}
            </p>
            <button
              onClick={onRestartExperience}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white border border-hairline text-xs font-mono text-ink-soft hover:text-ink transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === "ta" ? "அனுபவத்தை மீண்டும் தொடங்க" : "Restart Experience"}</span>
            </button>
          </div>
        )}

        <div className="pt-4 border-t border-hairline flex justify-center">
          <button
            onClick={() => {
              sound.playChime(380, 0.1);
              window.scrollTo({ top: 0, behavior: "smooth" });
              onPrevChapter();
            }}
            className="px-5 py-2.5 rounded-full bg-white border border-hairline text-xs font-mono text-ink-soft hover:text-ink transition-all"
          >
            {t.stage3.nav.prevChapter}
          </button>
        </div>
      </div>
    </div>
  );
};

