"use client";

import React, { useState } from "react";
import { X, HelpCircle, Check } from "lucide-react";
import {
  FamilyMember,
  FamilyRelationship,
  GenderType,
  DependencyType,
  InsuranceStatusType,
} from "@/types/questionnaire";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface FamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: FamilyMember) => void;
  initialData?: FamilyMember | null;
  defaultRelationship?: FamilyRelationship;
}

export const FamilyMemberModal: React.FC<FamilyMemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultRelationship = "Spouse",
}) => {
  const { t } = useLanguage();
  const [relationship, setRelationship] = useState<FamilyRelationship>(
    initialData?.relationship || defaultRelationship
  );
  const [name, setName] = useState(initialData?.name || "");
  const [age, setge] = useState<number>(
    initialData?.age || (defaultRelationship === "Child" ? 6 : defaultRelationship === "Mother" || defaultRelationship === "Father" ? 61 : 32)
  );
  const [gender, setGender] = useState<GenderType>(
    initialData?.gender ||
      (defaultRelationship === "Mother" ? "female" : defaultRelationship === "Father" ? "male" : "female")
  );
  const [financiallyDependent, setFinanciallyDependent] = useState<DependencyType>(
    initialData?.financiallyDependent || "yes"
  );
  const [existingInsurance, setExistingInsurance] = useState<InsuranceStatusType>(
    initialData?.existingInsurance || "no"
  );
  const [showWhyModal, setShowWhyModal] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playChime(640, 0.15);
    onSave({
      id: initialData?.id || `member_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      relationship,
      name: name.trim() || undefined,
      age: Number(age),
      gender,
      financiallyDependent,
      existingInsurance,
    });
    onClose();
  };

  const relTranslated = t.modal.relationships[relationship] || relationship;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-obsidian-plum/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-deep-aubergine border-t sm:border border-burnished-copper/30 shadow-luxury-glass p-6 sm:p-8 overflow-y-auto max-h-[88vh] sm:max-h-[90vh]">
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-12 h-1 bg-dusty-mauve/30 rounded-full mx-auto mb-4" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-obsidian-plum border border-glass-border flex items-center justify-center text-dusty-mauve hover:text-warm-ivory transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <span className="text-[11px] uppercase font-mono tracking-widest text-burnished-copper block mb-1">
            {t.modal.tag}
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-warm-ivory">
            {t.modal.title} {relTranslated}
          </h3>
          <p className="text-xs text-dusty-mauve mt-0.5 font-light">
            {t.modal.subtitle}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
          {/* Relationship Selection */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-dusty-mauve block mb-2">
              {t.modal.relLabel}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {(["Spouse", "Child", "Mother", "Father", "Other Dependent"] as FamilyRelationship[]).map(
                (rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => {
                      setRelationship(rel);
                      if (rel === "Child" && age > 25) setge(6);
                      if ((rel === "Mother" || rel === "Father") && age < 45) setge(61);
                      if (rel === "Mother") setGender("female");
                      if (rel === "Father") setGender("male");
                    }}
                    className={`min-h-[44px] py-2 px-1 text-center text-xs rounded-xl border transition-all ${
                      relationship === rel
                        ? "bg-burnished-copper/25 border-burnished-copper text-warm-ivory font-medium"
                        : "bg-obsidian-plum/70 border-glass-border text-dusty-mauve hover:text-warm-ivory"
                    }`}
                  >
                    {t.modal.relationships[rel] || rel}
                  </button>
                )
              )}
            </div>
          </div>

          {/* ge and Optional Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-dusty-mauve block mb-1">
                {t.modal.ageLabel}
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={age}
                onChange={(e) => setge(Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0)))}
                className="w-full min-h-[44px] bg-obsidian-plum/80 border border-glass-border rounded-xl px-4 py-2.5 text-sm text-warm-ivory font-mono focus:outline-none focus:border-burnished-copper"
                required
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-dusty-mauve block mb-1">
                {t.modal.nameLabel} <span className="text-dusty-mauve/40">{t.modal.optional}</span>
              </label>
              <input
                type="text"
                placeholder={relTranslated}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[44px] bg-obsidian-plum/80 border border-glass-border rounded-xl px-4 py-2.5 text-sm text-warm-ivory placeholder-dusty-mauve/40 focus:outline-none focus:border-burnished-copper"
              />
            </div>
          </div>

          {/* Financial Dependency */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-dusty-mauve block mb-2">
              {t.modal.depLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "yes" as DependencyType, label: t.modal.depOptions.yes },
                { id: "partially" as DependencyType, label: t.modal.depOptions.partially },
                { id: "no" as DependencyType, label: t.modal.depOptions.no },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFinanciallyDependent(item.id)}
                  className={`min-h-[44px] py-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                    financiallyDependent === item.id
                      ? "bg-burnished-copper/25 border-burnished-copper text-warm-ivory shadow-copper-glow"
                      : "bg-obsidian-plum/70 border-glass-border text-dusty-mauve hover:text-warm-ivory"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Existing Insurance */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-dusty-mauve block mb-2">
              {t.modal.insLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "yes" as InsuranceStatusType, label: t.modal.insOptions.yes },
                { id: "no" as InsuranceStatusType, label: t.modal.insOptions.no },
                { id: "not_sure" as InsuranceStatusType, label: t.modal.insOptions.not_sure },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setExistingInsurance(item.id)}
                  className={`min-h-[44px] py-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                    existingInsurance === item.id
                      ? "bg-burnished-copper/25 border-burnished-copper text-warm-ivory shadow-copper-glow"
                      : "bg-obsidian-plum/70 border-glass-border text-dusty-mauve hover:text-warm-ivory"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Expandable Why note */}
          <div className="p-3 rounded-xl bg-obsidian-plum/40 border border-glass-border/60">
            <button
              type="button"
              onClick={() => setShowWhyModal(!showWhyModal)}
              className="flex items-center space-x-1.5 text-xs text-burnished-copper hover:underline w-full justify-between font-mono"
            >
              <div className="flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t.modal.whyAsk}</span>
              </div>
              <span className="text-[10px] text-dusty-mauve">{showWhyModal ? "Hide" : "Show"}</span>
            </button>
            {showWhyModal && (
              <p className="text-[11px] text-dusty-mauve mt-2 leading-relaxed border-t border-glass-border/40 pt-2 font-light">
                {t.modal.whyAskText}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2 pb-2 sm:pb-0">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2.5 rounded-full text-xs font-mono text-dusty-mauve hover:text-warm-ivory"
            >
              {t.modal.cancel}
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-burnished-copper text-warm-ivory shadow-copper-glow hover:bg-burnished-copper-light transition-all flex items-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t.modal.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};