import { UserProtectionProfile } from "@/types/questionnaire";
import { PersonalizedScenario, TargetPerson } from "@/types/stage2";

/**
 * Deterministic Profile-First Scenario Engine
 * 
 * GOLDEN RULE: NEVER introduce a person who does not exist in the user's profile.
 * - Single users (no spouse/children/dependents) => 100% about the user themselves.
 * - If concern mentions family or parents that do not exist, preserve the concern
 *   and adapt the character to the user without fabricating phantom relatives.
 * - If relatives exist, reuse their actual relationship, name, and age from Stage 1.
 */
export function selectPersonalizedScenario(profile: UserProtectionProfile): PersonalizedScenario {
  const { household, user, financial, insurance, concerns } = profile;
  const userAge = user.age || 30;
  const userGender = user.gender || "male";

  const members = household.familyMembers || [];
  const spouse = members.find((m) => m.relationship === "Spouse");
  const children = members.filter((m) => m.relationship === "Child");
  const parents = members.filter(
    (m) => m.relationship === "Mother" || m.relationship === "Father" || m.relationship === "Grandparent"
  );
  const otherDependents = members.filter(
    (m) => m.relationship === "Other Dependent" || m.relationship === "Sibling"
  );

  const isSingle =
    household.protectionType === "myself" &&
    members.length === 0 &&
    (!user.singleDependents || user.singleDependents === "no_one");

  const primaryConcern = concerns[0] || "hospital_bill";

  // -------------------------------------------------------------
  // 1. SINGLE USER (NO SPOUSE, NO CHILDREN, NO PARENTS/DEPENDENTS)
  // -------------------------------------------------------------
  if (isSingle) {
    const selfTarget: TargetPerson = {
      characterType: "self",
      familyMemberId: "self",
      relationship: "You",
      name: "You",
      age: userAge,
      gender: userGender,
      isSelfOnly: true,
    };

    if (primaryConcern === "accident") {
      return {
        id: "scenario_01_accident",
        scenarioType: "accident",
        title: {
          en: "The Unexpected Accident",
          ta: "எதிர்பாராத விபத்து",
        },
        emotionalTheme: {
          en: "Life can change in a moment, while your personal responsibilities continue.",
          ta: "வாழ்க்கை ஒரு கணத்தில் மாறலாம், ஆனால் உங்கள் சொந்தப் பொறுப்புகள் தொடர்ந்து கொண்டே இருக்கும்.",
        },
        targetPerson: selfTarget,
        act1_normal: {
          headline: {
            en: "Imagine an ordinary morning on your way to work.",
            ta: "ஒரு சாதாரண காலைப்பொழுதில் நீங்கள் வேலைக்குச் செல்வதைக் கற்பனை செய்யுங்கள்.",
          },
          story: {
            en: "You are focused on your career, your personal independence, and the life you are actively building. Everything is going exactly as planned.",
            ta: "உங்கள் தொழில், சுயாதீன வாழ்க்கை மற்றும் எதிர்காலத் திட்டங்களில் நீங்கள் கவனம் செலுத்துகிறீர்கள். எல்லாம் திட்டமிட்டபடி நடக்கிறது.",
          },
        },
        act2_interruption: {
          headline: {
            en: "Now imagine a sudden unexpected disruption occurs on the road.",
            ta: "திடீரென சாலையில் ஒரு எதிர்பாராத விபத்து உங்கள் நாளை மாற்றுகிறது.",
          },
          story: {
            en: "Life pauses in an instant. While you are taken into emergency medical care, your rent, living costs, and monthly commitments do not pause.",
            ta: "வாழ்க்கை ஒரு கணத்தில் நிற்கிறது. நீங்கள் அவசர சிகிச்சைக்கு அழைத்துச் செல்லப்படும் வேளையிலும், வாடகை மற்றும் மாதாந்திரக் கடமைகள் நிற்பதில்லை.",
          },
        },
        act3_hospital: {
          steps: [
            {
              stepNumber: "01",
              title: { en: "Emergency Admission & Triage", ta: "அவசர சேர்க்கை & முதலுதவி" },
              desc: { en: "Immediate ambulance transfer, rapid trauma triage, and pain stabilization.", ta: "உடனடி ஆம்புலன்ஸ் மாற்றம், தீவிர அவசர சிகிச்சை மற்றும் வலி நிவாரணம்." },
            },
            {
              stepNumber: "02",
              title: { en: "Diagnostic Scans & Evaluations", ta: "பரிசோதனைகள் & ஸ்கேன்" },
              desc: { en: "Whole-body CT scan, orthopedic radiological assessment, and blood screening.", ta: "முழு உடல் CT ஸ்கேன், எலும்பு முறிவு பரிசோதனை மற்றும் இரத்தப் பரிசோதனைகள்." },
            },
            {
              stepNumber: "03",
              title: { en: "Surgical Intervention", ta: "அவசர அறுவை சிகிச்சை" },
              desc: { en: "Operating theatre procedures performed by specialist trauma surgeons.", ta: "சிறப்பு அறுவை சிகிச்சை நிபுணர் குழுவால் செய்யப்படும் அவசர அறுவை சிகிச்சை." },
            },
            {
              stepNumber: "04",
              title: { en: "ICU & Monitored Recovery", ta: "தீவிர சிகிச்சைப் பிரிவு (ICU) தங்கல்" },
              desc: { en: "Inpatient monitoring, intravenous medication, and specialized nursing.", ta: "மருத்துவமனைத் தங்கல், நரம்பு வழி மருந்துகள் மற்றும் தீவிர செவிலியர் கண்காணிப்பு." },
            },
            {
              stepNumber: "05",
              title: { en: "Discharge & Rehabilitation", ta: "டிஸ்சார்ஜ் & மறுவாழ்வு" },
              desc: { en: "Discharge clearance, physiotherapy regimen, and home recovery plan.", ta: "டிஸ்சார்ஜ் ஆலோசனைகள், இயன்முறை உடற்பயிற்சி மற்றும் வீட்டில் ஓய்வு." },
            },
          ],
        },
        act4_bill: {
          totalAmount: 380000,
          breakdown: [
            { key: "emergencyCare", amount: 65000, label: { en: "Emergency Trauma Care & Triage", ta: "அவசர சிகிச்சைப் பிரிவு & முதலுதவி" } },
            { key: "traumaSurgery", amount: 150000, label: { en: "Urgent Surgery & Theatre Charges", ta: "அவசர அறுவை சிகிச்சை & தியேட்டர் கட்டணம்" } },
            { key: "icuStay", amount: 85000, label: { en: "Intensive Care Unit (ICU) Stay", ta: "தீவிர சிகிச்சைப் பிரிவு (ICU) தங்கல்" } },
            { key: "diagnosticsScans", amount: 45000, label: { en: "Diagnostic Scans & Pathology", ta: "ஸ்கேன் மற்றும் முழு உடல் பரிசோதனைகள்" } },
            { key: "medicinesConsumables", amount: 35000, label: { en: "Medicines & Surgical Consumables", ta: "மருந்துகள் & மருத்துவப் பொருட்கள்" } },
          ],
        },
        act5_personal_context: {
          savingsNote: {
            en: "An unexpected accident arrives with zero advance warning, directly challenging liquid reserves.",
            ta: "எதிர்பாராத விபத்து எந்தவித முன்னறிவிப்புமின்றி வந்து சேமிப்பு இருப்பை நேரடியாக சவாலுக்குள்ளாக்குகிறது.",
          },
          insuranceNote: {
            en: "When living independently, having active cashless health cover ensures you do not face emergency hospital deposits alone.",
            ta: "சுயாதீனமாக வாழும்போது, கேஷ்லெஸ் இன்ஷூரன்ஸ் இருப்பது அவசரக்கால மருத்துவ வைப்புத்தொகையைத் தனியாக எதிர்கொள்ளாமல் இருக்க உதவுகிறது.",
          },
        },
        act6_decision: {
          question: {
            en: "If an unexpected accident required ₹3.8 Lakhs, how would you handle the expense?",
            ta: "திடீரென ₹3.8 லட்சம் மருத்துவச் செலவு வந்தால், நீங்கள் அதை எவ்வாறு சமாளிப்பீர்கள்?",
          },
          sub: {
            en: "Select an option to observe how your personal financial resources would respond.",
            ta: "உங்கள் சொந்த நிதி ஆதாரங்கள் எவ்வாறு செயல்படும் என்பதைப் பார்க்க ஒரு வழியைத் தேர்ந்தெடுக்கவும்.",
          },
        },
        act7_realization: {
          headline: {
            en: "Life stopped for a moment. But expenses didn't.",
            ta: "வாழ்க்கை ஒரு கணம் நின்றது. ஆனால் செலவுகள் நிற்கவில்லை.",
          },
          quote: {
            en: "“The value of health insurance is not just paying a bill. It is ensuring that an unexpected event does not compromise your hard-won independence.”",
            ta: "“ஹெல்த் இன்ஷூரன்ஸின் பலன் பில்லைக் கட்டுவதில் மட்டும் இல்லை. எதிர்பாராத நிகழ்வு உங்கள் சுதந்திரத்தையும் சேமிப்பையும் பாதிக்காமல் இருப்பதில் உள்ளது.”",
          },
          sub: {
            en: "Health insurance provides a dedicated financial barrier between unexpected hospital costs and your future plans.",
            ta: "ஹெல்த் இன்ஷூரன்ஸ் எதிர்பாராத மருத்துவச் செலவுகளுக்கும் உங்கள் எதிர்காலக் கனவுகளுக்கும் இடையே ஒரு நிதி அரணாகச் செயல்படுகிறது.",
          },
        },
        environment3D: "accident",
      };
    }

    if (primaryConcern === "savings_depletion" || primaryConcern === "parents_healthcare") {
      const isParentAdapted = primaryConcern === "parents_healthcare";

      return {
        id: "scenario_06_savings",
        scenarioType: "savings",
        title: {
          en: "Protecting Your Hard-Earned Savings",
          ta: "கடினமாக உழைத்துச் சேர்த்த சேமிப்பைப் பாதுகாத்தல்",
        },
        emotionalTheme: {
          en: "What if money you spent years building suddenly had to be redirected toward an unexpected medical expense?",
          ta: "நீங்கள் பல ஆண்டுகள் சேர்த்த பணம் திடீரென ஒரு மருத்துவச் செலவிற்காகப் பயன்படுத்த நேர்ந்தால் என்னவாகும்?",
        },
        targetPerson: selfTarget,
        adaptationNotice: isParentAdapted
          ? {
              en: "You selected healthcare costs for aging parents as a concern. Since you haven't recorded parents in your household circle, we've focused on the underlying financial question: how unexpected medical expenses can impact your personal savings and future responsibilities.",
              ta: "பெற்றோரின் மருத்துவச் செலவுகளை நீங்கள் ஒரு கவலையாகத் தேர்ந்தெடுத்தீர்கள். உங்கள் சுயவிவரத்தில் பெற்றோரைப் பதிவு செய்யாததால், எதிர்பாராத மருத்துவச் செலவுகள் உங்கள் சொந்த சேமிப்பையும் எதிர்காலப் பொறுப்புகளையும் எவ்வாறு பாதிக்கும் என்பதை நோக்குவோம்.",
            }
          : undefined,
        act1_normal: {
          headline: {
            en: "Imagine the savings you've worked hard to build.",
            ta: "ஒவ்வொரு மாதமும் உங்கள் சொந்த உழைப்பில் நீங்கள் சேர்த்துள்ள சேமிப்பைக் கற்பனை செய்யுங்கள்.",
          },
          story: {
            en: "Month after month, you set aside income for your independence, future investments, or long-term goals. Every rupee represents discipline.",
            ta: "மாதந்தோறும் உங்கள் சுதந்திரம், சேமிப்பு அல்லது எதிர்கால முதலீடுகளுக்காக பணத்தைச் சேமிக்கிறீர்கள். ஒவ்வொரு ரூபாயும் உங்கள் கடின உழைப்பைக் குறிக்கிறது.",
          },
        },
        act2_interruption: {
          headline: {
            en: "An unexpected acute health condition requires hospitalization.",
            ta: "திடீரென ஒரு மருத்துவ சிகிச்சைக்காக மருத்துவமனையில் சேர வேண்டிய நிலை ஏற்படுகிறது.",
          },
          story: {
            en: "A sudden medical emergency requires multi-day specialized inpatient care. Without an active insurance layer, personal savings become the first line of defense.",
            ta: "திடீர் மருத்துவ அவசரநிலைக்கு பல நாட்கள் தீவிர சிகிச்சை தேவைப்படுகிறது. இன்ஷூரன்ஸ் இல்லாவிட்டால், உங்கள் சொந்த சேமிப்பே முதல் பலியாகிறது.",
          },
        },
        act3_hospital: {
          steps: [
            {
              stepNumber: "01",
              title: { en: "Emergency Diagnostic Assessment", ta: "அவசர நோயறிதல் பரிசோதனை" },
              desc: { en: "Clinical evaluation, advanced blood workup, and diagnostic scans.", ta: "மருத்துவ மதிப்பீடு, விரிவான இரத்தப் பரிசோதனைகள் மற்றும் ஸ்கேன்கள்." },
            },
            {
              stepNumber: "02",
              title: { en: "Urgent Medical Procedure", ta: "அவசர சிகிச்சை முறை" },
              desc: { en: "Specialist physician intervention and operating theatre care.", ta: "சிறப்பு மருத்துவர் தலையீடு மற்றும் தீவிர சிகிச்சை நடைமுறைகள்." },
            },
            {
              stepNumber: "03",
              title: { en: "Monitored Inpatient Stay", ta: "மருத்துவமனைத் தங்கல்" },
              desc: { en: "Multi-day room stay, dedicated nursing, and intravenous pharmaceuticals.", ta: "பல நாட்கள் அறைத் தங்கல், நரம்பு வழி மருந்துகள் மற்றும் செவிலியர் கண்காணிப்பு." },
            },
            {
              stepNumber: "04",
              title: { en: "Recovery & Stabilization", ta: "மீட்பு வார்டு சிகிச்சை" },
              desc: { en: "Pain management, mobility evaluation, and vital sign stabilization.", ta: "வலி மேலாண்மை, இயன்முறை சிகிச்சை மற்றும் உடல்நிலை சீராதல்." },
            },
            {
              stepNumber: "05",
              title: { en: "Settlement & Discharge", ta: "இறுதி பில் தீர்வு & டிஸ்சார்ஜ்" },
              desc: { en: "Final hospital billing clearance and outpatient medication regimen.", ta: "மருத்துவமனை பில் தீர்வு, மருந்துப் பரிந்துரைகள் மற்றும் தொடர் ஆலோசனை." },
            },
          ],
        },
        act4_bill: {
          totalAmount: 420000,
          breakdown: [
            { key: "traumaSurgery", amount: 190000, label: { en: "Specialized Medical / Surgical Care", ta: "சிறப்பு மருத்துவ / அறுவை சிகிச்சை" } },
            { key: "privateRoomStay", amount: 110000, label: { en: "Private Room Stay & Nursing Care", ta: "தனி அறை வாடகை & செவிலியர் பராமரிப்பு" } },
            { key: "diagnosticsScans", amount: 65000, label: { en: "Advanced Diagnostics & Imaging", ta: "நவீன நோயறிதல் & ஸ்கேன் பரிசோதனைகள்" } },
            { key: "medicinesConsumables", amount: 55000, label: { en: "Pharmacy & Medical Consumables", ta: "மருந்துகள் & மருத்துவப் பொருட்கள்" } },
          ],
        },
        act5_personal_context: {
          savingsNote: {
            en: "Liquidating bank deposits, mutual funds, or investments interrupts years of compound growth.",
            ta: "வங்கி டெபாசிட் அல்லது மியூச்சுவல் ஃபண்டுகளை அவசரமாக விற்பது பல வருட நிதி வளர்ச்சியைத் தடுக்கிறது.",
          },
          insuranceNote: {
            en: "Having a dedicated health policy protects your hard-earned wealth from being redirected into hospital bills.",
            ta: "ஹெல்த் இன்ஷூரன்ஸ் உங்கள் சேமிப்பை மருத்துவ பில்களுக்காகப் பயன்படுத்துவதைத் தடுக்கும் அரணாக உள்ளது.",
          },
        },
        act6_decision: {
          question: {
            en: "If a ₹4.2 Lakh medical expense arrived unexpectedly, how would you manage it?",
            ta: "திடீரென ₹4.2 லட்சம் மருத்துவச் செலவு வந்தால், நீங்கள் அதை எவ்வாறு சமாளிப்பீர்கள்?",
          },
          sub: {
            en: "Explore how different financial approaches affect your personal savings.",
            ta: "பல்வேறு நிதி வழிகள் உங்கள் சேமிப்பை எவ்வாறு பாதிக்கின்றன என்பதை ஆராயுங்கள்.",
          },
        },
        act7_realization: {
          headline: {
            en: "Protecting the financial goals that matter.",
            ta: "முக்கியமான எதிர்கால இலக்குகளைப் பாதுகாத்தல்.",
          },
          quote: {
            en: "“The value of health insurance is not just paying a bill. It is protecting the financial goals that bill could otherwise interrupt.”",
            ta: "“ஹெல்த் இன்ஷூரன்ஸின் பலன் பில்லைக் கட்டுவதில் மட்டும் இல்லை. அந்த பில் தடுத்து நிறுத்தக்கூடிய உங்கள் எதிர்காலக் கனவுகளைப் பாதுகாப்பதிலும் உள்ளது.”",
          },
          sub: {
            en: "Health insurance acts as a dedicated financial buffer so your hard-earned money remains intact for its intended purpose.",
            ta: "ஹெல்த் இன்ஷூரன்ஸ் ஒரு அரணாக நின்று, நீங்கள் சேர்த்த சேமிப்பை அதன் உண்மையான நோக்கத்திற்காகப் பாதுகாக்கிறது.",
          },
        },
        environment3D: "savings",
      };
    }

    if (primaryConcern === "family_treatment") {
      return {
        id: "scenario_03_specialist",
        scenarioType: "specialist",
        title: {
          en: "When You Need Specialist Treatment",
          ta: "உங்களுக்கு சிறப்பு சிகிச்சை தேவைப்படும்போது",
        },
        emotionalTheme: {
          en: "When you need specialized medical care, timely decisions should not be constrained by immediate cash availability.",
          ta: "உங்களுக்கு சிறந்த சிகிச்சை தேவைப்படும்போது, பணத்தை உடனடியாக ஏற்பாடு செய்வதில் தயக்கம் ஏற்படக்கூடாது.",
        },
        targetPerson: selfTarget,
        adaptationNotice: {
          en: "You selected specialized treatment as a key concern. Since you're exploring protection for yourself, we've modeled what happens if you yourself unexpectedly require specialized medical care.",
          ta: "சிறப்பு மருத்துவ சிகிச்சைக்கான தேவையை நீங்கள் ஒரு கவலையாகத் தேர்ந்தெடுத்தீர்கள். உங்களை மட்டுமே பாதுகாக்கும் சூழலில் இருப்பதால், உங்களுக்கே ஒரு சிறப்பு சிகிச்சை தேவைப்பட்டால் என்ன நடக்கும் என்று பார்ப்போம்.",
        },
        act1_normal: {
          headline: {
            en: "Imagine feeling fully in control of your daily routine.",
            ta: "உங்கள் தினசரி வழக்கத்தை நீங்கள் உற்சாகமாகக் கழிப்பதைக் கற்பனை செய்யுங்கள்.",
          },
          story: {
            en: "You are energetic and focused on your personal lifestyle and milestones. Life is active and unconstrained.",
            ta: "நீங்கள் சுறுசுறுப்பாகவும் உங்கள் தனிப்பட்ட வாழ்க்கை இலக்குகளில் கவனத்துடனும் இருக்கிறீர்கள். வாழ்க்கை சீராகச் செல்கிறது.",
          },
        },
        act2_interruption: {
          headline: {
            en: "A persistent health concern develops.",
            ta: "தொடர்ச்சியான ஒரு உடல்நல உபாதை ஏற்படுகிறது.",
          },
          story: {
            en: "A doctor recommends comprehensive diagnostic evaluation and a specialized medical procedure to ensure complete recovery.",
            ta: "முழுமையான குணம் பெற ஒரு சிறப்பு மருத்துவ சிகிச்சை தாமதமின்றி தேவை என மருத்துவர் பரிந்துரைக்கிறார்.",
          },
        },
        act3_hospital: {
          steps: [
            {
              stepNumber: "01",
              title: { en: "Specialist Consultation", ta: "சிறப்பு மருத்துவர் ஆலோசனை" },
              desc: { en: "Consultation with a senior sub-specialist at a tertiary private hospital.", ta: "முன்னணி தனியார் மருத்துவமனையில் மூத்த சிறப்பு மருத்துவரிடம் ஆலோசனை." },
            },
            {
              stepNumber: "02",
              title: { en: "Advanced Imaging & Diagnostics", ta: "நவீன இமேஜிங் & ஸ்கேன்" },
              desc: { en: "High-resolution contrast MRI and specialized clinical pathology.", ta: "உயர் தெளிவுத்திறன் ஸ்கேன் மற்றும் துல்லியமான ஆய்வகப் பரிசோதனைகள்." },
            },
            {
              stepNumber: "03",
              title: { en: "Specialized Clinical Procedure", ta: "சிறப்பு மருத்துவ சிகிச்சை" },
              desc: { en: "Targeted medical intervention performed by accredited specialists.", ta: "அங்கீகரிக்கப்பட்ட நிபுணர்களால் செய்யப்படும் நவீன சிகிச்சை." },
            },
            {
              stepNumber: "04",
              title: { en: "Monitored Recovery", ta: "கண்காணிப்பு வார்டு" },
              desc: { en: "Inpatient room stay with post-procedure recovery supervision.", ta: "சிகிச்சைக்குப் பிந்தைய செவிலியர் பராமரிப்புடன் கூடிய அறைத் தங்கல்." },
            },
            {
              stepNumber: "05",
              title: { en: "Follow-up & Therapy", ta: "தொடர் ஆலோசனைகள்" },
              desc: { en: "Structured outpatient consultations and physical recuperation.", ta: "தொடர் மருத்துவ ஆலோசனைகள் மற்றும் முழுமையான நலம் பெறுதல்." },
            },
          ],
        },
        act4_bill: {
          totalAmount: 360000,
          breakdown: [
            { key: "traumaSurgery", amount: 160000, label: { en: "Specialist Procedure Charges", ta: "சிறப்பு மருத்துவ நடைமுறை கட்டணம்" } },
            { key: "specialistConsultations", amount: 50000, label: { en: "Senior Specialist Consultations", ta: "மூத்த சிறப்பு மருத்துவர் கட்டணம்" } },
            { key: "advancedImaging", amount: 65000, label: { en: "Advanced Diagnostics & MRI", ta: "நவீன ஸ்கேன் மற்றும் பரிசோதனைகள்" } },
            { key: "privateRoomStay", amount: 85000, label: { en: "Inpatient Room Stay & Nursing", ta: "அறை வாடகை & செவிலியர் பராமரிப்பு" } },
          ],
        },
        act5_personal_context: {
          savingsNote: {
            en: "Accessing quality private specialists should never be delayed by immediate liquidity concerns.",
            ta: "சிறந்த தனியார் மருத்துவர்களை அணுகுவது உடனடி பணப்புழக்கம் குறித்த தயக்கத்தால் தடைபடக்கூடாது.",
          },
          insuranceNote: {
            en: "A robust health plan gives you the freedom to choose reputable hospitals and doctors without hesitation.",
            ta: "முறையான இன்ஷூரன்ஸ் முன்னணி மருத்துவமனைகளைத் தயக்கமின்றி தேர்வு செய்யும் சுதந்திரத்தை உங்களுக்கு அளிக்கிறது.",
          },
        },
        act6_decision: {
          question: {
            en: "If you required specialist care totaling ₹3.6 Lakhs, how would you fund it?",
            ta: "உங்களுக்கு ₹3.6 லட்சம் சிறப்பு சிகிச்சை தேவைப்பட்டால், பணத்தை எவ்வாறு ஏற்பாடு செய்வீர்கள்?",
          },
          sub: {
            en: "See how different financial sources support your medical choices.",
            ta: "பல்வேறு நிதி வழிகள் உங்கள் மருத்துவ முடிவுகளை எவ்வாறு ஆதரிக்கின்றன என்பதைப் பாருங்கள்.",
          },
        },
        act7_realization: {
          headline: {
            en: "Focusing on recovery rather than cost.",
            ta: "செலவைப் பற்றிய கவலையின்றி உடல்நலத்தில் கவனம் செலுத்துதல்.",
          },
          quote: {
            en: "“When health decisions arise, the question should be how to get well—not how to liquidate your hard-earned assets.”",
            ta: "“உடல்நல முடிவுகள் எழும்போது, எவ்வாறு குணமாக வேண்டும் என்பதே கேள்வியாக இருக்க வேண்டும்—சேமிப்பைக் கலைப்பது அல்ல.”",
          },
          sub: {
            en: "Health insurance ensures you have the freedom to access timely medical care according to policy terms.",
            ta: "ஹெல்த் இன்ஷூரன்ஸ் சரியான நேரத்தில் தரமான சிகிச்சையைப் பெறுவதற்கான நிதிப் பாதுகாப்பை உங்களுக்கு உறுதி செய்கிறது.",
          },
        },
        environment3D: "specialist",
      };
    }

    if (primaryConcern === "understanding_coverage") {
      return {
        id: "scenario_07_coverage",
        scenarioType: "coverage",
        title: {
          en: "Demystifying Your Health Coverage",
          ta: "உங்கள் இன்ஷூரன்ஸ் பாதுகாப்பைப் புரிந்து கொள்ளுதல்",
        },
        emotionalTheme: {
          en: "Understanding what your health policy actually covers before a claim occurs is the foundation of financial peace of mind.",
          ta: "மருத்துவ அவசரநிலை ஏற்படும் முன்பே உங்கள் பாலிசியில் எவை அனுமதிக்கப்படும் என்பதை அறிவதே நிம்மதிக்கான அடிப்படை.",
        },
        targetPerson: selfTarget,
        act1_normal: {
          headline: {
            en: "Imagine assuming you are financially protected.",
            ta: "நீங்கள் நிதிப் பாதுகாப்புடன் இருப்பதாக நினைத்து வாழ்வதைக் கற்பனை செய்யுங்கள்.",
          },
          story: {
            en: "You have your daily schedule in order. Perhaps you have an employer health card or an existing policy stored in an email.",
            ta: "உங்கள் தினசரி வாழ்க்கை சீராக உள்ளது. ஒருவேளை அலுவலக இன்ஷூரன்ஸ் கார்டு அல்லது பழைய பாலிசி உங்களிடம் இருக்கலாம்.",
          },
        },
        act2_interruption: {
          headline: {
            en: "An unexpected hospital stay requires reviewing the fine print.",
            ta: "திடீர் மருத்துவமனைச் சேர்க்கை பாலிசி விதிகளை உற்றுநோக்க வைக்கிறது.",
          },
          story: {
            en: "During admission, the hospital desk asks about room category limits, sub-limits, and co-payment clauses you may have never examined.",
            ta: "மருத்துவமனையில் அனுமதிக்கப்படும்போது, ரூம் வாடகை உச்சவரம்பு மற்றும் மறைமுக நிபந்தனைகள் குறித்த கேள்விகள் எழுகின்றன.",
          },
        },
        act3_hospital: {
          steps: [
            {
              stepNumber: "01",
              title: { en: "Hospital Registration & Desk Review", ta: "மருத்துவமனை அனுமதி & ஆவண ஆய்வு" },
              desc: { en: "Submitting health card details and checking network hospital cashless eligibility.", ta: "இன்ஷூரன்ஸ் அட்டை விவரங்களை சமர்ப்பித்து கேஷ்லெஸ் தகுதியைச் சரிபார்த்தல்." },
            },
            {
              stepNumber: "02",
              title: { en: "Room Category Verification", ta: "அறை வகை சரிபார்ப்பு" },
              desc: { en: "Checking whether policy covers a private single room or enforces proportionate deductions.", ta: "பாலிசியில் தனி அறை அனுமதிக்கப்படுகிறதா அல்லது வாடகை உச்சவரம்பு உள்ளதா என அறிதல்." },
            },
            {
              stepNumber: "03",
              title: { en: "Medical Treatment & Care", ta: "மருத்துவ சிகிச்சை" },
              desc: { en: "Undergoing treatment with daily medication and physician rounds.", ta: "மருத்துவர் கண்காணிப்பில் தொடர் சிகிச்சை மற்றும் மருந்துகள் பெறுதல்." },
            },
            {
              stepNumber: "04",
              title: { en: "Cashless Pre-Authorization", ta: "கேஷ்லெஸ் முன்அனுமதி" },
              desc: { en: "Insurer evaluates covered medical line items against policy terms and exclusions.", ta: "அனுமதிக்கப்பட்ட மருத்துவச் செலவுகளை பாலிசி விதிகளுடன் இன்ஷூரன்ஸ் நிறுவனம் ஒப்பிடுதல்." },
            },
            {
              stepNumber: "05",
              title: { en: "Discharge & Settlement", ta: "டிஸ்சார்ஜ் & தீர்வு" },
              desc: { en: "Approved cashless amount settled directly; non-medical consumables settled by patient.", ta: "அங்கீகரிக்கப்பட்ட தொகை நேரடியாகத் தீர்க்கப்பட்டு டிஸ்சார்ஜ் நிறைவுறுதல்." },
            },
          ],
        },
        act4_bill: {
          totalAmount: 350000,
          breakdown: [
            { key: "traumaSurgery", amount: 160000, label: { en: "Inpatient Surgical Procedure", ta: "அறுவை சிகிச்சை நடைமுறை கட்டணம்" } },
            { key: "privateRoomStay", amount: 95000, label: { en: "Room Nursing & Accommodation", ta: "அறை வாடகை & செவிலியர் கட்டணம்" } },
            { key: "diagnosticsScans", amount: 50000, label: { en: "Laboratory & Radiology Charges", ta: "ஆய்வக மற்றும் ஸ்கேன் கட்டணங்கள்" } },
            { key: "medicinesConsumables", amount: 45000, label: { en: "Medicines & Non-Medical Consumables", ta: "மருந்துகள் & மருத்துவ நுகர்பொருட்கள்" } },
          ],
        },
        act5_personal_context: {
          savingsNote: {
            en: "Without clarity on room rent caps, unexpected out-of-pocket proportionate deductions can surprise you at discharge.",
            ta: "ரூம் வாடகை உச்சவரம்பு பற்றிய தெளிவு இல்லாவிட்டால், எதிர்பாராத கூடுதல் செலவுகள் டிஸ்சார்ஜின் போது ஆச்சரியப்படுத்தலாம்.",
          },
          insuranceNote: {
            en: "Understanding waiting periods, sub-limits, and network cashless hospitals turns insurance from an abstract paper into real protection.",
            ta: "காத்திருப்பு காலம் மற்றும் கேஷ்லெஸ் நெட்வொர்க் மருத்துவமனைகளைப் புரிந்துகொள்வது உண்மையான நிம்மதியை அளிக்கிறது.",
          },
        },
        act6_decision: {
          question: {
            en: "How clearly do you want your health insurance boundaries to be defined?",
            ta: "உங்கள் இன்ஷூரன்ஸ் பாதுகாப்பு எல்லைகள் எவ்வளவு தெளிவாக இருக்க வேண்டும் என விரும்புகிறீர்கள்?",
          },
          sub: {
            en: "Select how you would handle any uncovered or deductible portion.",
            ta: "பாலிசியில் வராத மீதித் தொகையை எவ்வாறு சமாளிப்பீர்கள் என்பதைத் தேர்வு செய்யுங்கள்.",
          },
        },
        act7_realization: {
          headline: {
            en: "Clarity is the true foundation of protection.",
            ta: "தெளிவான புரிதலே உண்மையான பாதுகாப்பு.",
          },
          quote: {
            en: "“The right time to understand your health insurance is before you step into a hospital—not at the billing counter.”",
            ta: "“இன்ஷூரன்ஸைப் புரிந்து கொள்ள வேண்டிய சரியான நேரம் மருத்துவமனைக்குச் செல்லும் முன்புதான்—பில் கவுண்டரில் அல்ல.”",
          },
          sub: {
            en: "Knowing exactly what your policy covers lets you navigate healthcare with absolute dignity and zero anxiety.",
            ta: "உங்கள் பாலிசி எவற்றையெல்லாம் ஏற்கும் என்பதை முன்கூட்டியே அறிவது எந்தவித பதற்றமுமின்றி சிகிச்சையை எதிர்கொள்ள உதவும்.",
          },
        },
        environment3D: "self",
      };
    }

    // Default single user scenario: Sudden Hospitalization
    return {
      id: "scenario_02_hospitalization",
      scenarioType: "hospitalization",
      title: {
        en: "The Sudden Hospitalization",
        ta: "திடீர் மருத்துவமனைச் சேர்க்கை",
      },
      emotionalTheme: {
        en: "When acute illness strikes, navigating hospital costs while living independently requires preparation.",
        ta: "திடீர் உடல்நலக்குறைவு ஏற்படும்போது, மருத்துவச் செலவுகளைத் தன்னம்பிக்கையுடன் எதிர்கொள்ள முன்கூட்டியே திட்டமிடல் அவசியம்.",
      },
      targetPerson: selfTarget,
      act1_normal: {
        headline: {
          en: "Imagine an ordinary evening at home.",
          ta: "ஒரு வழக்கமான மாலைப் பொழுதைக் கற்பனை செய்யுங்கள்.",
        },
        story: {
          en: "You have finished your daily tasks and are relaxing at home. Everything feels normal, safe, and under control.",
          ta: "உங்கள் வேலைகளை முடித்துவிட்டு நீங்கள் வீட்டில் ஓய்வெடுக்கிறீர்கள். எல்லாம் இயல்பாகவும் பாதுகாப்பாகவும் உள்ளது.",
        },
      },
      act2_interruption: {
        headline: {
          en: "Now imagine severe acute illness strikes unexpectedly.",
          ta: "திடீரென ஒரு கடுமையான உடல்நலக்குறைவு ஏற்படுகிறது.",
        },
        story: {
          en: "A sudden acute infection or acute condition requires you to be admitted immediately to a private hospital for intensive clinical care.",
          ta: "தீவிர தொற்று அல்லது கடுமையான வலி காரணமாக நீங்கள் உடனடியாக ஒரு தனியார் மருத்துவமனையில் அனுமதிக்கப்பட வேண்டியுள்ளது.",
        },
      },
      act3_hospital: {
        steps: [
          {
            stepNumber: "01",
            title: { en: "Urgent Hospital Admission", ta: "அவசர மருத்துவ அனுமதி" },
            desc: { en: "Emergency admission, registration, and initial intravenous stabilization.", ta: "அவசர சேர்க்கை, மருத்துவப் பதிவு மற்றும் உடனடி முதலுதவி." },
          },
          {
            stepNumber: "02",
            title: { en: "Comprehensive Diagnostics", ta: "விரிவான பரிசோதனைகள்" },
            desc: { en: "Full-panel pathology, contrast ultrasound, and continuous vital monitoring.", ta: "விரிவான இரத்தப் பரிசோதனை, அல்ட்ராசவுண்ட் ஸ்கேன் மற்றும் தொடர் கண்காணிப்பு." },
          },
          {
            stepNumber: "03",
            title: { en: "Active Medical Inpatient Care", ta: "தீவிர மருத்துவச் சிகிச்சை" },
            desc: { en: "Multi-day treatment, intravenous antibiotic infusion, and specialist rounds.", ta: "பல நாட்கள் தங்கி சிகிச்சை பெறுதல், நரம்பு வழி மருந்துகள் மற்றும் மருத்துவர் வருகை." },
          },
          {
            stepNumber: "04",
            title: { en: "Inpatient Room Stay", ta: "மருத்துவமனை அறைத் தங்கல்" },
            desc: { en: "Private room accommodation with dedicated round-the-clock nursing.", ta: "தனி அறை வாடகை மற்றும் 24 மணி நேர செவிலியர் பராமரிப்பு." },
          },
          {
            stepNumber: "05",
            title: { en: "Discharge & Recovery Summary", ta: "டிஸ்சார்ஜ் & நலம் பெறுதல்" },
            desc: { en: "Final hospital bill clearance, pharmacy handover, and home recovery plan.", ta: "இறுதி மருத்துவமனை பில் தீர்வு, மருந்துப் பரிந்துரைகள் மற்றும் நலம் பெறுதல்." },
          },
        ],
      },
      act4_bill: {
        totalAmount: 375000,
        breakdown: [
          { key: "traumaSurgery", amount: 165000, label: { en: "Specialist Inpatient Treatment", ta: "சிறப்பு மருத்துவ சிகிச்சை கட்டணம்" } },
          { key: "privateRoomStay", amount: 110000, label: { en: "Private Room Accommodation & Nursing", ta: "தனி அறை வாடகை & செவிலியர் பராமரிப்பு" } },
          { key: "diagnosticsScans", amount: 55000, label: { en: "Diagnostic Scans & Pathology", ta: "ஸ்கேன் மற்றும் ஆய்வகப் பரிசோதனைகள்" } },
          { key: "medicinesConsumables", amount: 45000, label: { en: "Pharmacy & Medical Infusions", ta: "மருந்துகள் & மருத்துவப் பொருட்கள்" } },
        ],
      },
      act5_personal_context: {
        savingsNote: {
          en: "When living independently, a ₹3.75 Lakh hospital expense directly challenges personal cash reserves.",
          ta: "சுயாதீனமாக வாழும்போது, ₹3.75 லட்சம் மருத்துவச் செலவு உங்கள் சொந்தச் சேமிப்பை நேரடியாகப் பாதிக்கிறது.",
        },
        insuranceNote: {
          en: "Having adequate personal health coverage prevents you from having to deplete personal savings during recovery.",
          ta: "போதுமான ஹெல்த் இன்ஷூரன்ஸ் இருப்பது சேமிப்பைக் கரைக்காமல் சிகிச்சையில் மட்டும் கவனம் செலுத்த உதவும்.",
        },
      },
      act6_decision: {
        question: {
          en: "If a ₹3.75 Lakh medical bill arrived unexpectedly, how would you handle it?",
          ta: "திடீரென ₹3.75 லட்சம் மருத்துவ பில் வந்தால், நீங்கள் அதை எவ்வாறு சமாளிப்பீர்கள்?",
        },
        sub: {
          en: "Select an option to see how different financial approaches respond.",
          ta: "நிதி ஆதாரங்களின் தாக்கத்தைப் பார்க்க ஒரு வழியைத் தேர்ந்தெடுக்கவும்.",
        },
      },
      act7_realization: {
        headline: {
          en: "Independence is backed by preparation.",
          ta: "சுயாதீன வாழ்க்கைக்கு முன்கூட்டிய திட்டமிடலே பலம்.",
        },
        quote: {
          en: "“Living independently is empowering. Having a strong health insurance buffer ensures that freedom stays protected.”",
          ta: "“சுயாதீனமாக வாழ்வது பெருமைக்குரியது. அதற்குப் பலமான ஹெல்த் இன்ஷூரன்ஸ் அரண் இருப்பது அந்த சுதந்திரத்தைப் பாதுகாக்கிறது.”",
        },
        sub: {
          en: "Health insurance guarantees that unexpected hospital costs are absorbed by a policy rather than your hard-earned life savings.",
          ta: "ஹெல்த் இன்ஷூரன்ஸ் எதிர்பாராத மருத்துவச் செலவுகளை உங்கள் சேமிப்பிற்குப் பதிலாக பாலிசியே ஏற்க வழிசெய்கிறது.",
        },
      },
      environment3D: "hospital",
    };
  }

  // -------------------------------------------------------------
  // 2. PARENTS RECORDED IN PROFILE
  // -------------------------------------------------------------
  if (parents.length > 0 && (primaryConcern === "parents_healthcare" || primaryConcern === "family_treatment")) {
    const parent = parents[0];
    const parentRel = parent.relationship === "Father" ? "Father" : "Mother";
    const parentTarget: TargetPerson = {
      characterType: "parent",
      familyMemberId: parent.id,
      relationship: parent.relationship,
      name: parent.name || (parent.relationship === "Father" ? "Your Father" : "Your Mother"),
      age: parent.age || 64,
      gender: parent.gender || (parent.relationship === "Father" ? "male" : "female"),
      isSelfOnly: false,
    };

    return {
      id: "scenario_04_parent",
      scenarioType: "parent",
      title: {
        en: `Healthcare for Your ${parentRel}`,
        ta: parentRel === "Father" ? "அப்பாவின் மருத்துவப் பராமரிப்பு" : "அம்மாவின் மருத்துவப் பராமரிப்பு",
      },
      emotionalTheme: {
        en: "Parents may become financially dependent on their children as healthcare needs increase with age.",
        ta: "வயதாகும்போது பெற்றோரின் மருத்துவத் தேவைகள் அதிகரிப்பதால், அவர்கள் பிள்ளைகளின் நிதிப் பாதுகாப்பைச் சார்ந்து நிற்கலாம்.",
      },
      targetPerson: parentTarget,
      act1_normal: {
        headline: {
          en: `Imagine a relaxed visit with your ${parentRel.toLowerCase()}.`,
          ta: `உங்கள் ${parentRel === "Father" ? "அப்பாவுடன்" : "அம்மாவுடன்"} மகிழ்ச்சியாக இருக்கும் தருணத்தைக் கற்பனை செய்யுங்கள்.`,
        },
        story: {
          en: `They spent decades caring for the family. Today, at ${parentTarget.age} years of age, you want them to live with comfort, dignity, and complete peace of mind.`,
          ta: `பல வருடங்களாகக் குடும்பத்தைக் காப்பாற்றியவர்கள். இன்று, ${parentTarget.age} வயதில், அவர்கள் கவலையின்றி நிம்மதியாக வாழ வேண்டும் என்று விரும்புகிறீர்கள்.`,
        },
      },
      act2_interruption: {
        headline: {
          en: `Now imagine an unexpected health concern arises.`,
          ta: `திடீரென ஒரு மருத்துவ அவசரநிலை ஏற்படுகிறது.`,
        },
        story: {
          en: `An acute cardiac or orthopedic joint complication requires your ${parentRel.toLowerCase()} to be admitted immediately for specialized senior citizen medical care.`,
          ta: `திடீர் இதயப் பிரச்சனை அல்லது மூட்டு பாதிப்பிற்கு உங்கள் ${parentRel === "Father" ? "அப்பாவிற்கு" : "அம்மாவிற்கு"} மூத்த குடிமக்கள் சிறப்பு மருத்துவ சிகிச்சை தேவைப்படுகிறது.`,
        },
      },
      act3_hospital: {
        steps: [
          {
            stepNumber: "01",
            title: { en: "Specialist Geriatric Admission", ta: "முதியோர் சிறப்பு சேர்க்கை" },
            desc: { en: "Echocardiogram, angiography / MRI scans, and senior specialist evaluation.", ta: "எக்கோ கார்டியோகிராம், ஆஞ்சியோகிராபி / எம்ஆர்ஐ ஸ்கேன் மற்றும் மூத்த மருத்துவர் பரிசோதனை." },
          },
          {
            stepNumber: "02",
            title: { en: "Specialized Procedure / Implant", ta: "சிறப்பு அறுவை சிகிச்சை / இம்ப்ளான்ட்" },
            desc: { en: "Stent placement or orthopedic joint surgery performed by expert teams.", ta: "ஸ்டென்ட் பொருத்துதல் அல்லது மூட்டு மாற்று அறுவை சிகிச்சை." },
          },
          {
            stepNumber: "03",
            title: { en: "Cardiac / Senior ICU Monitoring", ta: "இதய / முதியோர் தீவிரக் கண்காணிப்பு" },
            desc: { en: "Continuous rhythm monitoring and geriatric nursing supervision.", ta: "தொடர் இதயத் துடிப்பு கண்காணிப்பு மற்றும் சிறப்பு செவிலியர் பராமரிப்பு." },
          },
          {
            stepNumber: "04",
            title: { en: "Recovery Ward & Physiotherapy", ta: "மீட்பு வார்டு & இயன்முறை சிகிச்சை" },
            desc: { en: "Post-operative recovery, gentle mobility therapy, and vital stabilization.", ta: "அறுவை சிகிச்சைக்குப் பிந்தைய பராமரிப்பு, நடக்கும் பயிற்சி மற்றும் உடல்நிலை சீராதல்." },
          },
          {
            stepNumber: "05",
            title: { en: "Discharge & Long-Term Management", ta: "டிஸ்சார்ஜ் & நீண்ட கால மேலாண்மை" },
            desc: { en: "Discharge summary, specialized medication regimen, and home care plan.", ta: "டிஸ்சார்ஜ் சுருக்கம், தினசரி மருந்து அட்டவணை மற்றும் வீட்டில் ஓய்வு." },
          },
        ],
      },
      act4_bill: {
        totalAmount: 480000,
        breakdown: [
          { key: "cardiacOrthoProcedure", amount: 220000, label: { en: "Specialized Senior Procedure", ta: "முதியோர் சிறப்பு சிகிச்சை முறை" } },
          { key: "seniorIcuMonitoring", amount: 115000, label: { en: "Senior ICU Care & Monitoring", ta: "முதியோர் தீவிர கண்காணிப்பு" } },
          { key: "advancedImaging", amount: 50000, label: { en: "Advanced Cardiology Imaging", ta: "நவீன இதய இமேஜிங் & ஸ்கேன்" } },
          { key: "specializedImplants", amount: 55000, label: { en: "Certified Surgical Implants / Stents", ta: "அங்கீகரிக்கப்பட்ட இம்ப்ளான்ட் / ஸ்டென்ட்" } },
          { key: "nursingCare", amount: 40000, label: { en: "Geriatric Nursing Support", ta: "முதியோர் சிறப்பு செவிலியர் பராமரிப்பு" } },
        ],
      },
      act5_personal_context: {
        savingsNote: {
          en: "Senior citizen healthcare is an inevitable part of long-term family financial planning.",
          ta: "பெற்றோரின் மருத்துவச் செலவுகள் குடும்ப நிதித் திட்டமிடலின் மிக முக்கியப் பகுதியாகும்.",
        },
        insuranceNote: {
          en: "Having dedicated parent coverage ensures your parents receive top-tier private care with complete dignity.",
          ta: "பெற்றோருக்குத் தனி பாலிசி இருப்பது அவர்கள் கண்ணியத்துடன் சிறந்த சிகிச்சை பெற வழிசெய்கிறது.",
        },
      },
      act6_decision: {
        question: {
          en: `If your ${parentRel.toLowerCase()} needed ₹4.8 Lakhs in medical care, how would you want it handled?`,
          ta: `உங்கள் ${parentRel === "Father" ? "அப்பாவிற்கு" : "அம்மாவிற்கு"} ₹4.8 லட்சம் சிகிச்சை தேவைப்பட்டால், அதை எவ்வாறு நிர்வகிப்பீர்கள்?`,
        },
        sub: {
          en: "Explore how different financial avenues support timely care for your parents.",
          ta: "பெற்றோரின் சிகிச்சையை ஆதரிக்க பல்வேறு நிதி வழிகளை ஆராயுங்கள்.",
        },
      },
      act7_realization: {
        headline: {
          en: "Dignity and care for the generation before us.",
          ta: "நமக்கு முன்னால் நின்ற தலைமுறைக்கு மரியாதையும் பாதுகாப்பும்.",
        },
        quote: {
          en: "“Ensuring our parents receive the best medical attention is both a responsibility and an expression of gratitude.”",
          ta: "“நம் பெற்றோருக்கு சிறந்த மருத்துவ சிகிச்சை கிடைப்பதை உறுதி செய்வது நமது பொறுப்பும் நன்றியுணர்வும் ஆகும்.”",
        },
        sub: {
          en: "Health insurance designed for senior family members helps manage hospital bills with respect, security, and peace of mind.",
          ta: "முதியோருக்கான ஹெல்த் இன்ஷூரன்ஸ் அனுமதிக்கப்பட்ட செலவுகளை ஏற்று குடும்பத்திற்கு நிம்மதியை அளிக்கிறது.",
        },
      },
      environment3D: "parents",
    };
  }

  // -------------------------------------------------------------
  // 3. CHILDREN RECORDED IN PROFILE
  // -------------------------------------------------------------
  if (children.length > 0 && primaryConcern === "family_treatment") {
    const child = children[0];
    const childTarget: TargetPerson = {
      characterType: "child",
      familyMemberId: child.id,
      relationship: "Child",
      name: child.name || "Your Child",
      age: child.age || 6,
      gender: child.gender || "child",
      isSelfOnly: false,
    };

    return {
      id: "scenario_05_child",
      scenarioType: "child",
      title: {
        en: "Pediatric Care for Your Child",
        ta: "குழந்தைக்கான சிறப்பு மருத்துவப் பராமரிப்பு",
      },
      emotionalTheme: {
        en: "When your child needs medical care, arranging immediate treatment should happen without financial hesitation.",
        ta: "உங்கள் குழந்தைக்கு சிகிச்சை தேவைப்படும்போது, பணத்தைப் பற்றிய தயக்கமின்றி உடனடி சிகிச்சை கிடைக்க வேண்டும்.",
      },
      targetPerson: childTarget,
      act1_normal: {
        headline: {
          en: "Imagine an ordinary day watching your child play.",
          ta: "உங்கள் குழந்தை மகிழ்ச்சியாக விளையாடுவதைப் பார்க்கும் ஒரு நாளைக் கற்பனை செய்யுங்கள்.",
        },
        story: {
          en: `Your child (${childTarget.age} yrs) brings immense joy to your family. You are building savings and milestones for their bright future.`,
          ta: `உங்கள் குழந்தை (${childTarget.age} வயது) குடும்பத்திற்கு எல்லையற்ற மகிழ்ச்சியைத் தருகிறது. அவர்களின் எதிர்காலத்திற்காகப் பணத்தைச் சேமிக்கிறீர்கள்.`,
        },
      },
      act2_interruption: {
        headline: {
          en: "An acute pediatric illness develops suddenly.",
          ta: "திடீரென குழந்தைக்கு கடுமையான உடல்நலக்குறைவு ஏற்படுகிறது.",
        },
        story: {
          en: "Severe fever and respiratory symptoms require urgent pediatric emergency admission and high-dependency care.",
          ta: "கடுமையான காய்ச்சல் காரணமாக குழந்தையை அவசரமாக மருத்துவமனையில் அனுமதிக்க வேண்டிய நிலை ஏற்படுகிறது.",
        },
      },
      act3_hospital: {
        steps: [
          {
            stepNumber: "01",
            title: { en: "Pediatric Emergency Triage", ta: "குழந்தைகள் அவசரப் பிரிவு சேர்க்கை" },
            desc: { en: "Immediate pediatric triage, oxygen support, and IV fluid administration.", ta: "உடனடி குழந்தை மருத்துவர் மதிப்பீடு, ஆக்ஸிஜன் மற்றும் நரம்பு வழி குளுக்கோஸ்." },
          },
          {
            stepNumber: "02",
            title: { en: "Pediatric ICU (PICU) Monitoring", ta: "குழந்தைகள் தீவிர சிகிச்சைப் பிரிவு (PICU)" },
            desc: { en: "24-hour pediatric intensive care monitoring and specialized diagnostics.", ta: "24 மணி நேர தீவிரக் கண்காணிப்பு மற்றும் துல்லியமான இரத்தப் பரிசோதனை." },
          },
          {
            stepNumber: "03",
            title: { en: "Specialist Pediatric Therapy", ta: "சிறப்பு குழந்தை மருத்துவ சிகிச்சை" },
            desc: { en: "Consultations with senior pediatricians and targeted therapies.", ta: "குழந்தைகள் சிறப்பு மருத்துவர் ஆலோசனை மற்றும் தொடர் மருந்துகள்." },
          },
          {
            stepNumber: "04",
            title: { en: "Observation Ward Stay", ta: "கண்காணிப்பு வார்டு" },
            desc: { en: "Step-down room stay where parents remain present at the bedside.", ta: "காய்ச்சல் தணிந்து பெற்றோர் உடனிருக்கக்கூடிய தனி அறைத் தங்கல்." },
          },
          {
            stepNumber: "05",
            title: { en: "Safe Recovery & Discharge", ta: "பாதுகாப்பான மீட்சி & டிஸ்சார்ஜ்" },
            desc: { en: "Complete vital clearance, pediatric prescription handover, and home care.", ta: "முழுமையான குணம் அடைந்து மருத்துவர் ஆலோசனையுடன் வீடு திரும்புதல்." },
          },
        ],
      },
      act4_bill: {
        totalAmount: 310000,
        breakdown: [
          { key: "icuStay", amount: 110000, label: { en: "Pediatric ICU (PICU) Care", ta: "குழந்தைகள் தீவிர சிகிச்சைப் பிரிவு (PICU)" } },
          { key: "specialistConsultations", amount: 55000, label: { en: "Senior Pediatrician Rounds", ta: "குழந்தைகள் சிறப்பு மருத்துவர் கட்டணம்" } },
          { key: "diagnosticsScans", amount: 45000, label: { en: "Diagnostics, Cultures & Bloodwork", ta: "இரத்தப் பரிசோதனை & நோயறிதல்" } },
          { key: "medicinesConsumables", amount: 60000, label: { en: "Specialized Pediatric Medications", ta: "சிறப்பு குழந்தைகள் மருந்துகள்" } },
          { key: "postDischargeSupport", amount: 40000, label: { en: "Post-Discharge Follow-up Care", ta: "டிஸ்சார்ஜிற்குப் பிந்தைய பராமரிப்பு" } },
        ],
      },
      act5_personal_context: {
        savingsNote: {
          en: "Sudden pediatric emergencies often arrive before annual family savings buffers can absorb them.",
          ta: "குழந்தைகளுக்கான அவசரச் செலவுகள் மாதாந்திர பட்ஜெட்டை விட வேகமாக எகிறிவிடும்.",
        },
        insuranceNote: {
          en: "A comprehensive family floater policy ensures your child gets access to top pediatric hospitals without out-of-pocket stress.",
          ta: "குடும்ப ஹெல்த் இன்ஷூரன்ஸ் சிறந்த குழந்தைகள் மருத்துவமனையை அணுகும் துணிவைத் தருகிறது.",
        },
      },
      act6_decision: {
        question: {
          en: "If your child required ₹3.1 Lakhs in emergency care, how would your family fund it?",
          ta: "குழந்தைக்கு ₹3.1 லட்சம் அவசர சிகிச்சை தேவைப்பட்டால், நீங்கள் எவ்வாறு சமாளிப்பீர்கள்?",
        },
        sub: {
          en: "See how different financial sources support immediate pediatric decisions.",
          ta: "பல்வேறு நிதி வழிகள் உங்கள் முடிவுகளை எவ்வாறு ஆதரிக்கின்றன என்பதைப் பாருங்கள்.",
        },
      },
      act7_realization: {
        headline: {
          en: "Protecting our children's health and future.",
          ta: "குழந்தைகளின் ஆரோக்கியத்தையும் எதிர்காலத்தையும் பாதுகாத்தல்.",
        },
        quote: {
          en: "“When a child is unwell, parents should only have to think about holding their hand—not about the hospital bill.”",
          ta: "“குழந்தைக்கு உடல்நலமில்லாதபோது, பில்லைப் பற்றி சிந்திக்காமல் அவர்களின் கையைப் பிடித்துத் தேற்றுவதே பெற்றோரின் கடமை.”",
        },
        sub: {
          en: "Health insurance guarantees that your family's future education funds stay safe from unexpected pediatric medical bills.",
          ta: "ஹெல்த் இன்ஷூரன்ஸ் குழந்தைகளின் எதிர்காலக் கல்விச் சேமிப்பை மருத்துவ பில்களிலிருந்து பாதுகாக்கிறது.",
        },
      },
      environment3D: "child",
    };
  }

  // -------------------------------------------------------------
  // 4. MARRIED / COUPLE PROFILE (SPOUSE EXISTS)
  // -------------------------------------------------------------
  if (spouse) {
    const spouseTarget: TargetPerson = {
      characterType: "spouse",
      familyMemberId: spouse.id,
      relationship: "Spouse",
      name: spouse.name || "Your Spouse",
      age: spouse.age || userAge,
      gender: spouse.gender || (userGender === "male" ? "female" : "male"),
      isSelfOnly: false,
    };

    return {
      id: "scenario_02_hospitalization",
      scenarioType: "hospitalization",
      title: {
        en: "Protecting You and Your Partner",
        ta: "நீங்களும் உங்கள் துணைவரும்",
      },
      emotionalTheme: {
        en: "When building a household together, an unexpected medical situation tests your joint financial resilience.",
        ta: "இருவராக இணைந்து ஒரு குடும்பத்தை உருவாக்கும்போது, திடீர் மருத்துவச் செலவு உங்கள் நிதிப் பலத்தை சோதிக்கிறது.",
      },
      targetPerson: spouseTarget,
      act1_normal: {
        headline: {
          en: "Imagine a peaceful evening with your partner.",
          ta: "உங்கள் துணைவருடன் அமைதியாக இருக்கும் ஒரு மாலையைக் கற்பனை செய்யுங்கள்.",
        },
        story: {
          en: "Dinner together, talking about work and future household milestones. You share responsibilities and support each other's dreams.",
          ta: "இரவு உணவு, வேலை மற்றும் குடும்பத்தின் எதிர்காலத் திட்டங்களைப் பற்றிய பேச்சு. ஒருவருக்கொருவர் துணையாக இருக்கிறீர்கள்.",
        },
      },
      act2_interruption: {
        headline: {
          en: "Now imagine one of you suddenly needs hospital admission.",
          ta: "திடீரென உங்களில் ஒருவருக்கு மருத்துவமனைச் சேர்க்கை தேவைப்படுகிறது.",
        },
        story: {
          en: "An acute medical condition or urgent surgical procedure requires immediate inpatient hospitalization at a private hospital.",
          ta: "திடீர் உடல்நலக்குறைவு காரணமாக உங்களில் ஒருவர் உடனடியாக ஒரு தனியார் மருத்துவமனையில் அனுமதிக்கப்பட வேண்டிய சூழல் ஏற்படுகிறது.",
        },
      },
      act3_hospital: {
        steps: [
          {
            stepNumber: "01",
            title: { en: "Emergency Evaluation & Admission", ta: "அவசர மதிப்பீடு & அனுமதி" },
            desc: { en: "Initial diagnostic panel, registration, and specialist consultation.", ta: "ஆரம்பப் பரிசோதனை, மருத்துவப் பதிவு மற்றும் சிறப்பு மருத்துவர் ஆலோசனை." },
          },
          {
            stepNumber: "02",
            title: { en: "Comprehensive Diagnostics & Scans", ta: "விரிவான ஸ்கேன் & சோதனைகள்" },
            desc: { en: "Ultrasound, blood workup, and clinical laboratory investigations.", ta: "அல்ட்ராசவுண்ட், சிறப்பு இரத்தப் பரிசோதனைகள் மற்றும் ஆய்வக மதிப்பீடு." },
          },
          {
            stepNumber: "03",
            title: { en: "Inpatient Medical / Surgical Care", ta: "மருத்துவ / அறுவை சிகிச்சை" },
            desc: { en: "Procedure scheduling, dedicated operating care, and medication.", ta: "ஆபரேஷன் தியேட்டர் சிகிச்சை, நிபுணர் பராமரிப்பு மற்றும் மருந்துகள்." },
          },
          {
            stepNumber: "04",
            title: { en: "Private Room Stay & Nursing", ta: "மருத்துவமனை தங்கல் & செவிலியர்" },
            desc: { en: "Multi-day inpatient room stay with continuous nursing support.", ta: "பல நாட்கள் அறைத் தங்கல் மற்றும் தொடர் செவிலியர் உதவி." },
          },
          {
            stepNumber: "05",
            title: { en: "Settlement & Safe Discharge", ta: "பில் தீர்வு & டிஸ்சார்ஜ்" },
            desc: { en: "Hospital bill settlement, prescription release, and convalescence.", ta: "இறுதி மருத்துவமனை பில் விவரம் மற்றும் மருந்துப் பரிந்துரைகள்." },
          },
        ],
      },
      act4_bill: {
        totalAmount: 400000,
        breakdown: [
          { key: "traumaSurgery", amount: 180000, label: { en: "Operating Theatre & Surgical Care", ta: "ஆபரேஷன் தியேட்டர் கட்டணம் & சிகிச்சை" } },
          { key: "privateRoomStay", amount: 120000, label: { en: "Private Room Stay & Nursing Care", ta: "தனி அறை வாடகை & செவிலியர் பராமரிப்பு" } },
          { key: "medicinesConsumables", amount: 65000, label: { en: "Medications & Medical Consumables", ta: "மருந்துகள் & மருத்துவப் பொருட்கள்" } },
          { key: "diagnosticsScans", amount: 35000, label: { en: "Diagnostics, Bloodwork & Scans", ta: "நோயறிதல் சோதனைகள் & ஸ்கேன்" } },
        ],
      },
      act5_personal_context: {
        savingsNote: {
          en: "A sudden ₹4 Lakh hospital bill can interrupt joint household goals like buying a home or taking a sabbatical.",
          ta: "திடீர் ₹4 லட்சம் மருத்துவச் செலவு சொந்த வீடு வாங்குவது போன்ற உங்கள் கூட்டுக் கனவுகளைத் தாமதப்படுத்தலாம்.",
        },
        insuranceNote: {
          en: "A couple's health cover shields your combined earnings from medical inflation.",
          ta: "இருவருக்குமான ஹெல்த் இன்ஷூரன்ஸ் உங்கள் கடின உழைப்பின் வருமானத்தை மருத்துவப் பணவீக்கத்திலிருந்து பாதுகாக்கிறது.",
        },
      },
      act6_decision: {
        question: {
          en: "If a ₹4 Lakh medical bill arrived unexpectedly, how would you manage it?",
          ta: "திடீரென ₹4 லட்சம் மருத்துவச் செலவு வந்தால், நீங்கள் இருவரும் அதை எவ்வாறு சமாளிப்பீர்கள்?",
        },
        sub: {
          en: "Explore how different financial sources support your household.",
          ta: "நிதி ஆதாரங்களின் தாக்கத்தைப் பார்க்க ஒரு வழியைத் தேர்ந்தெடுக்கவும்.",
        },
      },
      act7_realization: {
        headline: {
          en: "Partnership through all of life's seasons.",
          ta: "வாழ்க்கையின் எல்லா தருணங்களிலும் துணை நிற்பது.",
        },
        quote: {
          en: "“When someone you love is hospitalized, the conversation should be about healing—not liquidating investments.”",
          ta: "“குடும்பத்தில் ஒருவர் மருத்துவமனையில் இருக்கும்போது, சேமிப்பைக் கலைப்பதைப் பற்றி யோசிக்காமல் சிகிச்சையை மட்டுமே சிந்திக்க வேண்டும்.”",
        },
        sub: {
          en: "Health insurance provides a shared shield absorbing eligible hospital expenses so your life plans continue unaffected.",
          ta: "ஹெல்த் இன்ஷூரன்ஸ் அனுமதிக்கப்பட்ட மருத்துவச் செலவுகளை ஏற்று உங்கள் எதிர்காலத் திட்டங்கள் தடையின்றித் தொடர வழிசெய்கிறது.",
        },
      },
      environment3D: "hospital",
    };
  }

  // -------------------------------------------------------------
  // 5. DEFAULT FALLBACK: PURE USER SCENARIO
  // -------------------------------------------------------------
  const selfFallback: TargetPerson = {
    characterType: "self",
    familyMemberId: "self",
    relationship: "You",
    name: "You",
    age: userAge,
    gender: userGender,
    isSelfOnly: true,
  };

  return {
    id: "scenario_02_hospitalization",
    scenarioType: "hospitalization",
    title: {
      en: "The Sudden Hospitalization",
      ta: "திடீர் மருத்துவமனைச் சேர்க்கை",
    },
    emotionalTheme: {
      en: "Life can change in a moment, while your personal responsibilities continue.",
      ta: "வாழ்க்கை ஒரு கணத்தில் மாறலாம், ஆனால் உங்கள் சொந்தப் பொறுப்புகள் தொடர்ந்து கொண்டே இருக்கும்.",
    },
    targetPerson: selfFallback,
    act1_normal: {
      headline: {
        en: "Imagine an ordinary day going as planned.",
        ta: "திட்டமிட்டபடி செல்லும் ஒரு சாதாரண நாளைக் கற்பனை செய்யுங்கள்.",
      },
      story: {
        en: "You are focused on your work, your independence, and your future goals.",
        ta: "உங்கள் தொழில், சுதந்திரம் மற்றும் எதிர்கால இலக்குகளில் கவனம் செலுத்துகிறீர்கள்.",
      },
    },
    act2_interruption: {
      headline: {
        en: "Now imagine an unexpected medical situation arises.",
        ta: "திடீரென ஒரு எதிர்பாராத மருத்துவச் சூழல் ஏற்படுகிறது.",
      },
      story: {
        en: "An acute medical emergency requires you to be admitted immediately to a private hospital for intensive clinical care.",
        ta: "தீவிர உடல்நலக்குறைவு காரணமாக நீங்கள் அவசரமாக மருத்துவமனையில் அனுமதிக்கப்பட வேண்டியுள்ளது.",
      },
    },
    act3_hospital: {
      steps: [
        {
          stepNumber: "01",
          title: { en: "Urgent Hospital Admission", ta: "அவசர மருத்துவ அனுமதி" },
          desc: { en: "Emergency admission, registration, and initial stabilization.", ta: "அவசர சேர்க்கை, மருத்துவப் பதிவு மற்றும் உடனடி முதலுதவி." },
        },
        {
          stepNumber: "02",
          title: { en: "Comprehensive Diagnostics", ta: "விரிவான பரிசோதனைகள்" },
          desc: { en: "Full-panel pathology, contrast imaging, and vital monitoring.", ta: "விரிவான இரத்தப் பரிசோதனை, ஸ்கேன் மற்றும் தொடர் கண்காணிப்பு." },
        },
        {
          stepNumber: "03",
          title: { en: "Specialist Inpatient Care", ta: "தீவிர மருத்துவச் சிகிச்சை" },
          desc: { en: "Multi-day treatment, intravenous pharmaceuticals, and specialist care.", ta: "பல நாட்கள் தங்கி சிகிச்சை பெறுதல் மற்றும் மருத்துவர் வருகை." },
        },
        {
          stepNumber: "04",
          title: { en: "Inpatient Room Stay", ta: "மருத்துவமனை அறைத் தங்கல்" },
          desc: { en: "Private room accommodation with dedicated round-the-clock nursing.", ta: "தனி அறை வாடகை மற்றும் 24 மணி நேர செவிலியர் பராமரிப்பு." },
        },
        {
          stepNumber: "05",
          title: { en: "Discharge & Recovery", ta: "டிஸ்சார்ஜ் & நலம் பெறுதல்" },
          desc: { en: "Final hospital bill clearance and home recovery plan.", ta: "இறுதி மருத்துவமனை பில் தீர்வு மற்றும் நலம் பெறுதல்." },
        },
      ],
    },
    act4_bill: {
      totalAmount: 375000,
      breakdown: [
        { key: "traumaSurgery", amount: 165000, label: { en: "Specialist Medical Care", ta: "சிறப்பு மருத்துவ சிகிச்சை" } },
        { key: "privateRoomStay", amount: 110000, label: { en: "Room Accommodation & Nursing", ta: "அறை வாடகை & செவிலியர் கட்டணம்" } },
        { key: "diagnosticsScans", amount: 55000, label: { en: "Diagnostic Scans & Pathology", ta: "ஸ்கேன் மற்றும் ஆய்வகப் பரிசோதனைகள்" } },
        { key: "medicinesConsumables", amount: 45000, label: { en: "Pharmacy & Consumables", ta: "மருந்துகள் & மருத்துவப் பொருட்கள்" } },
      ],
    },
    act5_personal_context: {
      savingsNote: {
        en: "A sudden hospital expense directly challenges personal cash reserves.",
        ta: "திடீர் மருத்துவச் செலவு உங்கள் சொந்தச் சேமிப்பை நேரடியாகப் பாதிக்கிறது.",
      },
      insuranceNote: {
        en: "Having adequate personal health coverage prevents you from having to deplete personal savings during recovery.",
        ta: "போதுமான ஹெல்த் இன்ஷூரன்ஸ் இருப்பது சேமிப்பைக் கரைக்காமல் சிகிச்சையில் மட்டும் கவனம் செலுத்த உதவும்.",
      },
    },
    act6_decision: {
      question: {
        en: "If a ₹3.75 Lakh medical bill arrived unexpectedly, how would you handle it?",
        ta: "திடீரென ₹3.75 லட்சம் மருத்துவ பில் வந்தால், நீங்கள் அதை எவ்வாறு சமாளிப்பீர்கள்?",
      },
      sub: {
        en: "Select an option to see how different financial approaches respond.",
        ta: "நிதி ஆதாரங்களின் தாக்கத்தைப் பார்க்க ஒரு வழியைத் தேர்ந்தெடுக்கவும்.",
      },
    },
    act7_realization: {
      headline: {
        en: "Focusing on healing instead of cost.",
        ta: "செலவைப் பற்றிய கவலையின்றி சிகிச்சையில் கவனம் செலுத்துதல்.",
      },
      quote: {
        en: "“Living independently is empowering. Having a strong health insurance buffer ensures that freedom stays protected.”",
        ta: "“சுயாதீனமாக வாழ்வது பெருமைக்குரியது. அதற்குப் பலமான ஹெல்த் இன்ஷூரன்ஸ் அரண் இருப்பது அந்த சுதந்திரத்தைப் பாதுகாக்கிறது.”",
      },
      sub: {
        en: "Health insurance guarantees that unexpected hospital costs are absorbed by a policy rather than your hard-earned savings.",
        ta: "ஹெல்த் இன்ஷூரன்ஸ் எதிர்பாராத மருத்துவச் செலவுகளை உங்கள் சேமிப்பிற்குப் பதிலாக பாலிசியே ஏற்க வழிசெய்கிறது.",
      },
    },
    environment3D: "hospital",
  };
}
