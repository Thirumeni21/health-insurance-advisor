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
      <div className="text-center sm:text-left space-y-2 border-b border-glass-border pb-4">
        <span className="text-[11px] font-mono tracking-widest uppercase text-burnished-copper block">
          {ch.badge}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-warm-ivory">
          {ch.headline}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-dusty-mauve font-light leading-relaxed max-w-2xl">
          {ch.subheading}
        </p>
      </div>

      {/* 1. Interactive Expense Sorter */}
      <div className="luxury-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-glass-border pb-3">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-warm-ivory">{ch.sorterTitle}</h3>
            <p className="text-xs text-dusty-mauve font-light mt-0.5">{ch.sorterSub}</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 self-start sm:self-auto">
            <button
              onClick={() => {
                sound.playSoftPulse();
                setActiveCategoryFilter("all");
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                activeCategoryFilter === "all"
                  ? "bg-burnished-copper text-warm-ivory shadow-copper-glow"
                  : "bg-deep-aubergine text-dusty-mauve hover:text-warm-ivory border border-glass-border"
              }`}
            >
              {lang === "ta" ? "அனைத்தும்" : "All Items"}
            </button>
            <button
              onClick={() => {
                sound.playSoftPulse();
                setActiveCategoryFilter("covered");
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                activeCategoryFilter === "covered"
                  ? "bg-emerald-800/80 text-warm-ivory border border-emerald-500/50"
                  : "bg-deep-aubergine text-dusty-mauve hover:text-warm-ivory border border-glass-border"
              }`}
            >
              {lang === "ta" ? "ஏற்கப்படலாம்" : "May Be Covered"}
            </button>
            <button
              onClick={() => {
                sound.playSoftPulse();
                setActiveCategoryFilter("not_covered");
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                activeCategoryFilter === "not_covered"
                  ? "bg-rose-900/80 text-warm-ivory border border-rose-500/50"
                  : "bg-deep-aubergine text-dusty-mauve hover:text-warm-ivory border border-glass-border"
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
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCovered
                    ? "bg-deep-aubergine/80 border-emerald-500/30 hover:border-emerald-500/60"
                    : "bg-deep-aubergine/80 border-rose-500/30 hover:border-rose-500/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isCovered
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                          : "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                      }`}
                    >
                      {isCovered ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{isCovered ? (lang === "ta" ? "ஏற்கப்படலாம்" : "May Be Covered") : (lang === "ta" ? "உங்கள் பொறுப்பு" : "Customer Share")}</span>
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-warm-ivory mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-dusty-mauve font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Three-Phase Care Timeline */}
      <div className="luxury-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl text-warm-ivory">{ch.timelineTitle}</h3>
          <p className="text-xs text-dusty-mauve font-light mt-1">{ch.timelineSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ch.phases.map((ph, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-deep-aubergine/70 border border-glass-border flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center space-x-2 text-burnished-copper text-xs font-mono mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{ph.timing}</span>
                </div>
                <h4 className="font-serif text-base text-warm-ivory font-semibold mb-1.5">
                  {ph.phase}
                </h4>
                <p className="text-xs text-dusty-mauve font-light leading-relaxed">
                  {ph.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Daycare Banner */}
        <div className="p-4 rounded-2xl bg-obsidian-plum/80 border border-burnished-copper/30 flex items-start space-x-3 text-xs leading-relaxed font-light text-dusty-mauve">
          <Info className="w-4 h-4 text-burnished-copper flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-warm-ivory font-serif text-sm block mb-0.5">{ch.daycareTitle}</strong>
            {ch.daycareSub}
          </div>
        </div>
      </div>

      {/* 3. Room Rent Simulator (Room A vs Room B) */}
      <div className="luxury-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-glass-border pb-3">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-warm-ivory">{ch.roomRentTitle}</h3>
            <p className="text-xs text-dusty-mauve font-light mt-0.5">{ch.roomRentSub}</p>
          </div>
          <Home className="w-5 h-5 text-burnished-copper self-start sm:self-auto" />
        </div>

        {/* Room Selection Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              sound.playSoftPulse();
              setSelectedRoom("standard");
            }}
            className={`p-5 rounded-2xl text-left border transition-all ${
              selectedRoom === "standard"
                ? "bg-burnished-copper/20 border-burnished-copper shadow-copper-glow"
                : "bg-deep-aubergine/70 border-glass-border hover:border-burnished-copper/40"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif text-base font-bold text-warm-ivory">
                {ch.roomRentSimulator.standardTitle}
              </span>
              {selectedRoom === "standard" && <CheckCircle2 className="w-4 h-4 text-burnished-copper" />}
            </div>
            <p className="text-xs text-warm-ivory/90 font-light leading-relaxed">
              {ch.roomRentSimulator.standardImpact}
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playSoftPulse();
              setSelectedRoom("deluxe");
            }}
            className={`p-5 rounded-2xl text-left border transition-all ${
              selectedRoom === "deluxe"
                ? "bg-rose-950/40 border-rose-500/80 shadow-lg"
                : "bg-deep-aubergine/70 border-glass-border hover:border-rose-500/40"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif text-base font-bold text-warm-ivory">
                {ch.roomRentSimulator.deluxeTitle}
              </span>
              {selectedRoom === "deluxe" && <AlertTriangle className="w-4 h-4 text-rose-400" />}
            </div>
            <p className="text-xs text-rose-200/90 font-light leading-relaxed">
              {ch.roomRentSimulator.deluxeImpact}
            </p>
          </button>
        </div>
      </div>

      {/* 4. Deductible & Co-Payment Calculator */}
      <div className="luxury-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between border-b border-glass-border pb-3">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-warm-ivory">{ch.costSharingTitle}</h3>
            <p className="text-xs text-dusty-mauve font-light mt-0.5">
              {lang === "ta" ? "உங்கள் பங்கும் இன்ஷூரன்ஸ் பங்கும் எவ்வாறு பிரிக்கப்படுகிறது என்று பாருங்கள்:" : "Interactive visualization of customer responsibility vs insurer settlement:"}
            </p>
          </div>
          <Sliders className="w-5 h-5 text-burnished-copper" />
        </div>

        {/* Live Calculation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-deep-aubergine/80 border border-glass-border">
            <span className="text-[10px] font-mono uppercase tracking-wider text-dusty-mauve block mb-1">
              {lang === "ta" ? "மாதிரி மருத்துவ பில்" : "Sample Eligible Bill"}
            </span>
            <div className="font-serif text-2xl font-bold text-warm-ivory">₹{sampleBillAmount.toLocaleString("en-IN")}</div>
            <span className="text-[10px] font-mono text-dusty-mauve/70 mt-1 block">
              Deductible: ₹{deductibleVal.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 block mb-1">
              {lang === "ta" ? "உங்கள் மொத்தப் பொறுப்பு" : "Your Total Share"}
            </span>
            <div className="font-serif text-2xl font-bold text-rose-200">
              ₹{totalCustomerResponsibility.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] font-mono text-rose-300/70 mt-1 block">
              Deductible + {copayPercent}% Co-pay
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 block mb-1">
              {lang === "ta" ? "இன்ஷூரன்ஸ் செலுத்தும் பங்கு" : "Insurer Settlement"}
            </span>
            <div className="font-serif text-2xl font-bold text-emerald-200">
              ₹{insurerResponsibility.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] font-mono text-emerald-300/70 mt-1 block">
              Eligible Insurer Share
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-obsidian-plum/80 border border-glass-border text-xs text-dusty-mauve leading-relaxed font-light">
          {ch.nonPayableDesc}
        </div>
      </div>

      {/* Navigation Stepper */}
      <div className="pt-4 flex items-center justify-between border-t border-glass-border/40">
        <button
          onClick={() => {
            sound.playChime(380, 0.1);
            window.scrollTo({ top: 0, behavior: "smooth" });
            onPrevChapter();
          }}
          className="px-5 py-3 rounded-full bg-obsidian-plum border border-glass-border text-xs font-mono text-dusty-mauve hover:text-warm-ivory transition-all"
        >
          {t.stage3.nav.prevChapter}
        </button>

        <button
          onClick={() => {
            sound.playChime(580, 0.12);
            window.scrollTo({ top: 0, behavior: "smooth" });
            onNextChapter();
          }}
          className="group inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory text-xs font-semibold uppercase tracking-wider shadow-copper-glow hover:scale-105 transition-all duration-300 min-h-[44px]"
        >
          <span>{t.stage3.nav.nextChapter}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
