"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Home,
  Sliders,
  AlertTriangle,
  Info,
  DollarSign,
} from "lucide-react";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface Chapter2BoundariesProps {
  onNextChapter: () => void;
  onPrevChapter: () => void;
}

export const Chapter2Boundaries: React.FC<Chapter2BoundariesProps> = ({
  onNextChapter,
  onPrevChapter,
}) => {
  const { language, t } = useLanguage();
  const lang = language === "ta" ? "ta" : "en";
  const ch = t.stage3.chapter2;

  // Interactive Sorter State
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<"all" | "covered" | "not_covered">("all");

  // Room Rent Simulator State
  const [selectedRoom, setSelectedRoom] = useState<"standard" | "deluxe">("standard");

  // Deductible & Copay Interactive Values
  const [sampleBillAmount, setSampleBillAmount] = useState<number>(300000); // ₹3,00,000
  const [copayPercent, setCopayPercent] = useState<number>(20); // 20%
  const [deductibleVal, setDeductibleVal] = useState<number>(25000); // ₹25,000

  // Calculation for Deductible + Copay
  const afterDeductible = Math.max(0, sampleBillAmount - deductibleVal);
  const customerCopayShare = Math.round((afterDeductible * copayPercent) / 100);
  const totalCustomerResponsibility = deductibleVal + customerCopayShare;
  const insurerResponsibility = Math.max(0, sampleBillAmount - totalCustomerResponsibility);

  // Sorter Items
  const sorterItems = [
    {
      id: "icu",
      type: "covered",
      title: lang === "ta" ? "ஐசியூ (ICU) & மருத்துவர் கட்டணம்" : "ICU & Specialist Surgeon Fees",
      desc: lang === "ta" ? "அவசரக் கண்காணிப்பு, அறுவை சிகிச்சை மற்றும் மூத்த மருத்துவர் வருகைகள்." : "Urgent critical care, operations, and attending physician charges.",
    },
    {
      id: "consumables",
      type: "not_covered",
      title: lang === "ta" ? "மருத்துவ நுகர்பொருட்கள் (Consumables)" : "Non-Medical Consumables & PPE",
      desc: lang === "ta" ? "கையுறைகள், பஞ்சு, நிர்வாகக் கட்டணங்கள் மற்றும் தூய்மைப் பொருட்கள்." : "Gloves, syringes, administrative kits, and hygiene materials.",
    },
    {
      id: "diagnostics",
      type: "covered",
      title: lang === "ta" ? "சேர்க்கைக்கு முந்தைய ஸ்கேன்கள்" : "Pre-Hospitalization Diagnostics",
      desc: lang === "ta" ? "அனுமதிக்கு 30–60 நாட்களுக்கு முன் செய்யப்பட்ட இரத்தப் பரிசோதனைகள், MRI." : "Doctor visits, MRI, and blood tests leading to admission (30–60 days).",
    },
    {
      id: "room_overage",
      type: "not_covered",
      title: lang === "ta" ? "அறை வாடகை வரம்பிற்கு மேற்பட்ட கூடுதல் செலவு" : "Room Rent Limit Overage",
      desc: lang === "ta" ? "பாலிசி அனுமதித்ததை விட உயர்ந்த டீலக்ஸ் அறையைத் தேர்ந்தெடுக்கும் போது ஏற்படும் கூடுதல் கட்டணம்." : "Tariff excess from picking a suite beyond your contractual room category.",
    },
    {
      id: "daycare",
      type: "covered",
      title: lang === "ta" ? "டேகேர் சிகிச்சைகள் (Daycare)" : "Daycare Medical Procedures",
      desc: lang === "ta" ? "24 மணி நேரம் தங்கத் தேவையில்லாத கண்புரை, டயாலிசிஸ் சிகிச்சைகள்." : "Procedures not requiring overnight stay (e.g. cataract, chemotherapy).",
    },
    {
      id: "unproven",
      type: "not_covered",
      title: lang === "ta" ? "நிரூபிக்கப்படாத மாற்று சிகிச்சைகள்" : "Unproven / Experimental Therapies",
      desc: lang === "ta" ? "அறிவியல் பூர்வமாக அங்கீகரிக்கப்படாத அல்லது பாலிசியில் விலக்கப்பட்ட சிகிச்சைகள்." : "Unrecognized therapies or cosmetic aesthetic enhancements.",
    },
  ];

  const filteredSorterItems = sorterItems.filter((it) => {
    if (activeCategoryFilter === "all") return true;
    return it.type === activeCategoryFilter;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-10 select-none animate-fadeIn">
      {/* Chapter Badge Header */}
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

      {/* 1. Interactive Expense Sorter */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-3">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">{ch.sorterTitle}</h3>
            <p className="text-xs text-ink-soft mt-0.5">{ch.sorterSub}</p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => {
                sound.playSoftPulse();
                setActiveCategoryFilter("all");
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                activeCategoryFilter === "all"
                  ? "bg-ink text-white font-medium"
                  : "bg-bg-soft text-ink-soft hover:text-ink border border-hairline"
              }`}
            >
              {lang === "ta" ? "அனைத்தும்" : "All Items"}
            </button>
            <button
              onClick={() => {
                sound.playSoftPulse();
                setActiveCategoryFilter("covered");
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                activeCategoryFilter === "covered"
                  ? "bg-sage-100 text-ink border border-sage-300 font-semibold"
                  : "bg-bg-soft text-ink-soft hover:text-ink border border-hairline"
              }`}
            >
              {lang === "ta" ? "ஏற்கப்படலாம்" : "May Be Covered"}
            </button>
            <button
              onClick={() => {
                sound.playSoftPulse();
                setActiveCategoryFilter("not_covered");
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                activeCategoryFilter === "not_covered"
                  ? "bg-rose-100 text-rose-800 border border-rose-200 font-semibold"
                  : "bg-bg-soft text-ink-soft hover:text-ink border border-hairline"
              }`}
            >
              {lang === "ta" ? "உங்கள் பங்கு" : "Customer Share"}
            </button>
          </div>
        </div>

        {/* Sorter Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSorterItems.map((item) => {
            const isCovered = item.type === "covered";

            return (
              <div
                key={item.id}
                className={`p-4 rounded-[16px] border transition-all flex flex-col justify-between ${
                  isCovered
                    ? "bg-sage-100/40 border-sage-200"
                    : "bg-rose-50/50 border-rose-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isCovered
                          ? "bg-white text-ink border border-sage-300 font-medium"
                          : "bg-white text-rose-700 border border-rose-200 font-medium"
                      }`}
                    >
                      {isCovered ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-rose-600" />}
                      <span>{isCovered ? (lang === "ta" ? "ஏற்கப்படலாம்" : "May Be Covered") : (lang === "ta" ? "உங்கள் பொறுப்பு" : "Customer Share")}</span>
                    </span>
                  </div>
                  <h4 className="font-sans text-sm font-semibold text-ink mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Three-Phase Care Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-6">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">{ch.timelineTitle}</h3>
          <p className="text-xs text-ink-soft mt-1">{ch.timelineSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ch.phases.map((ph, idx) => (
            <div
              key={idx}
              className="p-5 rounded-[16px] bg-bg-soft border border-hairline flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center space-x-2 text-ink text-xs font-mono mb-2">
                  <Clock className="w-3.5 h-3.5 text-lavender-600" />
                  <span className="font-semibold">{ph.timing}</span>
                </div>
                <h4 className="font-display text-base text-ink font-semibold mb-1.5">
                  {ph.phase}
                </h4>
                <p className="text-xs text-ink-soft leading-relaxed">
                  {ph.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Daycare Banner */}
        <div className="p-4 rounded-[16px] bg-bg-soft border border-hairline flex items-start space-x-3 text-xs leading-relaxed text-ink-soft">
          <Info className="w-4 h-4 text-lavender-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-ink font-sans text-sm font-semibold block mb-0.5">{ch.daycareTitle}</strong>
            {ch.daycareSub}
          </div>
        </div>
      </div>

      {/* 3. Room Rent Simulator */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">{ch.roomRentTitle}</h3>
            <p className="text-xs text-ink-soft mt-0.5">{ch.roomRentSub}</p>
          </div>
          <Home className="w-5 h-5 text-lavender-600 self-start sm:self-auto" />
        </div>

        {/* Room Selection Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              sound.playSoftPulse();
              setSelectedRoom("standard");
            }}
            className={`p-5 rounded-[16px] text-left border transition-all ${
              selectedRoom === "standard"
                ? "bg-lavender-100 border-lavender-600 shadow-sm"
                : "bg-bg-soft border-hairline hover:border-lavender-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-base font-semibold text-ink">
                {ch.roomRentSimulator.standardTitle}
              </span>
              {selectedRoom === "standard" && <CheckCircle2 className="w-4 h-4 text-lavender-600" />}
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              {ch.roomRentSimulator.standardImpact}
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playSoftPulse();
              setSelectedRoom("deluxe");
            }}
            className={`p-5 rounded-[16px] text-left border transition-all ${
              selectedRoom === "deluxe"
                ? "bg-rose-50 border-rose-300 shadow-sm"
                : "bg-bg-soft border-hairline hover:border-rose-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-base font-semibold text-ink">
                {ch.roomRentSimulator.deluxeTitle}
              </span>
              {selectedRoom === "deluxe" && <AlertTriangle className="w-4 h-4 text-rose-500" />}
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              {ch.roomRentSimulator.deluxeImpact}
            </p>
          </button>
        </div>
      </div>

      {/* 4. Deductible & Co-Payment Calculator */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-hairline shadow-subtle space-y-6">
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">{ch.costSharingTitle}</h3>
            <p className="text-xs text-ink-soft mt-0.5">
              {lang === "ta" ? "உங்கள் பங்கும் இன்ஷூரன்ஸ் பங்கும் எவ்வாறு பிரிக்கப்படுகிறது என்று பாருங்கள்:" : "Interactive visualization of customer responsibility vs insurer settlement:"}
            </p>
          </div>
          <Sliders className="w-5 h-5 text-lavender-600" />
        </div>

        {/* Live Calculation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-[16px] bg-bg-soft border border-hairline">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-soft block mb-1">
              {lang === "ta" ? "மாதிரி மருத்துவ பில்" : "Sample Eligible Bill"}
            </span>
            <div className="font-display text-2xl font-bold text-ink">₹{sampleBillAmount.toLocaleString("en-IN")}</div>
            <span className="text-[10px] font-mono text-muted mt-1 block">
              Deductible: ₹{deductibleVal.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="p-4 rounded-[16px] bg-rose-50 border border-rose-200">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-800 block mb-1 font-semibold">
              {lang === "ta" ? "உங்கள் மொத்தப் பொறுப்பு" : "Your Total Share"}
            </span>
            <div className="font-display text-2xl font-bold text-rose-900">
              ₹{totalCustomerResponsibility.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] font-mono text-rose-700 mt-1 block">
              Deductible + {copayPercent}% Co-pay
            </span>
          </div>

          <div className="p-4 rounded-[16px] bg-sage-100/60 border border-sage-300">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink block mb-1 font-semibold">
              {lang === "ta" ? "இன்ஷூரன்ஸ் செலுத்தும் பங்கு" : "Insurer Settlement"}
            </span>
            <div className="font-display text-2xl font-bold text-ink">
              ₹{insurerResponsibility.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] font-mono text-ink-soft mt-1 block">
              Eligible Insurer Share
            </span>
          </div>
        </div>

        <div className="p-4 rounded-[16px] bg-bg-soft border border-hairline text-xs text-ink-soft leading-relaxed">
          {ch.nonPayableDesc}
        </div>
      </div>

      {/* Navigation Stepper */}
      <div className="pt-4 flex items-center justify-between border-t border-hairline">
        <button
          onClick={() => {
            sound.playChime(380, 0.1);
            window.scrollTo({ top: 0, behavior: "smooth" });
            onPrevChapter();
          }}
          className="px-5 py-3 rounded-full bg-white border border-hairline text-xs font-mono text-ink-soft hover:text-ink hover:bg-bg-soft transition-all"
        >
          {t.stage3.nav.prevChapter}
        </button>

        <button
          onClick={() => {
            sound.playChime(580, 0.12);
            window.scrollTo({ top: 0, behavior: "smooth" });
            onNextChapter();
          }}
          className="btn-primary min-h-[44px] px-8 py-4 text-xs group inline-flex items-center space-x-3"
        >
          <span>{t.stage3.nav.nextChapter}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
