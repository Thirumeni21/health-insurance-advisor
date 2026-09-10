"use client";

import React, { useState } from "react";
import { ArrowRight, Plus, Trash2, Edit2 } from "lucide-react";
import {
  FamilyMember,
  FamilyRelationship,
  HouseholdType,
} from "@/types/questionnaire";
import { FamilyMemberModal } from "./FamilyMemberModal";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface Question3FamilyCircleProps {
  householdType: HouseholdType | null;
  userAge: number;
  familyMembers: FamilyMember[];
  onAddMember: (member: FamilyMember) => void;
  onUpdateMember: (member: FamilyMember) => void;
  onRemoveMember: (id: string) => void;
  onContinue: () => void;
}

export const Question3FamilyCircle: React.FC<Question3FamilyCircleProps> = ({
  householdType,
  userAge,
  familyMembers,
  onAddMember,
  onUpdateMember,
  onRemoveMember,
  onContinue,
}) => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [defaultRelationship, setDefaultRelationship] = useState<FamilyRelationship>("Spouse");

  const openAddModal = (relationship: FamilyRelationship) => {
    sound.playChime(500, 0.1);
    setEditingMember(null);
    setDefaultRelationship(relationship);
    setIsModalOpen(true);
  };

  const openEditModal = (member: FamilyMember) => {
    sound.playChime(460, 0.08);
    setEditingMember(member);
    setDefaultRelationship(member.relationship);
    setIsModalOpen(true);
  };

  const handleSaveModal = (member: FamilyMember) => {
    if (editingMember) {
      onUpdateMember(member);
    } else {
      onAddMember(member);
    }
  };

  const isSingle = householdType === "myself";

  return (
    <div className="w-full max-w-3xl mx-auto animate-fadeIn select-none z-10 relative">
      {/* Title */}
      <div className="text-center mb-8">
        <span className="text-[11px] uppercase font-mono tracking-widest text-burnished-copper mb-2 block">
          {t.step3.tag}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-warm-ivory tracking-tight mb-3">
          {t.step3.title}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-dusty-mauve max-w-md mx-auto font-light">
          {t.step3.subtitle}
        </p>
      </div>

      {/* Quick Add Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {[
          { label: t.step3.addButtons.spouse, rel: "Spouse" as FamilyRelationship },
          { label: t.step3.addButtons.child, rel: "Child" as FamilyRelationship },
          { label: t.step3.addButtons.mother, rel: "Mother" as FamilyRelationship },
          { label: t.step3.addButtons.father, rel: "Father" as FamilyRelationship },
          { label: t.step3.addButtons.other, rel: "Other Dependent" as FamilyRelationship },
        ].map((item) => (
          <button
            key={item.rel}
            type="button"
            onClick={() => openAddModal(item.rel)}
            className="group inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-deep-aubergine/80 hover:bg-oxblood-burgundy border border-glass-border hover:border-burnished-copper text-xs font-mono text-warm-ivory transition-all shadow-sm hover:scale-105 min-h-[44px]"
          >
            <Plus className="w-3.5 h-3.5 text-burnished-copper group-hover:rotate-90 transition-transform" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Member Cards List */}
      <div className="space-y-3 mb-8">
        {/* Central Anchor Card (YOU) */}
        <div className="luxury-card p-4 rounded-2xl flex items-center justify-between border-burnished-copper/40 bg-oxblood-burgundy/40">
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-full bg-burnished-copper/20 border border-burnished-copper flex items-center justify-center text-burnished-copper font-serif font-bold text-sm">
              YOU
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-lg text-warm-ivory">
                  {t.step3.youLabel}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-burnished-copper/15 text-burnished-copper border border-burnished-copper/30">
                  {t.step3.youBadge}
                </span>
              </div>
              <span className="text-xs text-dusty-mauve font-mono">
                {userAge} {t.step2.ageUnit} · {t.step3.youDesc}
              </span>
            </div>
          </div>
          <span className="text-xs text-burnished-copper font-mono"> Anchor</span>
        </div>

        {/* Dynamic Added Members */}
        {familyMembers.map((member) => {
          const relTranslated = t.modal.relationships[member.relationship] || member.relationship;

          return (
            <div
              key={member.id}
              className="luxury-card p-4 rounded-2xl flex items-center justify-between border-glass-border hover:border-burnished-copper/40 transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-full bg-deep-aubergine border border-glass-border flex items-center justify-center text-warm-ivory font-serif text-sm">
                  {member.relationship.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-serif text-lg text-warm-ivory">
                      {member.name || relTranslated}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-deep-aubergine text-dusty-mauve border border-glass-border">
                      {relTranslated}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-xs text-dusty-mauve font-mono mt-0.5">
                    <span>{member.age} {t.step2.ageUnit}</span>
                    <span>·</span>
                    <span>
                      {member.financiallyDependent === "yes"
                        ? t.step3.dependentTag
                        : member.financiallyDependent === "partially"
                        ? "Partially Dep."
                        : t.step3.familyTag}
                    </span>
                    <span>·</span>
                    <span className={member.existingInsurance === "yes" ? "text-soft-champagne" : "text-dusty-mauve/60"}>
                      {member.existingInsurance === "yes" ? t.step3.insuredTag : t.step3.noInsuranceTag}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => openEditModal(member)}
                  className="w-8 h-8 rounded-lg bg-obsidian-plum border border-glass-border flex items-center justify-center text-dusty-mauve hover:text-warm-ivory hover:border-burnished-copper transition-colors"
                  title="Edit member"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playChime(320, 0.1);
                    onRemoveMember(member.id);
                  }}
                  className="w-8 h-8 rounded-lg bg-obsidian-plum border border-glass-border flex items-center justify-center text-dusty-mauve hover:text-red-400 hover:border-red-400/40 transition-colors"
                  title="Remove member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {familyMembers.length === 0 && !isSingle && (
          <div className="p-4 rounded-2xl border border-dashed border-glass-border text-center text-xs font-mono text-dusty-mauve">
            {t.step3.emptyNotice}
          </div>
        )}
      </div>

      {/* Continue */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => {
            sound.playChime(580, 0.12);
            onContinue();
          }}
          className="group inline-flex items-center space-x-3 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-burnished-copper hover:bg-burnished-copper-light text-warm-ivory shadow-copper-glow hover:scale-105 transition-all duration-300 min-h-[44px]"
        >
          <span>{t.step3.continue}</span>
          < ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Modal */}
      <FamilyMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        initialData={editingMember}
        defaultRelationship={defaultRelationship}
      />
    </div>
  );
};